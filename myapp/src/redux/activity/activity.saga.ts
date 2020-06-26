import { put, takeEvery, takeLatest, call, select, all } from "redux-saga/effects";
import { Toast } from 'antd-mobile'
import { fromJS } from 'immutable'
import { push, replace } from 'connected-react-router'
import * as R from 'ramda'
import * as types from './activity.type'
import { fetchActivityDetail, fetchActivityList, fetchSumitFeedBack, fetchUploadImage, IFetchActivityDetailParams, IFetchActivityListParams, IFetchSumitFeedBackParams } from '../../shared/api/activity'
import { getActivityDetailSaga, updateActivityCrowdFileList, updateActivityDetail, updateActivityList, updateActivityListIsEmpty, updateActivityPage, updateActivityPageLoading, updateActivityRightsFileList } from "./activity.action";
import { selectorActivity } from "../selector";
import { Action, AnyAction } from "redux";
import { store } from "../../index";

const getActivityList = function* () {
	try {
		yield put(updateActivityPageLoading(true))
		const activityState = yield select(selectorActivity)
		let page = activityState.get('page')
		let list = activityState.get('list')
		!list.size && Toast.loading('正在加载', 3);
		const currentPage = ++page
		const data = yield call(fetchActivityList, { page: currentPage })
		if (data.code !== 0) return Toast.fail(data.msg, 0.8)
		yield put(updateActivityPage(currentPage))
		if (data.data.length === 0)
			return yield put(updateActivityListIsEmpty(true))
		yield put(updateActivityList(list.push(...data.data)))
	} finally {
		yield put(updateActivityPageLoading(false))
		Toast.hide()
	}
}

const getActivityDetail = function* ({ payload: params }: { payload: IFetchActivityDetailParams } & Action) {
	try {
		Toast.loading('正在加载', 3);
		const data = yield call(fetchActivityDetail, params)
		if (data.code !== 0) return Toast.fail(data.msg, 0.8)
		yield put(updateActivityDetail(fromJS(data.data.feedbackInfo)))
		yield put(updateActivityRightsFileList(fromJS(data.data.attachmentsInfo.rightsFileList)))
	} finally {
		Toast.hide()
	}
}

const sumitFeedBack = function* ({ payload: payOrderFeedbackId }: { payload: number | string } & Action) {
	try {
		Toast.loading('正在加载', 3);
		const activityState = yield select(selectorActivity)
		const rightsFileList = activityState.get('rightsFileList').map(
			(item: any) => R.omit(['url'])(item)
		).toJS()

		const data = yield call(fetchSumitFeedBack, { rightsFileList, payOrderFeedbackId })
		if (data.code !== 0) return Toast.fail(data.msg, 0.8)
		Toast.success('反馈提交成功', .8);
		setTimeout(() => store.dispatch(getActivityDetailSaga({ id: payOrderFeedbackId })), 1000) // Toast onClose 会报错 用 timeout

		const list = activityState.get('list')

		const index = list.findIndex((item: any) => R.equals(item.id, +payOrderFeedbackId))
		if (index > -1)
			yield put(updateActivityList(
				list.update(index, (item: any) => R.assoc('state', 1)(item)
			)))
	} finally {
		// Toast.hide()
	}
}

const uploadCrowFiles = function *({ payload: params }: { payload: File[] } & Action) {
	const activityState = yield select(selectorActivity)
	const crowdFileList = activityState.get('crowdFileList')

	yield uploadFiles({ fileList: crowdFileList, updater: updateActivityCrowdFileList, files: params })
}
//
const uploadRightsFiles = function *({ payload: params }: { payload: File[] } & Action) {
	const activityState = yield select(selectorActivity)
	const rightsFileList = activityState.get('rightsFileList')

	yield uploadFiles({ fileList: rightsFileList, updater: updateActivityRightsFileList, files: params })
}

const uploadFiles = function *({ fileList, updater, files }: any ) {
  try {
	  Toast.loading('正在上传', 3);
	  const start = fileList.size

	  const responses = yield all(
		  files.slice(start).map((file: File) => {
			  const formData = new FormData
			  formData.append('file', file)
			  return call(fetchUploadImage.bind(null, formData))
		  })
	  )

	  const hasError = responses.some((r: any) => {
		  if (r.data.code !== 0) Toast.fail(r.data.msg, 0.8)
		  return r.data.code !== 0
	  })

	  if (hasError) {
		  console.log(responses)
		  return console.log('hasError')
	  }

	  const uploadedFileData = responses.map((r: any) => r.data.data)

	  yield put(updater(fileList.push(...uploadedFileData)))
  } finally {
	  Toast.hide()
  }
}

const removeCrowFile = function *({ payload: index }: { payload: number } & Action) {
	const activityState = yield select(selectorActivity)
	const crowdFileList = activityState.get('crowdFileList')

	yield removeFiles({ fileList: crowdFileList, updater: updateActivityCrowdFileList, index })
}

const removeRightsFile = function *({ payload: index }: { payload: number } & Action) {
	const activityState = yield select(selectorActivity)
	const rightsFileList = activityState.get('rightsFileList')

	yield removeFiles({ fileList: rightsFileList, updater: updateActivityRightsFileList, index })
}

const removeFiles = function *({ fileList, updater, index }: any) {
	yield put(updater(fileList.delete(index)))
}


export default function* activitySaga() {
	yield takeEvery(types.SAGA_ACTIVITY_LIST_GET, getActivityList)
	yield takeEvery(types.SAGA_ACTIVITY_DETAIL_GET, getActivityDetail)
	yield takeLatest(types.SAGA_ACTIVITY_SUMIT_FEED_BACK, sumitFeedBack)
	yield takeLatest(types.SAGA_ACTIVITY_CROWD_FILE_UPLOAD, uploadCrowFiles)
	yield takeLatest(types.SAGA_ACTIVITY_RIGHTS_FILE_UPLOAD, uploadRightsFiles)
	yield takeEvery(types.SAGA_ACTIVITY_CROWD_FILE_REMOVE, removeCrowFile)
	yield takeEvery(types.SAGA_ACTIVITY_RIGHTS_FILE_REMOVE, removeRightsFile)
}