import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Grid, IconButton, Tooltip } from '@mui/material';
import { format, addHours, startOfDay, isValid } from 'date-fns';
import { Event } from '../utils/types';
import AddIcon from '@mui/icons-material/Add';
import { RootState } from '../utils/types';

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
  const [showMore, setShowMore] = useState<{ [key: string]: boolean }>({});

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
          const displayMore = eventsInInterval.length > 2 && !showMore[intervalKey];

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
                }}
              >
                <Typography>{format(interval, 'HH:mm')}</Typography>

                {/* Display events with dots and tooltips */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {eventsInInterval.slice(0, displayMore ? 2 : eventsInInterval.length).map((event) => (
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
                      sx={{ cursor: 'pointer', color: 'blue' }}
                      onClick={() => setShowMore({ ...showMore, [intervalKey]: true })}
                    >
                      View More
                    </Typography>
                  )}
                </Box>

                {/* Show all events when "View More" is clicked */}
                {showMore[intervalKey] && (
                  <Box sx={{ marginTop: 1 }}>
                    {eventsInInterval.map((event) => (
                      <Box
                        key={event.id}
                        sx={{
                          padding: 1,
                          backgroundColor: event.color,
                          borderRadius: 1,
                          cursor: 'pointer',
                          marginBottom: 1,
                        }}
                        onClick={() => openModal(event, new Date(event.date))}
                      >
                        <Typography>{event.title}</Typography>
                        <Typography variant="body2">
                          {`${event.startTime} - ${event.endTime}`}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
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
