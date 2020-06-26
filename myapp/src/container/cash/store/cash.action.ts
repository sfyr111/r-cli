import { createAction } from 'redux-actions'
import * as types from './cash.type'

export const loadCashierSaga = createAction(types.SAGA_CASHIER_LOAD)
export const getPaymentListSaga = createAction(types.SAGA_PAYMENT_LIST_GET)
export const prePaySaga = createAction(types.SAGA_PRE_PAY)
export const unityPaySaga = createAction(types.SAGA_UNITY_PAY)
export const startPollQueryPayResultSaga = createAction(types.SAGA_POLL_QUERY_PAY_RESULT_START)
export const stopPollQueryPayResultSaga = createAction(types.SAGA_POLL_QUERY_PAY_RESULT_STOP)
export const paidBackWriteSaga = createAction(types.SAGA_PAID_BACK_WRITE)
export const reportPaymentSaga = createAction(types.SAGA_REPORT_PAYMENT)
export const cancelNormalPaySaga = createAction(types.SAGA_CANCEL_NORMAL_PAY)

export const updateCashMethods = createAction(types.CASH_METHODS_UPDATE)
export const updateCashInfo = createAction(types.CASH_INFO_UPDATE)
export const updateBillInfo = createAction(types.BILL_INFO_UPDATE)
export const updatePayInfo = createAction(types.PAY_INFO_UPDATE)
