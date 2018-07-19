import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  CircularProgress, Grid, List, Typography,
} from '@material-ui/core/es/index';
import { getCategories, getLatestItems } from '../../actions/categoriesActions';
import CategoryTag from '../../components/categories/CategoryTag';
import ItemTag from '../../components/items/ItemTag';

class Home extends React.Component {
  constructor(props) {
    super(props);

    const { onGetCategories, onGetLatestItems } = props;
    onGetCategories();
    onGetLatestItems();
  }

  render() {
    const {
      categories, categoriesLoading, latestItems, latestItemsLoading,
    } = this.props;

    return (
      <Grid container spacing={24}>
        <Grid item xs={4}>
          <Typography variant="title">
            Categories
          </Typography>
          <List component="nav">
            {categoriesLoading && <CircularProgress size={30} />}
            {!categoriesLoading && categories.map(category => (
              <CategoryTag key={category.id} category={category} />
            ))}
          </List>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="title">
            Latest items
          </Typography>
          <List component="nav">
            {latestItemsLoading && <CircularProgress size={30} />}
            {!latestItemsLoading && latestItems.map(item => (
              <ItemTag key={item.id} item={item} />
            ))}
          </List>
        </Grid>
      </Grid>
    );
  }
}

Home.propTypes = {
  onGetCategories: PropTypes.func.isRequired,
  onGetLatestItems: PropTypes.func.isRequired,
  categories: PropTypes.array.isRequired,
  categoriesLoading: PropTypes.bool.isRequired,
  latestItems: PropTypes.array.isRequired,
  latestItemsLoading: PropTypes.bool.isRequired,
};

const mapStateToProps = ({
  categories: {
    categories, categoriesLoading,
    latestItems, latestItemsLoading,
  },
}) => ({
  categories,
  categoriesLoading,
  latestItems,
  latestItemsLoading,
});

const mapDispatchToProps = dispatch => ({
  onGetCategories: () => dispatch(getCategories()),
  onGetLatestItems: () => dispatch(getLatestItems()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
