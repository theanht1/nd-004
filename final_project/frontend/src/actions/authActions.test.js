import axios from 'axios';
import Cookies from 'js-cookie';
import store from '../store';
import {
  AUTHORIZATION_COOKIE_NAME, getCurrentUser, ggLogin, logout,
} from './authActions';
import { SET_CURRENT_USER } from '../reducers/auth';

jest.mock('axios');


describe('authActions', () => {
  const response = {
    access_token: 'ACCESS_TOKEN',
    current_user: { id: 1, name: 'USER_NAME', email: 'USER_EMAIL' },
  };

  test('should login failed with invalid token', async () => {
    axios.post.mockImplementation(() => Promise.reject(new Error('Failed')));
    await store.dispatch(ggLogin({ id_token: 'INVALID_TOKEN' }));

    const { auth } = store.getState();
    expect(auth.loginLoading).toBeFalsy();
    expect(auth.currentUser).toEqual({});
  });

  test('should login successfully with valid token', async () => {
    axios.post.mockImplementation(() => Promise.resolve({ data: response }));
    await store.dispatch(ggLogin({ id_token: 'VALID_TOKEN' }));

    const { auth } = store.getState();
    expect(auth.loginLoading).toBeFalsy();
    expect(auth.currentUser.id).toBe(response.current_user.id);
    expect(auth.currentUser.name).toBe(response.current_user.name);
    expect(auth.currentUser.email).toBe(response.current_user.email);
    expect(Cookies.get(AUTHORIZATION_COOKIE_NAME)).toBe(response.access_token);
    expect(axios.defaults.headers.common.Authorization).toBe(response.access_token);
  });

  test('should logout successfully', () => {
    store.dispatch(logout());

    const { auth } = store.getState();
    expect(auth.currentUser).toEqual({});
    expect(Cookies.get(AUTHORIZATION_COOKIE_NAME)).toBeUndefined();
    expect(axios.defaults.headers.common.Authorization).toBe('');
  });

  test('should get current user successfully', async () => {
    store.dispatch({
      type: SET_CURRENT_USER,
      payload: {},
    });
    axios.get.mockImplementation(() => Promise.resolve({ data: response }));
    await store.dispatch(getCurrentUser({ accessToken: response.access_token }));

    const { auth } = store.getState();
    expect(auth.currentUserLoading).toBeFalsy();
    expect(auth.currentUser.id).toBe(response.current_user.id);
    expect(auth.currentUser.name).toBe(response.current_user.name);
    expect(auth.currentUser.email).toBe(response.current_user.email);
    expect(Cookies.get(AUTHORIZATION_COOKIE_NAME)).toBe(response.access_token);
    expect(axios.defaults.headers.common.Authorization).toBe(response.access_token);
  });
});
