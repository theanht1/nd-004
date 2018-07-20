import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  CircularProgress, FormControl, Grid, Input, InputLabel, MenuItem, Select,
} from '@material-ui/core';
import { withRouter } from 'react-router';
import { getCategories } from '../../actions/categoriesActions';

class ItemForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      description: '',
      category_id: 1,
    };

    const { onGetCategories } = props;
    onGetCategories();

    this.handlerChange = this.handlerChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { item } = nextProps;
    if (item.id) {
      this.setState({
        name: item.name,
        description: item.description,
        category_id: item.category_id,
      });
    }
  }

  handlerChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const {
      categories, categoriesLoading, onSubmit, history: { goBack },
    } = this.props;
    if (categoriesLoading) {
      return <CircularProgress size={68} />;
    }

    const { name, description, category_id } = this.state;
    return (
      <Grid>
        <FormControl fullWidth className="margin-top-20">
          <InputLabel>
            Name
          </InputLabel>
          <Input value={name} name="name" onChange={this.handlerChange} />
        </FormControl>

        <FormControl fullWidth className="margin-top-20">
          <InputLabel>
            Description
          </InputLabel>
          <Input
            value={description}
            name="description"
            multiline
            rows={4}
            onChange={this.handlerChange}
          />
        </FormControl>

        <FormControl fullWidth className="margin-top-20">
          <InputLabel>
            Category
          </InputLabel>
          <Select value={category_id} name="category_id" onChange={this.handlerChange}>
            {categories.map(category => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div className="margin-top-20">
          <Button
            onClick={() => goBack()}
            variant="contained"
            color="default"
            className="margin-right-10"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onSubmit({ name, description, category_id })}
            variant="contained"
            color="primary"
          >
            Submit
          </Button>
        </div>
      </Grid>
    );
  }
}

ItemForm.propTypes = {
  categories: PropTypes.array.isRequired,
  categoriesLoading: PropTypes.bool.isRequired,
  onGetCategories: PropTypes.func.isRequired,
  item: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

ItemForm.defaultProps = {
  item: { name: '', description: '', category_id: '' },
};

const mapStateToProps = ({ categories: { categories, categoriesLoading } }) => ({
  categories,
  categoriesLoading,
});

const mapDispatchToProps = dispatch => ({
  onGetCategories: () => { dispatch(getCategories()); },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ItemForm));
