import { put, takeEvery, fork, call, select, all, take } from 'redux-saga/effects';
import { Toast } from 'antd-mobile';
import { fromJS, setIn } from 'immutable';
import jsCookie from 'js-cookie';
import Api from '../../../shared/api/apiUrl';
import { getOrderDetailSaga } from './order-detail.action';
// import { getOrderDetailSaga } from './order-detail.action'

import {
  fetchSaleBill,
  fetchWriteOff,
  fetchCreateSubOrder,
  fetchModifyPickOrder,
  IFetchSaleBillParams,
  IFetchWriteOffParams
} from '../../../shared/api/orderDetail';
import * as types from './order-detail.type';
import { Action } from 'redux-actions';
import { push, replace } from 'connected-react-router';
// import axios from 'axios'
import {
  // setSourceInfo,
  updateRepairInfo,
  updateSubOrderInfo,
  updateWriteOffSaga,
  getWriteOffSaga,
  omsOperateSaga,
  updateModifyOrderInfo
} from './order-detail.action';
import { bg } from '../../../shared/script/utils';
import BigNumber from 'bignumber.js';

interface IAction<Payload> extends Action<Payload> {}

interface IAnyObj {
  [key: string]: any;
}

interface IWriteOffParams {
  billNumber: string;
  from: string;
}

const doWriteOff = function* (billNumber: string) {
  const res = yield call(fetchWriteOff, {
    Param: {
      DealCode: billNumber || '1215466502381',
      WriteOffID: jsCookie.get('code') || '18888888881',
      WriteOffTime: new Date().valueOf()
    },
    _platform_num: jsCookie.get('_platform_num') || '101397'
  });
  if (res.errno === 0) {
    Toast.success('核销成功', 0.8);
    // loadData
    yield put(
      getOrderDetailSaga({
        mtenantId: jsCookie.get('_platform_num') || '101397',
        deptCode: jsCookie.get('deptCode') || '12032',
        billNumber: billNumber || '1215573504356'
      })
    );
  } else {
    Toast.fail(res.errno, 1);
  }
  return res;
};

const toWriteOff = function* ({
  payload: { billNumber, from }
}: { payload: IWriteOffParams } & Action<any>) {
  const repairInfo = yield select((state: any) =>
    state.getIn(['orderDetail', 'repairInfo', 'content', 'result'])
  );

  const { repairList } = repairInfo.toJS();

  if (from !== 'payResult' && repairList.length > 0) {
    yield put(omsOperateSaga(repairInfo)); // 调oms接口
    yield take(types.SUB_ORDER_INFO_UPDATE);
    const subOrderInfoState = yield select((state: any) =>
      state.getIn(['orderDetail', 'subOrderInfo'])
    );
    const errno = subOrderInfoState.get('errno');
    const errmsg = subOrderInfoState.get('errmsg');
    if (errno === 0 || errno === 8197) {
      yield doWriteOff(billNumber);
    } else {
      Toast.fail(errmsg, 1);
    }
  } else {
    yield doWriteOff(billNumber);
  }
};

const toPayFor = function* ({ payload: { billNumber } }: { payload: any } & Action<any>) {
  const repairInfo = yield select((state: any) =>
    state.getIn(['orderDetail', 'repairInfo', 'content', 'result'])
  );
  const {
    dealState,
    repairList,
    totalDiff,
    totalPickAgio,
    totalPayPrice,
    dealTotalPayment
  } = repairInfo.toJS();
  // const rewriteoff = dealState === 9 && repairList.length > 0 ? 1 : 0
  const rewriteoff = dealState === 9 ? 1 : 0;

  if (repairList.length === 0)
    return yield put(
      push(
        `/m/lsgc/write-off/cash?billNumber=${billNumber}&rewriteoff=${rewriteoff}&money=${totalPayPrice}`
      )
    );

  yield put(omsOperateSaga(repairInfo)); // 调oms接口
  if (dealState === 9) yield take(types.SUB_ORDER_INFO_UPDATE);
  if (dealState === 1) yield take(types.MODIFY_ORDER_INFO_UPDATE);

  const subOrderInfoState = yield select((state: any) =>
    state.getIn(['orderDetail', 'subOrderInfo'])
  );
  const modifyOrderInfoState = yield select((state: any) =>
    state.getIn(['orderDetail', 'modifyOrderInfo'])
  );

  let money = 0;

  if (dealState === 1) {
    // 修改原单
    console.log(modifyOrderInfoState.toJS());
    const errno = modifyOrderInfoState.get('errno');
    const errmsg = modifyOrderInfoState.get('errmsg');
    money = totalPayPrice;
    if (errno === 0 || errno === 8197) {
      yield put(
        push(
          `/m/lsgc/write-off/cash?billNumber=${billNumber}&rewriteoff=${rewriteoff}&money=${money}`
        )
      );
    } else {
      Toast.fail(errmsg, 1);
    }
  } else if (dealState === 9) {
    // 创建补差单
    const errno = subOrderInfoState.get('errno');
    const errmsg = subOrderInfoState.get('errmsg');
    const orderId = subOrderInfoState.getIn(['data', 'orderId']);
    const price = subOrderInfoState.getIn(['data', 'price']);
    money = totalDiff - totalPickAgio;
    if (errno === 0) {
      yield put(
        push(
          `/m/lsgc/write-off/cash?billNumber=${billNumber}&rewriteoff=${rewriteoff}&money=${money}&subBillNumber=${orderId}&subPrice=${price}`
        )
      );
    } else {
      Toast.fail(errmsg, 1);
    }
  }
};

const getPackageList = function* (action: IAction<IFetchSaleBillParams>) {
  const res = yield call(fetchSaleBill, action.payload);

  if (res.code !== '0') return Toast.fail(res.msg, 0.8);

  const data = formateData(res);

  yield put(updateRepairInfo(fromJS(data)));
  // yield put(omsOperateSaga(res.content.result)) // 移到支付后调用
};

const omsOperate = function* ({ payload: resultData }: { payload: any } & Action<any>) {
  const data = resultData.toJS();
  // 待核销-退补单信息
  if (data.dealState === 9) {
    return yield createSubOrder(data);
  }

  // 待支付-差异信息
  if (data.dealState === 1) {
    return yield modifyPickOrder(data);
  }
};

const createSubOrder = function* (data: any) {
  const totalPrice = data.vecMutiTradeDdo
    .reduce(
      (pre: BigNumber, cur: any) => pre.plus(bg(cur.pickMoney).minus(cur.tradeTotalFee)),
      bg(0)
    )
    .toString();
  const payPrice = data.vecMutiTradeDdo
    .reduce(
      (pre: BigNumber, cur: any) => pre.plus(bg(cur.realPickMoney).minus(cur.tradeTotalPayment)),
      bg(0)
    )
    .toString();
  const handleRebate = data.vecMutiTradeDdo
    .reduce((pre: BigNumber, cur: any) => pre.plus(cur.pickAgio), bg(0))
    .toString();

  const params = {
    totalPrice,
    payPrice,
    handleRebate,
    mainDealCode: data.dealCode,
    uid: data.buyerId,
    storeCode: data.storeCode,
    partnerId: 2, // 和良慧讨论过目前写死
    itemList: JSON.stringify({ itemList: createSubOrderItemList(data.vecMutiTradeDdo) })
  };
  const createSubOrderRes = yield call(fetchCreateSubOrder, params);
  const r = updateSubOrderInfo(fromJS(createSubOrderRes));
  yield put(r);
};

const modifyPickOrder = function* (data: any) {
  const payPrice = data.vecMutiTradeDdo
    .reduce((pre: BigNumber, cur: any) => pre.plus(cur.realPickMoney), bg(0))
    .toNumber();
  const totalPrice = data.vecMutiTradeDdo
    .reduce((pre: BigNumber, cur: any) => pre.plus(cur.pickMoney), bg(0))
    .toNumber();
  const handleRebate = data.vecMutiTradeDdo
    .reduce((pre: BigNumber, cur: any) => pre.plus(cur.pickAgio), bg(0))
    .toString();

  const params = {
    totalPrice,
    payPrice,
    handleRebate,
    dealCode: data.dealCode,
    itemList: JSON.stringify({ itemList: modifyPickOrderItemList(data.vecMutiTradeDdo) })
  };
  const modifyPickOrderRes = yield call(fetchModifyPickOrder, params);
  const r = updateModifyOrderInfo(fromJS(modifyPickOrderRes));
  yield put(r);
};

const createSubOrderItemList = function (list: any[]) {
  return list.map((v) => {
    const ret: any = {
      skuId: Number(v.itemSkuId),
      // num: v.tradeNum,
      num: bg(v.tradeNum).minus(v.pickAmount).abs().toNumber(),
      name: v.itemTitle,
      sellPrice: v.itemSoldPrice,
      itemType: v.itemType,
      totalPrice: bg(v.pickMoney).minus(v.tradeTotalFee).toString(),
      payPrice: bg(v.realPickMoney).minus(v.tradeTotalPayment).toString(),
      handleRebate: String(v.pickAgio)
    };
    if (v.isWeighing) ret.weight = bg(v.pickWeight).minus(v.weight).abs().toNumber();

    return ret;
  });
};

const modifyPickOrderItemList = function (list: any[]) {
  return list.map((v) => {
    const ret: any = {
      tradeId: v.tradeId,
      num: v.pickAmount,
      totalPrice: Number(v.pickMoney),
      payPrice: Number(v.realPickMoney),
      handleRebate: String(v.pickAgio)
    };
    if (v.isWeighing) {
      ret.weight = v.pickWeight;
      ret.num = 1;
    }

    return ret;
  });
};

const formateData = function (res: { [key: string]: any }) {
  const result = res.content.result;
  const vecMutiTradeDdo = [...result.vecMutiTradeDdo] || [];
  const temArr: any[] = [];
  let totalDiff = 0;
  let totalPickMoney = 0;
  let totalPayPrice = 0; // 状态为1时支付金额
  let totalPickAgio = 0;
  /* TO_BE_PAID(1, "待支付"),
    COMPLETE(6, "已完成"),
    CANCEL(7, "已取消"),
    TO_BE_VERIFICATION(9, "待核销")  订单状态
  */
  vecMutiTradeDdo.forEach((v: IAnyObj) => {
    totalPayPrice += v.realPickMoney;
    totalPickMoney += v.pickMoney;
    const diff = (v.diff = v.realPickMoney - v.tradeTotalPayment); // 真实拣货金额 - 实际支付金额
    const diffNum = (v.diffNum = !v.isWeighing ? Math.abs(v.pickAmount - v.tradeNum) : 0);
    const diffWeight = (v.diffWeight = v.isWeighing ? Math.abs(v.pickWeight - v.weight) : 0);
    if (!!diff || !!diffNum || !!diffWeight) {
      // 只要有差异都生成
      totalDiff += diff; // 总金额差异
      temArr.push(v);
    }
    totalPickAgio += v.pickAgio;
  });
  const response = setIn(res, ['content', 'result', 'repairList'], temArr);
  response.content.result.totalDiff = totalDiff;
  response.content.result.totalPickMoney = totalPickMoney;
  response.content.result.totalPayPrice = totalPayPrice;
  return setIn(response, ['content', 'result', 'totalPickAgio'], totalPickAgio);
};

export default function* orderDetailSaga() {
  // yield takeEvery(types.WRITE_OFF_UPDATE, updateSagaWriteOff)
  yield takeEvery(types.SAGA_ORDER_DETAIL_GET, getPackageList);
  yield takeEvery(types.SAGA_OMS_OPERATE, omsOperate);
  yield takeEvery(types.SAGA_TO_PAY, toPayFor);
  yield takeEvery(types.SAGA_TO_WRITEOFF, toWriteOff);
  // yield getSagaPackageList()
}
