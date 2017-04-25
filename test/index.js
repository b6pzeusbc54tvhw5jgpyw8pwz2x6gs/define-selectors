//import _ from 'underscore'
import { expect } from 'chai'
import { createSelector } from 'reselect'
import defineSelectors from '../'

export const selectNav = state => state.nav
export const selectPage = state => state.page
export const selectFoo = state => state.foo

const selectors = {
  selectNavAndPageAndFoo: {
    createSelector,
    subSelectors: [ 'selectNavAndPage', selectFoo ],
    func: (navAndPage, foo) => {
      return `${navAndPage}/${foo}`
    },
  },

  selectNavAndPage: {
    createSelector,
    subSelectors: [ selectNav, selectPage ],
    func: (nav, page) => {
      return `${nav}/${page}`
    },
  },
}

export const {
  selectNavAndPageAndFoo,
  selectNavAndPage,
} = defineSelectors( selectors )

const state = {
  nav: 'navA',
  page: 'pageB',
  foo: 'fooC',
}

describe('define-reselect test', () => {

  it('defineSelectors should work', () => {
    const result = selectNavAndPageAndFoo( state )
    expect( result ).to.equal( 'navA/pageB/fooC' )
  })
})

