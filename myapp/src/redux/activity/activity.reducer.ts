import { handleActions } from 'redux-actions'
import { fromJS } from 'immutable'
import * as types from './activity.type'

const initState = fromJS({
  pageLoading: false,
  listIsEmpty: false,
  page: 0,
  list: [],
  detail: {},
  crowdFileList: [],
  rightsFileList: [],
})

export const activity = handleActions(
  {
    [types.ACTIVITY_LIST_UPDATE]: (state, action) => state.set('list', action.payload),
    [types.ACTIVITY_DETAIL_UPDATE]: (state, action) => state.set('detail', action.payload),
    [types.ACTIVITY_LIST_PAGE_UPDATE]: (state, action) => state.set('page', action.payload),
    [types.ACTIVITY_LIST_LOADING_UPDATE]: (state, action) => state.set('pageLoading', action.payload),
    [types.ACTIVITY_LIST_IS_EMPTY_UPDATE]: (state, action) => state.set('listIsEmpty', action.payload),
    [types.ACTIVITY_CROWD_FILE_LIST_UPDATE]: (state, action) => state.set('crowdFileList', action.payload),
    [types.ACTIVITY_RIGHTS_FILE_LIST_UPDATE]: (state, action) => state.set('rightsFileList', action.payload),
  },
  initState
)
