import { handleActions } from 'redux-actions'
import { fromJS } from 'immutable'
import * as types from './test-page.type'

const initState = fromJS({
  cashMethods: [], // 支付方式
  cashInfo: {}, // 支付信息
})

export const activity = handleActions(
  {
    // [types.ACTIVITY_RIGHTS_FILE_LIST_UPDATE]: (state, action) => state.set('rightsFileList', action.payload),
  },
  initState
)
