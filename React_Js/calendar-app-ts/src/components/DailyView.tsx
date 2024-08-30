import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Grid, IconButton, Tooltip } from '@mui/material';
import { format, addHours, startOfDay } from 'date-fns';
import { Event, RootState } from '../utils/types';
import AddIcon from '@mui/icons-material/Add';

interface DailyViewProps {
  selectedDate: Date;
  openModal: (event: Event | null, day: Date | null) => void;
  selectedCategory: string;
}

const DailyView: React.FC<DailyViewProps> = ({
  selectedDate,
  openModal,
  selectedCategory,
}) => {
  const events = useSelector((state: RootState) => state.events);

  // Generate an array of 1-hour intervals from 00:00 to 23:00
  const intervals = Array.from({ length: 24 }, (_, index) => {
    const time = startOfDay(selectedDate);
    return addHours(time, index);
  });

  // Filter events for the selected day and category
  const dayEvents = events.filter(
    (event) =>
      new Date(event.date).toDateString() === selectedDate.toDateString() &&
      (selectedCategory === 'All' || event.category === selectedCategory)
  );

  // Function to determine if an event overlaps with a given interval
  const doesEventOverlap = (event: Event, interval: Date) => {
    const eventStart = event.startTime;
    const eventEnd = event.endTime;
    const intervalFormatted = format(interval, 'HH:mm');
    const nextIntervalFormatted = format(addHours(interval, 1), 'HH:mm');
    return eventStart < nextIntervalFormatted && eventEnd > intervalFormatted;
  };

  return (
    <Box>
      <Typography variant="h5">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</Typography>
      <Grid container spacing={0}>
        {intervals.map((interval) => {
          const eventsInInterval = dayEvents.filter((event) =>
            doesEventOverlap(event, interval)
          );
          const intervalKey = format(interval, 'HH:mm');
          const displayMore = eventsInInterval.length > 2;

          return (
            <Grid item xs={12} key={intervalKey}>
              {/* Time Slot */}
              <Box
                sx={{
                  padding: 1,
                  borderBottom: '1px solid #ddd',
                  position: 'relative',
                  minHeight: 60, // Adjust height as needed
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: eventsInInterval.length > 0 ? '#f5f5f5' : '#fff',
                  overflow: 'visible', // Ensure content is visible
                }}
              >
                <Typography>{format(interval, 'HH:mm')}</Typography>

                {/* Display events with dots and tooltips */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {eventsInInterval.slice(0, 2).map((event) => (
                    <Tooltip
                      title={`${event.title} (${event.startTime} - ${event.endTime})`}
                      key={event.id}
                    >
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          backgroundColor: event.color,
                          cursor: 'pointer',
                        }}
                        onClick={() => openModal(event, new Date(event.date))}
                      />
                    </Tooltip>
                  ))}
                  {displayMore && (
                    <Typography
                      variant="body2"
                      sx={{ cursor: 'pointer', color: 'blue', marginLeft: 1 }}
                      onClick={() => openModal(null, selectedDate)}
                    >
                      View More
                    </Typography>
                  )}
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
      <IconButton
        color="primary"
        onClick={() => openModal(null, selectedDate)}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <AddIcon />
      </IconButton>
    </Box>
  );
};

export default DailyView;
