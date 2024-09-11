// EventModal.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Modal,
  Box,
  IconButton,
  SelectChangeEvent,
} from '@mui/material';

import { clearScheduledNotification } from '../utils/requestNotificationPermission';
import { addEvent, updateEvent, deleteEvent } from '../store/eventsSlice';
import { showSnackbar } from '../store/snackbarSlice';
import CloseIcon from '@mui/icons-material/Close';
import { Event, RootState, modalMode, EventObject} from '../utils/types';
import EventDetails from './EventDetails';
import ExistingEventsList from './ExistingEventsList'; // Import your new component
import {scheduleNotification} from '../utils/requestNotificationPermission';
import { format, addMinutes } from 'date-fns';
import { ViewHeadline } from '@mui/icons-material';

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  selectedEvent: Event | null;
  selectedDay: Date | null;
  setSelectedEvent: (event: Event | null) => void;
  selectedCategory: string;
  mode: modalMode;
  setMode: (mode: modalMode) => void;
  categoryColors: Record<string, string>;
  setCategoryColors: (colors: Record<string, string>) => void;
}

const EventModal: React.FC<EventModalProps> = ({
  open,
  onClose,
  selectedEvent,
  selectedDay,
  setSelectedEvent,
  selectedCategory,
  mode,
  setMode,
  categoryColors,
  setCategoryColors,

}) => {

  const getCurrentTimeInterval = (intervalMinutes: number) => {
    const now = new Date();
    const minutes = now.getMinutes();
    
    // Round down to the nearest interval (e.g., 15 minutes)
    const roundedMinutes = Math.ceil(minutes / intervalMinutes) * intervalMinutes;
    const roundedStartTime = new Date(now.setMinutes(roundedMinutes));
  
    // Calculate the end time by adding the interval duration
    const roundedEndTime = addMinutes(roundedStartTime, intervalMinutes);
  
    return {
      startTime: format(roundedStartTime, 'HH:mm'),
      endTime: format(roundedEndTime, 'HH:mm'),
    };
  };


  const dispatch = useDispatch();
  const events = useSelector((state: RootState) => state.events);

  const { startTime, endTime } = getCurrentTimeInterval(30);

  // State variables for the event modal
  const [eventState, setEventState] = useState<EventObject>({
    title: '',
    category: 'General',
    color: categoryColors['General'],
    startTime: startTime,
    endTime: endTime,
  });

  const resetForm = () => {
    const { startTime, endTime } = getCurrentTimeInterval(30);
    setEventState({
      title: '',
      category: 'General',
      color: categoryColors['General'],
      startTime: startTime,
      endTime: endTime,
    });
  };

  

  useEffect(() => {
    if (selectedEvent) {
      setEventState({
        title: selectedEvent.title,
        category: selectedEvent.category,
        color: selectedEvent.color,
        startTime: selectedEvent.startTime,
        endTime: selectedEvent.endTime,
      });
    } else {
      resetForm();
    }
  }, [selectedEvent, open]);

  const handleSaveOrEdit = () => {
    
    const event: Event = {
      id: selectedEvent ? selectedEvent.id : Date.now(),
      title: eventState.title,
      category: eventState.category,
      color: eventState.color,
      date: selectedDay?.toISOString() || '',
      startTime: eventState.startTime,
      endTime: eventState.endTime,
    };

    if (mode === 'viewEvent') {
      setMode('edit');
    } else {
      if (selectedEvent) {
        dispatch(updateEvent(event));
        dispatch(showSnackbar({ message: 'Event updated successfully!', color: 'success' }));
        clearScheduledNotification(selectedEvent.id);
      } else {
        dispatch(addEvent(event));
        dispatch(showSnackbar({ message: 'Event added successfully!', color: 'success' })); // Show success snackbar when a new event is added
      }
      onClose();
      setMode('view'); // Reset mode after closing
    }
    // Schedule notification for the event
    scheduleNotification(event);
  };

  const handleDelete = (id: number) => {
    dispatch(deleteEvent(id));
    dispatch(showSnackbar({ message: 'Event deleted successfully!', color: 'error' })); // Show error snackbar when an event is deleted
    clearScheduledNotification(id);
    setMode('view'); // Reset mode after closing
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    const newCategory: string = event.target.value;
    setEventState({ ...eventState, category: newCategory, color: categoryColors[newCategory] });
};

  const handleAddClick = () => {
    resetForm();
    setMode('add'); // Set mode to 'add' when the "Add Event" button is clicked
    setSelectedEvent(null);
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        setSelectedEvent(null);
        setMode('view');
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"

    >
      <Box
        sx={{
          maxWidth: 400,
          minWidth: Math.min(400, window.innerWidth * 0.7),
          padding: 2,
          backgroundColor: '#fff',
          borderRadius: 2,
          position: 'absolute',
          top: '50%',
          left: '50%',
            transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Close Button */}
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
          }}
          onClick={() => {
            onClose();
            setSelectedEvent(null);
            setMode('view');
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Event Details or Existing Events List */}
        {mode !== 'view' ? (
          <EventDetails
            mode={mode}
            selectedEvent={selectedEvent}
            eventState={eventState}
            setEventState={setEventState}
            handleSaveOrEdit={handleSaveOrEdit}
            handleDelete={handleDelete}
            handleCategoryChange={handleCategoryChange}
            categoryColors={categoryColors}
            setCategoryColors={setCategoryColors}
          />
        ) : (
          <ExistingEventsList
            events={events}
            selectedDay={selectedDay}
            selectedCategory={selectedCategory}
            setSelectedEvent={setSelectedEvent}
            setMode={setMode}
            handleDelete={handleDelete}
            handleAddClick={handleAddClick}
          />
        )}
      </Box>
    </Modal>
  );
};

export default EventModal;
