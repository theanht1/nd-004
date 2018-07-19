import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  AppBar, Button, Toolbar, Typography,
} from '@material-ui/core/es/index';
import { logout } from '../../actions/authActions';


const Header = (props) => {
  const { currentUser, isLogin, onLogout } = props;

  return (
    <header>
      <AppBar position="static">
        <Toolbar className="flex space-between">
          <Button component={Link} to="/" color="inherit">
            <Typography variant="title" color="inherit">
              Developer catalog
            </Typography>
          </Button>
          <div>
            {isLogin && (
              <div className="flex" color="inherit">
                <Typography variant="subheading" className="align-self-center" color="inherit">
                  Hi&nbsp;
                  {currentUser.name}
                  ,
                </Typography>
                <Button onClick={onLogout} color="inherit">
                  Logout
                </Button>
              </div>
            )}
            {!isLogin && (
              <Button component={Link} to="/login" color="inherit">
                Login
              </Button>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </header>
  );
};

Header.propTypes = {
  currentUser: PropTypes.object,
  isLogin: PropTypes.bool,
  onLogout: PropTypes.func.isRequired,
};

Header.defaultProps = {
  currentUser: null,
  isLogin: false,
};

const mapStateToProps = ({ auth: { currentUser } }) => ({
  currentUser,
  isLogin: !!currentUser && Object.keys(currentUser).length > 0,
});

const mapDispatchToProps = dispatch => ({
  onLogout: () => { dispatch(logout()); },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
