import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import axios from 'axios';
import store, { history } from './store';
import './style.css';
import App from './App';

// TODO: Config backend host
axios.defaults.baseURL = 'http://localhost:5000/api';

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
