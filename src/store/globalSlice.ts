import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MenuItem } from '../App';

interface GlobalState {
  pageLoading: boolean;
  menu: Array<MenuItem>;
}

const initialState: GlobalState = {
  pageLoading: false,
  menu: []
};

export const globalSlice = createSlice({
  name: 'global',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setPageLoading: (state, action: PayloadAction<boolean>) => {
      console.log('====globalSlice/setPageLoading', action.payload);
      state.pageLoading = action.payload;
    },
    setMenu: (state, action: PayloadAction<Array<MenuItem>>) => {
      console.log('====globalSlice/setMenu', action.payload);
      state.menu = action.payload;
    }
  }
});

export const { setPageLoading, setMenu } = globalSlice.actions;

// Other code such as selectors can use the imported `RootState` type
// export const selectPost = (state: RootState) => state.loadResult ;

export default globalSlice.reducer;
