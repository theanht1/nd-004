export const SET_CATEGORIES = 'categories/SET_CATEGORIES';
export const SET_CATEGORIES_LOADING = 'categories/SET_CATEGORIES_LOADING';
export const SET_LATEST_ITEMS = 'categories/SET_LATEST_ITEMS';
export const SET_LATEST_ITEMS_LOADING = 'categories/SET_LATEST_ITEMS_LOADING';
export const SET_ITEMS = 'categories/SET_ITEMS';
export const SET_ITEMS_LOADING = 'categories/SET_ITEMS_LOADING';

const initialState = {
  categories: [],
  categoriesLoading: false,
  latestItems: [],
  latestItemsLoading: false,
  items: [],
  itemsLoading: false,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CATEGORIES:
      return { ...state, categories: payload };
    case SET_CATEGORIES_LOADING:
      return { ...state, categoriesLoading: payload };
    case SET_LATEST_ITEMS:
      return { ...state, latestItems: payload };
    case SET_LATEST_ITEMS_LOADING:
      return { ...state, latestItemsLoading: payload };
    case SET_ITEMS:
      return { ...state, items: payload };
    case SET_ITEMS_LOADING:
      return { ...state, itemsLoading: payload };
    default:
      return state;
  }
};
