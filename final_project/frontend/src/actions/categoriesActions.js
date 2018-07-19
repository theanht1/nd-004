import axios from 'axios';
import {
  SET_CATEGORIES,
  SET_CATEGORIES_LOADING,
  SET_LATEST_ITEMS,
  SET_LATEST_ITEMS_LOADING,
} from '../reducers/categories';
import { performRequest } from '../api';


export const getCategories = () => (dispatch) => {
  dispatch({
    type: SET_CATEGORIES_LOADING,
    payload: true,
  });

  return performRequest({
    dispatch,
    requestPromise: axios.get('/categories/'),
    onData: ({ data: { categories } }) => {
      dispatch({
        type: SET_CATEGORIES,
        payload: categories,
      });
    },
    postUpdate: () => { dispatch({ type: SET_CATEGORIES_LOADING, payload: false }); },
  });
};

export const getLatestItems = () => (dispatch) => {
  dispatch({
    type: SET_LATEST_ITEMS_LOADING,
    payload: true,
  });

  return performRequest({
    dispatch,
    requestPromise: axios.get('/items/latest/'),
    onData: ({ data: { items } }) => {
      console.log(items);
      dispatch({
        type: SET_LATEST_ITEMS,
        payload: items,
      });
    },
    postUpdate: () => { dispatch({ type: SET_LATEST_ITEMS_LOADING, payload: false }); },
  });
};
