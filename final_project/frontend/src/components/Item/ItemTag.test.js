import React from 'react';
import { shallow, mount } from 'enzyme';
import { ListItemText } from '@material-ui/core';
import ItemTag from './ItemTag';

const item = {
  id: 1,
  name: 'Item',
  description: 'Description',
  category: { id: 1, name: 'Category' },
};

describe('CategoryItem', () => {
  test('should render correctly', () => {
    const itemTag = shallow(
      <ItemTag item={item} />,
    );
    expect(itemTag.find(ListItemText).length).toBe(1);
    expect(itemTag.find(ListItemText).first().html())
      .toEqual(expect.stringContaining(item.name));
  });
});
