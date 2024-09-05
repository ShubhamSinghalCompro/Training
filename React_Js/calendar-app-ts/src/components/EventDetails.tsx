import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, TextField, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { categoryColors } from '../utils/categoryColors';
import { Event, Category, modalMode, EventObject } from '../utils/types';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

interface FormErrors {
  title: string;
  time: string;
}

interface EventDetailsProps {
    mode: modalMode;
    selectedEvent: Event | null;
    eventState: EventObject;
    setEventState: (event: EventObject) => void;
    handleSaveOrEdit: () => void;
    handleDelete: (id: number) => void;
    handleCategoryChange: (event: SelectChangeEvent<string>) => void;

  }

const EventDetails: React.FC<EventDetailsProps> = ({mode, selectedEvent, eventState, setEventState, handleSaveOrEdit, handleDelete, handleCategoryChange}) => {
  const [formErrors, setFormErrors] = useState<FormErrors>({
    title: '',
    time: '',
  });

  useEffect(() => {
    setFormErrors({
      title:'',
      time: '',
    });
  }, [mode]);

  const validateForm = (): boolean => {
    let errors: FormErrors = { title: '', time: '' };
    let isValid = true;
  
    // Check if the title is empty
    if (eventState.title.trim() === '') {
      errors.title = 'Title is required';
      isValid = false;
    }
  
    // Check if end time is greater than start time
    if (eventState.endTime <= eventState.startTime) {
      errors.time = 'End time should be greater than start time';
      isValid = false;
    }
  
    // Update the form errors state
    setFormErrors(errors);
  
    // Return the validation status
    return isValid;
  };
    return (
        <>
            <Typography variant="h6">
              {mode === 'add' ? 'Add Event' : (mode === 'edit' ? 'Edit Event' : 'Event')}
            </Typography>
            <Box
              sx={{ backgroundColor: eventState.color, height: 8, borderRadius: 1, mb: 2 }}
            />
         

          {/* Form for adding/editing event */}
            
              {/* Title Field */}
              <TextField
                label="Title"
                value={eventState.title}
                onChange={(event) => setEventState({ ...eventState, title: event.target.value })}
                fullWidth
                sx={{ mt: 2, mb: 2 }}
                disabled={mode === 'viewEvent'}
                error={formErrors.title !== ''}
                helperText={formErrors.title}
              />
              {/* Start Time Field */}
              <TextField
                label="Start Time"
                type="time"
                fullWidth
                value={eventState.startTime}
                onChange={(e) => {setEventState({ ...eventState, startTime: e.target.value })}}
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
                disabled={mode === 'viewEvent'}
                error= {formErrors.time !== ''}
                helperText={formErrors.time}
              />
              {/* End Time Field */}
              <TextField
                label="End Time"
                type="time"
                fullWidth
                value={eventState.endTime}
                onChange={(e) => {
                  setEventState({ ...eventState, endTime: e.target.value });
                }}
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
                disabled={mode === 'viewEvent'}
                error= {formErrors.time !== ''}
                helperText={formErrors.time}
              />
              {/* Category Selection */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={eventState.category}
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
                onClick= {() => {
                  if(validateForm()) {
                    handleSaveOrEdit();
                  }
                }}
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
    );
};

export default EventDetails;