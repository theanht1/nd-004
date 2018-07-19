import React from 'react';
import PropTypes from 'prop-types';
import { Divider, ListItem, ListItemText } from '@material-ui/core/es/index';
import { Link } from 'react-router-dom';

const CategoryItem = ({ category }) => {
  const categoryItemURL = `/categories/${category.id}/items/`;
  return (
    <div>
      <ListItem button component={Link} to={categoryItemURL}>
        <ListItemText primary={category.name} />
      </ListItem>
      <Divider />
    </div>
  );
};

CategoryItem.propTypes = {
  category: PropTypes.object.isRequired,
};

export default CategoryItem;
