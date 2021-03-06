import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, CircularProgress, Typography } from '@material-ui/core';
import { ggLogin } from '../../actions/authActions';
import { openSnackbar } from '../../actions/appActions';

const styles = {
  loginSession: {
    marginTop: '50px',
    marginBottom: '30px',
  },
};

const Login = (props) => {
  const { loginLoading, onGoogleLogin, onOpenSnackbar } = props;

  const googleLogin = () => {
    global.gapi.load('auth2', () => {
      const GoogleAuth = global.gapi.auth2.init();
      GoogleAuth.signIn()
        .then((res) => {
          onGoogleLogin({ id_token: res.getAuthResponse().id_token });
        }, () => {
          onOpenSnackbar({
            type: 'error',
            message: 'Cannot authorize with Google account. Please try again.',
          });
        });
    });
  };
  return (
    <div align="center" style={styles.loginSession}>
      <Typography variant="headline">
        Login with Google account
      </Typography>
      <Button
        onClick={googleLogin}
        disabled={loginLoading}
        variant="contained"
        color="primary"
      >
        {loginLoading && <CircularProgress color="secondary" size={20} />}
        &nbsp;Login with Google
      </Button>
    </div>
  );
};

Login.propTypes = {
  loginLoading: PropTypes.bool.isRequired,
  onGoogleLogin: PropTypes.func.isRequired,
  onOpenSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = ({ auth: { loginLoading } }) => ({
  loginLoading,
});

const mapDispatchToProps = dispatch => ({
  onGoogleLogin: ({ id_token }) => dispatch(ggLogin({ id_token })),
  onOpenSnackbar: snackbar => dispatch(openSnackbar(snackbar)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
