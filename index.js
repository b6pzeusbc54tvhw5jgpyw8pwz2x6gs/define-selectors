import { createSelector as defaultCreateSelector, createSelectorCreator } from 'reselect'
import createCachedSelector from 're-reselect'
import memoizeWithCacheSize from './lib/memoizeWithCacheSize'

const shallowEqual = (a, b) => a === b
const nativeIsArray = Array.isArray
const toString = Object.prototype.toString
const isArray = nativeIsArray || ((o) => toString.call(o) === '[object Array]')

const defineSelector = ( key, selectors, definedSelectors ) => {
  if( definedSelectors[ key ] === 'ing' ) {
    throw new Error('FOUND_CIRCULAR_REFERENCE')
  }

  if( typeof definedSelectors[key] === 'function' ) {
    return definedSelectors[key]
  }

  definedSelectors[key] = 'ing'

  const data = selectors[key]
  const isArrayData = isArray(data)

  let inputSelectors, resultFunc, resolverFunc, cacheSize, createSelector

  if( isArrayData ) {
    inputSelectors = data[0]
    resultFunc = data[1]
    resolverFunc = data[2]
    cacheSize = data[3] || 1
    createSelector = data[4]
  } else {
    inputSelectors = data.inputSelectors
    resultFunc = data.resultFunc
    resolverFunc = data.resolverFunc
    cacheSize = data.cacheSize
    createSelector = data.customSelectorCreator
  }

  if( createSelector && cacheSize > 1 ) {
    console.error('when cacheSize > 1, built-in createSelector is used. You can not define cacheSize and customSelectorCreator at the same time.')
    throw new Error('WRONG_CACHE_SIZE_AND_CUSTOM_SELECTOR_CREATOR')
  }

  createSelector = cacheSize > 1 ?
    createSelectorCreator( memoizeWithCacheSize, shallowEqual, cacheSize ) :
    defaultCreateSelector

  // magic
  inputSelectors = inputSelectors.map( s => {
    if( s === void 0 ) {
      console.error( 'selector key: ' + key )
      throw new Error('FOUND_UNDEFINED_INPUT_SELECTOR')
    }
    return typeof s === 'string' ? defineSelector( s, selectors, definedSelectors ) : s
  })

  if( resolverFunc ) {
    definedSelectors[key] = createCachedSelector( inputSelectors, resultFunc )( resolverFunc, createSelector )
  } else {
    definedSelectors[key] = createSelector( inputSelectors, resultFunc )
  }

  return definedSelectors[key]
}

export default ( selectors ) => {
  const definedSelectors = {}
  Object.keys( selectors ).map( key => {
    defineSelector( key, selectors, definedSelectors )
  })

 return definedSelectors
}
