import { combineReducers } from 'redux';
import auth from './auth';
import app from './app';

export default combineReducers({
  app,
  auth,
});