import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { ConnectedRouter, push } from 'connected-react-router';
import axios from 'axios';
import store, { history } from '../../store';
import AppRouter from '../../AppRouter';
import ItemsPage from '.';

jest.mock('axios');

describe('ItemNew', () => {
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
    category: CATEGORIES[0],
  };
  // Mock API get
  axios.get.mockImplementation(() => Promise.resolve({
    data: { categories: CATEGORIES, item: ITEM, items: [ITEM] },
  }));
  let appComponent;

  beforeAll(() => {
    appComponent = mount(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <AppRouter />
        </ConnectedRouter>
      </Provider>,
    );
    store.dispatch(push('/categories/1/items'));
  });

  test('should render successfully', async () => {
    appComponent.update();
    expect(history.location.pathname).toBe('/categories/1/items');
    expect(appComponent.find(ItemsPage)).toBeTruthy();
    // Change route
    await store.dispatch(push('/categories/3/items'));
    expect(history.location.pathname).toBe('/categories/3/items');
    expect(appComponent.find(ItemsPage)).toBeTruthy();
  });
});
