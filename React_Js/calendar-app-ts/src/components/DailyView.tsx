import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Grid2, IconButton, Tooltip, Theme } from '@mui/material';
import { format, addHours, startOfDay } from 'date-fns';
import { Event, RootState, modalMode } from '../utils/types';
import AddIcon from '@mui/icons-material/Add';
import { calculateEventPositionInInterval, doesEventOverlapWithInterval, sortEventsByIntervals } from '../utils/calendarViewFuncs';
import {styled} from  '@mui/material/styles';

interface DailyViewProps {
  selectedDate: Date;
  openModal: (event: Event | null, day: Date | null, mode: modalMode) => void;
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

  const slotRefs = useRef<(HTMLDivElement | null)[]>([]); // Ref for time slot references

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
  const sortedDayEvents = sortEventsByIntervals(dayEvents, intervals);

  const handleOnClick = (event: Event | null, day: Date | null, mode: modalMode, length: number) => {
    length ===0 ? openModal(null, selectedDate, 'add') : openModal(null, selectedDate, 'view');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    const gridLength = intervals.length;
    
    if (event.key === 'Enter') {
      event.preventDefault();
      openModal(null, selectedDate, 'view');
    }
    else{
      if(event.key === 'ArrowDown'){
        event.preventDefault();
        if(index < gridLength - 1){
          slotRefs.current[index + 1]?.focus();
        }
      }
      else if(event.key === 'ArrowUp'){
        event.preventDefault();
        if(index > 0){
          slotRefs.current[index - 1]?.focus();
        }
      }
    }
  };
  
  return (
    <>
      <Box display = 'flex' justifyContent = 'start' alignItems = 'center' padding={1}>
        <Typography variant="h5">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</Typography>
        <IconButton
          color="primary"
          sx={{
            ml: 1, 
            '&:hover': { backgroundColor: theme.palette.grey[300] }
          }}
          onClick={() => openModal(null, selectedDate, 'add')}
          aria-label="Add event"
          tabIndex={0}
        >
          <AddIcon />
        </IconButton>
      </Box>
      <ScrollableContainer>
      <Grid2 spacing={0}>
        {intervals.map((interval, index) => {
          const eventsInInterval = sortedDayEvents.filter((event) =>
            doesEventOverlapWithInterval(event, interval)
          );
          const intervalKey = format(interval, 'HH:mm');
          const displayMore = eventsInInterval.length > 3;

          return (
            <Grid2 key={intervalKey}>
              {/* Time Slot */}
              <AllIntervalContainer 
                ref={(ref: HTMLDivElement | null) => (slotRefs.current[index] = ref)}
                onClick={ () => handleOnClick( null, selectedDate, 'view', eventsInInterval.length) }
                aria-label={`Time slot at ${format(interval, 'HH:mm')}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => handleKeyDown(e, index)}
              >
                {/* Time Label */}
                <Typography position = 'absolute' left = {8} top={8}>{format(interval, 'HH:mm')}</Typography>

                {/* Container for all events in this interval */}
                <IntervalBox>
                  {eventsInInterval.slice(0, 3).map((event) => {
                    const { topPosition, eventHeight } = calculateEventPositionInInterval(event, interval);

                    return (
                      <Tooltip
                        title={`${event.title} (${event.startTime} - ${event.endTime})`}
                        key={event.id}
                      >
                        <EventBox
                          topPosition={topPosition}
                          eventHeight={eventHeight}
                          event = {event}
                          eventsInInterval={eventsInInterval}
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal(event, new Date(event.date), 'viewEvent');
                          }}
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
                      title="View more"
                    >
                      <ViewMoreBox
                        
                        onClick={() => openModal(null, selectedDate, 'view')}
                        aria-label="View more events"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            openModal(null, selectedDate, 'view');
                          }
                        }}
                      >
                        <Typography color = "white">{`+${eventsInInterval.length - 3}`}</Typography>
                      </ViewMoreBox>
                    </Tooltip>
                  )}
                </IntervalBox>
              </AllIntervalContainer>
            </Grid2>
          );
        })}
      </Grid2>
      </ScrollableContainer>
    </>
  );
};

interface EventBoxProps {
  topPosition: number;
  eventHeight: number;
  event: Event;
  eventsInInterval: Event[]; // Define the type of `eventsInInterval` based on your actual data structure
}

const EventBox = styled(Box)<EventBoxProps>(({ theme, topPosition, eventHeight, event, eventsInInterval }) => ({
  position: 'absolute',
  top: `${topPosition}px`,
  left: `${eventsInInterval.indexOf(event) * 220}px`, // Adjust this value for spacing between events
  width: '20%', // Reduced width of the event box
  height: `${eventHeight}px`,
  backgroundColor: event.color,
  cursor: 'pointer',
  overflow: 'hidden', // Ensure no content overflows the box
}));

const ViewMoreBox = styled(Box)(({theme}) => ({
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
}));

const AllIntervalContainer = styled(Box)(({ theme }) => ({
  padding: '0 16px',
  borderBottom: '1px solid #ddd',
  position: 'relative',
  minHeight: 60, // Constant height for each time slot
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#f9f9f9',
  '&:hover': {
    backgroundColor: theme.palette.action.selected, // Hover color from theme
    cursor: 'pointer'
  },
}));

const IntervalBox = styled(Box)(({ theme }) => ({
  marginLeft: '60px', // Margin to position events away from the time label
  position: 'relative',
  height: '100%', // Fill the parent container
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
}));

const ScrollableContainer = styled(Box)`
  flex: 1; /* Take up remaining space */
  overflow-y: auto; /* Scrollable content */
  padding-right: 10px;
  margin-top: 20px;

  @media (max-width: 600px) {
    padding: 10px;
    border-radius: 10px;
    border-width: 1px;
  }
`;

export default DailyView;
