import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  CircularProgress,
  Typography,
} from '@material-ui/core/es/index';
import { Link } from 'react-router-dom';
import { deleteItem, getItem } from '../../actions/itemActions';
import { openAlert } from '../../actions/appActions';

class ItemDetail extends React.Component {
  constructor(props) {
    super(props);

    const { onGetItem, match: { params: { item_id } } } = props;
    onGetItem({ item_id });

    this.openDeleteAlert = this.openDeleteAlert.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  openDeleteAlert() {
    const { onOpenAlert } = this.props;
    onOpenAlert({
      title: 'Warning!',
      content: 'This will remove this item permanently. Are you sure?',
      onSuccess: this.handleDelete,
    });
  }

  handleDelete() {
    const { onDeleteItem, match: { params: { item_id } } } = this.props;
    return onDeleteItem({ id: item_id });
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
        <Typography variant="body1" className="margin-top-20">
          {item.description}
        </Typography>

        <div className="margin-top-20 flex">
          <Button onClick={() => goBack()} variant="contained" className="margin-right-10">
            Back
          </Button>
          {isOwner && (
          <div>
            <Button
              onClick={this.openDeleteAlert}
              variant="contained"
              color="secondary"
              className="margin-right-10"
            >
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
  onDeleteItem: PropTypes.func.isRequired,
  onOpenAlert: PropTypes.func.isRequired,
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
  onDeleteItem: ({ id }) => dispatch(deleteItem({ id })),
  onOpenAlert: alert => dispatch(openAlert(alert)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ItemDetail);
