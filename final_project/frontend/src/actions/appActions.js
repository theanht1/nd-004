import { SET_ALERT_STATE, SET_SNACK_BAR_STATE } from '../reducers/app';

/**
 * Open snackbar to notice user
 * @param {String} message
 * @param {String} type
 * @returns {Function} dispatch function
 */
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

// closeSnackbar() return a dispatch function to close the snackbar
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

/**
 * Open alert modal
 * @param {String} title
 * @param {String} content
 * @param {Function} onSuccess
 * @returns {Function} dispatch function
 */
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

// closeAlert() return a dispatch function to close the alert modal
export const closeAlert = () => (dispatch) => {
  dispatch({
    type: SET_ALERT_STATE,
    payload: {
      open: false,
    },
  });
};
