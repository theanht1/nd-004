/* eslint-disable prefer-promise-reject-errors */
import axios from 'axios';
import store from '../store';
import { performRequest } from './index';

jest.mock('axios');

describe('performRequest', () => {
  let onData;
  let postUpdate;
  let onError;

  beforeEach(() => {
    onData = jest.fn();
    postUpdate = jest.fn();
    onError = jest.fn();
    store.dispatch = jest.fn();
  });

  test('should resolve successful request', async () => {
    axios.get.mockImplementation(() => Promise.resolve({}));
    await performRequest({
      requestPromise: axios.get('/'),
      onData,
      postUpdate,
      onError,
    });

    expect(onData.mock.calls).toHaveLength(1);
    expect(postUpdate.mock.calls).toHaveLength(1);
    expect(onError.mock.calls).toHaveLength(0);
  });

  test('should log in case reject without dispatch', async () => {
    axios.get.mockImplementation(() => Promise.reject('UNRECOGNIZED_CASE'));
    await performRequest({
      requestPromise: axios.get('/'),
      onData,
    });

    expect(onData.mock.calls).toHaveLength(0);
    expect(onError.mock.calls).toHaveLength(0);
    expect(store.dispatch.mock.calls).toHaveLength(0);

    axios.get.mockImplementation(() => Promise.reject({
      response: 'UNRECOGNIZED_CASE',
    }));
    await performRequest({
      requestPromise: axios.get('/'),
      onData,
      postUpdate,
    });
    expect(onData.mock.calls).toHaveLength(0);
    expect(postUpdate.mock.calls).toHaveLength(1);
  });

  test('should reject error request with onError', async () => {
    axios.get.mockImplementation(() => Promise.reject({
      response: { data: { error: 'RANDOM_ERROR' } },
    }));
    await performRequest({
      requestPromise: axios.get('/'),
      dispatch: store.dispatch,
      onData,
      postUpdate,
      onError,
    });

    expect(onData.mock.calls).toHaveLength(0);
    expect(postUpdate.mock.calls).toHaveLength(1);
    expect(onError.mock.calls).toHaveLength(1);
    expect(store.dispatch.mock.calls).toHaveLength(0);
  });

  test('should reject error request without onError', async () => {
    axios.get.mockImplementation(() => Promise.reject({
      response: { data: { error: 'RANDOM_ERROR' } },
    }));
    // Without onError
    await performRequest({
      requestPromise: axios.get('/'),
      dispatch: store.dispatch,
      onData,
      postUpdate,
    });

    expect(onData.mock.calls).toHaveLength(0);
    expect(postUpdate.mock.calls).toHaveLength(1);
    expect(onError.mock.calls).toHaveLength(0);
    expect(store.dispatch.mock.calls).toHaveLength(1);
  });

  test('should reject error request with multiple errors response', async () => {
    axios.get.mockImplementation(() => Promise.reject({
      response: { data: { error: { err: 'RANDOM_ERROR' } } },
    }));
    // Without onError
    await performRequest({
      requestPromise: axios.get('/'),
      dispatch: store.dispatch,
      onData,
      postUpdate,
    });

    expect(onData.mock.calls).toHaveLength(0);
    expect(postUpdate.mock.calls).toHaveLength(1);
    expect(onError.mock.calls).toHaveLength(0);
    expect(store.dispatch.mock.calls).toHaveLength(1);
  });

  test('should reject error request with 404 error', async () => {
    axios.get.mockImplementation(() => Promise.reject({
      response: {
        data: { error: 'RANDOM_ERROR' },
        status: 404,
      },
    }));
    // Without onError
    await performRequest({
      requestPromise: axios.get('/'),
      dispatch: store.dispatch,
      onData,
      postUpdate,
    });

    expect(onData.mock.calls).toHaveLength(0);
    expect(postUpdate.mock.calls).toHaveLength(1);
    expect(onError.mock.calls).toHaveLength(0);
    expect(store.dispatch.mock.calls).toHaveLength(2);
  });
});
