# define-reselect

**define-reselect** is a solution to [this stackoverflow problem][question]. It works based on [Reselect][Reselect] and [Re-reselect][Re-reselect].

## Usage

```js
import defineSelectors from 'define-select'

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
expect( selectNavAndPageAndFoo(state) ).to.equal( 'navA/pageB/fooC' )   // pass
```

## API
define-reselect consists in just one method exported as default.

```js
import defineSelectors from 'define-reselect'
```

### defineSelectors( selectors )

- `selectors` is a object.
```
{ selectorName1: { selectorData }, selectorName2: { selectorData }}
```

- `selectorData` is a object or array
InputSelectors, resultFunc are required and the remainings are optional.

- selectorData as a array: 
```
[ inputSelectors, resultFunc, resolverFunc, cacheSize, customSelectorCreator ]
```
Note these index position. If you want to use `customSelectorCreator` but don't want `resolverFunc` and `cacheSize` try this:

```
[ inputSelectors, resultFunc, void 0, void 0, customSelectorCreator ]
```

- selectorData as a Object:
```
{
  inputSelectors: inputSelectors,
  resultFunc: resultFunc,
  resolverFunc: resolverFunc,
  cacheSize: cacheSize,
  customSelectorCreator: customSelectorCreator,
}
```

 - inputSelectors: is a array. refer [Reselect project][reselect]. To avoid [difinition ordering problem][question], when you use the selector in the same selectors, you have to use it's selectorName as the `string` type. In above example, when selectNavAndPageAndFoo is defined, it recursively go to the `selectNavAndPage` selector to define this first. `FOUND_CIRCULAR_REFERENCE` error occurs if a circular reference is found.
 - resultFunc: refer [Reselect project][reselect]
 - resolverFunc: refer [Re-reselect project][reReselect]
 - cacheSize: refer [my unmerged PR to reselect][myPR]
 - customSelectorCreator: refer [Reselect project][reselect]



[reselect]: https://github.com/reactjs/reselect
[reReselect]: https://github.com/toomuchdesign/re-reselect
[question]: http://stackoverflow.com/questions/43288495/how-to-ignore-ordering-of-reselect-selectors-when-composing-selectors
[myPR]: https://github.com/reactjs/reselect/pull/210
