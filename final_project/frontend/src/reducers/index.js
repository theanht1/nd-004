import { combineReducers } from 'redux';
import auth from './auth';
import app from './app';
import categories from './categories';

export default combineReducers({
  app,
  auth,
  categories,
});