import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCategories, getLatestItems } from '../../actions/categoriesActions';
import CategoryItems from '../../components/Category/CategoryItems';

class Home extends React.Component {
  constructor(props) {
    super(props);

    const { onGetCategories, onGetLatestItems } = props;
    onGetCategories();
    onGetLatestItems();
  }

  render() {
    return (
      <CategoryItems type="latest" />
    );
  }
}

Home.propTypes = {
  onGetCategories: PropTypes.func.isRequired,
  onGetLatestItems: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  onGetCategories: () => dispatch(getCategories()),
  onGetLatestItems: () => dispatch(getLatestItems()),
});

export default connect(null, mapDispatchToProps)(Home);
