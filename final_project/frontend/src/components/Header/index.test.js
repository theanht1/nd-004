import React from 'react';
import { mount } from 'enzyme';
import { ListItemText, Button } from '@material-ui/core';
import Header from './index';
import store, { history } from '../../store';
import {Provider} from "react-redux";
import {ConnectedRouter} from "connected-react-router";
import {SET_CURRENT_USER} from "../../reducers/auth";

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
      .filterWhere(item => item.prop('to') === '/login').length)
      .toBe(1);
  });

  test('should not show login if user is authenticated', () => {
    store.dispatch({
      type: SET_CURRENT_USER,
      payload: { id: 1, name: 'Name', email: 'email' },
    });
    appComponent.update();
    expect(appComponent.find(Button)
      .filterWhere(item => item.prop('to') === '/login').length)
      .toBe(0);
  });
});
