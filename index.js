const defineSelector = ( key, selectors, definedSelectors ) => {
  if( definedSelectors[ key ] === 'ing' ) {
    throw new Error('FOUND_CIRCULAR_REFERENCE')
  }

  if( typeof definedSelectors[key] === 'function' ) {
    return definedSelectors[key]
  }

  definedSelectors[key] = 'ing'
  const { createSelector, subSelectors, func } = selectors[key]
  const subFuncSelectors = subSelectors.map( s => {
    return typeof s === 'string' ? defineSelector( s, selectors, definedSelectors ) : s
  })

  definedSelectors[key] = createSelector( subFuncSelectors, func )
  return definedSelectors[key]
}

export default ( selectors ) => {
  const definedSelectors = {}
  Object.keys( selectors ).map( key => {
    defineSelector( key, selectors, definedSelectors )
  })

 return definedSelectors
}
