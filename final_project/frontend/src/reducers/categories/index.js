export const SET_CATEGORIES = 'home/SET_CATEGORIES';
export const SET_CATEGORIES_LOADING = 'home/SET_CATEGORIES_LOADING';
export const SET_LATEST_ITEMS = 'home/SET_LATEST_ITEMS';
export const SET_LATEST_ITEMS_LOADING = 'home/SET_LATEST_ITEMS_LOADING';

const initialState = {
  categories: [],
  categoriesLoading: false,
  latestItems: [],
  latestItemsLoading: false,
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_CATEGORIES:
      return { ...state, categories: [...payload] };
    case SET_CATEGORIES_LOADING:
      return { ...state, categoriesLoading: payload };
    case SET_LATEST_ITEMS:
      return { ...state, latestItems: [...payload] };
    case SET_LATEST_ITEMS_LOADING:
      return { ...state, latestItemsLoading: payload };
    default:
      return state;
  }
};