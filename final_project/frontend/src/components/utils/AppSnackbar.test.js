import React from 'react';
import { mount } from 'enzyme';
import { SnackbarContent, Snackbar } from '@material-ui/core';
import AppSnackbar from './AppSnackbar';
import store from '../../store';
import { openSnackbar } from '../../actions/appActions';


describe('AppSnackbar', () => {
  let snbComponent;
  const SNACKBAR_PAYLOAD = {
    message: 'MESSAGE', type: 'success',
  };

  beforeAll(() => {
    snbComponent = mount(
      <AppSnackbar store={store} />,
    );
  });

  test('should render correctly', async () => {
    await store.dispatch(openSnackbar(SNACKBAR_PAYLOAD));
    snbComponent.update();
    expect(snbComponent.find(SnackbarContent).first().text()).toBe(SNACKBAR_PAYLOAD.message);

    snbComponent.find(Snackbar).first().props().onClose();
    snbComponent.update();
    expect(store.getState().app.snackbar.open).toBeFalsy();
  });
});
