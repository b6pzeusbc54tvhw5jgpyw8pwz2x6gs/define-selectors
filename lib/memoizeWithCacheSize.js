//import _ from 'underscore';

export default (func, equalityCheck, cacheSize=1) => {

  let cacheArgsArr = []     // Cache store of old argument arrays
  let cacheResultArr = []  // Cache store of old results

  const memoizedResultFunc = (...args) => {
    let foundIdx = -1
    const oldCacheResultArr = cacheResultArr
    const isFound = cacheArgsArr.some( (oldArgArr,idx) => {
      if( oldArgArr.length !== args.length ) {
        return false
      }

      if( oldArgArr.every( (value,i) => equalityCheck(args[i],value) )) {
        foundIdx = idx
      }

      return foundIdx > -1
    })

    // console.log( 'foundIdx: ' + foundIdx )
    let result
    if( isFound ) {
      cacheArgsArr = [
        args,
        ...cacheArgsArr.slice( 0, foundIdx ),
        ...cacheArgsArr.slice( foundIdx+1, cacheSize ),
      ]
      cacheResultArr = [
        cacheResultArr[foundIdx],
        ...cacheResultArr.slice( 0, foundIdx ),
        ...cacheResultArr.slice( foundIdx+1, cacheSize ),
      ]
      result = cacheResultArr[0]

    } else if( ! isFound ) {

      result = func(...args)
      cacheArgsArr = [ args, ...cacheArgsArr.slice( 0, cacheSize-1 ) ]
      cacheResultArr = [ result, ...cacheResultArr.slice( 0, cacheSize-1 ) ]
      result = cacheResultArr[0]
    }

    if( oldCacheResultArr !== cacheResultArr ) {
      // console.log( 'updated cache:' )
      // console.log( cacheArgsArr )
      // console.log( cacheResultArr )
    }

    return result
  }

  memoizedResultFunc.getCacheArgsArr = () => cacheArgsArr
  memoizedResultFunc.getCacheResultArr = () => cacheResultArr
  memoizedResultFunc.clearCache = () => {
    cacheArgsArr = []
    cacheResultArr = []
  }
  return memoizedResultFunc
}
