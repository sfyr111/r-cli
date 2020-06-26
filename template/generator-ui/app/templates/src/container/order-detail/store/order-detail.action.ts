import { createAction } from 'redux-actions'
import * as types from './order-detail.type'
export const getOrderDetailSaga = createAction(types.SAGA_ORDER_DETAIL_GET)
export const setOrderDetailSaga = createAction(types.SAGA_ORDER_DETAIL_SET)
export const setSourceInfoSaga = createAction(types.SAGA_ORDER_SOURCE_SET)
export const updateRepairInfo = createAction(types.ORDER_REPAIR_UPDATE)
export const updateSubOrderInfo = createAction(types.SUB_ORDER_INFO_UPDATE)
export const updateModifyOrderInfo = createAction(types.MODIFY_ORDER_INFO_UPDATE)
export const updateWriteOffSaga = createAction(types.SAGA_WRITE_OFF_UPDATE)
export const getWriteOffSaga = createAction(types.WRITE_OFF_UPDATE)
export const omsOperateSaga = createAction(types.SAGA_OMS_OPERATE)
export const toPaySaga = createAction(types.SAGA_TO_PAY)
export const toWriteOffSaga = createAction(types.SAGA_TO_WRITEOFF)
