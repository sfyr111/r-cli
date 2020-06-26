import { handleActions } from 'redux-actions'
import { fromJS } from 'immutable'
import * as types from './cash-page.type'

const initState = fromJS({
  data: {}
})

export const cashPage = handleActions(
  {
    [types.CASH_PAGE_DATA_UPDATE]: (state, action) => state.set('data', action.payload),
  },
  initState
)
