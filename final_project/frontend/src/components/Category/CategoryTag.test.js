import React from 'react';
import { shallow, mount } from 'enzyme';
import { ListItemText } from '@material-ui/core';
import { Route } from 'react-router';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import CategoryTag from './CategoryTag';
import store, { history } from '../../store';

const category = {
  id: 1,
  name: 'Backend',
};

describe('CategoryItem', () => {
  test('should render correctly', () => {
    const categoryTag = shallow(
      <CategoryTag category={category} />,
    );
    expect(categoryTag.find(ListItemText).length).toBe(1);
    expect(categoryTag.find(ListItemText).first().html())
      .toEqual(expect.stringContaining(category.name));

    const app = mount(
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Route path="/" render={() => <CategoryTag category={category} />} />
        </ConnectedRouter>
      </Provider>,
    );
  });
});
