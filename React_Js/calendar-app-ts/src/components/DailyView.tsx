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

  // Helper function to convert 'HH:mm' string to total minutes since midnight
  const convertTimeStringToMinutes = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Function to determine how many intervals an event spans
  const getIntervalsOccupiedByEvent = (event: Event, intervals: Date[]) => {
    const eventStart = convertTimeStringToMinutes(event.startTime);
    const eventEnd = convertTimeStringToMinutes(event.endTime);

    // Count how many intervals are covered by the event
    return intervals.filter(interval => {
      const intervalStart = convertTimeStringToMinutes(format(interval, 'HH:mm'));
      const nextIntervalStart = convertTimeStringToMinutes(format(addHours(interval, 1), 'HH:mm'));

      return eventStart < nextIntervalStart && eventEnd > intervalStart;
    }).length;
  };

  // Sort events based on the number of intervals they occupy
  const sortedDayEvents = [...dayEvents].sort((a, b) => {
    const intervalsOccupiedA = getIntervalsOccupiedByEvent(a, intervals);
    const intervalsOccupiedB = getIntervalsOccupiedByEvent(b, intervals);
    return intervalsOccupiedB - intervalsOccupiedA; // Sort in descending order
  });

  // Function to determine if an event overlaps with a given interval
  const doesEventOverlapWithInterval = (event: Event, interval: Date) => {
    const eventStart = convertTimeStringToMinutes(event.startTime);
    const eventEnd = convertTimeStringToMinutes(event.endTime);
    const intervalStart = convertTimeStringToMinutes(format(interval, 'HH:mm'));
    const nextIntervalStart = convertTimeStringToMinutes(format(addHours(interval, 1), 'HH:mm'));

    // Check if event starts before the end of this interval and ends after the start of this interval
    return eventStart < nextIntervalStart && eventEnd > intervalStart;
  };

  // Calculate the position and height for an event in a given interval
  const calculateEventPositionInInterval = (event: Event, interval: Date) => {
    const eventStart = convertTimeStringToMinutes(event.startTime);
    const eventEnd = convertTimeStringToMinutes(event.endTime);
    const intervalStart = convertTimeStringToMinutes(format(interval, 'HH:mm'));
    const nextIntervalStart = convertTimeStringToMinutes(format(addHours(interval, 1), 'HH:mm'));

    // Determine the visible start and end within this interval
    const visibleStart = Math.max(eventStart, intervalStart);
    const visibleEnd = Math.min(eventEnd, nextIntervalStart);

    // Calculate top position and height in pixels (1 minute = 2 pixels)
    const pixelsPerMinute = 1;
    const topPosition = (visibleStart - intervalStart) * pixelsPerMinute;
    const eventHeight = (visibleEnd - visibleStart) * pixelsPerMinute;
    debugger

    return { topPosition, eventHeight };
  };

  return (
    <Box>
      <Typography variant="h5">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</Typography>
      <Grid container spacing={0}>
        {intervals.map((interval) => {
          const eventsInInterval = sortedDayEvents.filter((event) =>
            doesEventOverlapWithInterval(event, interval)
          );
          const intervalKey = format(interval, 'HH:mm');
          const displayMore = eventsInInterval.length > 2;

          return (
            <Grid item xs={12} key={intervalKey}>
              {/* Time Slot */}
              <Box
                sx={{
                  padding: '0 16px',
                  borderBottom: '1px solid #ddd',
                  position: 'relative',
                  minHeight: 60, // Constant height for each time slot
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: '#f9f9f9',
                }}
              >
                {/* Time Label */}
                <Typography sx={{ position: 'absolute', left: 8, top: 8 }}>{format(interval, 'HH:mm')}</Typography>

                {/* Container for all events in this interval */}
                <Box
                  sx={{
                    marginLeft: '60px', // Margin to position events away from the time label
                    position: 'relative',
                    height: '100%', // Fill the parent container
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}
                >
                  {eventsInInterval.slice(0, 2).map((event) => {
                    const { topPosition, eventHeight } = calculateEventPositionInInterval(event, interval);

                    return (
                      <Tooltip
                        title={`${event.title} (${event.startTime} - ${event.endTime})`}
                        key={event.id}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: `${topPosition}px`,
                            left: `${eventsInInterval.indexOf(event) * 220}px`, // Adjust this value for spacing between events
                            width: '200px', // Reduced width of the event box
                            height: `${eventHeight}px`,
                            backgroundColor: event.color,
                            cursor: 'pointer',
                            borderRadius: '4px',
                            overflow: 'hidden', // Ensure no content overflows the box
                          }}
                          onClick={() => openModal(event, new Date(event.date))}
                        />
                      </Tooltip>
                    );
                  })}
                  {displayMore && (
                    <Typography
                      variant="body2"
                      sx={{ cursor: 'pointer', color: 'blue', marginLeft: 'auto', zIndex: 1 }}
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
