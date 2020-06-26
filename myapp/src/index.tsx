import 'babel-polyfill'
// import 'core-js/stable'
import 'react-app-polyfill/ie11'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import Immutable from 'immutable'
import { ConnectedRouter } from 'connected-react-router/immutable'
import configureStore, { history } from './configureStore'
import flexible from './shared/script/flexible'
import { getQueryString } from './shared/script/utils'
import App from './App'

import './index.styl'
import './shared/stylus/base.styl'
import './shared/stylus/reset.styl'

flexible()

if (getQueryString('debug') === 'true') {
  new window.VConsole()
}

const initialState = Immutable.Map()
export const store = configureStore(initialState)

const root = document.getElementById('root')

ReactDOM.render(
  <Provider store={store as any}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  root
)
