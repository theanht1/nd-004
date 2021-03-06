import React from 'react';
import { mount } from 'enzyme';
import { Button } from '@material-ui/core';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import Header from './index';
import store, { history } from '../../store';
import { SET_CURRENT_USER } from '../../reducers/auth';

describe('Header', () => {
  let appComponent;
  beforeAll(() => {
    appComponent = mount(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Header />
        </ConnectedRouter>
      </Provider>,
    );
  });

  test('should show login button', () => {
    expect(appComponent.find(Button)
      .filterWhere(item => item.prop('to') === '/login'))
      .toHaveLength(1);
  });

  test('should not show login if user is authenticated', () => {
    store.dispatch({
      type: SET_CURRENT_USER,
      payload: { id: 1, name: 'Name', email: 'email' },
    });
    appComponent.update();
    expect(appComponent.find(Button)
      .filterWhere(item => item.prop('to') === '/login'))
      .toHaveLength(0);
  });

  test('should logout', () => {
    store.dispatch({
      type: SET_CURRENT_USER,
      payload: { id: 1, name: 'Name', email: 'email' },
    });
    const logoutBtn = appComponent.find(Button).last();
    logoutBtn.props().onClick();
    const { auth } = store.getState();
    expect(auth.currentUser).toEqual({});
  });
});
