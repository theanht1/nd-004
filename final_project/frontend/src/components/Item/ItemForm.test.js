import React from 'react';
import { mount } from 'enzyme';
import { Route } from 'react-router';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import ItemForm from './ItemForm';
import store, { history } from '../../store';

describe('ItemForm', () => {
  let appComponent;
  const dispatchMock = jest.fn();

  const props = {
    item: {
      id: 1, name: 'Item name', description: 'Item description', category_id: 1,
    },
    onSubmit: () => {},
  };

  beforeAll(() => {
    store.dispatch = dispatchMock;
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
    expect(dispatchMock.mock.calls.length).toBe(1);
    // console.log(formComponent.find('input [name="name"]').length).toBe(2);
  });
});
