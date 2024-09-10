import React from 'react';
import { Box, Grid2, Typography, IconButton, Button } from '@mui/material';
import { format } from 'date-fns';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Event } from '../utils/types'; // Adjust the path as needed for your project structure

interface ExistingEventsListProps {
  events: Event[];
  selectedDay: Date | null;
  selectedCategory: string;
  setSelectedEvent: (event: Event) => void;
  setMode: (mode: 'add' | 'edit' | 'view' | 'viewEvent') => void;
  handleDelete: (id: number) => void;
  handleAddClick: () => void;
}

const ExistingEventsList: React.FC<ExistingEventsListProps> = ({
  events,
  selectedDay,
  selectedCategory,
  setSelectedEvent,
  setMode,
  handleDelete,
  handleAddClick,
}) => {

   const dailyEvents = (
    events: Event[],
    selectedDay: Date | null,
  ): Event[] => {
    return events
      .filter(event => {
        if (!selectedDay) return false; // If selectedDay is null, skip filtering
        return format(new Date(event.date), 'yyyy-MM-dd') === format(new Date(selectedDay), 'yyyy-MM-dd');
      })
  }

  const categoryEvents : Event[] = dailyEvents(events, selectedDay).filter(event => selectedCategory === 'All' || event.category === selectedCategory);


  return (
    <>
     <Typography variant="h6" sx={{ mt: 2 }}>
            Existing Events
          </Typography>
      <Grid2 spacing={1}>
        {categoryEvents
          .map(event => (
            <Grid2 spacing={{xs: 12} } key={event.id}>
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
                onClick={() => {
                  setSelectedEvent(event);
                  setMode('viewEvent');
                }}
              >
              <Box
                sx={{ display: 'flex', alignItems: 'center' }}>
                 <Box
                    sx={{
                      width: 16,
                      height: 16,
                      backgroundColor: event.color,
                      borderRadius: '50%',
                      mr: 1,
                    }}
                  />
                <Typography>{event.title}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                 
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedEvent(event);
                      setMode('edit');
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={e => {
                      e.stopPropagation();
                      handleDelete(event.id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </Grid2>
          ))}
      </Grid2>
      {/* Add Event Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddClick}
        endIcon={<AddIcon />}
        sx={{ mt: 5 }}
        fullWidth
      >
        Add Event
      </Button>
    </>
  );
};

export default ExistingEventsList;
