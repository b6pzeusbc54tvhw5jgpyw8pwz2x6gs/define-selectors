"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

//import _ from 'underscore';

exports.default = function (func, equalityCheck) {
  var cacheSize = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;


  var cacheArgsArr = []; // Cache store of old argument arrays
  var cacheResultArr = []; // Cache store of old results

  var memoizedResultFunc = function memoizedResultFunc() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    var foundIdx = -1;
    var oldCacheResultArr = cacheResultArr;
    var isFound = cacheArgsArr.some(function (oldArgArr, idx) {
      if (oldArgArr.length !== args.length) {
        return false;
      }

      if (oldArgArr.every(function (value, i) {
        return equalityCheck(args[i], value);
      })) {
        foundIdx = idx;
      }

      return foundIdx > -1;
    });

    // console.log( 'foundIdx: ' + foundIdx )
    var result = void 0;
    if (isFound) {
      cacheArgsArr = [args].concat(_toConsumableArray(cacheArgsArr.slice(0, foundIdx)), _toConsumableArray(cacheArgsArr.slice(foundIdx + 1, cacheSize)));
      cacheResultArr = [cacheResultArr[foundIdx]].concat(_toConsumableArray(cacheResultArr.slice(0, foundIdx)), _toConsumableArray(cacheResultArr.slice(foundIdx + 1, cacheSize)));
      result = cacheResultArr[0];
    } else if (!isFound) {

      result = func.apply(undefined, args);
      cacheArgsArr = [args].concat(_toConsumableArray(cacheArgsArr.slice(0, cacheSize - 1)));
      cacheResultArr = [result].concat(_toConsumableArray(cacheResultArr.slice(0, cacheSize - 1)));
      result = cacheResultArr[0];
    }

    if (oldCacheResultArr !== cacheResultArr) {
      // console.log( 'updated cache:' )
      // console.log( cacheArgsArr )
      // console.log( cacheResultArr )
    }

    return result;
  };

  memoizedResultFunc.getCacheArgsArr = function () {
    return cacheArgsArr;
  };
  memoizedResultFunc.getCacheResultArr = function () {
    return cacheResultArr;
  };
  memoizedResultFunc.clearCache = function () {
    cacheArgsArr = [];
    cacheResultArr = [];
  };
  return memoizedResultFunc;
};