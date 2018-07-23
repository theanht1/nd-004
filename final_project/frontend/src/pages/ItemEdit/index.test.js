import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { ConnectedRouter, push } from 'connected-react-router';
import axios from 'axios';
import ItemEdit from '.';
import store, { history } from '../../store';
import { SET_CURRENT_USER } from '../../reducers/auth';
import AppRouter from '../../AppRouter';
import ItemForm from '../../components/Item/ItemForm';

jest.mock('axios');

describe('ItemEdit', () => {
  const USER = {
    id: 1, name: 'USER_NAME', email: 'USER_EMAIL',
  };

  const CATEGORIES = [
    { id: 1, name: 'CATEGORY_1' },
    { id: 2, name: 'CATEGORY_2' },
  ];

  const ITEM = {
    id: 1,
    name: 'Item name',
    description: 'Item description',
    user_id: USER.id,
    category_id: CATEGORIES[0].id,
    category: CATEGORIES[0],
  };
  let appComponent;

  beforeAll(() => {
    // Mock API get item and categories
    axios.get
      .mockImplementation(() => Promise.resolve({
        data: {
          item: ITEM, categories: CATEGORIES, items: [ITEM],
        },
      }));
    // Mock API edit item
    axios.patch.mockImplementation(() => Promise.resolve({ data: { item: ITEM } }));

    appComponent = mount(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <AppRouter />
        </ConnectedRouter>
      </Provider>,
    );
  });

  test('should render correctly with authorized user', async () => {
    // Set current user as the item's owner
    await store.dispatch({
      type: SET_CURRENT_USER,
      payload: USER,
    });
    await store.dispatch(push('/items/1/edit'));
    appComponent.update();
    // should render
    expect(history.location.pathname).toBe('/items/1/edit');
    expect(appComponent.find(ItemEdit).html())
      .toEqual(expect.stringContaining('Edit item'));

    // should redirect after updating
    await appComponent.find(ItemForm).props().onSubmit();
    expect(history.location.pathname).toBe('/items/1');
  });

  test('should redirect with unauthorized user', async () => {
    store.dispatch({
      type: SET_CURRENT_USER,
      payload: {},
    });
    await store.dispatch(push('/items/1/edit'));
    // should redirect to home
    expect(history.location.pathname).toBe('/');
  });
});
