import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Grid, Tooltip, IconButton, Theme } from '@mui/material';
import { format, addHours, startOfDay, addDays, startOfWeek,  } from 'date-fns';
import { Event, RootState, modalMode } from '../utils/types';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

interface WeeklyViewProps {
  selectedDate: Date;
  openModal: (event: Event | null, day: Date | null, mode?: modalMode) => void;
  selectedCategory: string;
  theme:Theme;
}

const WeeklyView: React.FC<WeeklyViewProps> = ({
  selectedDate,
  openModal,
  selectedCategory,
  theme
}) => {
  const events = useSelector((state: RootState) => state.events);

  // Calculate the Monday of the week for the selected date
  const startOfWeekDate = startOfWeek(selectedDate, { weekStartsOn: 1 });

  // Generate an array of 1-hour intervals from 00:00 to 23:00
  const intervals = Array.from({ length: 24 }, (_, index) => {
    const time = startOfDay(selectedDate);
    return addHours(time, index);
  });

  // Generate days of the week starting from Monday
  const weekDays = Array.from({ length: 7 }, (_, index) => addDays(startOfWeekDate, index));

  // Filter events by selected category and the week
  const weeklyEvents = events.filter(
    (event) =>
      (selectedCategory === 'All' || event.category === selectedCategory) &&
      weekDays.some((day) => new Date(event.date).toDateString() === day.toDateString())
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

  return (
    <Box>
      {/* Display Week Days at the Top */}
      <Grid container spacing={0}>
        <Grid item xs={1}>
          <Typography sx={{ padding: '8px', fontWeight: 'bold' }}>Time</Typography>
        </Grid>
        {weekDays.map((day) => (
          <Grid item xs key={day.toDateString()}>
            <Typography sx={{ padding: '8px', fontWeight: 'bold', textAlign: 'center' }}>
              {format(day, 'EEE, MMM d')}
            </Typography>
          </Grid>
        ))}
      </Grid>
  
      {/* Display Time Intervals and Events */}
      <Grid container spacing={0}>
        {intervals.map((interval, rowIndex) => (
          <Grid container spacing={0} key={interval.toString()}>
            {/* Time Column */}
            <Grid item xs={1}>
              <Typography sx={{ padding: '8px', textAlign: 'right' }}>{format(interval, 'HH:mm')}</Typography>
            </Grid>
            {/* Days Columns */}
            {weekDays.map((day, colIndex) => {
              const eventsInInterval = weeklyEvents.filter(
                (event) =>
                  new Date(event.date).toDateString() === day.toDateString() &&
                  doesEventOverlapWithInterval(event, interval)
              );
              const sortedDayEvents = [...eventsInInterval].sort((a, b) => {
                const intervalsOccupiedA = getIntervalsOccupiedByEvent(a, intervals);
                const intervalsOccupiedB = getIntervalsOccupiedByEvent(b, intervals);
                return intervalsOccupiedB - intervalsOccupiedA; // Sort in descending order
              });
              const displayMore = eventsInInterval.length > 1;
  
              return (
                <Grid item xs key={`${day.toDateString()}-${interval.toString()}`}>
                  <Box
                    sx={{
                      borderBottom: '1px solid #ddd',
                      borderRight: colIndex < weekDays.length - 1 ? '1px solid #ddd' : 'none', // Add this for vertical lines
                      position: 'relative',
                      minHeight: 60, // Fixed height for each time slot
                      display: 'flex',
                      justifyContent: 'flex-start', // Align items at the start
                      alignItems: 'flex-start', // Align items at the top
                      backgroundColor: '#f9f9f9',
                      boxSizing: 'border-box', // Ensure the box sizing includes padding and borders
                      paddingLeft: '5px', // Optional padding for spacing
                      '&:hover': {
                        backgroundColor: theme.palette.action.selected, // Hover color from theme
                        cursor:'pointer'
                      },
                    }}
                    onClick={() => openModal(null, day)}
                  >
                    {sortedDayEvents.slice(0, 1).map((event) => {
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
                              width: '50%', // Adjust width for better spacing
                              height: `${eventHeight}px`,
                              backgroundColor: event.color,
                              cursor: 'pointer',
                              borderRadius: '4px',
                              overflow: 'hidden', // Prevent content overflow
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal(event, new Date(event.date), 'viewEvent')}}
                          />
                        </Tooltip>
                      );
                    })}
                    {displayMore && (
                      <IconButton
                      sx={{ marginLeft: 'auto', zIndex: 1 }}
                      onClick={() => openModal(null, day)}
                    >
                      <MoreHorizIcon color="primary" />
                    </IconButton>
                    )}
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
  
};

// Helper function to check if an event overlaps with a given interval
const doesEventOverlapWithInterval = (event: Event, interval: Date) => {
  const eventStart = convertTimeStringToMinutes(event.startTime);
  const eventEnd = convertTimeStringToMinutes(event.endTime);
  const intervalStart = convertTimeStringToMinutes(format(interval, 'HH:mm'));
  const nextIntervalStart = convertTimeStringToMinutes(format(addHours(interval, 1), 'HH:mm'));

  return eventStart < nextIntervalStart && eventEnd > intervalStart;
};

// Helper function to convert time strings to minutes
const convertTimeStringToMinutes = (timeString: string) => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

// Helper function to calculate event position and height
const calculateEventPositionInInterval = (event: Event, interval: Date) => {
  const eventStart = convertTimeStringToMinutes(event.startTime);
  const eventEnd = convertTimeStringToMinutes(event.endTime);
  const intervalStart = convertTimeStringToMinutes(format(interval, 'HH:mm'));
  const nextIntervalStart = convertTimeStringToMinutes(format(addHours(interval, 1), 'HH:mm'));

  const visibleStart = Math.max(eventStart, intervalStart);
  const visibleEnd = Math.min(eventEnd, nextIntervalStart);

  const pixelsPerMinute = 1; // Adjust this to control the height
  const topPosition = (visibleStart - intervalStart) * pixelsPerMinute;
  const eventHeight = (visibleEnd - visibleStart) * pixelsPerMinute;

  return { topPosition, eventHeight };
};

export default WeeklyView;
