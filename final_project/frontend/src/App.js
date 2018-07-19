import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Card, Snackbar } from '@material-ui/core/es/index';
import Header from './components/header';
import Home from './pages/home';
import Login from './pages/login';
import { closeSnackbar } from './actions/appActions';
import ItemsPage from './pages/itemsPage';
import ItemNew from './pages/itemNew';
import ItemDetail from './pages/itemDetail';

const App = (props) => {
  const {
    openSnackbar, snackbarMessage, onCloseSnackbar,
    isLogin, currentUserLoading,
  } = props;

  return (
    <div>
      <Header />
      <main>
        <Card className="container">
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/categories/:category_id/items/" component={ItemsPage} />
          <Route
            exact
            path="/items/new"
            render={() => (
              currentUserLoading || isLogin ? <ItemNew /> : <Redirect to="/login" />
            )}
          />
          <Route exact path="/items/:item_id/" component={ItemDetail} />
        </Card>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={openSnackbar}
          autoHideDuration={4000}
          onClose={onCloseSnackbar}
          message={snackbarMessage}
        />
      </main>
    </div>
  );
};

App.propTypes = {
  openSnackbar: PropTypes.bool,
  snackbarMessage: PropTypes.string,
  onCloseSnackbar: PropTypes.func.isRequired,
  isLogin: PropTypes.bool.isRequired,
  currentUserLoading: PropTypes.bool.isRequired,
};

App.defaultProps = {
  openSnackbar: false,
  snackbarMessage: '',
};

const mapStateToProps = ({
  app: { openSnackbar, snackbarMessage },
  auth: { currentUser, currentUserLoading },
}) => ({
  openSnackbar,
  snackbarMessage,
  currentUserLoading,
  isLogin: !!currentUser && Object.keys(currentUser).length > 0,
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
