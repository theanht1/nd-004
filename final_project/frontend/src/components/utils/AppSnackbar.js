import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Snackbar, SnackbarContent } from '@material-ui/core/es/index';
import { closeSnackbar } from '../../actions/appActions';

const styles = {
  success: {
    backgroundColor: '#4caf50',
  },
  warning: {
    backgroundColor: '#ffc107',
  },
  error: {
    backgroundColor: '#f44336',
  },
  info: {
    backgroundColor: '#3d5afe',
  },
};

const AppSnackbar = (props) => {
  const {
    open, message, type, onCloseSnackbar,
  } = props;

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      open={open}
      autoHideDuration={3000}
      onClose={onCloseSnackbar}
    >
      <SnackbarContent
        style={styles[type]}
        message={message}
      />
    </Snackbar>
  );
};

AppSnackbar.propTypes = {
  onCloseSnackbar: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};


const mapStateToProps = ({
  app: { snackbar: { open, message, type } },
}) => ({
  open, message, type,
});

const mapDispatchToProps = dispatch => ({
  onCloseSnackbar: () => dispatch(closeSnackbar()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AppSnackbar);
