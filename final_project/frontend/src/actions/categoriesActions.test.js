import axios from 'axios';
import store from '../store';
import { getCategories, getItems, getLatestItems } from './categoriesActions';

jest.mock('axios');


describe('categoriesActions', () => {
  const categoriesList = [
    { id: 1, name: 'CATEGORY_1' },
    { id: 2, name: 'CATEGORY_2' },
  ];

  const latestItemsList = [
    { id: 1, name: 'ITEM_1', description: 'DESC_1' },
    { id: 2, name: 'ITEM_2', description: 'DESC_2' },
  ];

  test('should return categories list', async () => {
    axios.get.mockImplementation(() => Promise.resolve({
      data: { categories: categoriesList },
    }));
    await store.dispatch(getCategories());

    const { categories } = store.getState();
    expect(categories.categoriesLoading).toBeFalsy();
    expect(categories.categories).toHaveLength(2);
    expect(categories.categories).toEqual(categoriesList);
  });

  test('should return latest items', async () => {
    axios.get.mockImplementation(() => Promise.resolve({
      data: { items: latestItemsList },
    }));
    await store.dispatch(getLatestItems());

    const { categories } = store.getState();
    expect(categories.latestItemsLoading).toBeFalsy();
    expect(categories.latestItems).toHaveLength(2);
    expect(categories.latestItems).toEqual(latestItemsList);
  });

  test('should return category\'s items', async () => {
    axios.get.mockImplementation(() => Promise.resolve({
      data: { items: latestItemsList },
    }));
    await store.dispatch(getItems({ category_id: categoriesList[0].id }));

    const { categories } = store.getState();
    expect(categories.itemsLoading).toBeFalsy();
    expect(categories.items).toHaveLength(2);
    expect(categories.items).toEqual(latestItemsList);
  });
});
