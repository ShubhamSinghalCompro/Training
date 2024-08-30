import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Grid, IconButton, Tooltip } from '@mui/material';
import { format, addDays, startOfWeek, addHours, startOfDay, eachDayOfInterval } from 'date-fns';
import { Event } from '../utils/types';
import AddIcon from '@mui/icons-material/Add';
import { RootState } from '../utils/types';

interface WeeklyViewProps {
  selectedDate: Date;
  openModal: (event: Event | null, day: Date | null) => void;
  selectedCategory: string;
}

const WeeklyView: React.FC<WeeklyViewProps> = ({
  selectedDate,
  openModal,
  selectedCategory,
}) => {
  const events = useSelector((state: RootState) => state.events);
  
  // Generate start and end dates of the week
  const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const end = addDays(start, 6);
  const days = eachDayOfInterval({ start, end });

  // Generate an array of 1-hour intervals from 00:00 to 23:00
  const intervals = Array.from({ length: 24 }, (_, index) => {
    const time = startOfDay(new Date());
    return addHours(time, index);
  });

  return (
    <Box>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        {`Week of ${format(start, 'MMMM d, yyyy')} - ${format(end, 'MMMM d, yyyy')}`}
      </Typography>
      <Grid container>
        {/* Header row for weekdays and time slots */}
        <Grid item xs={12}>
          <Grid container spacing={2} sx={{ marginBottom: 2 }}>
            {/* Empty box for the top-left corner */}
            <Grid item xs={2}></Grid>
            {/* Days of the week headers */}
            {days.map((day) => (
              <Grid item xs key={day.toDateString()}>
                <Box
                  sx={{
                    padding: 1,
                    borderBottom: '1px solid #ddd',
                    backgroundColor: '#f5f5f5',
                    textAlign: 'center',
                    fontWeight: 'bold',
                  }}
                >
                  <Typography variant="body2">{format(day, 'EEE')}</Typography>
                  <Typography variant="body2">{format(day, 'MMM d')}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Main grid for time slots and events */}
        <Grid item xs={12}>
          <Grid container>
            {/* Time slots column */}
            <Grid item xs={2} sx={{ borderRight: '1px solid #ddd', paddingRight: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {intervals.map((interval) => (
                  <Box
                    key={format(interval, 'HH:mm')}
                    sx={{
                      padding: 1,
                      borderBottom: '1px solid #ddd',
                      backgroundColor: '#fff',
                      minHeight: 60,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body2">{format(interval, 'HH:mm')}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>

            {/* Days of the week and intervals */}
            <Grid item xs={10}>
              <Grid container>
                {/* Render day events under the time slots */}
                {intervals.map((interval) => {
                  const intervalKey = format(interval, 'HH:mm');

                  return (
                    <Grid item xs={12} container key={intervalKey} spacing={2}>
                      {days.map((day) => {
                        const dayStr = day.toDateString();
                        const dayEvents = events.filter(
                          (event) =>
                            new Date(event.date).toDateString() === dayStr &&
                            (selectedCategory === 'All' || event.category === selectedCategory)
                        );
                        const eventsInInterval = dayEvents.filter((event) =>
                          doesEventOverlap(event, interval)
                        );
                        const displayMore = eventsInInterval.length > 2;

                        return (
                          <Grid item xs key={dayStr}>
                            <Box
                              sx={{
                                padding: 1,
                                borderBottom: '1px solid #ddd',
                                minHeight: 60,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: eventsInInterval.length > 0 ? '#f5f5f5' : '#fff',
                              }}
                            >
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
                                    sx={{ cursor: 'pointer', color: 'blue' }}
                                    onClick={() => openModal(null, day)}
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
                  );
                })}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
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

// Helper function to determine if an event overlaps with a given interval
const doesEventOverlap = (event: Event, interval: Date) => {
  const eventStart = event.startTime;
  const eventEnd = event.endTime;
  const intervalFormatted = format(interval, 'HH:mm');
  const nextIntervalFormatted = format(addHours(interval, 1), 'HH:mm');
  return eventStart < nextIntervalFormatted && eventEnd > intervalFormatted;
};

export default WeeklyView;
