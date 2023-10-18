import { combineReducers } from 'redux';
import globalReducer from './globalSlice';
import postsReducer from './postSlice';

const rootReducer = combineReducers({
  global: globalReducer,
  posts: postsReducer
});

export default rootReducer;
