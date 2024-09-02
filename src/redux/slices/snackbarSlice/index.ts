import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {SnackBarState} from './types';

const initialState: SnackBarState = {
  visible: false,
  message: '',
};

export const snackBarSlice = createSlice({
  name: 'snackBar',
  initialState,
  reducers: {
    setSnackBarVisibility: (state, action: PayloadAction<boolean>) => {
      state.visible = action.payload;
    },
    toggleSnackBarVisibility: state => {
      state.visible = !state.visible;
    },
    setSnackMessage: (state, action: PayloadAction<string>) => {
      state.visible = true;
      state.message = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setSnackBarVisibility,
  toggleSnackBarVisibility,
  setSnackMessage,
} = snackBarSlice.actions;
export default snackBarSlice.reducer;
