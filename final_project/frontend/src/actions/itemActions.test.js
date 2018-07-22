import axios from 'axios';
import store from '../store';
import {createItem, deleteItem, editItem, getItem} from './itemActions';

jest.mock('axios');


describe('itemActions', () => {
  const ITEM = {
    id: 1, name: 'ITEM_1', description: 'DESC_1', category_id: 1,
  };
  const EDIT_ITEM = {
    id: 1, name: 'ITEM_2', description: 'DESC_2', category_id: 1,
  };

  test('should be able to create new item', async () => {
    axios.post.mockImplementation(() => Promise.resolve({
      data: { item: ITEM },
    }));
    await store.dispatch(createItem(ITEM));

    const { item } = store.getState();
    expect(item.itemSubmitting).toBeFalsy();
  });

  test('should be able to get item', async () => {
    axios.get.mockImplementation(() => Promise.resolve({
      data: { item: ITEM },
    }));
    await store.dispatch(getItem({ item_id: ITEM.id}));

    const { item } = store.getState();
    expect(item.itemLoading).toBeFalsy();
    expect(item.item).toEqual(ITEM);
  });

  test('should be able to edit item', async () => {
    axios.patch.mockImplementation(() => Promise.resolve({
      data: { item: EDIT_ITEM },
    }));
    await store.dispatch(editItem(EDIT_ITEM));

    const { item } = store.getState();
    expect(item.itemSubmitting).toBeFalsy();
    expect(item.item).toEqual(EDIT_ITEM);
  });

  test('should be able to delete item', async () => {
    axios.delete.mockImplementation(() => Promise.resolve({}));
    await store.dispatch(deleteItem({ id: EDIT_ITEM.id }));

    const { item } = store.getState();
    expect(item.itemSubmitting).toBeFalsy();
    expect(item.item).toEqual({ name: '', description: '', category_id: 0});
  });
});
