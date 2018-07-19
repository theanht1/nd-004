export const SET_SNACK_BAR_STATE = 'app/SET_SNACK_BAR_STATE';
export const SET_ALERT_STATE = 'app/SET_ALERT_STATE';

const initialState = {
  snackbar: {
    open: false,
    message: '',
    type: 'info',
  },
  alert: {
    open: false,
    title: '',
    content: '',
    onSuccess: () => {},
  },
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_SNACK_BAR_STATE:
      return { ...state, snackbar: { ...state.payload, ...payload } };
    case SET_ALERT_STATE:
      return { ...state, alert: { ...state.alert, ...payload } };
    default:
      return state;
  }
};
