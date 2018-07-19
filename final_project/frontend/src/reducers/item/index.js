export const SET_ITEM_SUBMITTING = 'item/SET_ITEM_SUBMITTING';

const initialState = {
  itemSubmitting: false,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_ITEM_SUBMITTING:
      return { ...state, itemSubmitting: payload };
    default:
      return state;
  }
};
