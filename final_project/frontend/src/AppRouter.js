import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Redirect, Route, Switch, withRouter,
} from 'react-router';
import ItemsPage from './pages/ItemsPage';
import Login from './pages/Login';
import ItemDetail from './pages/ItemDetail';
import Home from './pages/Home';
import ItemEdit from './pages/ItemEdit';
import ItemNew from './pages/ItemNew';


const AppRouter = (props) => {
  const {
    isLogin, currentUserLoading,
  } = props;

  return (
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
  );
};

AppRouter.propTypes = {
  isLogin: PropTypes.bool.isRequired,
  currentUserLoading: PropTypes.bool.isRequired,
};

const mapStateToProps = ({
  auth: { currentUser, currentUserLoading },
}) => ({
  currentUserLoading,
  isLogin: !!currentUser && Object.keys(currentUser).length > 0,
});

export default withRouter(connect(mapStateToProps)(AppRouter));
