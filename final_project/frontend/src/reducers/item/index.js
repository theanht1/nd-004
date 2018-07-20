export const SET_ITEM_SUBMITTING = 'item/SET_ITEM_SUBMITTING';
export const SET_ITEM = 'item/SET_ITEM';
export const SET_ITEM_LOADING = 'item/SET_ITEM_LOADING';

const initialState = {
  itemSubmitting: false,
  item: { name: '', description: '', category_id: 0 },
  itemLoading: false,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_ITEM_SUBMITTING:
      return { ...state, itemSubmitting: payload };
    case SET_ITEM:
      return { ...state, item: payload };
    case SET_ITEM_LOADING:
      return { ...state, itemLoading: payload };
    default:
      return state;
  }
};
