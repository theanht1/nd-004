import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CircularProgress, Typography } from '@material-ui/core';
import { push } from 'connected-react-router';
import ItemForm from '../../components/Item/ItemForm';
import { editItem, getItem } from '../../actions/itemActions';

class ItemEdit extends React.Component {
  constructor(props) {
    super(props);

    const { onGetItem, match: { params: { item_id } } } = props;
    onGetItem({ item_id });
  }

  componentWillReceiveProps(nextProps) {
    const {
      currentUser, currentUserLoading, item, itemLoading, goHome,
    } = nextProps;
    if (!currentUserLoading && !itemLoading && currentUser
      && currentUser.id !== item.user_id) {
      goHome();
    }
  }

  render() {
    const {
      onEditItem, currentUserLoading, item, itemLoading,
      match: { params: { item_id } },
    } = this.props;

    if (currentUserLoading || itemLoading) {
      return <CircularProgress size={68} />;
    }
    return (
      <div className="item-form">
        <Typography variant="title">
          Edit item
        </Typography>
        <ItemForm item={item} onSubmit={eItem => onEditItem({ ...eItem, id: item_id })} />
      </div>
    );
  }
}

ItemEdit.propTypes = {
  onEditItem: PropTypes.func.isRequired,
  onGetItem: PropTypes.func.isRequired,
  goHome: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  itemLoading: PropTypes.bool.isRequired,
  currentUser: PropTypes.object.isRequired,
  currentUserLoading: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
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
  onEditItem: item => dispatch(editItem(item)),
  onGetItem: ({ item_id }) => dispatch(getItem({ item_id })),
  goHome: () => dispatch(push('/')),
});

export default connect(mapStateToProps, mapDispatchToProps)(ItemEdit);
