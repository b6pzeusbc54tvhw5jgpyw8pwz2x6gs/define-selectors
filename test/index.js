//import _ from 'underscore'
import { expect } from 'chai'
import defineSelectors from '../src/index'

export const selectNav = state => state.nav
export const selectPage = state => state.page
export const selectFoo = state => state.foo

const selectors = {

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
}

const state = {
  nav: 'navA',
  page: 'pageB',
  foo: 'fooC',
}

let selectNavAndPageAndFoo, selectNavAndPage
describe('define-reselect test', () => {

  it('defineSelectors should work', () => {
    const defined = defineSelectors( selectors )
    selectNavAndPageAndFoo = defined.selectNavAndPageAndFoo
    selectNavAndPage = defined.selectNavAndPage
  })

  it('selectors should work', () => {
    expect( selectNavAndPageAndFoo(state) ).to.equal( 'navA/pageB/fooC' )
    expect( selectNavAndPage(state) ).to.equal( 'navA/pageB' )
  })
})

