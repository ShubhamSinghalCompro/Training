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
import { categoryColors } from '../utils/categoryColors';
import { Event, Category, RootState, modalMode } from '../utils/types';
import EventDetails from './EventDetails';
import ExistingEventsList from './ExistingEventsList'; // Import your new component
import {scheduleNotification} from '../utils/requestNotificationPermission';

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  selectedEvent: Event | null;
  selectedDay: Date | null;
  setSelectedEvent: (event: Event | null) => void;
  selectedCategory: string;
  mode: modalMode;
  setMode: (mode: modalMode) => void;
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
}) => {
  const dispatch = useDispatch();
  const events = useSelector((state: RootState) => state.events);

  // State variables for the event modal
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<Category>('General');
  const [color, setColor] = useState<string>(categoryColors.General);
  const [startTime, setStartTime] = useState<string>('00:00');
  const [endTime, setEndTime] = useState<string>('00:00');

  const resetForm = () => {
    setTitle('');
    setCategory('General');
    setColor(categoryColors['General']);
    setStartTime('00:00');
    setEndTime('00:00');
  };

  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title);
      setCategory(selectedEvent.category);
      setColor(categoryColors[selectedEvent.category]);
      setStartTime(selectedEvent.startTime || '00:00');
      setEndTime(selectedEvent.endTime || '00:00');
    } else {
      resetForm();
      setMode('view');
    }
  }, [selectedEvent, open]);

  const handleSave = () => {
    const event: Event = {
      id: selectedEvent ? selectedEvent.id : Date.now(),
      title,
      category,
      color: categoryColors[category],
      date: selectedDay?.toISOString() || '',
      startTime,
      endTime,
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
    const newCategory: Category = event.target.value as Category;
    setCategory(newCategory);
    setColor(categoryColors[newCategory]);
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
    >
      <Box
        sx={{
          maxWidth: 400,
          margin: 'auto',
          mt: 8,
          padding: 2,
          backgroundColor: '#fff',
          borderRadius: 2,
          position: 'relative',
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
            title={title}
            category={category}
            color={color}
            startTime={startTime}
            endTime={endTime}
            setTitle={setTitle}
            setStartTime={setStartTime}
            setEndTime={setEndTime}
            handleSave={handleSave}
            handleDelete={handleDelete}
            handleCategoryChange={handleCategoryChange}
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
