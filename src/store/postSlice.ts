import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILoadResult } from '../App';

interface PostState {
  loadedResult: ILoadResult | undefined;
}

const initialState: PostState = {
  loadedResult: undefined
};

export const postSlice = createSlice({
  name: 'posts',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    loadResult: (state, action: PayloadAction<ILoadResult>) => {
      console.log('====postSlice/loadResult', action.payload);
      state.loadedResult = action.payload;
    }
  }
});

export const { loadResult } = postSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectPost = (state: RootState) => state.loadResult ;

export default postSlice.reducer;
