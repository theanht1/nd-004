import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import Cookies from 'js-cookie';
import axios from 'axios';
import store, { history } from './store';
import './style.css';
import App from './App';
import { AUTHORIZATION_COOKIE_NAME, getCurrentUser } from './actions/userActions';

// TODO: Config backend host
axios.defaults.baseURL = 'http://localhost:5000/api';
const accessToken = Cookies.get(AUTHORIZATION_COOKIE_NAME);
if (accessToken && accessToken.length > 0) {
  store.dispatch(getCurrentUser({ accessToken }));
}

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <App />
      </div>
    </ConnectedRouter>
  </Provider>,
  // eslint-disable-next-line no-undef
  document.getElementById('root'),
);
