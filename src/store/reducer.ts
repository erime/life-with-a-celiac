import { combineReducers } from 'redux';
import postsReducer from './postSlice';

const rootReducer = combineReducers({
  posts: postsReducer
});

export default rootReducer;
