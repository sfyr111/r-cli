import { put, takeEvery, takeLatest, call, select, all } from 'redux-saga/effects';
import { Toast } from 'antd-mobile';
import { fromJS } from 'immutable';
import { push, replace } from 'connected-react-router';
import * as types from './cash-page.type';
import {
  fetchGet
} from './api';
import {
} from './cash-page.action';
import { Action, AnyAction } from 'redux';

import { } from '../../../shared/script/utils';
import { delay } from 'redux-saga';
import { CallEffectFn, race, take } from 'redux-saga/effects';
// import { selectorCash } from '../../../redux/selector';

const initCashPage = function* ({ payload: params }: { payload: any } & Action) {
  const params = { };
  try {
    const data = yield call(fetchGet, { ...params });
    if (data.code !== '0') return Toast.fail(data.msg, 0.8);
    yield put(updateCashPageData(fromJS(data.content.result)));
  } finally {
  }
};

export default function* cashPageSaga() {
  yield takeEvery(types.SAGA_CASH_PAGE_INIT, initCashPage);
}
