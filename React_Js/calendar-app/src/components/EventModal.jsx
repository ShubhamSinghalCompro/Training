import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addEvent, updateEvent, deleteEvent } from '../store/eventsSlice';
import {
  Modal,
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton
} from '@mui/material';
import { format } from 'date-fns';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { categoryColors } from '../utils/categoryColors';

const EventModal = ({ open, onClose, selectedEvent, selectedDay, setSelectedEvent }) => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events);

  //State variables for the event modal
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Meeting');
  const [color, setColor] = useState(categoryColors[category]);
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('00:00');

  useEffect(() => {
    if(selectedEvent) {
      setTitle(selectedEvent.title);
      setCategory(selectedEvent.category);
      setColor(categoryColors[selectedEvent.category]);
      setStartTime(selectedEvent.startTime || '00:00'); // Use existing or default to 12:00 am
      setEndTime(selectedEvent.endTime || '00:00'); // Use existing or default to 12:00 am
    } else {
      setTitle('');
      setCategory('Meeting');
      setColor(categoryColors['Meeting']);
      setStartTime('00:00'); // Reset to 12:00 am when adding a new event
      setEndTime('00:00'); // Reset to 12:00 am when adding a new event
    }
  }, [selectedEvent, open]);

  const handleSave = () => {
    const event = {
      id: selectedEvent ? selectedEvent.id : Date.now(),
      title,
      category,
      color: categoryColors[category],
      date: selectedDay,
      startTime,
      endTime
    };

    if (selectedEvent) {
      dispatch(updateEvent(event));
    } else {
      dispatch(addEvent(event));
    }
    onClose();
  };

  const handleDelete = (id) => {
    dispatch(deleteEvent(id));
    onClose();
  };

  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    setCategory(newCategory);
    setColor(categoryColors[newCategory]);
  };

  return (
    <Modal open={open} onClose={() => {onClose(); setSelectedEvent(null);}}>
      <Box sx={{
        maxWidth: 400,
        margin: 'auto',
        mt: 8,
        padding: 2,
        backgroundColor: '#fff',
        borderRadius: 2,
        position: 'relative'
      }}>
          {/* Close Button */}
          <IconButton
            sx={{
              position: 'absolute',
              top: 8,
              right: 8
            }}
            onClick={() => { onClose(); setSelectedEvent(null); }}
          >
            <CloseIcon />
          </IconButton>

          {/* Title */}

          <Typography variant="h6">
            {selectedEvent ? 'Edit Event' : 'Add Event'}
          </Typography>
          <Box sx={{ backgroundColor: color, height: 8, borderRadius: 1, mb: 2 }} />

          {/* Form */}
          <TextField
            label="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            fullWidth
            sx={{ mt: 2, mb: 2 }}
          />
          {/* Start Time */}
        <TextField
          label="Start Time"
          type="time"
          fullWidth
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
        />
        {/* End Time */}
        <TextField
          label="End Time"
          type="time"
          fullWidth
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          sx={{ mb: 2 }}
          InputLabelProps={{ shrink: true }}
        />
        {/* Category Selection */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={handleCategoryChange}
            label="Category"
          >
            {Object.keys(categoryColors).map(cat => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
         {/* Save and Delete Buttons */}
         <Button variant="contained" color="primary" onClick={handleSave} endIcon={selectedEvent ? <SaveIcon /> : <AddIcon />}>
          {selectedEvent ? 'Update Event' : 'Add Event'}
        </Button>
        {selectedEvent && (
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDelete(selectedEvent.id)}
            sx={{ ml: 2 }}
            endIcon={<DeleteIcon />}
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
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ width: 16, height: 16, backgroundColor: event.color, borderRadius: '50%', mr: 1 }} />
                  <Button size='small' variant="contained" color="primary" onClick={() => setSelectedEvent(event)} endIcon={<EditIcon />}>
                    Edit
                  </Button>
                  <Button size='small' variant="contained" color="error" onClick={() => handleDelete(event.id)} sx={{ ml: 2 }} endIcon={<DeleteIcon />}>
                    Delete
                  </Button>
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
