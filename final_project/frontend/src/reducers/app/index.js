export const SET_SNACK_BAR_STATE = 'app/SET_SNACK_BAR_STATE';

const initialState = {
  snackbar: {
    open: false,
    message: '',
  },
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_SNACK_BAR_STATE:
      return { ...state, snackbar: { ...payload } };
    default:
      return state;
  }
};
