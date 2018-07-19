import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button, CircularProgress, Typography } from '@material-ui/core/es/index';
import { Link } from 'react-router-dom';
import { getItem } from '../../actions/itemActions';

class ItemDetail extends React.Component {
  constructor(props) {
    super(props);

    const { onGetItem, match: { params: { item_id } } } = props;
    onGetItem({ item_id });
  }

  render() {
    const {
      item, itemLoading, currentUser, currentUserLoading, history: { goBack },
    } = this.props;
    if (itemLoading || currentUserLoading) {
      return <CircularProgress size={68} />;
    }

    const isOwner = currentUser && currentUser.id === item.user_id;
    const editURL = `/items/${item.id}/edit`;

    return (
      <div className="item-form">
        <Typography variant="title">
          {item.name}
        </Typography>
        <Typography variant="body1">
          {item.description}
        </Typography>

        <div className="margin-top-20 flex">
          <Button onClick={() => goBack()} variant="contained" className="margin-right-10">
            Back
          </Button>
          {isOwner && (
          <div>
            <Button variant="contained" color="secondary" className="margin-right-10">
              Delete
            </Button>
            <Button component={Link} to={editURL} variant="contained" color="primary">
              Edit
            </Button>
          </div>
          )}
        </div>
      </div>
    );
  }
}

ItemDetail.propTypes = {
  onGetItem: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  itemLoading: PropTypes.bool.isRequired,
  currentUser: PropTypes.object.isRequired,
  currentUserLoading: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = ({
  item: { item, itemLoading },
  auth: { currentUser, currentUserLoading },
}) => ({
  item,
  itemLoading,
  currentUser,
  currentUserLoading,
});

const mapDispatchToProps = dispatch => ({
  onGetItem: ({ item_id }) => dispatch(getItem({ item_id })),
});

export default connect(mapStateToProps, mapDispatchToProps)(ItemDetail);
