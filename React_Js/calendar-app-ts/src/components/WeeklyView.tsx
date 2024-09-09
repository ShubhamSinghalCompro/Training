import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Grid, Tooltip, IconButton, Theme } from '@mui/material';
import { format, addHours, startOfDay, addDays, startOfWeek,  } from 'date-fns';
import { Event, RootState, modalMode } from '../utils/types';
import {calculateEventPositionInInterval, doesEventOverlapWithInterval, sortEventsByIntervals} from '../utils/calendarViewFuncs';
import AddIcon from '@mui/icons-material/Add';

interface WeeklyViewProps {
  selectedDate: Date;
  openModal: (event: Event | null, day: Date | null, mode: modalMode) => void;
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
  const categoryEvents = events.filter((event) =>
    (selectedCategory === 'All' || event.category === selectedCategory));
    
  const weeklyEvents = categoryEvents.filter(
    (event) =>
      weekDays.some((day) => new Date(event.date).toDateString() === day.toDateString())
  );

  const getEventsInInterval = (
    weeklyEvents: Event[],
    day: Date,
    interval: Date,
  ): Event[]  => {
    return weeklyEvents
      .filter(event => new Date(event.date).toDateString() === day.toDateString())
      .filter(event => doesEventOverlapWithInterval(event, interval)); // Adjust sort function as needed
  }

  return (
    <Box>
      {/* Display Week Days at the Top */}
      <Grid container spacing={0}>
        <Grid item xs={1}>

          <Typography sx={{ padding: '12px', fontWeight: 'bold' }}>Time</Typography>
        </Grid>
        {weekDays.map((day) => (
          <Grid item xs key={day.toDateString()}>
            <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center' }}>
            <Typography sx={{ padding: '8px', textAlign: 'center' }}>
              {format(day, 'EEE, MMM d')}
            </Typography>
            <IconButton
              color="primary"
              sx={{
                ml: 1, 
                width: '20px',
                height: '20px',
                '&:hover': { backgroundColor: theme.palette.grey[300],
                  
                }
              }}
              onClick={() => openModal(null, day)}
              aria-label="Add event"
              tabIndex={0}
              >
                <AddIcon />
              </IconButton>
              </Box>
          </Grid>
        ))}
      </Grid>
  
      {/* Display Time Intervals and Events */}
      <Grid container spacing={0}>
        {intervals.map((interval) => (
          <Grid container spacing={0} key={interval.toString()}>
            {/* Time Column */}
            <Grid item xs={1}>
              <Typography sx={{ padding: '8px', textAlign: 'right' }}>{format(interval, 'HH:mm')}</Typography>
            </Grid>
            {/* Days Columns */}
            {weekDays.map((day, colIndex) => {
              const eventsInInterval = getEventsInInterval(weeklyEvents, day, interval);
              const sortedIntervalEvents = sortEventsByIntervals(eventsInInterval, intervals);
              const displayMore = eventsInInterval.length > 2;
  
              return (
                <Grid item xs key={`${day.toDateString()}-${interval.toString()}`}>
                  <Box
                    sx={{
                      borderBottom: '1px solid #ddd',
                      borderRight: colIndex < weekDays.length - 1 ? '1px solid #ddd' : 'none',
                      position: 'relative',
                      minHeight: 60,
                      display: 'flex',  // Use flexbox to align items
                      flexDirection: 'row', // Row direction for side-by-side alignment
                      justifyContent: 'start', // Align items at the start
                      alignItems: 'start',  // Align items at the start vertically
                      backgroundColor: '#f9f9f9',
                      boxSizing: 'border-box',
                      paddingLeft: '5px',
                      '&:hover': {
                        backgroundColor: theme.palette.action.selected,
                        cursor: 'pointer',
                      },
                    }}
                    onClick={() => openModal(null, day)}
                    aria-label={`Time slot at ${format(interval, 'HH:mm')}`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openModal(null, selectedDate);
                      }
                    }}
                  >
                    {sortedIntervalEvents.slice(0, 2).map((event, index) => {
                      const { topPosition, eventHeight } = calculateEventPositionInInterval(event, interval);
  
                      return (
                        <Tooltip
                          title={`${event.title} (${event.startTime} - ${event.endTime})`}
                          key={event.id}
                        >

                          <Box
                            sx={{
                              position: 'absolute',
                              left: `${index * (100 / 3)}%`,
                              top: `${topPosition}px`,
                              width: `${100 / 3}%`, // Adjust width for better spacing
                              height: `${eventHeight}px`,
                              backgroundColor: event.color,
                              cursor: 'pointer',
                              overflow: 'hidden',
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal(event, new Date(event.date), 'viewEvent')}}
                              aria-label={`${event.title} (${event.startTime} - ${event.endTime})`}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              openModal(event, new Date(event.date), 'viewEvent');
                            }
                          }}
                          />
                        </Tooltip>
                      );
                    })}
                    {displayMore && (
                      <Tooltip
                    title= "View more"
                    >

                      <Box
                        sx={{
                          position: 'absolute',
                          left: `${2 * (100 / 3)}%`,
                          width: `${100 / 3}%`, // Adjust width for better spacing
                          height: `${60}px`,
                          backgroundColor: theme.palette.grey[500],
                          cursor: 'pointer',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          display: 'flex', // Use flexbox to center content
                          justifyContent: 'center', // Center horizontally
                          alignItems: 'center', // Center vertically
                        }}
                        onClick={() => {
                          
                          openModal(null, day)}}

                          aria-label="View more events"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            openModal(null, selectedDate);
                          }
                        }}
                      >
                        <Typography sx={{ color: 'white' }}>{`+${eventsInInterval.length - 2}`}</Typography>
                      </Box>
                    </Tooltip>
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

export default WeeklyView;
