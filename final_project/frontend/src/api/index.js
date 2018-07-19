/* eslint-disable import/prefer-default-export */
import { openSnackbar } from '../actions/appActions';

export const performRequest = ({
  dispatch, requestPromise, onData, onError, postUpdate = () => {},
}) => requestPromise.then((response) => {
  onData(response);
  postUpdate();
}).catch((error) => {
  let errorMessage;
  if (error.response) {
    if (onError) {
      onError(error.response);
      return;
    }
    errorMessage = error.response.error;
  } else {
    errorMessage = 'Something went wrong! Please try again.';
  }

  if (dispatch) {
    dispatch(openSnackbar({ message: errorMessage }));
  } else {
  // eslint-disable-next-line no-console
    console.log(errorMessage);
  }
  postUpdate();
});
