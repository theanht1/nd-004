import React from 'react';
import PropTypes from 'prop-types';
import {
  Redirect, Route, Switch, withRouter,
} from 'react-router';
import { connect } from 'react-redux';
import { Card } from '@material-ui/core/es/index';
import Header from './components/header';
import Home from './pages/home';
import Login from './pages/login';
import ItemsPage from './pages/itemsPage';
import ItemNew from './pages/itemNew';
import ItemDetail from './pages/itemDetail';
import ItemEdit from './pages/itemEdit';
import AppSnackbar from './components/utils/AppSnackbar';
import AppAlert from './components/utils/AppAlert';

const App = (props) => {
  const {
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
        <AppSnackbar />
        <AppAlert />
      </main>
    </div>
  );
};

App.propTypes = {
  isLogin: PropTypes.bool.isRequired,
  currentUserLoading: PropTypes.bool.isRequired,
};

const mapStateToProps = ({
  auth: { currentUser, currentUserLoading },
}) => ({
  currentUserLoading,
  isLogin: !!currentUser && Object.keys(currentUser).length > 0,
});

export default withRouter(connect(mapStateToProps)(App));
