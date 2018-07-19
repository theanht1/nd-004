import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCategories, getItems } from '../../actions/categoriesActions';
import CategoryItems from '../../components/categories/CategoryItems';

class ItemsPage extends React.Component {
  constructor(props) {
    super(props);

    const { onGetCategories, onGetItems } = props;
    onGetCategories();
    onGetItems({ category_id: 1 });
  }

  componentWillReceiveProps(nextProps) {
    const { match: { params: { category_id } }, onGetItems } = nextProps;
    // eslint-disable-next-line react/destructuring-assignment
    if (category_id !== this.props.match.params.category_id) {
      onGetItems({ category_id });
    }
  }

  render() {
    const { match: { params: { category_id } } } = this.props;

    return (
      <CategoryItems type="category" category_id={category_id} />
    );
  }
}

ItemsPage.propTypes = {
  onGetCategories: PropTypes.func.isRequired,
  onGetItems: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

const mapDispatchToProps = dispatch => ({
  onGetCategories: () => dispatch(getCategories()),
  onGetItems: ({ category_id }) => dispatch(getItems({ category_id })),
});

export default connect(null, mapDispatchToProps)(ItemsPage);
