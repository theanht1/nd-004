import axios from 'axios';
import { push } from 'connected-react-router';
import { SET_ITEM, SET_ITEM_LOADING, SET_ITEM_SUBMITTING } from '../reducers/item';
import { performRequest } from '../api';
import { openSnackbar } from './appActions';

/**
 * Create item dispatch
 * @param {String} name
 * @param {String} description
 * @param {Number} category_id
 * @returns {Function}
 */
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
      dispatch(openSnackbar({
        type: 'success',
        message: 'New item has created!',
      }));
    },
    postUpdate: () => {
      dispatch({
        type: SET_ITEM_SUBMITTING,
        payload: false,
      });
    },
  });
};

/**
 * Edit item dispatch
 * @param {Number} id
 * @param {String} name
 * @param {String} description
 * @param {Number} category_id
 * @returns {Function}
 */
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
      dispatch(openSnackbar({
        type: 'success',
        message: 'Item has been updated!',
      }));
    },
    postUpdate: () => {
      dispatch({
        type: SET_ITEM_SUBMITTING,
        payload: false,
      });
    },
  });
};

/**
 * Delete item dispatch
 * @param {Number} id
 * @returns {Function}
 */
export const deleteItem = ({ id }) => (dispatch) => {
  dispatch({
    type: SET_ITEM_SUBMITTING,
    payload: true,
  });

  return performRequest({
    dispatch,
    requestPromise: axios.delete(`/items/${id}/`),
    onData: () => {
      dispatch({
        type: SET_ITEM,
        payload: {
          name: '', description: '', category_id: 0,
        },
      });
      dispatch(push('/'));
      dispatch(openSnackbar({
        type: 'success',
        message: 'Item has been deleted!',
      }));
    },
    postUpdate: () => {
      dispatch({
        type: SET_ITEM_SUBMITTING,
        payload: false,
      });
    },
  });
};

// Get item with id
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
