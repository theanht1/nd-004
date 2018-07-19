export const SET_SNACK_BAR_STATE = 'app/SET_SNACK_BAR_STATE';

const initialState = {
  openSnackbar: false,
  snackbarMessage: '',
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_SNACK_BAR_STATE:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};