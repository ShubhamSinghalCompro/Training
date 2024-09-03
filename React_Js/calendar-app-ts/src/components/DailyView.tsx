import React from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Grid, IconButton, Tooltip, Theme } from '@mui/material';
import { format, addHours, startOfDay } from 'date-fns';
import { Event, RootState, modalMode } from '../utils/types';
import AddIcon from '@mui/icons-material/Add';
import {getIntervalsOccupiedByEvent, calculateEventPositionInInterval, doesEventOverlapWithInterval} from '../utils/calendarViewFuncs';

interface DailyViewProps {
  selectedDate: Date;
  openModal: (event: Event | null, day: Date | null, mode?: modalMode) => void;
  selectedCategory: string;
  theme: Theme
}

const DailyView: React.FC<DailyViewProps> = ({
  selectedDate,
  openModal,
  selectedCategory,
  theme
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
  
  // Sort events based on the number of intervals they occupy
  const sortedDayEvents = [...dayEvents].sort((a, b) => {
    const intervalsOccupiedA = getIntervalsOccupiedByEvent(a, intervals);
    const intervalsOccupiedB = getIntervalsOccupiedByEvent(b, intervals);
    return intervalsOccupiedB - intervalsOccupiedA; // Sort in descending order
  });
  
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', p: 1 }}>
      <Typography variant="h5">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</Typography>
      <IconButton
        color="primary"
        sx={{
           ml: 1, 
          '&:hover': { backgroundColor: theme.palette.grey[300]}
        }}
        onClick={() => openModal(null, selectedDate)}
      >
        <AddIcon />
      </IconButton>
      </Box>
      <Grid container spacing={0}>
        {intervals.map((interval) => {
          const eventsInInterval = sortedDayEvents.filter((event) =>
            doesEventOverlapWithInterval(event, interval)
          );
          const intervalKey = format(interval, 'HH:mm');
          const displayMore = eventsInInterval.length > 3;

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
                  '&:hover': {
                        backgroundColor: theme.palette.action.selected, // Hover color from theme
                        cursor:'pointer'
                      },
                }}
                onClick={() => openModal(null, selectedDate)}
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
                  {eventsInInterval.slice(0, 3).map((event) => {
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
                            width: '20%', // Reduced width of the event box
                            height: `${eventHeight}px`,
                            backgroundColor: event.color,
                            cursor: 'pointer',
                            overflow: 'hidden', // Ensure no content overflows the box
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal(event, new Date(event.date), 'viewEvent')}}
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
                          width: '20%', // Adjust width for better spacing
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
                          
                          openModal(null, selectedDate)}}
                      >
                        <Typography sx={{ color: 'white' }}>{`+${eventsInInterval.length - 3}`}</Typography>
                      </Box>
                    </Tooltip>
                    )}
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default DailyView;
