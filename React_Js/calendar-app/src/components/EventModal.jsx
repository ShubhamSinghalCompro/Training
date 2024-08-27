import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Box, Button, Typography, TextField, Grid, IconButton } from '@mui/material';
import { format } from 'date-fns';  // Import format function
import { addEvent, updateEvent, deleteEvent } from '../store/eventsSlice';

const EventModal = ({ open, onClose, selectedEvent, selectedDay, setSelectedEvent }) => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events);

  const [title, setTitle] = useState('');
  const [color, setColor] = useState('#000000');

  // Reset state when modal is opened or when selectedEvent changes
  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title);
      setColor(selectedEvent.color);
    } else {
      setTitle('');
      setColor('#000000');
    }
  }, [selectedEvent, open]);

  const handleSave = () => {
    if (selectedEvent) {
      dispatch(updateEvent({ ...selectedEvent, title, color }));
    } else {
      dispatch(addEvent({ id: Date.now(), title, color, date: selectedDay }));
    }
    onClose();
  };

  const handleDelete = (id) => {
    dispatch(deleteEvent(id));
    onClose();
  };

  return (
    <Modal open={open} onClose={() => { onClose(); setSelectedEvent(null); }}>
      <Box sx={{ maxWidth: 400, margin: 'auto', padding: 2, backgroundColor: '#fff', borderRadius: 2, mt: 8 }}>
        <Typography variant="h6">{selectedEvent ? 'Edit Event' : 'Add Event'}</Typography>
        <TextField
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mt: 2, mb: 2 }}
        />
        <TextField
          label="Color"
          type="color"
          fullWidth
          value={color}
          onChange={(e) => setColor(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" onClick={handleSave}>
          {selectedEvent ? 'Update Event' : 'Add Event'}
        </Button>
        {selectedEvent && (
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleDelete(selectedEvent.id)}
            sx={{ ml: 2 }}
          >
            Delete Event
          </Button>
        )}
        {/* Display existing events for the selected day */}
        <Typography variant="h6" sx={{ mt: 2 }}>Existing Events</Typography>
        <Grid container spacing={1}>
          {events
            .filter(event => format(new Date(event.date), 'yyyy-MM-dd') === format(new Date(selectedDay), 'yyyy-MM-dd'))
            .map(event => (
              <Grid item xs={12} key={event.id}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, border: '1px solid #ddd', borderRadius: 1 }}>
                  <Typography>{event.title}</Typography>
                  <Box>
                    <IconButton onClick={() => setSelectedEvent(event)} color="primary">
                      Edit
                    </IconButton>
                    <IconButton onClick={() => handleDelete(event.id)} color="error">
                      Delete
                    </IconButton>
                  </Box>
                </Box>
              </Grid>
            ))}
        </Grid>
      </Box>
    </Modal>
  );
};

export default EventModal;
