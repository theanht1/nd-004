import React from 'react';
import { mount } from 'enzyme';
import axios from 'axios';
import { Button } from '@material-ui/core';
import Login from '.';
import store from '../../store';

jest.mock('axios');

describe('Login', () => {
  const GoogleAuth = {};
  const authRes = {};
  const ID_TOKEN = 'ID_TOKEN';

  beforeAll(() => {
    // store.dispatch = jest.fn();
    global.gapi = { auth2: {} };
    global.gapi.load = jest.fn((type, callback) => {
      callback();
    });
    GoogleAuth.signIn = jest.fn();
    global.gapi.auth2.init = jest.fn(() => GoogleAuth);
    authRes.getAuthResponse = jest.fn(() => ({ id_token: ID_TOKEN }));

    axios.post.mockImplementation(() => Promise.resolve({
      data: { access_token: 'TOKEN' },
    }));
  });

  test('should render and have functions correctly', async () => {
    const loginComponent = mount(
      <Login store={store} />,
    );
    const loginBtn = loginComponent.find(Button).first();
    expect(loginBtn).toBeTruthy();

    // Login success
    GoogleAuth.signIn = jest.fn(() => Promise.resolve(authRes));
    await loginBtn.props().onClick();
    expect(global.gapi.load.mock.calls).toHaveLength(1);
    expect(GoogleAuth.signIn.mock.calls).toHaveLength(1);

    // Login false
    GoogleAuth.signIn = jest.fn(() => Promise.reject(new Error('ERROR')));
    await loginBtn.props().onClick();
    expect(store.getState().app.snackbar.open).toBeTruthy();
  });
});
