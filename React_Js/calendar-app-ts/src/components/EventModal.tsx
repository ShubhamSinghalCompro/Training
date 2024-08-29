import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  Fab,
  SelectChangeEvent,
} from '@mui/material';
import { format } from 'date-fns';
import { addEvent, updateEvent, deleteEvent } from '../store/eventsSlice';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { categoryColors } from '../utils/categoryColors';
import { Event, Category } from '../utils/types';

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  selectedEvent: Event | null;
  selectedDay: Date | null;
  setSelectedEvent: (event: Event | null) => void;
  selectedCategory: string; // Assuming you have this prop for filtering events by category
}

// Define the RootState interface for TypeScript
interface RootState {
  events: Event[];
}

const EventModal: React.FC<EventModalProps> = ({
  open,
  onClose,
  selectedEvent,
  selectedDay,
  setSelectedEvent,
  selectedCategory,
}) => {
  const dispatch = useDispatch();
  const events = useSelector((state: RootState) => state.events);

  // State variables for the event modal
  const [title, setTitle] = useState<string>('');
  const [category, setCategory] = useState<Category>('General');
  const [color, setColor] = useState<string>(categoryColors.General);
  const [startTime, setStartTime] = useState<string>('00:00');
  const [endTime, setEndTime] = useState<string>('00:00');
  const [mode, setMode] = useState<'view' | 'add' | 'edit' | 'viewEvent'>('view'); // State to manage modal mode


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

    if(mode === 'viewEvent') {
      setMode('edit'); 
    }
    else{
    if (selectedEvent) {
      dispatch(updateEvent(event));
    } else {
      dispatch(addEvent(event));
    }
    onClose();
    setMode('view'); // Reset mode after closing
  }
  };

  const handleDelete = (id: number) => {
    dispatch(deleteEvent(id));
    onClose();
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
    <>
      {/* Floating Action Button to open modal in add mode */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleAddClick}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>

      {/* Modal for adding or editing events */}
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

          {/* Title */}
          {mode !== 'view' && (
            <>
            <Typography variant="h6">
              {mode === 'add' ? 'Add Event' : (mode === 'edit' ? 'Edit Event' : 'Event')}
            </Typography>
            <Box
              sx={{ backgroundColor: color, height: 8, borderRadius: 1, mb: 2 }}
            />
         

          {/* Form for adding/editing event */}
            
              {/* Title Field */}
              <TextField
                label="Title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                fullWidth
                sx={{ mt: 2, mb: 2 }}
                disabled={mode === 'viewEvent'}
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
                disabled={mode === 'viewEvent'}
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
                disabled={mode === 'viewEvent'}
              />
              {/* Category Selection */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  onChange={handleCategoryChange}
                  label="Category"
                  disabled={mode === 'viewEvent'}
                >
            {Object.keys(categoryColors).filter(cat => cat !== 'All').map(cat => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Save and Delete Buttons */}
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                endIcon={mode === 'viewEvent'? <EditIcon /> : selectedEvent ? <SaveIcon /> : <AddIcon />}
              >
                {mode === 'viewEvent' ? 'Edit Event' : (selectedEvent ? 'Update Event' : 'Add Event')}
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
              <Typography variant="h6" sx={{ mt: 2 }}>
                Existing Events
              </Typography>
              <Grid container spacing={1}>
                {events
                  .filter(event => {
                    if (!selectedDay) return false; // If selectedDay is null, skip filtering
                    return format(new Date(event.date), 'yyyy-MM-dd') === format(new Date(selectedDay), 'yyyy-MM-dd');})
                  .filter(
                    (event) =>
                      selectedCategory === 'All' ||
                      event.category === selectedCategory
                  )
                  .map((event) => (
                    <Grid item xs={12} key={event.id}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          p: 1,
                          border: '1px solid #ddd',
                          borderRadius: 1,
                          cursor: 'pointer',
                          
                        }}
                        onClick={() => { setSelectedEvent(event); setMode('viewEvent'); }}
                      >
                        <Typography>{event.title}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              backgroundColor: event.color,
                              borderRadius: '50%',
                              mr: 1,
                            }}
                          />
                         <IconButton

                          size='small'
                          color='primary'
                          onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(event); 
                          setMode('edit'); }}>
                            <EditIcon />
                          </IconButton>
                          <IconButton
                          size='small'
                          color='error'
                          onClick={(e) => {
                            e.stopPropagation(); 
                            handleDelete(event.id)}}>
                            <DeleteIcon />
                          </IconButton>
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
