import { handleActions } from 'redux-actions';
import { fromJS } from 'immutable';
import * as types from './kb-store.type';

const initState = fromJS({
  storeList: [],
  selectedStore: {}
});

export const kbStore = handleActions(
  {
    [types.KB_STORE_LIST_UPDATE]: (state, action) => state.set('storeList', action.payload),
    [types.KB_STORE_SELECTED_UPDATE]: (state, action) => state.set('selectedStore', action.payload)
  },
  initState
);
