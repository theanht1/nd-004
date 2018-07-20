/* eslint-disable import/prefer-default-export */
import { push } from 'connected-react-router';
import { openSnackbar } from '../actions/appActions';

/**
 * Function to wrap app's requests
 * @param {Function} dispatch : App's dispatch
 * @param {Promise} requestPromise : AJAX request
 * @param {Function} onData : Handle success data
 * @param {Function} onError : Handle error
 * @param {Function} postUpdate : Execute after request (both success or error)
 * @returns {Promise}
 */
export const performRequest = ({
  dispatch, requestPromise, onData, onError, postUpdate = () => {},
}) => requestPromise.then((response) => {
  // Handle success
  onData(response);
  postUpdate();
}, (error) => {
  // Handle error
  let errorMessage = 'Something went wrong! Please try again.';
  if (error.response) {
    if (onError) {
      onError(error.response);
      postUpdate();
      return;
    }

    if (error.response.data && error.response.data.error) {
      const errors = error.response.data.error;
      // errors can be a string or object of Marshmallow errors
      if (typeof (errors) === 'string') {
        errorMessage = errors;
      } else {
        const firstError = Object.keys(errors)[0];
        const keyName = `${firstError[0].toUpperCase()}${firstError.substr(1)}`;
        errorMessage = `${keyName}: ${errors[firstError]}`;
        // errorMessage = Object.keys(errors).map(key => `${key}: ${errors[key]}`).join('\n');
      }
    }
  }

  if (dispatch) {
    // Open snackbar with errorMessage
    dispatch(openSnackbar({ message: errorMessage, type: 'error' }));

    // Redirect to home with 404 error
    if (error.response.status === 404) {
      dispatch(push('/'));
    }
  } else {
  // eslint-disable-next-line no-console
    console.log(errorMessage);
  }
  postUpdate();
});
