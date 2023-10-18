import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GlobalState {
  pageLoading: boolean;
}

const initialState: GlobalState = {
  pageLoading: false
};

export const globalSlice = createSlice({
  name: 'global',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setPageLoading: (state, action: PayloadAction<boolean>) => {
      console.log('====globalSlice/setPageLoading', action.payload);
      state.pageLoading = action.payload;
    }
  }
});

export const { setPageLoading } = globalSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectPost = (state: RootState) => state.loadResult ;

export default globalSlice.reducer;
