import createHistory from 'history/createBrowserHistory';
import thunk from 'redux-thunk';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { applyMiddleware, compose, createStore } from 'redux';
import reducers from './reducers';

export const history = createHistory();

const initialState = {};
const middleware = [
  thunk,
  routerMiddleware(history),
];

const store = createStore(
  connectRouter(history)(reducers),
  initialState,
  compose(applyMiddleware(...middleware)),
);

export default store;
