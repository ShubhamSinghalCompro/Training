import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Box, Button, Typography, TextField, Grid, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { format } from 'date-fns'; // Import format function
import { addEvent, updateEvent, deleteEvent } from '../store/eventsSlice';
import { categoryColors } from '../utils/categoryColors';
import EditIcon from '@mui/icons-material/Edit'; 
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';


const EventModal = ({ open, onClose, selectedEvent, selectedDay, setSelectedEvent }) => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Meeting'); // Default category
  const [color, setColor] = useState(categoryColors.Meeting); // Default color

  // Reset state when modal is opened or when selectedEvent changes
  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title);
      setCategory(selectedEvent.category);
      setColor(categoryColors[selectedEvent.category]);
    } else {
      setTitle('');
      setCategory('Meeting');
      setColor(categoryColors.Meeting);
    }
  }, [selectedEvent, open]);

  const handleSave = () => {
    const event = { 
      id: selectedEvent ? selectedEvent.id : Date.now(),
      title,
      category,
      color: categoryColors[category],
      date: selectedDay 
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
    <Modal open={open} onClose={() => { onClose(); setSelectedEvent(null); }}>
      <Box sx={{ maxWidth: 400, margin: 'auto', padding: 2, backgroundColor: '#fff', borderRadius: 2, mt: 8 }}>
        <Typography variant="h6">{selectedEvent ? 'Edit Event' : 'Add Event'}</Typography>
        <Box sx={{ backgroundColor: color, height: 8, borderRadius: 1, mb: 2 }} /> {/* Color bar */}
        <TextField
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mt: 2, mb: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Category</InputLabel> {/* Add InputLabel */}
          <Select
            value={category}
            onChange={handleCategoryChange}
            label="Category" 
          >
            {Object.keys(categoryColors).map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleSave} endIcon={selectedEvent ? <SaveIcon /> : <AddIcon />}>
          {selectedEvent ? 'Update' : 'Add Event'}
        </Button>
        {selectedEvent && (
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDelete(selectedEvent.id)}
            sx={{ ml: 2 }}
            endIcon={<DeleteIcon />}
          >
            Delete
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
                    {/* Show color bar for each event */}
                    <Box sx={{ width: 16, height: 16, backgroundColor: event.color, borderRadius: '50%', mr: 1 }} />
                    <Button 
                      size='small' 
                      variant="contained" 
                      color="primary" 
                      onClick={() => setSelectedEvent(event)}
                      endIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                    <Button
                      size='small'
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(event.id)}
                      sx={{ ml: 2 }}
                      endIcon={<DeleteIcon />}
                    >
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
