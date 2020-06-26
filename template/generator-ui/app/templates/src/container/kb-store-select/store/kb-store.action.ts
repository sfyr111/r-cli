import { createAction } from 'redux-actions';
import * as types from './kb-store.type';

export const getKbStoreListSaga = createAction(types.SAGA_KB_STORE_LIST_GET);
export const writeOffKbStoreSaga = createAction(types.SAGA_KB_STORE_WRITE_OFF);

export const updateKbStoreList = createAction(types.KB_STORE_LIST_UPDATE);
export const updateKbStoreSelected = createAction(types.KB_STORE_SELECTED_UPDATE);
