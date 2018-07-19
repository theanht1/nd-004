export const SET_CURRENT_USER = 'auth/SET_CURRENT_USER';
export const SET_LOGIN_LOADING = 'auth/SET_LOGIN_LOADING';
export const SET_CURRENT_USER_LOADING = 'auth/SET_CURRENT_USER_LOADING';

const initialState = {
  currentUser: null,
  loginLoading: false,
  currentUserLoading: false,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        currentUser: { ...payload },
      };
    case SET_LOGIN_LOADING:
      return {
        ...state,
        loginLoading: payload,
      };
    case SET_CURRENT_USER_LOADING:
      return {
        ...state,
        currentUserLoading: payload,
      };
    default:
      return state;
  }
};
