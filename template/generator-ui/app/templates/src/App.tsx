import React, { Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux-immutable';

// import * as Sentry from '@sentry/browser'
// import Loadable from 'react-loadable'

const ConfirmReceipt = React.lazy(() => import('./container/confirm-receipt/confirm-receipt'));
const OrderDetail = React.lazy(() => import('./container/order-detail'));
// render={(props) => <OrderDetail {...props} writeOffMsg repairInfo />}
const TestPage = React.lazy(() => import('./container/test-page/test-page'));
const Cash = React.lazy(() => import('./container/cash/cash'));
const CashResult = React.lazy(() => import('./container/cash-result/cash-result'));
const KBStoreSelect = React.lazy(() => import('./container/kb-store-select/kb-store-select'));
const KBWriteOffResult = React.lazy(() =>
  import('./container/kb-write-off-result/kb-write-off-result')
);

import './App.styl';
import OrderSearch from './container/order-search/order-search';
import { publicPath } from './shared/script/utils';
// if (process.env.NODE_ENV !== 'development') Sentry.init({ dsn: 'https://c94a87930dc447d1942455039701e68c@trap.retailo2o.com/6', release: 'test' });

interface IState {
  error: any;
  eventId: any;
}

interface IProps {}

class App extends React.Component<IProps, IState> {
  static defaultProps: IProps;

  constructor(props: IProps) {
    super(props);

    this.state = {
      error: null,
      eventId: null
    };
  }

  componentDidMount() {}

  componentDidCatch(error: any, errorInfo: any) {
    this.setState({ error });
    // Sentry.withScope(scope => {
    //   scope.setExtras(errorInfo)
    //   const eventId = Sentry.captureException(error)
    //   this.setState({ eventId })
    // });
  }

  render() {
    return this.state.error ? (
      // ? <a onClick={() => Sentry.showReportDialog({ eventId: this.state.eventId })}>反馈问题</a>
      'ERROR'
    ) : (
      <div className="App">
        <div className="app-content">
          <Suspense fallback={null}>
            <Switch>
              <Route exact path={`${publicPath()}/cash`} component={Cash} />
              <Route exact path={`${publicPath()}/cash-result`} component={CashResult} />
              <Route
                exact
                path={`${publicPath()}/test-page`}
                render={(props) => <TestPage {...props} />}
              />
              <Route exact path={`${publicPath()}/confirm-receipt`} component={ConfirmReceipt} />
              <Route exact path={`${publicPath()}/order-detail`} component={OrderDetail} />
              <Route exact path={`${publicPath()}/order-search`} component={OrderSearch} />
              <Route exact path={`${publicPath()}/kb-store-select`} component={KBStoreSelect} />
              <Route
                exact
                path={`${publicPath()}/kb-write-off-result`}
                component={KBWriteOffResult}
              />
              {/* <Route path="/" exact render={() => <Redirect to="/home" />} /> */}
              {/* <Route path="/streams-rkhy/activity-list" exact component={ActivityList} /> */}
              {/* <Route path="/streams-rkhy/activity-detail/:id" component={ActivityDetail} /> */}
              {/* <Route render={() => <Redirect to="/home" />} /> */}
            </Switch>
          </Suspense>
        </div>
      </div>
    );
  }
}

export default App;
