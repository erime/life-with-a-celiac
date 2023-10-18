import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoadResult, Post } from '../App';

interface PostState {
  loadedResult: LoadResult | undefined;
  activePost: Post | undefined;
  posts: Array<Post>;
}

const initialState: PostState = {
  loadedResult: undefined,
  activePost: undefined,
  posts: []
};

export const postSlice = createSlice({
  name: 'posts',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    loadResult: (state, action: PayloadAction<LoadResult>) => {
      console.log('====postSlice/loadResult', action.payload);
      state.loadedResult = action.payload;
    },
    setActivePost: (state, action: PayloadAction<Post>) => {
      console.log('====postSlice/setActivePost', action.payload);
      state.activePost = action.payload;
    },
    setPosts: (state, action: PayloadAction<Array<Post>>) => {
      console.log('====postSlice/setPosts', action.payload);
      state.posts = action.payload;
    }
  }
});

export const { loadResult, setActivePost, setPosts } = postSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectPost = (state: RootState) => state.loadResult ;

export default postSlice.reducer;
