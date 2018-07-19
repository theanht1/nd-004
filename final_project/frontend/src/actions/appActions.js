import { SET_SNACK_BAR_STATE } from '../reducers/app';

export const openSnackbar = ({ message }) => (dispatch) => {
  dispatch({
    type: SET_SNACK_BAR_STATE,
    payload: {
      showSnackbar: true,
      snackbarMessage: message,
    },
  });
};

export const closeSnackbar = () => (dispatch) => {
  dispatch({
    type: SET_SNACK_BAR_STATE,
    payload: {
      showSnackbar: false,
      snackbarMessage: '',
    },
  });
};
