import axios from 'axios';
import Cookies from 'js-cookie';
import { push } from 'connected-react-router';
import { SET_CURRENT_USER, SET_CURRENT_USER_LOADING, SET_LOGIN_LOADING } from '../reducers/auth';
import { performRequest } from '../api';
import { openSnackbar } from './appActions';

export const AUTHORIZATION_COOKIE_NAME = 'c_t';

// Set token to request header and cookie
const setAccessToken = (token) => {
  axios.defaults.headers.common.Authorization = token.length > 0
    ? token : '';
  Cookies.set(AUTHORIZATION_COOKIE_NAME, token, { expires: 3 });
};

// Remove current access token, typically using for logout
const removeAccessToken = () => {
  axios.defaults.headers.common.Authorization = '';
  Cookies.remove(AUTHORIZATION_COOKIE_NAME);
};

/**
 * Login with Google
 * @param {String} id_token
 * @returns {Function}
 */
export const ggLogin = ({ id_token }) => (dispatch) => {
  dispatch({
    type: SET_LOGIN_LOADING,
    payload: true,
  });
  return performRequest({
    dispatch,
    requestPromise: axios.post('/google-login/', { id_token }),
    onData: ({ data: { access_token, current_user } }) => {
      dispatch({
        type: SET_CURRENT_USER,
        payload: current_user,
      });
      setAccessToken(access_token);
      dispatch(push('/'));
      dispatch(openSnackbar({
        type: 'success',
        message: 'Login successfully!',
      }));
    },
    postUpdate: () => {
      dispatch({
        type: SET_LOGIN_LOADING,
        payload: false,
      });
    },
  });
};

// logout() return a dispatch function for user logging out
export const logout = () => (dispatch) => {
  removeAccessToken();
  dispatch({
    type: SET_CURRENT_USER,
    payload: {},
  });
  dispatch(openSnackbar({
    type: 'success',
    message: 'Logout successfully!',
  }));
};

/**
 * Get current user by access token
 * @param {String} accessToken
 * @returns {Function}
 */
export const getCurrentUser = ({ accessToken }) => (dispatch) => {
  dispatch({
    type: SET_CURRENT_USER_LOADING,
    payload: true,
  });
  setAccessToken(accessToken);
  return performRequest({
    requestPromise: axios.get('/me/'),
    onData: ({ data: { current_user } }) => {
      dispatch({
        type: SET_CURRENT_USER,
        payload: current_user,
      });
    },
    postUpdate: () => {
      dispatch({
        type: SET_CURRENT_USER_LOADING,
        payload: false,
      });
    },
  });
};
