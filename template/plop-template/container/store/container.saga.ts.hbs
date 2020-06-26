import { put, takeEvery, takeLatest, call, select, all } from 'redux-saga/effects';
import { Toast } from 'antd-mobile';
import { fromJS } from 'immutable';
import { push, replace } from 'connected-react-router';
import * as types from './cash.type';
import {
  fetchBillInfo,
  fetchCancelNormalPay,
  fetchLoadCashier,
  fetchPaidBackWrite,
  fetchPaymentList,
  fetchPrePayList,
  fetchReportPayment,
  fetchTongyizhifu
} from './api';
import {
  loadCashierSaga,
  paidBackWriteSaga,
  reportPaymentSaga,
  startPollQueryPayResultSaga,
  stopPollQueryPayResultSaga,
  unityPaySaga,
  updateBillInfo,
  updateCashInfo,
  updateCashMethods,
  updatePayInfo
} from './cash.action';
import { Action, AnyAction } from 'redux';

import jsCookie from 'js-cookie';
import {
  bg,
  genCashSignStr,
  genQueryStringForObj,
  getQueryObjForSearch,
  publicPath
} from '../../../shared/script/utils';
import { delay } from 'redux-saga';
import { CallEffectFn, race, take } from '../../../../node_modules/redux-saga/effects';
import { selectorCash } from '../../../redux/selector';

const PAY_STATE_FAILE = '89';
const PAY_STATE_SUCCESS = '0';
const PAY_STATE_NEED_SEARCH = '101';
// const PAY_STATE_SUCCESS = '-1'
// const PAY_STATE_NEED_SEARCH = '0'

// 加载收银台
const loadCashier = function* ({
  payload: { billNumber = '', money = '', subBillNumber = '', subPrice = '' }
}: {
  payload: {
    billNumber: string;
    money: string;
    subBillNumber: string | undefined;
    subPrice: string | undefined;
  };
} & Action) {
  try {
    const billData = yield call(fetchBillInfo, {
      mtenantId: jsCookie.get('_platform_num'),
      nodeCode: jsCookie.get('deptCode'),
      billNumber
    });
    if (billData.code !== '0') return Toast.fail(billData.msg, 0.8);
    yield put(updateBillInfo(fromJS(billData.content.result))); // 这里是主单 dealTotalFee 总金额,  dealTotalPayment 应付金额, buyerId 用 uid, dealCode 单据号

    yield put(
      updatePayInfo(
        fromJS({
          billNumber: !!subBillNumber ? subBillNumber : billNumber, // 有子单付子单
          price: !!subBillNumber ? subPrice : money // 有子单付子单金额
        })
      )
    );

    const cashState = yield select(selectorCash);

    const saleMoney = bg(cashState.getIn(['payInfo', 'price'])).toNumber();

    console.log('saleMoney: ', saleMoney);
    const reqParams = {
      timestamp: Date.now(),
      nodeCode: jsCookie.get('deptCode'),
      billNumber: cashState.getIn(['payInfo', 'billNumber']),
      _platform_num: jsCookie.get('_platform_num'),
      detail: {
        uid: cashState.getIn(['billInfo', 'buyerId']),
        saleMoney // dealTotalFee 总金额, dealTotalPayment 应付金额, 告诉收银台我要付多少钱？
      }
    };

    const data = yield call(fetchLoadCashier, { ...reqParams, sign: genCashSignStr(reqParams) });
    if (data.code !== '0') return Toast.fail(data.msg, 0.8);
    yield put(updateCashInfo(fromJS(data.content.result)));
  } catch (e) {
  } finally {
  }
};

// 加载支付列表
const getPaymentList = function* () {
  const params = {
    timestamp: Date.now(),
    _platform_num: jsCookie.get('_platform_num')
  };
  try {
    const sign = genCashSignStr(params);
    const data = yield call(fetchPaymentList, { ...params, sign });
    if (data.code !== '0') return Toast.fail(data.msg, 0.8);
    yield put(updateCashMethods(fromJS(data.content.result)));
  } finally {
  }
};

// 预支付
const executePrePay = function* ({
  payload: { preParams, unityExtParams }
}: { payload: any } & Action) {
  Toast.loading('正在支付', 0);
  const cashState = yield select(selectorCash);
  try {
    const reqParams = {
      timestamp: Date.now(),
      _platform_num: jsCookie.get('_platform_num'),
      ...preParams
    };
    console.log('prePayReqParams: ', reqParams);
    const data = yield call(fetchPrePayList, { ...reqParams, sign: genCashSignStr(reqParams) });
    if (data.code !== '0') return Toast.fail(data.msg, 0.8);
    const unityParams = {
      orderid: data.content.result.orderid,
      paynumber: preParams.paynumber,
      interFaceCategoryCode: preParams.salePaymentDetail.interFaceCategoryCode,
      payMoney: preParams.salePaymentDetail.paymentMoney,
      paymentCode: preParams.salePaymentDetail.paymentCode,
      tradeType: 'pay',
      cardInCode: preParams.salePaymentDetail.cardCode,
      uid: cashState.getIn(['billInfo', 'buyerId']),
      nodeCode: jsCookie.get('deptCode'),
      nodeName: '',
      employeeCode: jsCookie.get('code') || '',
      employeeName: '',
      ...unityExtParams
    };
    yield put(unityPaySaga(unityParams));
  } finally {
  }
};

// 统一支付
const execUnityPay = function* ({ payload: params }: { payload: any } & Action) {
  const cashState = yield select(selectorCash);
  const reqParams = {
    timestamp: Date.now(),
    _platform_num: jsCookie.get('_platform_num'),
    ...params
  };
  try {
    const data = yield call(fetchTongyizhifu, { ...reqParams, sign: genCashSignStr(reqParams) });
    if (data.code !== '0') return Toast.fail(data.msg, 0.8);
    const { payState } = data.content.result;
    // 支付状态失败
    if (payState === PAY_STATE_FAILE) {
      Toast.hide();
      const queryObj = getQueryObjForSearch(location.search);
      const queryString = genQueryStringForObj({ ...queryObj, status: '0' });
      // return yield put(push(`${publicPath()}/cash-result?status=0&billNumber=${cashState.getIn(['billInfo', 'dealCode'])}`))
      return yield put(push(`${publicPath()}/cash-result${queryString}`)); // 当前所有参数带到失败结果页
    }
    if (payState === PAY_STATE_NEED_SEARCH) {
      return yield put(
        startPollQueryPayResultSaga({
          ...reqParams,
          ...{ tradeType: 'query' }
        })
      );
    }
    if (payState === PAY_STATE_SUCCESS) {
      return yield put(
        paidBackWriteSaga({
          paynumber: params.paynumber,
          payDetail: {
            centerWaterNo: data.content.result.centerWaterNo,
            orderid: params.orderid,
            payMoney: params.payMoney,
            interFaceCategoryCode: params.interFaceCategoryCode,
            paymentCode: params.paymentCode,
            balance: '' // 卡余额
          }
        })
      );
    }
    return Toast.fail(data.msg, 0.8);
  } finally {
  }
};

const pollQueryPay = function* ({ payload: params }: AnyAction) {
  console.log('@pollQueryPay: ', params);
  const cashState = yield select(selectorCash);
  while (true) {
    try {
      const data = yield call(fetchTongyizhifu, { ...params, sign: genCashSignStr(params) });
      if (data.code !== '0') {
        console.error('pollQueryPay: ', data.msg);
        yield put(stopPollQueryPayResultSaga());
        return Toast.fail(data.msg, 1.5);
      }
      const { payState } = data.content.result;
      console.log('@poll payState: ', payState);
      // 支付失败
      if (payState === PAY_STATE_FAILE) {
        Toast.hide();
        yield put(stopPollQueryPayResultSaga());
        const queryObj = getQueryObjForSearch(location.search);
        const queryString = genQueryStringForObj({ ...queryObj, status: '0' });
        // return yield put(push(`${publicPath()}/cash-result?status=0&billNumber=${cashState.getIn(['billInfo', 'dealCode'])}`))
        return yield put(push(`${publicPath()}/cash-result${queryString}`)); // 当前所有参数带到失败结果页
      }
      // 支付成功
      if (payState === PAY_STATE_SUCCESS) {
        Toast.hide();
        yield put(stopPollQueryPayResultSaga());
        return yield put(
          paidBackWriteSaga({
            paynumber: params.paynumber,
            payDetail: {
              centerWaterNo: data.content.result.centerWaterNo,
              orderid: params.orderid,
              payMoney: params.payMoney,
              interFaceCategoryCode: params.interFaceCategoryCode,
              paymentCode: params.paymentCode,
              balance: '' // 卡余额
            }
          })
        );
      }
      yield call(delay, 2000);
    } catch (err) {
      console.error(err);
      yield put(stopPollQueryPayResultSaga());
    }
  }
};

// 支付回写
const execPaidBackWrite = function* ({ payload: params }: { payload: any } & Action) {
  const cashState = yield select(selectorCash);
  const reqParams = {
    timestamp: Date.now(),
    _platform_num: jsCookie.get('_platform_num'),
    ...params
  };
  try {
    const data = yield call(fetchPaidBackWrite, { ...reqParams, sign: genCashSignStr(reqParams) });
    if (data.code !== '0') return Toast.fail(data.msg, 0.8);
    Toast.success('支付成功', 1);
    const { billNumber, money, subBillNumber, subPrice } = getQueryObjForSearch(location.search);
    // 重新加载收银台
    if (data.content.result.unpaidMoney > 0)
      return yield put(loadCashierSaga({ billNumber, money, subBillNumber, subPrice }));
    // 支付上报
    if (data.content.result.unpaidMoney === 0)
      return yield put(
        reportPaymentSaga({
          nodeCode: jsCookie.get('deptCode'),
          paynumber: params.paynumber
        })
      );
  } finally {
  }
};

// 支付上报
const execReportPayment = function* ({ payload: params }: { payload: any } & Action) {
  const cashState = yield select(selectorCash);
  const reqParams = {
    timestamp: Date.now(),
    _platform_num: jsCookie.get('_platform_num'),
    status: '1',
    storeId: jsCookie.get('deptCode'),
    storeName: '',
    cashierId: jsCookie.get('code') || '',
    cashierName: '',
    ...params
  };
  try {
    const data = yield call(fetchReportPayment, { ...reqParams, sign: genCashSignStr(reqParams) });
    if (data.code !== '0') return Toast.fail(data.msg, 0.8);
    // const { rewriteoff = '0' } = getQueryObjForSearch(location.search)
    Toast.hide();
    const queryObj = getQueryObjForSearch(location.search);
    const queryString = genQueryStringForObj({ ...queryObj, status: '1' });
    // return yield put(push(`${publicPath()}/cash-result?status=0&billNumber=${cashState.getIn(['billInfo', 'dealCode'])}`))
    yield put(push(`${publicPath()}/cash-result${queryString}`)); // 当前所有参数带到失败结果页
    // yield put(push(`${publicPath()}/cash-result?status=1&billNumber=${cashState.getIn(['billInfo', 'dealCode'])}&rewriteoff=${rewriteoff}`))
  } finally {
  }
};

// 取消支付
const execCancelNormalPay = function* ({ payload: params }: { payload: any } & Action) {
  try {
    const data = yield call(fetchCancelNormalPay, { timestamp: 1, sign: 's' });
    if (data.code !== 0) return Toast.fail(data.msg, 0.8);
    // Toast.loading('正在加载', 3);
  } finally {
  }
};

export default function* cashSaga() {
  yield takeEvery(types.SAGA_CASHIER_LOAD, loadCashier);
  yield takeEvery(types.SAGA_PAYMENT_LIST_GET, getPaymentList);
  yield takeEvery(types.SAGA_PRE_PAY, executePrePay);
  yield takeLatest(types.SAGA_UNITY_PAY, execUnityPay);
  yield takeLatest(types.SAGA_PAID_BACK_WRITE, execPaidBackWrite);
  yield takeLatest(types.SAGA_REPORT_PAYMENT, execReportPayment);
  while (true) {
    const action = yield take(types.SAGA_POLL_QUERY_PAY_RESULT_START);
    console.log('@SAGA_POLL_QUERY_PAY_RESULT_START: ', action);
    yield race({
      task: call(pollQueryPay, action),
      cancel: take(types.SAGA_POLL_QUERY_PAY_RESULT_STOP)
    });
  }
}
