import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from './eventsSlice';
import snackbarReducer from './snackbarSlice';

// Define the type for the store's state
export type RootState = ReturnType<typeof store.getState>;

// Define the type for dispatch
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
  reducer: {
    events: eventsReducer,
    snackbar: snackbarReducer,
  },
});

export default store;
