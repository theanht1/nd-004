import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, CircularProgress, Typography } from '@material-ui/core/es/index';
import { ggLogin } from '../../actions/userActions';

const styles = {
  loginSession: {
    marginTop: '50px',
    marginBottom: '30px',
  },
};

const Login = (props) => {
  const { loginLoading, onGoogleLogin } = props;

  const googleLogin = () => {
    global.gapi.load('auth2', () => {
      const GoogleAuth = global.gapi.auth2.init();
      GoogleAuth.signIn()
        .then((res) => {
          onGoogleLogin({ id_token: res.getAuthResponse().id_token });
        }, (err) => {
          console.log(err);
        });
    });
  };
  return (
    <div align="center" style={styles.loginSession}>
      <Typography variant="headline">
        Login with Google account
      </Typography>
      <Button variant="contained" color="primary" onClick={googleLogin}>
        {loginLoading && <CircularProgress color="secondary" size={20} />}
        &nbsp;Login with Google
      </Button>
    </div>
  );
};

Login.propTypes = {
  loginLoading: PropTypes.bool.isRequired,
  onGoogleLogin: PropTypes.func.isRequired,
};

const mapStateToProps = ({ auth: { loginLoading } }) => ({
  loginLoading,
});

const mapDispatchToProps = dispatch => ({
  onGoogleLogin: () => { dispatch(ggLogin()); },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
