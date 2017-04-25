# define-selectors

**define-selectors** is a solution to [this stackoverflow problem][question]. It works based on [Reselect][Reselect] and [Re-reselect][reReselect].

## Comparison with reselect

reselect:
```js
import { createSelector } from 'reselect'
const inputSelector1 = (state) => state.val1
const inputSelector2 = (state) => state.val2

const someSelector = createSelector([
  inputSelector1,
  inputSelector2,
], ( val1, val2 ) => {
  // expensive calculation
  return val1 + val2
})
```

define-selectors:
```js
import defineSelectors from 'define-selectors'
const inputSelector1 = (state) => state.val1
const inputSelector2 = (state) => state.val2

const { someSelector } = defineSelectors({
  someSelector: [[
    inputSelector1,
    inputSelector2,
  ], ( val1, val2 ) => {
    // expensive calculation
    return val1 + val2
  }],
})

// equivalent to above
const { someSelector } = defineSelectors({
  someSelector: {
    inputSelectors: [
      inputSelector1,
      inputSelector2,
    ],
    resultFunc: ( val1, val2 ) => {
      // expensive calculation
      return val1 + val2
    },
  },
})
```

## Usage

```js
import defineSelectors from 'define-selectors'

const { selectNavAndPageAndFoo, selectNavAndPage } = defineSelectors({

  selectNavAndPageAndFoo: [
    [ 'selectNavAndPage', selectFoo ],
    (navAndPage, foo) => {
      return `${navAndPage}/${foo}`
    },
  ],

  selectNavAndPage: [
    [ selectNav, selectPage ],
    (nav, page) => {
      return `${nav}/${page}`
    },
  ],
})

const state = { nav: 'navA', page: 'pageB', foo: 'fooC' }
console.log( selectNavAndPageAndFoo(state) )    // 'navA/pageB/fooC'
```


## API
define-reselect consists in just one method exported as default.

```js
import defineSelectors from 'define-reselect'
```

### defineSelectors( selectors )

- `selectors` is a object. key: selectorName, value: selectorData pairs
```js
{
  selectorName1: selectorData1,
  selectorName2: selectorData2,
  ...
}
```

- `selectorData` is a very important here. it is a object or array. selectorData contains `inputSelectors`, `resultFunc`, `resolverFunc`, `cacheSize`, `customSelectorCreator`. `inputSelectors`, `resultFunc` are required and the remainings are optional.

- selectorData(array):
```
[ inputSelectors, resultFunc, resolverFunc, cacheSize, customSelectorCreator ]
```
Note these index position. If you want to use `customSelectorCreator` but don't want `resolverFunc` and `cacheSize` try this:

```
[ inputSelectors, resultFunc, void 0, void 0, customSelectorCreator ]
```

- selectorData(object)
```
{
  inputSelectors: inputSelectors,
  resultFunc: resultFunc,
  resolverFunc: resolverFunc,
  cacheSize: cacheSize,
  customSelectorCreator: customSelectorCreator,
}
```

 - inputSelectors(array): refer [Reselect project][reselect]. To avoid [difinition ordering problem][question], you have to define each selector in the same `selectors` object. When you use the selector in the same selectors as inputSelector, use selectorName as the `string` type. In above example, when selectNavAndPageAndFoo is defined, it recursively go to the `selectNavAndPage` selector to define this first. `FOUND_CIRCULAR_REFERENCE` error occurs if a circular reference is found.
 - resultFunc(function): refer [Reselect project][reselect]
 - resolverFunc(function): refer [Re-reselect project][reReselect]
 - cacheSize(number): refer [my unmerged PR to reselect][myPR]
 - customSelectorCreator(function): refer [Reselect project][reselect]

## Contributing
Happy to PR any of the improvements you're thinking about. Thanks!


[reselect]: https://github.com/reactjs/reselect
[reReselect]: https://github.com/toomuchdesign/re-reselect
[question]: http://stackoverflow.com/questions/43288495/how-to-ignore-ordering-of-reselect-selectors-when-composing-selectors
[myPR]: https://github.com/reactjs/reselect/pull/210
