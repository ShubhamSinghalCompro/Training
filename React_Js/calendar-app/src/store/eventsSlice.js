import {createSlice} from '@reduxjs/toolkit';

// Functions to load and save events
const loadEventsFromLocalStorage = () => {
  const savedEvents = localStorage.getItem('events');
  if (savedEvents) {
    return JSON.parse(savedEvents);
  } else {
    return [];
  }
}

const saveEventsToLocalStorage = (events) => {
  localStorage.setItem('events', JSON.stringify(events));
}

const initialState = loadEventsFromLocalStorage();

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducer: {
    addEvent(state, action) {
      state.push(action.payload);
      saveEventsToLocalStorage(state);
    },
    updateEvent(state, action) {
      const index = state.findIndex((event => event.id === action.payload.id));
      if(index === -1) return;
      // Update the event at the specified index by merging the existing event
      // with the updated event from the action payload. This is done using the
      // spread operator to create a new object with the updated properties.
      state[index] = {...state[index], ...action.payload};

      saveEventsToLocalStorage(state);

    },
    deleteEvent(state, action) {
      const index = state.findIndex((event => event.id === action.payload));
      if(index === -1) return;
      const newState = state.slice(0, index).concat(state.slice(index + 1)); // can be done using filter as well
      saveEventsToLocalStorage(newState);
      return newState;
    },
  },
});

export const {addEvent, updateEvent, deleteEvent} = eventSlice.actions;
export default eventSlice.reducer;