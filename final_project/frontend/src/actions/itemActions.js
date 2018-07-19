import axios from 'axios';
import { push } from 'connected-react-router';
import { SET_ITEM, SET_ITEM_LOADING, SET_ITEM_SUBMITTING } from '../reducers/item';
import { performRequest } from '../api';


export const createItem = ({ name, description, category_id }) => (dispatch) => {
  dispatch({
    type: SET_ITEM_SUBMITTING,
    payload: true,
  });

  return performRequest({
    dispatch,
    requestPromise: axios.post('/items/', { name, description, category_id }),
    onData: ({ data: { item } }) => {
      dispatch(push(`/items/${item.id}`));
    },
    postUpdate: () => {
      dispatch({
        type: SET_ITEM_SUBMITTING,
        payload: true,
      });
    },
  });
};

export const editItem = ({
  id, name, description, category_id,
}) => (dispatch) => {
  dispatch({
    type: SET_ITEM_SUBMITTING,
    payload: true,
  });

  return performRequest({
    dispatch,
    requestPromise: axios.patch(`/items/${id}/`, { name, description, category_id }),
    onData: () => {
      dispatch(push(`/items/${id}`));
    },
    postUpdate: () => {
      dispatch({
        type: SET_ITEM_SUBMITTING,
        payload: true,
      });
    },
  });
};

export const getItem = ({ item_id }) => (dispatch) => {
  dispatch({
    type: SET_ITEM_LOADING,
    payload: true,
  });

  return performRequest({
    dispatch,
    requestPromise: axios.get(`/items/${item_id}/`),
    onData: ({ data: { item } }) => {
      dispatch({
        type: SET_ITEM,
        payload: item,
      });
    },
    postUpdate: () => {
      dispatch({
        type: SET_ITEM_LOADING,
        payload: false,
      });
    },
  });
};
