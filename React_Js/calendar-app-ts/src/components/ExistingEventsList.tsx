import React from 'react';
import { Box, Grid2, Typography, IconButton, Button } from '@mui/material';
import { format } from 'date-fns';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Event } from '../utils/types'; // Adjust the path as needed for your project structure
import styled from '@emotion/styled';

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
  const dailyEvents = (events: Event[], selectedDay: Date | null): Event[] => {
    return events.filter(event => {
      if (!selectedDay) return false; // If selectedDay is null, skip filtering
      return format(new Date(event.date), 'yyyy-MM-dd') === format(new Date(selectedDay), 'yyyy-MM-dd');
    });
  };

  const categoryEvents : Event[] = dailyEvents(events, selectedDay).filter(event => selectedCategory === 'All' || event.category === selectedCategory);


  return (
    <>
      <Grid2 spacing={1} aria-label="Event list for selected day and category">
        {categoryEvents.map(event => (
          <Grid2  spacing={{ xs: 12 }} key={event.id}>
            <ExistingEventsListContainer
              onClick={() => {
                setSelectedEvent(event);
                setMode('viewEvent');
              }}
              aria-label={`View details for ${event.title} event`}
              role="button"
              tabIndex={0}
            >
              <Box display="flex" alignItems="center">
                <ColorDot color={event.color} aria-hidden="true" />
                <Typography>{event.title}</Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <IconButton
                  size="small"
                  color="primary"
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedEvent(event);
                    setMode('edit');
                  }}
                  aria-label={`Edit ${event.title} event`}
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
                  aria-label={`Delete ${event.title} event`}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </ExistingEventsListContainer>
          </Grid2>
        ))}
      </Grid2>
      {/* Accessible Add Event Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddClick}
        endIcon={<AddIcon />}
        sx={{ display: 'flex', justifyContent: 'center', mx: 'auto', mt: 2 }}
        aria-label="Add new event"
      >
        Add Event
      </Button>
    </>
  );
};

interface ColorDotProps {
  color: string;
}

const ColorDot = styled(Box)<ColorDotProps>(({ color }) => ({
  width: 16,
  height: 16,
  backgroundColor: color,
  borderRadius: '50%',
  marginRight: 8,
  marginLeft: 8
}));

const ExistingEventsListContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 8,
  border: '1px solid #ddd',
  borderRadius: 8,
  cursor: 'pointer',
  marginBottom: 8,
  '&:focus': {
    outline: '2px solid #1976d2', // Adds a visible focus state
  }
}));

export default ExistingEventsList;
