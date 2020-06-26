import { createAction } from 'redux-actions'
import * as types from './cash-page.type'

export const initCashPageSaga = createAction(types.SAGA_CASH_PAGE_INIT)

export const updateCashPageData = createAction(types.CASH_PAGE_DATA_UPDATE)

