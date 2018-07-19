import { SET_ALERT_STATE, SET_SNACK_BAR_STATE } from '../reducers/app';

export const openSnackbar = ({ message, type }) => (dispatch) => {
  dispatch({
    type: SET_SNACK_BAR_STATE,
    payload: {
      open: true,
      message,
      type,
    },
  });
};

export const closeSnackbar = () => (dispatch) => {
  dispatch({
    type: SET_SNACK_BAR_STATE,
    payload: {
      open: false,
      message: '',
      type: 'info',
    },
  });
};

export const openAlert = ({ title, content, onSuccess }) => (dispatch) => {
  dispatch({
    type: SET_ALERT_STATE,
    payload: {
      open: true,
      title,
      content,
      onSuccess,
    },
  });
};

export const closeAlert = () => (dispatch) => {
  dispatch({
    type: SET_ALERT_STATE,
    payload: {
      open: false,
    },
  });
};
