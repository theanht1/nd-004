import React from 'react';
import { mount } from 'enzyme';
import { DialogTitle, Button, DialogContentText } from '@material-ui/core';
import AppAlert from './AppAlert';
import store from '../../store';
import { openAlert } from '../../actions/appActions';


describe('AppAlert', () => {
  let alertComponent;
  const ALERT_PAYLOAD = {
    title: 'TITLE', content: 'CONTENT', onSuccess: jest.fn(),
  };

  beforeAll(() => {
    alertComponent = mount(
      <AppAlert store={store} />,
    );
  });

  test('should render correctly', async () => {
    await store.dispatch(openAlert(ALERT_PAYLOAD));
    alertComponent.update();
    expect(alertComponent.find(DialogTitle).first().text()).toBe(ALERT_PAYLOAD.title);
    expect(alertComponent.find(DialogContentText).first().text()).toBe(ALERT_PAYLOAD.content);

    // select Yes
    alertComponent.find(Button).last().props().onClick();
    alertComponent.update();
    expect(ALERT_PAYLOAD.onSuccess.mock.calls).toHaveLength(1);
    expect(store.getState().app.alert.open).toBeFalsy();
  });
});
