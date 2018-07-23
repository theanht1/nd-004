import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { ConnectedRouter, push } from 'connected-react-router';
import axios from 'axios';
import store, { history } from '../../store';
import { SET_CURRENT_USER } from '../../reducers/auth';
import AppRouter from '../../AppRouter';
import ItemForm from '../../components/Item/ItemForm';

jest.mock('axios');

describe('ItemNew', () => {
  const USER = {
    id: 1, name: 'USER_NAME', email: 'USER_EMAIL',
  };

  const ITEM = {
    id: 1, name: 'Item name', description: 'Item description', user_id: USER.id,
  };

  const CATEGORIES = [
    { id: 1, name: 'CATEGORY_1' },
    { id: 2, name: 'CATEGORY_2' },
  ];
  // Mock API get item
  axios.get.mockImplementation(() => Promise.resolve({
    data: { categories: CATEGORIES, item: ITEM },
  }));
  // Mock API create item
  axios.post.mockImplementation(() => Promise.resolve({
    data: { item: ITEM },
  }));
  let appComponent;

  beforeAll(() => {
    store.dispatch(push('/items/new'));
    appComponent = mount(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <AppRouter />
        </ConnectedRouter>
      </Provider>,
    );
  });

  test('should redirect to login with anonymous user', () => {
    store.dispatch({
      type: SET_CURRENT_USER,
      payload: {},
    });
    appComponent.update();
    store.dispatch(push('/items/new'));
    expect(history.location.pathname).toBe('/login');
  });

  test('should render with login user', async () => {
    await store.dispatch({
      type: SET_CURRENT_USER,
      payload: { id: 1 },
    });
    await store.dispatch(push('/items/new'));
    expect(history.location.pathname).toBe('/items/new');
    appComponent.update();
    await appComponent.find(ItemForm).props().onSubmit({});
    // should redirect to item detail page after created
    expect(history.location.pathname).toBe('/items/1');
  });
});
