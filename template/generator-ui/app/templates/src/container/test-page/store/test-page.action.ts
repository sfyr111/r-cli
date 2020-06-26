import { createAction } from 'redux-actions'
import * as types from './test-page.type'

export const startPollSaga = createAction(types.POLL_START)

export const stopPollSaga = createAction(types.POLL_STOP)
