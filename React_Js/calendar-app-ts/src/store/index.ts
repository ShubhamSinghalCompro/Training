import { configureStore } from '@reduxjs/toolkit';
import eventsReducer from './eventsSlice';

// Define the type for the store's state
export type RootState = ReturnType<typeof store.getState>;

// Define the type for dispatch
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
  reducer: {
    events: eventsReducer,
  },
});

export default store;
