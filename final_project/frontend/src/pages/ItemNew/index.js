import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core/es/index';
import ItemForm from '../../components/Item/ItemForm';
import { createItem } from '../../actions/itemActions';

const ItemNew = (props) => {
  const { onCreateItem } = props;
  return (
    <div className="item-form">
      <Typography variant="title">
        Add new item
      </Typography>
      <ItemForm onSubmit={onCreateItem} />
    </div>
  );
};

ItemNew.propTypes = {
  onCreateItem: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  onCreateItem: item => dispatch(createItem(item)),
});

export default connect(null, mapDispatchToProps)(ItemNew);
