import { put, takeEvery, takeLatest, call, select, all, take, race } from 'redux-saga/effects'
import { Toast } from 'antd-mobile'
import { fromJS } from 'immutable'
import { push, replace } from 'connected-react-router'
import * as R from 'ramda'
import * as types from './test-page.type'
import {} from './api'
import {} from './test-page.action'
// import { selectorActivity } from "../selector";
import { Action, AnyAction } from 'redux'
import axios from 'axios'

import {} from './test-page.action'
import { delay } from 'redux-saga'
import { POLL_START, POLL_STOP } from './test-page.type'

/**
 * Saga worker.
 */
function* pollSagaWorker() {
  let n = 1
  while (true) {
    try {
      const { data } = yield call(() => axios({ url: `http://swapi.dev/api/planets/${n++}/` }))
      // yield put(getDataSuccessAction(data));
      console.log(data)
      yield call(delay, 2000)
    } catch (err) {
      console.error(err)
      // yield put(getDataFailureAction(err));
    }
  }
}

export default function* testPageSaga() {
  while (true) {
    yield take(POLL_START)
    yield race({
      task: call(pollSagaWorker),
      cancel: take(POLL_STOP),
    })
  }
  // yield takeLatest(types.SAGA_ACTIVITY_RIGHTS_FILE_UPLOAD, uploadRightsFiles)
  // yield takeEvery(types.SAGA_ACTIVITY_RIGHTS_FILE_REMOVE, removeRightsFile)
}
