import { spawn, call, all } from 'redux-saga/effects';
// import activity from './activity/activity.saga'
// import testPage from '../container/test-page/store/test-page.saga'
import orderDetail from '../container/order-detail/store/order-detail.saga';
import cash from '../container/cash/store/cash.saga';
import kbStore from '../container/kb-store-select/store/kb-store.saga';

const pageStore = [cash, orderDetail, kbStore];

export default function* () {
  const sagas: (() => {})[] = [...pageStore];

  yield all(
    sagas.map((saga) =>
      spawn(function* () {
        while (true) {
          try {
            yield call(saga);
            break;
          } catch (e) {
            console.log(e);
          }
        }
      })
    )
  );
}
