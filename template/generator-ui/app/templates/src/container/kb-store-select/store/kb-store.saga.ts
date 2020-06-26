import { put, takeEvery, takeLatest, call, select, all } from 'redux-saga/effects';
import { Toast } from 'antd-mobile';
import { fromJS } from 'immutable';
import { push, replace } from 'connected-react-router';
import * as types from './kb-store.type';
import { fetchKbStoreList, fetchWriteOffGoods, fetchWriteOffInfoByPos } from './api';
import { updateKbStoreList } from './kb-store.action';
import { Action, AnyAction } from 'redux';

import jsCookie from 'js-cookie';
import { publicPath } from '../../../shared/script/utils';
import { selectorKbStore } from '../../../redux/selector';

// 加载支付列表
const getKbStoreList = function* () {
  const params = {
    code: jsCookie.get('code'),
    _platform_num: jsCookie.get('_platform_num')
  };
  try {
    const data = yield call(fetchKbStoreList, { ...params });
    if (data.code !== '0') return Toast.fail(data.msg, 0.8);
    yield put(updateKbStoreList(fromJS(data.content.result ? data.content.result.deptList : [])));
  } finally {
  }
};

const writeOff = function* ({ payload: ticketCode }: { payload: any } & Action) {
  const cashState = yield select(selectorKbStore);
  const deptCode = cashState.getIn(['kbStore', 'selectedStore', 'deptCode']);
  const r = yield call(fetchWriteOffInfoByPos, {
    ticketCode,
    deptCode,
    _platform_num: jsCookie.get('_platform_num')
  });
  if (r.code !== '0') return Toast.fail('券码查询出错', 0.3);

  const { canUseCount } = r.content.result;
  const res = yield call(fetchWriteOffGoods, {
    ticketCode,
    deptCode,
    useCount: canUseCount,
    _platform_num: jsCookie.get('_platform_num')
  });
  if (res.code !== '0') yield put(push(`${publicPath()}/kb-write-off-result?status=0`));
  else yield put(push(`${publicPath()}/kb-write-off-result?status=1&ticketCode=${ticketCode}`));
};

export default function* kbStoreSaga() {
  yield takeEvery(types.SAGA_KB_STORE_LIST_GET, getKbStoreList);
  yield takeEvery(types.SAGA_KB_STORE_WRITE_OFF, writeOff);
}
