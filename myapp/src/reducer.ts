import { combineReducers } from 'redux-immutable';
import { History } from 'history';
import { connectRouter } from 'connected-react-router/immutable';
import { RouterState } from 'connected-react-router';
import { activity } from './redux/activity/activity.reducer';
import { cash } from './container/cash/store/cash.reducer';
import { kbStore } from './container/kb-store-select/store/kb-store.reducer';
import { orderDetail } from '../src/container/order-detail/store/order-detail.reducer';

const pageReducers = { cash, orderDetail, kbStore };
const componentReducers = {};

const rootReducer = (history: History) =>
  combineReducers({
    activity,
    ...pageReducers,
    ...componentReducers,
    router: connectRouter(history)
  });

export interface State {
  count: number;
  router: RouterState;
}

export default rootReducer;
