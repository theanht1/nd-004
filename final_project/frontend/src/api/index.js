/* eslint-disable import/prefer-default-export */
import { openSnackbar } from '../actions/appActions';

export const performRequest = ({
  dispatch, requestPromise, onData, onError, postUpdate = () => {},
}) => requestPromise.then((response) => {
  onData(response);
  postUpdate();
}, (error) => {
  let errorMessage = 'Something went wrong! Please try again.';
  if (error.response) {
    if (onError) {
      onError(error.response);
      return;
    }

    if (error.response.data && error.response.data.error) {
      const errors = error.response.data.error;
      // errors can be a string or object of Marshmallow errors
      if (typeof (errors) === 'string') {
        errorMessage = errors;
      } else {
        const firstError = Object.keys(errors)[0];
        errorMessage = `${firstError}: ${errors[firstError]}`;
        // errorMessage = Object.keys(errors).map(key => `${key}: ${errors[key]}`).join('\n');
      }
    }
  }

  if (dispatch) {
    dispatch(openSnackbar({ message: errorMessage, type: 'error' }));
  } else {
  // eslint-disable-next-line no-console
    console.log(errorMessage);
  }
  postUpdate();
});
