//import _ from 'underscore'
import { expect } from 'chai'
import defineSelectors from '../src/index'

export const selectNav = state => state.nav
export const selectPage = state => state.page
export const selectFoo = state => state.foo

const selectNavPageFooResultFunc = (navPage, foo) => {
  return `${navPage}/${foo}`
}
const selectNavPageResultFunc = (nav, page) => {
  return `${nav}/${page}`
}

const state = {
  nav: 'navA',
  page: 'pageB',
  foo: 'fooC',
}

describe('define-reselect test', () => {

  describe('defineSelectors should work', () => {

    let selectNavPageFoo, selectNavPage

    it('basic defineSelectors should work', () => {
      const defined = defineSelectors({
        selectNavPageFoo: [
          [ 'selectNavPage', selectFoo ],
          selectNavPageFooResultFunc,
        ],
        selectNavPage: [
          [ selectNav, selectPage ],
          selectNavPageResultFunc,
        ],
      })
      selectNavPageFoo = defined.selectNavPageFoo
      selectNavPage = defined.selectNavPage
    })

    it('basic selectors should work', () => {
      expect( selectNavPageFoo(state) ).to.equal( 'navA/pageB/fooC' )
      expect( selectNavPage(state) ).to.equal( 'navA/pageB' )
    })
  })

  describe('cacheSize options should work', () => {
    let selectNavPageFooWithCacheSize2, selectNavPageWithCacheSize3
    it('cacheSize', () => {

      const defined = defineSelectors({
        selectNavPageFooWithCacheSize2: [
          [ 'selectNavPageWithCacheSize3', selectFoo ],
          selectNavPageFooResultFunc,
          void 0, 2,
        ],
        selectNavPageWithCacheSize3: [
          [ selectNav, selectPage ],
          selectNavPageResultFunc,
          void 0, 3,
        ],
      })
      selectNavPageFooWithCacheSize2 = defined.selectNavPageFooWithCacheSize2
      selectNavPageWithCacheSize3 = defined.selectNavPageWithCacheSize3
    })

    it('selectors with cacheSize should work', () => {
      expect( selectNavPageFooWithCacheSize2(state) ).to.equal( 'navA/pageB/fooC' )
      expect( selectNavPageWithCacheSize3(state) ).to.equal( 'navA/pageB' )
    })
  })



})


