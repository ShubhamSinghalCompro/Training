import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, TextField, Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { Event, modalMode, EventObject } from '../utils/types';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import {styled} from 'styled-components'; 

interface FormErrors {
  title: string;
  time: string;
  category: string;
  color: string;
}

interface EventDetailsProps {
  mode: modalMode;
  selectedEvent: Event | null;
  eventState: EventObject;
  setEventState: (event: EventObject) => void;
  handleSaveOrEdit: () => void;
  handleDelete: (id: number) => void;
  handleCategoryChange: (event: SelectChangeEvent<string>) => void;
  categoryColors: Record<string, string>;
  setCategoryColors: (colors: Record<string, string>) => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ mode, selectedEvent, eventState, setEventState, handleSaveOrEdit, handleDelete, handleCategoryChange, categoryColors, setCategoryColors }) => {
  const [formErrors, setFormErrors] = useState<FormErrors>({
    title: '',
    time: '',
    category: '',
    color: '',
  });

  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  
  // Refs for the input fields
  const titleRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<HTMLDivElement>(null);
  const endTimeRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const colorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setFormErrors({
      title: '',
      time: '',
      category: '',
      color: '',
    });
  }, [mode]);

  useEffect(() => {
    // Focus the first error field if there are errors
    if (Object.values(formErrors).some(error => error !== '')) {
      if (formErrors.title) {
        titleRef.current?.focus();
      } else if (formErrors.time) {
        startTimeRef.current?.focus();
      } else if (formErrors.category) {
        categoryRef.current?.focus();
      } else if (formErrors.color) {
        colorRef.current?.focus();
      }
    }
  }, [formErrors]);

  const handleAddCategory = () => {
    const { category, color } = eventState;
    const updatedCategories = { ...categoryColors, [category]: color };
    setCategoryColors(updatedCategories);
    localStorage.setItem('categoryColors', JSON.stringify(updatedCategories));
    setShowNewCategoryInput(false);
  };

  const validateForm = (): boolean => {
    let errors: FormErrors = { title: '', time: '', category: '', color: '' };
    let isValid = true;

    if (eventState.title.trim() === '') {
      errors.title = 'Title is required';
      isValid = false;
    }

    if (eventState.endTime <= eventState.startTime) {
      errors.time = 'End time should be greater than start time';
      isValid = false;
    }

    // Validate the category if the user is adding a new category
    if (showNewCategoryInput) {
      if (eventState.category.trim() === '') {
        errors.category = 'New category name is required';
        isValid = false;
      } else if (categoryColors[eventState.category.trim()] !== undefined) {
        errors.category = 'Category already exists';
        isValid = false;
      }

      if (eventState.color.trim() === '') {
        errors.color = 'Category color is required';
        isValid = false;
      } else if (Object.values(categoryColors).includes(eventState.color.trim())) {
        errors.color = 'This color is already assigned to another category';
        isValid = false;
      }
    }

    // Validate the selected category if not adding a new one
    if (!showNewCategoryInput && eventState.category.trim() === '') {
      errors.category = 'Category is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };
  

  return (
    <>
      <ColorBar eventState={eventState} categoryColors={categoryColors} showNewCategoryInput={showNewCategoryInput} />
      
      <TextField
        label="Title"
        value={eventState.title}
        onChange={(event) => setEventState({ ...eventState, title: event.target.value })}
        fullWidth
        sx={{ mt: 2, mb: 2 }}
        disabled={mode === 'viewEvent'}
        error={!!formErrors.title}
        helperText={formErrors.title}
        inputRef={titleRef} // Set the ref here
        aria-invalid={!!formErrors.title} // Indicate if the field is invalid
        aria-describedby="title-error" // Reference the error message
      />
      <TextField
        label="Start Time"
        type="time"
        fullWidth
        value={eventState.startTime}
        onChange={(e) => setEventState({ ...eventState, startTime: e.target.value })}
        sx={{ mb: 2 }}
        InputLabelProps={{ shrink: true }}
        disabled={mode === 'viewEvent'}
        error={!!formErrors.time}
        helperText={formErrors.time}
        inputRef={startTimeRef} // Set the ref here
        aria-invalid={!!formErrors.time} // Indicate if the field is invalid
        aria-describedby="start-time-error" // Reference the error message
      />
      <TextField
        label="End Time"
        type="time"
        fullWidth
        value={eventState.endTime}
        onChange={(e) => setEventState({ ...eventState, endTime: e.target.value })}
        sx={{ mb: 2 }}
        InputLabelProps={{ shrink: true }}
        disabled={mode === 'viewEvent'}
        error={!!formErrors.time}
        helperText={formErrors.time}
        inputRef={endTimeRef} // Set the ref here
        aria-invalid={!!formErrors.time} // Indicate if the field is invalid
        aria-describedby="end-time-error" // Reference the error message
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={showNewCategoryInput ? 'add-new' : eventState.category}
          onChange={(e) => {
            const selectedCategory = e.target.value;
            if (selectedCategory === 'add-new') {
              setShowNewCategoryInput(true);
            } else {
              setShowNewCategoryInput(false);
              handleCategoryChange(e);
            }
          }}
          label="Category"
          disabled={mode === 'viewEvent'}
          inputRef={categoryRef} // Set the ref here
          aria-invalid={!!formErrors.category} // Indicate if the field is invalid
          aria-describedby="category-error" // Reference the error message
        >
          {Object.keys(categoryColors).filter(cat => cat !== 'All').map(cat => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
          <MenuItem value="add-new">
            Add New Category
          </MenuItem>
        </Select>
      </FormControl>

      {showNewCategoryInput && (
        <Box marginBottom={2}>
          <TextField
            label="New Category"
            value={eventState.category}
            onChange={(e) => setEventState({ ...eventState, category: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
            error={!!formErrors.category}
            helperText={formErrors.category}
            inputRef={categoryRef} // Set the ref here
            aria-invalid={!!formErrors.category} // Indicate if the field is invalid
            aria-describedby="new-category-error" // Reference the error message
          />
          <TextField
            type="color"
            label="Choose Category Color"
            value={eventState.color}
            onChange={(e) => setEventState({ ...eventState, color: e.target.value })}
            fullWidth
            error={!!formErrors.color}
            helperText={formErrors.color}
            inputRef={colorRef} // Set the ref here
            aria-invalid={!!formErrors.color} // Indicate if the field is invalid
            aria-describedby="color-error" // Reference the error message
          />
        </Box>
      )}
      <Button
        variant="contained"
        color="primary"
        aria-label={mode === 'viewEvent' ? `Edit ${selectedEvent?.title} Event` : (selectedEvent ? `Update ${selectedEvent.title} Event` : 'Add Event')}
        onClick={() => {
          if (showNewCategoryInput) {
            if (validateForm()) {
              handleAddCategory();
              handleSaveOrEdit();
            }
          }
          else if (validateForm()) {
            handleSaveOrEdit();
          }
        }}
        endIcon={mode === 'viewEvent' ? <EditIcon /> : selectedEvent ? <SaveIcon /> : <AddIcon />}
        sx={mode !== 'add' ? {} : { display: 'flex', justifyContent: 'center', mx: 'auto' }}
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
          aria-label={`Delete ${selectedEvent.title} Event`}
        >
          Delete Event
        </Button>
      )}

    </>
  );
};


interface ColorBarInterface  {
  eventState: EventObject
  categoryColors: Record<string, string>
  showNewCategoryInput: boolean
}

const ColorBar = styled(Box)<ColorBarInterface>`
  background-color: ${(props) => props.showNewCategoryInput ? props.eventState.color : props.categoryColors[props.eventState.category] };
  height: 12px;
  border-radius: 8px; 
  margin-bottom: 4px;
  margin-top: 8px;
`

export default EventDetails;
