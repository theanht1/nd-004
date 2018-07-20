import React from 'react';
import store  from '../store';
import {closeAlert, closeSnackbar, openAlert, openSnackbar} from "./appActions";


describe('Snackbar', () => {
  const snackbar = {
    type: 'success',
    message: 'Test message',
  };
  test('should open correctly', () => {
    store.dispatch(openSnackbar({ ...snackbar }));

    expect(store.getState().app.snackbar.open).toBeTruthy();
    expect(store.getState().app.snackbar.message).toEqual(snackbar.message);
    expect(store.getState().app.snackbar.type).toEqual(snackbar.type);
  });

  test('should close currectly', () => {
    store.dispatch(closeSnackbar());
    expect(store.getState().app.snackbar.open).toBeFalsy();
  });
});

describe('Alert modal', () => {
  const alert = {
    title: 'Title',
    content: 'Content',
    onSuccess: () => {},
  };

  test('should open correctly', () => {
    store.dispatch(openAlert({ ...alert }));

    expect(store.getState().app.alert.open).toBeTruthy();
    expect(store.getState().app.alert.title).toEqual(alert.title);
    expect(store.getState().app.alert.content).toEqual(alert.content);
    expect(store.getState().app.alert.onSuccess).toEqual(alert.onSuccess);
  });

  test('should close currectly', () => {
    store.dispatch(closeAlert());
    expect(store.getState().app.alert.open).toBeFalsy();
  });
});
