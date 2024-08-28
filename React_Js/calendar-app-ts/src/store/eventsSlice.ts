import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the event type
interface Event {
  id: number;
  title: string;
  category: string;
  color: string;
  date: string;
  startTime: string;
  endTime: string;
}

// Function to load events from local storage
const loadEventsFromLocalStorage = (): Event[] => {
  try {
    const serializedEvents = localStorage.getItem('events');
    if (serializedEvents === null) {
      return []; // No events found in local storage
    }
    return JSON.parse(serializedEvents) as Event[];
  } catch (e) {
    console.error('Could not load events', e);
    return [];
  }
};

// Function to save events to local storage
const saveEventsToLocalStorage = (events: Event[]) => {
  try {
    const serializedEvents = JSON.stringify(events);
    localStorage.setItem('events', serializedEvents);
  } catch (e) {
    console.error('Could not save events', e);
  }
};

// Initial state for the events loaded from local storage
const initialState: Event[] = loadEventsFromLocalStorage();

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<Event>) => {
      state.push(action.payload);
      saveEventsToLocalStorage(state);  // Save state to local storage
    },
    updateEvent: (state, action: PayloadAction<Event>) => {
      const index = state.findIndex(event => event.id === action.payload.id);
      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload };
        saveEventsToLocalStorage(state);  // Save state to local storage
      }
    },
    deleteEvent: (state, action: PayloadAction<number>) => {
      const newState = state.filter(event => event.id !== action.payload);
      saveEventsToLocalStorage(newState);  // Save state to local storage
      return newState;
    },
  },
});

// Export actions for use in the component
export const { addEvent, updateEvent, deleteEvent } = eventsSlice.actions;

// Export the reducer to configure the store
export default eventsSlice.reducer;
