import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  CircularProgress, Grid, List, Typography,
} from '@material-ui/core/es/index';
import { Link } from 'react-router-dom';
import CategoryTag from './CategoryTag';
import ItemTag from '../items/ItemTag';

const CategoryItems = (props) => {
  const {
    type, category_id, categories, categoriesLoading, latestItems,
    latestItemsLoading, items, itemsLoading, isLogin,
  } = props;

  const renderCategoriesList = () => (
    <div>
      <Typography variant="title">
            Categories
      </Typography>
      <List component="nav">
        {categoriesLoading && <CircularProgress size={30} />}
        {!categoriesLoading && categories.map(category => (
          <CategoryTag key={category.id} category={category} />
        ))}
      </List>
    </div>
  );

  const renderItemsList = () => {
    const itemsList = type === 'latest' ? latestItems : items;
    const itemsListLoading = type === 'latest' ? latestItemsLoading : itemsLoading;

    if (categoriesLoading || itemsLoading) {
      return <CircularProgress size={30} />;
    }

    let itemsTitle;
    if (type === 'latest') {
      itemsTitle = 'Latest items';
    } else {
      const currentCategory = categories.find(cat => cat.id === Number(category_id));
      itemsTitle = currentCategory ? `${currentCategory.name}'s items` : 'Items';
    }
    return (
      <div>
        <Typography variant="title">
          {itemsTitle}
        </Typography>
        <List component="nav">
          {(itemsListLoading || categoriesLoading) && <CircularProgress size={30} />}
          {!itemsListLoading && itemsList.map(item => (
            <ItemTag key={item.id} item={item} />
          ))}
        </List>
      </div>
    );
  };
  return (
    <Grid container spacing={24}>
      <Grid item xs={12}>
        {isLogin && (
        <Button variant="contained" component={Link} to="/items/new">
          Add new item
        </Button>
        )}
      </Grid>
      <Grid item xs={4}>
        {renderCategoriesList()}
      </Grid>
      <Grid item xs={8}>
        {renderItemsList()}
      </Grid>
    </Grid>
  );
};

CategoryItems.propTypes = {
  type: PropTypes.oneOf(['latest', 'category']).isRequired,
  category_id: PropTypes.string,
  categories: PropTypes.array.isRequired,
  categoriesLoading: PropTypes.bool.isRequired,
  latestItems: PropTypes.array.isRequired,
  latestItemsLoading: PropTypes.bool.isRequired,
  items: PropTypes.array.isRequired,
  itemsLoading: PropTypes.bool.isRequired,
  isLogin: PropTypes.bool.isRequired,
};

CategoryItems.defaultProps = {
  category_id: '',
};

const mapStateToProps = ({
  categories: {
    categories, categoriesLoading,
    latestItems, latestItemsLoading,
    items, itemsLoading,
  },
  auth: { currentUser },
}) => ({
  categories,
  categoriesLoading,
  latestItems,
  latestItemsLoading,
  items,
  itemsLoading,
  isLogin: !!currentUser && Object.keys(currentUser).length > 0,
});

export default connect(mapStateToProps)(CategoryItems);
