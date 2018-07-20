import React from 'react';
import { shallow } from 'enzyme';
import { ListItemText } from '@material-ui/core';
import CategoryTag from './CategoryTag';

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
  });
});
