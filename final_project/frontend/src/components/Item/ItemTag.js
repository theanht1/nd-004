import React from 'react';
import PropTypes from 'prop-types';
import { ListItem, ListItemText } from '@material-ui/core';
import { Link } from 'react-router-dom';

const ItemTag = ({ item }) => {
  const itemDetailURL = `/items/${item.id}`;

  return (
    <ListItem button component={Link} to={itemDetailURL}>
      <ListItemText>
        {item.name}
        &nbsp;(
        {item.category.name}
        )
      </ListItemText>
    </ListItem>
  );
};

ItemTag.propTypes = {
  item: PropTypes.object.isRequired,
};

export default ItemTag;
