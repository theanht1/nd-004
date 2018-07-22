import React from 'react';
import { mount } from 'enzyme';
import { Route } from 'react-router';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import axios from 'axios';
import { Button } from '@material-ui/core/';
import ItemForm from './ItemForm';
import store, { history } from '../../store';
import { editItem } from '../../actions/itemActions';

jest.mock('axios');

describe('ItemForm', () => {
  let appComponent;

  const ITEM = {
    id: 1, name: 'Item name', description: 'Item description', category_id: 1,
  };
  const props = {
    item: ITEM,
    onSubmit: jest.fn(itemInfo => store.dispatch(editItem(itemInfo))),
  };

  const CATEGORIES = [
    { id: 1, name: 'CATEGORY_1' },
    { id: 2, name: 'CATEGORY_2' },
  ];

  beforeAll(() => {
    // Mock get categories
    axios.get.mockImplementation(() => Promise.resolve({
      data: { categories: CATEGORIES },
    }));
    // Mock submit item
    axios.patch.mockImplementation(() => Promise.resolve({
      data: { item: ITEM },
    }));
    appComponent = mount(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Route path="/" render={() => <ItemForm {...props} />} />
        </ConnectedRouter>
      </Provider>,
    );
  });

  test('should render correctly', () => {
    appComponent.update();
    const formComponent = appComponent.find(ItemForm).first();
    expect(formComponent.find('input [name="name"]')).toHaveLength(1);
    expect(formComponent.find('textarea [name="description"]')).toHaveLength(1);
  });

  test('should change state when change form', () => {
    const formComponent = appComponent.find(ItemForm).first();
    const nameInput = formComponent.find('input [name="name"]');
    nameInput.simulate('change', { target: { value: 'CHANGED' } });
    appComponent.update();
  });

  test('should trigger actions', () => {
    const formComponent = appComponent.find(ItemForm).first();
    // Go back
    formComponent.find(Button).first().props().onClick();
    // Submit
    formComponent.find(Button).last().props().onClick();
    const { onSubmit } = props;
    expect(onSubmit.mock.calls).toHaveLength(1);
  });
});
