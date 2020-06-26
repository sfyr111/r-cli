import { createAction } from 'redux-actions'
import * as types from './activity.type'

export const getActivityListSaga = createAction(types.SAGA_ACTIVITY_LIST_GET)
export const getActivityDetailSaga = createAction(types.SAGA_ACTIVITY_DETAIL_GET)
export const uploadActivityCrowdFilesSaga = createAction(types.SAGA_ACTIVITY_CROWD_FILE_UPLOAD)
export const uploadActivityRightsFilesSaga = createAction(types.SAGA_ACTIVITY_RIGHTS_FILE_UPLOAD)
export const removeActivityCrowdFileSaga = createAction(types.SAGA_ACTIVITY_CROWD_FILE_REMOVE)
export const removeActivityRightsFileSaga = createAction(types.SAGA_ACTIVITY_RIGHTS_FILE_REMOVE)
export const sumitFeedBackSaga = createAction(types.SAGA_ACTIVITY_SUMIT_FEED_BACK)

export const updateActivityDetail = createAction(types.ACTIVITY_DETAIL_UPDATE)
export const updateActivityList = createAction(types.ACTIVITY_LIST_UPDATE)
export const updateActivityPage = createAction(types.ACTIVITY_LIST_PAGE_UPDATE)
export const updateActivityPageLoading = createAction(types.ACTIVITY_LIST_LOADING_UPDATE)
export const updateActivityListIsEmpty = createAction(types.ACTIVITY_LIST_IS_EMPTY_UPDATE)
export const updateActivityCrowdFileList = createAction(types.ACTIVITY_CROWD_FILE_LIST_UPDATE)
export const updateActivityRightsFileList = createAction(types.ACTIVITY_RIGHTS_FILE_LIST_UPDATE)
