import React from 'react';
import PropTypes from 'prop-types';
import {Redirect, Route, Switch, withRouter} from 'react-router';
import { connect } from 'react-redux';
import {Card, Snackbar} from '@material-ui/core/es/index';
import Header from './components/header';
import Home from './pages/home';
import Login from './pages/login';
import { closeSnackbar } from './actions/appActions';
import ItemsPage from './pages/itemsPage';
import ItemNew from './pages/itemNew';
import ItemDetail from './pages/itemDetail';
import ItemEdit from './pages/itemEdit';

const App = (props) => {
  const {
    snackbar, onCloseSnackbar,
    isLogin, currentUserLoading,
  } = props;
  return (
    <div>
      <Header />
      <main>
        <Card className="container">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/categories/:category_id/items" component={ItemsPage} />
            <Route
              exact
              path="/items/new"
              render={() => (
                currentUserLoading || isLogin ? <ItemNew /> : <Redirect to="/login" />
              )}
            />
            <Route exact path="/items/:item_id/edit/" component={ItemEdit} />
            <Route exact path="/items/:item_id" component={ItemDetail} />
          </Switch>
        </Card>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={onCloseSnackbar}
          message={snackbar.message}
        />
      </main>
    </div>
  );
};

App.propTypes = {
  snackbar: PropTypes.object.isRequired,
  onCloseSnackbar: PropTypes.func.isRequired,
  isLogin: PropTypes.bool.isRequired,
  currentUserLoading: PropTypes.bool.isRequired,
};

const mapStateToProps = ({
  app: { snackbar },
  auth: { currentUser, currentUserLoading },
}) => ({
  snackbar,
  currentUserLoading,
  isLogin: !!currentUser && Object.keys(currentUser).length > 0,
});

const mapDispatchToProps = dispatch => ({
  onCloseSnackbar: () => dispatch(closeSnackbar()),
});

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps,
)(App));
