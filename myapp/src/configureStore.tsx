import { createBrowserHistory } from 'history'
import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'connected-react-router/immutable'
import createSagaMiddleware from 'redux-saga'
import createRootReducer from './reducer'
import rootSaga from './redux/saga'

export const history = createBrowserHistory()

const sagaMiddleware = createSagaMiddleware();

export default function configureStore(preloadedState?: any) {
  const composeEnhancer: typeof compose = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  const store = createStore(
    createRootReducer(history),
    preloadedState,
    composeEnhancer(
      applyMiddleware(
        sagaMiddleware,
        routerMiddleware(history),
      ),
    ),
  )

  sagaMiddleware.run(rootSaga)

  return store
}
