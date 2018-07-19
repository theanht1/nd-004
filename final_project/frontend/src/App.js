import React from 'react';
import PropTypes from 'prop-types';
import { Route, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Card, Snackbar } from '@material-ui/core/es/index';
import Header from './components/header';
import Home from './pages/home';
import Login from './pages/login';
import { closeSnackbar } from './actions/appActions';

const App = (props) => {
  const { openSnackbar, snackbarMessage, onCloseSnackbar } = props;

  return (
    <div>
      <Header />
      <main>
        <Card className="container">
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
        </Card>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={onCloseSnackbar}
          message={snackbarMessage}
        />
      </main>
    </div>
  );
};

App.propTypes = {
  openSnackbar: PropTypes.bool.isRequired,
  snackbarMessage: PropTypes.string.isRequired,
  onCloseSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = ({ app: { openSnackbar, snackbarMessage } }) => ({
  openSnackbar,
  snackbarMessage,
});

const mapDispatchToProps = dispatch => ({
  onCloseSnackbar: () => {
    dispatch(closeSnackbar());
  },
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(App));
