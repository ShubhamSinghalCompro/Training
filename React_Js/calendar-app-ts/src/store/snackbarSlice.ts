// snackbarSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SnackbarState {
  open: boolean;
  message: string;
  color?: 'success' | 'error' | 'warning' | 'info';
}

const initialState: SnackbarState = {
  open: false,
  message: '',
  color: 'info', // Default color
};

const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    showSnackbar: (
      state,
      action: PayloadAction<{ message: string; color?: 'success' | 'error' | 'warning' | 'info' }>
    ) => {
      state.open = true;
      state.message = action.payload.message;
      state.color = action.payload.color || 'info'; // Default to 'info' if no color is provided
    },
    hideSnackbar: (state) => {
      state.open = false;
      state.message = '';
    },
  },
});

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;
