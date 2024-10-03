import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Modal,
  Box,
  IconButton,
  SelectChangeEvent,
  Typography,
} from '@mui/material';

import { clearScheduledNotification } from '../utils/requestNotificationPermission';
import { addEvent, updateEvent, deleteEvent } from '../store/eventsSlice';
import { showSnackbar } from '../store/snackbarSlice';
import CloseIcon from '@mui/icons-material/Close';
import { Event, RootState, modalMode, EventObject} from '../utils/types';
import EventDetails from './EventDetails';
import ExistingEventsList from './ExistingEventsList'; 
import { scheduleNotification } from '../utils/requestNotificationPermission';
import { format, addMinutes } from 'date-fns';
import { styled } from '@mui/material/styles';

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
  intervalStartTime: string | null;
  setIntervalStartTime: (startTime: string | null) => void;
  intervalEndTime: string | null;
  setIntervalEndTime: (endTime: string | null) => void;
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
  intervalStartTime,
  setIntervalStartTime,
  intervalEndTime,
  setIntervalEndTime,

}) => {

  const getCurrentTimeInterval = useCallback((intervalMinutes: number) => {
    if (!intervalStartTime || !intervalEndTime) {
      const now = new Date();
      const minutes = now.getMinutes();
      
      const roundedMinutes = Math.ceil(minutes / intervalMinutes) * intervalMinutes;
      const roundedStartTime = new Date(now.setMinutes(roundedMinutes));
      const roundedEndTime = addMinutes(roundedStartTime, intervalMinutes);
  
      return {
        startTime: format(roundedStartTime, 'HH:mm'),
        endTime: format(roundedEndTime, 'HH:mm'),
      };
    } else {
      return {
        startTime: intervalStartTime,
        endTime: intervalEndTime,
      }
    }
  }, [intervalStartTime, intervalEndTime]);

  const dispatch = useDispatch();
  const events = useSelector((state: RootState) => state.events);
  const { startTime, endTime } = getCurrentTimeInterval(30);

  const [eventState, setEventState] = useState<EventObject>({
    title: '',
    category: 'General',
    color: categoryColors['General'],
    startTime: startTime,
    endTime: endTime,
  });

  const resetForm = useCallback(() => {
    const { startTime, endTime } = getCurrentTimeInterval(30);
    setEventState({
      title: '',
      category: 'General',
      color: categoryColors['General'],
      startTime: startTime,
      endTime: endTime,
    });
  }, [getCurrentTimeInterval, categoryColors]);

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
  }, [selectedEvent, open, resetForm]);

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
        dispatch(showSnackbar({ message: 'Event added successfully!', color: 'success' }));
      }
      scheduleNotification(event);
      onClose();
      setMode('view'); 
    }
  };

  const handleDelete = (id: number) => {
    dispatch(deleteEvent(id));
    dispatch(showSnackbar({ message: 'Event deleted successfully!', color: 'error' }));
    clearScheduledNotification(id);
    setMode('view');
  };

  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    const newCategory: string = event.target.value;
    setEventState({ ...eventState, category: newCategory, color: categoryColors[newCategory] });
  };

  const handleAddClick = () => {
    resetForm();
    setMode('add');
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
      aria-labelledby="event-modal-title"
      aria-describedby="event-modal-description"
      aria-modal="true"
      role="dialog"
    >
      <ModalBox>
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
          aria-label="Close modal"
        >
          <CloseIcon />
        </IconButton>

        {mode !== 'view' && (
          <Typography id="event-modal-title" variant="h6">
          {mode === 'add' ? 'Add Event' : (mode === 'edit' ? 'Edit Event' : 'Event')}
        </Typography>)}
        {mode === 'view' && (
          <Typography id="event-modal-title" variant="h6" sx={{ mb: 2 }}>
          Existing Events
        </Typography>
        )
        } 

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
      </ModalBox>
    </Modal>
  );
};

const ModalBox = styled(Box)(({ theme }) => ({
  maxWidth: 400,
  minWidth: Math.min(400, window.innerWidth * 0.7),
  padding: 16,
  backgroundColor: '#fff',
  borderRadius: 8,
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  outline: 0, // To remove the default focus outline from browsers
}));

export default EventModal;
