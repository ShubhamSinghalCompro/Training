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
  IconButton,
  Fab
} from '@mui/material';
import { format } from 'date-fns';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { categoryColors } from '../utils/categoryColors';

const EventModal = ({ open, onClose, selectedEvent, selectedDay, setSelectedEvent, selectedCategory}) => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events);

  // State variables for the event modal
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Meeting');
  const [color, setColor] = useState(categoryColors[category]);
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('00:00');
  const [mode, setMode] = useState('view'); // State to manage modal mode ('view', 'add', 'edit')

  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title);
      setCategory(selectedEvent.category);
      setColor(categoryColors[selectedEvent.category]);
      setStartTime(selectedEvent.startTime || '00:00');
      setEndTime(selectedEvent.endTime || '00:00');
      setMode('edit'); // Set mode to 'edit' when an event is selected
    } else {
      resetForm();
      setMode('view'); // Default mode
    }
  }, [selectedEvent, open]);

  const resetForm = () => {
    setTitle('');
    setCategory('Meeting');
    setColor(categoryColors['Meeting']);
    setStartTime('00:00');
    setEndTime('00:00');
  };

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
    setMode('view'); // Reset mode after closing
  };

  const handleDelete = (id) => {
    dispatch(deleteEvent(id));
    onClose();
    setMode('view'); // Reset mode after closing
  };

  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    setCategory(newCategory);
    setColor(categoryColors[newCategory]);
  };

  const handleAddClick = () => {
    resetForm();
    setMode('add'); // Set mode to 'add' when the "Add Event" button is clicked
    setSelectedEvent(null);
  };

  return (
    <>
      {/* Floating Action Button to open modal in add mode */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={() => { setMode('add'); }}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>

      {/* Modal for adding or editing events */}
      <Modal open={open} onClose={() => { onClose(); setSelectedEvent(null); setMode('view'); }}>
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
            onClick={() => { onClose(); setSelectedEvent(null); setMode('view'); }}
          >
            <CloseIcon />
          </IconButton>

          {/* Title */}
          {mode !== 'view' && (<Typography variant="h6">
            {mode === 'add' ? 'Add Event' : 'Edit Event'}
          </Typography>)}
          {mode !== 'view' && (<Box sx={{ backgroundColor: color, height: 8, borderRadius: 1, mb: 2 }} />)}

          {/* Form for adding/editing event */}
          {mode !== 'view' && (
            <>
              {/* Title Field */}
              <TextField
                label="Title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                fullWidth
                sx={{ mt: 2, mb: 2 }}
              />
              {/* Start Time Field */}
              <TextField
                label="Start Time"
                type="time"
                fullWidth
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
              />
              {/* End Time Field */}
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
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                endIcon={selectedEvent ? <SaveIcon /> : <AddIcon />}
              >
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
            </>
          )}

          {/* Display existing events for the selected day */}
          {mode === 'view' && (
            <>
              <Typography variant="h6" sx={{ mt: 2 }}>Existing Events</Typography>
              <Grid container spacing={1}>
                {events
                  .filter(event => format(new Date(event.date), 'yyyy-MM-dd') === format(new Date(selectedDay), 'yyyy-MM-dd')).filter(event => selectedCategory === 'All' || event.category === selectedCategory)
                  .map(event => (
                    <Grid item xs={12} key={event.id}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, border: '1px solid #ddd', borderRadius: 1 }}>
                        <Typography>{event.title}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: 16, height: 16, backgroundColor: event.color, borderRadius: '50%', mr: 1 }} />
                          <Button size='small' variant="contained" color="primary" onClick={() => { setSelectedEvent(event); setMode('edit'); }} endIcon={<EditIcon />}>
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
              {/* Add Event Button */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddClick}
                startIcon={<AddIcon />}
                sx={{ mt: 2 }}
                fullWidth
              >
                Add Event
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default EventModal;
