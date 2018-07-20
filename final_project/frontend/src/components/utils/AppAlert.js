import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
} from '@material-ui/core';
import { closeAlert } from '../../actions/appActions';


const AppAlert = (props) => {
  const {
    open, title, content, onSuccess, onCloseAlert,
  } = props;

  const wrapOnSuccess = () => {
    onSuccess();
    onCloseAlert();
  };

  return (
    <Dialog open={open} onClose={onCloseAlert}>
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseAlert}>
            No
        </Button>
        <Button onClick={wrapOnSuccess} color="secondary">
            Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AppAlert.propTypes = {
  onCloseAlert: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

const mapStateToProps = ({
  app: {
    alert: {
      open, title, content, onSuccess,
    },
  },
}) => ({
  open, title, content, onSuccess,
});

const mapDispatchToProps = dispatch => ({
  onCloseAlert: () => dispatch(closeAlert()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppAlert);
