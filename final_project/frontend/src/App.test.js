import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { mount } from 'enzyme';
import store, { history } from './store';
import App from './App';

test('App renders without crashing', () => {
  const app = mount(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>,
  );
});
