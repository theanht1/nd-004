import React from 'react';
import { mount } from 'enzyme';
import { Route } from 'react-router';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import axios from 'axios';
import { Button } from '@material-ui/core';
import ItemDetail from '.';
import store, { history } from '../../store';
import { SET_CURRENT_USER } from '../../reducers/auth';

jest.mock('axios');

describe('ItemDetail', () => {
  const USER = {
    id: 1, name: 'USER_NAME', email: 'USER_EMAIL',
  };

  const ITEM = {
    id: 1, name: 'Item name', description: 'Item description', user_id: USER.id,
  };

  // Mock API get item
  axios.get.mockImplementation(() => Promise.resolve({
    data: { item: ITEM },
  }));
  let appComponent;

  beforeAll(() => {
    history.goBack = jest.fn();
    appComponent = mount(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Route path="/" component={ItemDetail} />
        </ConnectedRouter>
      </Provider>,
    );
  });

  test('should render correctly', () => {
    appComponent.update();
    const itemDetail = appComponent.find(ItemDetail);
    expect(itemDetail.html())
      .toEqual(expect.stringContaining(ITEM.name));

    // Back button should trigger goBack
    const backBtn = itemDetail.find(Button).first();
    backBtn.props().onClick();
    expect(history.goBack.mock.calls).toHaveLength(1);
  });

  test('should show edit/delete with only authorized user', async () => {
    appComponent.update();
    const itemEditURL = '/items/1/edit';
    // Not show edit/delete buttons with anonymous user
    expect(appComponent.html())
      .not.toEqual(expect.stringContaining(itemEditURL));

    // Not show edit/delete buttons with unauthorized user
    store.dispatch({
      type: SET_CURRENT_USER,
      payload: { id: 2 },
    });
    appComponent.update();
    expect(appComponent.html())
      .not.toEqual(expect.stringContaining(itemEditURL));

    // Show with owner
    store.dispatch({
      type: SET_CURRENT_USER,
      payload: USER,
    });
    appComponent.update();
    expect(appComponent.html())
      .toEqual(expect.stringContaining(itemEditURL));

    // Delete button should work
    const deleteBtn = appComponent.find(Button).get(1);
    deleteBtn.props.onClick();

    const { app: { alert } } = store.getState();
    expect(alert.open).toBeTruthy();

    axios.delete.mockImplementation(() => Promise.resolve({ data: {} }));
    await alert.onSuccess();
    // Item should be deleted
    const { item: { item } } = store.getState();
    expect(item).toEqual({ name: '', description: '', category_id: 0 });
  });
});
