import React, { useMemo, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Grid, Tooltip, IconButton, Theme } from '@mui/material';
import { format, addHours, startOfDay, addDays, startOfWeek, addMinutes } from 'date-fns';
import { Event, RootState, modalMode } from '../utils/types';
import { calculateEventPositionInInterval, doesEventOverlapWithInterval, sortEventsByIntervals } from '../utils/calendarViewFuncs';
import AddIcon from '@mui/icons-material/Add';
import { darken } from '@mui/system';
import { styled } from 'styled-components';

interface WeeklyViewProps {
  selectedDate: Date;
  openModal: (event: Event | null, day: Date | null, mode: modalMode, startTime?: string | null, endTime?: string | null) => void;
  selectedCategory: string;
  theme:Theme;
}

const WeeklyView: React.FC<WeeklyViewProps> = ({
  selectedDate,
  openModal,
  selectedCategory,
  theme,
}) => {
  const events = useSelector((state: RootState) => state.events);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]); // Ref for time slot references

  // Memoize startOfWeek calculation
  const startOfWeekDate = useMemo(() => startOfWeek(selectedDate, { weekStartsOn: 1 }), [selectedDate]);

  // Memoize intervals generation
  const intervals = useMemo(() => Array.from({ length: 24 }, (_, index) => {
    const time = startOfDay(selectedDate);
    return addHours(time, index);
  }), [selectedDate]);

  // Memoize weekDays generation
  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, index) => addDays(startOfWeekDate, index)), [startOfWeekDate]);

  // Memoize event filtering by category and week
  const weeklyEvents = useMemo(() => {
    const categoryEvents = events.filter((event) =>
      selectedCategory === 'All' || event.category === selectedCategory
    );
    return categoryEvents.filter((event) =>
      weekDays.some((day) => new Date(event.date).toDateString() === day.toDateString())
    );
  }, [events, selectedCategory, weekDays]);

  // Memoize getEventsInInterval function
  const getEventsInInterval = useCallback(
    (weeklyEvents: Event[], day: Date, interval: Date): Event[] => {
      return weeklyEvents
        .filter((event) => new Date(event.date).toDateString() === day.toDateString())
        .filter((event) => doesEventOverlapWithInterval(event, interval));
    },
    []
  );

  // Calculate the unique index for each time slot (row and column)
  const calculateIndex = (rowIndex: number, colIndex: number) => rowIndex * weekDays.length + colIndex;

  // Handle keyboard navigation between rows and columns
  const handleKeyDown = (event: React.KeyboardEvent, rowIndex: number, colIndex: number, day: Date, length: number, interval: Date) => {
    const gridWidth = weekDays.length; // Number of columns (days of the week)
    let nextRowIndex = rowIndex;
    let nextColIndex = colIndex;
    const startTime = format(interval, 'HH:mm').toString();
    const endTime = format(addMinutes(interval, 59), 'HH:mm').toString();

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        nextRowIndex = rowIndex - 1;
        break;
      case 'ArrowDown':
        event.preventDefault();
        nextRowIndex = rowIndex + 1;
        break;
      case 'ArrowLeft':
        event.preventDefault();
        nextColIndex = colIndex - 1;
        break;
      case 'ArrowRight':
        event.preventDefault();
        nextColIndex = colIndex + 1;
        break;
      case 'Enter':
        event.preventDefault();
        length === 0 ? openModal(null, day, 'add', startTime, endTime) : openModal(null, day, 'view');
        return;
      default:
        return;
    }

    // Ensure the next index is within bounds
    if (nextRowIndex >= 0 && nextRowIndex < intervals.length && nextColIndex >= 0 && nextColIndex < gridWidth) {
      const nextIndex = calculateIndex(nextRowIndex, nextColIndex);
      slotRefs.current[nextIndex]?.focus(); // Focus on the next slot
    }
  };

  return (
    <>
      {/* Display Week Days at the Top */}
      <Grid container spacing={0}>
        <Grid item xs={1}>
          <TimeLabel theme={theme} fullName = 'HH:MM' shortName='H'></TimeLabel>
        </Grid>
        {weekDays.map((day) => {
          const shortDayName = format(day, 'E').charAt(0) + ','; // Short day name, e.g., 'Mon'
          const fullDayName = format(day, 'EEE') + ','; // Full day name with 3 letters, e.g., 'Mon'
          const fullDate = format(day, 'MMM d'); // Full date, e.g., 'Monday, September 13, 2024'
          const shortDate = format(day, 'd'); // Short date, e.g., 'Sep 13'
          return (
          <Grid item xs key={day.toDateString()}>
            <Box alignItems={'center'}>
              <CustBox>
              <WeekDayLabel theme={theme} fullName = {fullDayName} shortName = {shortDayName} >
              </WeekDayLabel>
              <WeekDayLabel theme={theme} fullName = {fullDate} shortName = {shortDate} ></WeekDayLabel>
              </CustBox>
              
              <CustomIconButton

                color="primary"
                sx={{
                  padding: 0,
                  '&:hover': { backgroundColor: theme.palette.grey[300] }
                }}
                onClick={() => openModal(null, day, 'add')}
                aria-label="Add event"
                tabIndex={0}
              >
                <AddIcon />
              </CustomIconButton>
            </Box>
          </Grid>
        )})}
      </Grid>

      {/* Display Time Intervals and Events */}
      <ScrollableContainer theme={theme}>
        <Grid container spacing={0} role = 'grid'>
          {intervals.map((interval, rowIndex) => {
            const fullSltoName = format(interval, 'HH:mm');
            const shortSltoName = format(interval, 'h');
            return(
            <Grid container spacing={0} key={interval.toString()} role = 'row'>
              {/* Time Column */}
              <Grid item xs={1}>
                <Box role = 'cell'>
                <IntervalSlotLabel theme={theme} fullName = {fullSltoName} shortName = {shortSltoName}></IntervalSlotLabel>
                </Box>
              </Grid>
              {/* Days Columns */}
              {weekDays.map((day, colIndex) => {
                const eventsInInterval = getEventsInInterval(weeklyEvents, day, interval);
                const sortedIntervalEvents = sortEventsByIntervals(eventsInInterval, intervals);
                const displayMore = eventsInInterval.length > 2;

                const slotIndex = calculateIndex(rowIndex, colIndex); // Unique index for the slot

                return (
                  <Grid  xs key={`${day.toDateString()}-${interval.toString()}`}>
                    <Box
                      ref={(el: HTMLDivElement | null) => (slotRefs.current[slotIndex] = el)}
                      sx={{
                        borderBottom: '1px solid #ddd',
                        borderRight: colIndex < weekDays.length - 1 ? '1px solid #ddd' : 'none',
                        position: 'relative',
                        minHeight: 60,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'start',
                        alignItems: 'start',
                        backgroundColor: '#f9f9f9',
                        boxSizing: 'border-box',
                        paddingLeft: '5px',
                        '&:hover': {
                          backgroundColor: theme.palette.action.selected,
                          cursor: 'pointer',
                        },
                      }}
                      onClick={() => {
                        const startTime = format(interval, 'HH:mm').toString();
                        const endTime = format(addMinutes(interval, 59), 'HH:mm').toString();
                        eventsInInterval.length === 0 ? openModal(null, day, 'add', startTime, endTime) : openModal(null, day, 'view')}
                      }
                      aria-label={` ${format(day, 'EEEE, MMMM d, yyyy')} Time slot at ${format(interval, 'HH:mm')}`}
                      tabIndex={0}
                      onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex, day, eventsInInterval.length, interval)}
                      role = 'cell'
                    >
                      {/* Render events inside the time slot */}
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
                                width: `${100 / 3}%`,
                                height: `${eventHeight}px`,
                                backgroundColor: event.color,
                                cursor: 'pointer',
                                overflow: 'hidden',
                                borderLeft: `1px solid ${darken(event.color, 0.2)}`,
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                openModal(event, new Date(event.date), 'viewEvent');
                              }}
                              aria-label={`${event.title} (${event.startTime} - ${event.endTime})`}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (e.key === 'Enter') {
                                  openModal(event, new Date(event.date), 'viewEvent');
                                } else if (e.key === 'Tab') {
                                  // If this is the last event, move focus back to the grid
                                  if (index === sortedIntervalEvents.length - 1) {
                                    slotRefs.current[calculateIndex(rowIndex, colIndex+1)]?.focus(); // Return to the grid box
                                  }
                                }
                              }}
                            />
                          </Tooltip>
                        );
                      })}
                      {/* Display "View More" option if there are more than 2 events */}
                      {displayMore && (
                        <IconButton
                          color="primary"
                          sx={{ position: 'absolute', right: '5px', bottom: '5px' }}
                          onClick={() => openModal(null, day, 'view')}
                          tabIndex={0}
                          aria-label="View more events"
                        >
                          <AddIcon />
                        </IconButton>
                      )}
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          )})}
        </Grid>
      </ScrollableContainer>
    </>
  );
};

const ScrollableContainer = styled(Box)<{ theme: any }>`
  flex: 1; /* Take up remaining space */
  overflow-y: auto; /* Scrollable content */
  padding-right: 10px;
  margin-top: ${(props) => props.theme.spacing(2)};

  @media (max-width: 600px) {
    padding: 10px;
    border-radius: 10px;
    border-width: 1px;
  }
;`

const WeekDayLabel = styled(Typography)<{ theme: any, fullName: string, shortName: string }>`

  @media (max-width: 800px) {
    &:before {
      content: "${props => props.shortName}";
      display: block;
    }
    font-size: clamp(6px, 2vw, 8px);
  }

  @media (min-width: 801px) {
    &:before {
      content: "${props => props.fullName}";
      display: block;
    }
    font-size: clamp(8px, 2vw, 10px);
  }
`;

const CustomIconButton = styled(IconButton)`

  @media (max-width: 600px) {
    margin-left: 0;
  }
`;

const IntervalSlotLabel = styled(Typography)<{fullName: string, shortName: string}>`

  padding: '8px';
  textAlign: 'right';

  @media (max-width: 800px) {
    &:before {
      content: "${props => props.shortName}";
      display: block;
    }
    font-size: clamp(6px, 2vw, 8px);
  }

  @media (min-width: 801px) {
    &:before {
      content: "${props => props.fullName}";
      display: block;
    }
    font-size: clamp(8px, 2vw, 10px);
  }
`;

const TimeLabel = styled(Typography)<{theme: any, fullName: string, shortName: string}>`
  padding : '6px'; 
  fontWeight: 'bold';
  @media (max-width: 800px) {
    &:before {
      content: "${props => props.shortName}";
      display: block;
    }
    font-size: clamp(6px, 2vw, 8px);
  }

  @media (min-width: 801px) {
    &:before {
      content: "${props => props.fullName}";
      display: block;
    }
    font-size: clamp(8px, 2vw, 10px);
  }
    `;

  const CustBox = styled(Box)<{theme: any}>`
    display: flex;
    @media (max-width: 600px) {
      flex-direction: column;
    }
  `;
export default WeeklyView;
