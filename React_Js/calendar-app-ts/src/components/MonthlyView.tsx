import React, { useState, useEffect, useRef } from 'react';
import { Box, Grid, Typography, Tooltip, useTheme } from '@mui/material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import { useSelector } from 'react-redux';
import { Event, RootState } from '../utils/types';
import styled from 'styled-components';

interface MonthlyViewProps {
  selectedDate: Date;
  selectedCategory: string;
  openModal: (event: Event | null, day: Date | null, mode: 'viewEvent' | 'add' | 'edit' | 'view') => void;
  categoryColors: Record<string, string>;
}

const MonthlyView: React.FC<MonthlyViewProps> = ({ selectedDate, selectedCategory, openModal, categoryColors }) => {
  const theme = useTheme();
  const events = useSelector((state: RootState) => state.events);
  const [days, setDays] = useState<Date[]>([]);
  const dayRefs = useRef<(HTMLDivElement | null)[]>([]); // ref for day references

  const generateCalendar = () => {
    const start = startOfWeek(startOfMonth(selectedDate), { weekStartsOn: 1 }); // Week starts on Monday
    const end = endOfWeek(endOfMonth(selectedDate), { weekStartsOn: 1 }); // Week ends on Sunday
    const days = eachDayOfInterval({ start, end });
    setDays(days);
  };

  useEffect(() => {
    generateCalendar();
  }, [selectedDate]);

   // Find first and last day of the month index
   const firstDayofMonthIndex = days.findIndex(
    (day) => format(day, 'd') === '1' && day.getMonth() === selectedDate.getMonth()
  );
  const lastDayofMonthIndex = days.findIndex(
    (day) => format(day, 'd') === format(endOfMonth(selectedDate), 'd') && day.getMonth() === selectedDate.getMonth()
  );

  const handleKeyDown = (event: React.KeyboardEvent, index: number, day: Date, selectedEvent: Event | null) => {
    const gridWidth = 7; // Number of columns (days of the week)
    let nextIndex = index;

    switch (event.key) {
      case 'ArrowUp':
        nextIndex = index - gridWidth;
        break;
      case 'ArrowDown':
        nextIndex = index + gridWidth;
        break;
      case 'ArrowLeft':
        nextIndex = index - 1;
        break;
      case 'ArrowRight':
        nextIndex = index + 1;
        break;
      case 'Enter':
        {
          event.preventDefault();
          openModal(selectedEvent, day, selectedEvent ? 'viewEvent' : 'view');
        }
        break;
      default:
        return;
    }

    // Ensure the next index is within the valid range of the month
    if (nextIndex >= 0 && nextIndex < days.length &&
        nextIndex >= firstDayofMonthIndex && nextIndex <= lastDayofMonthIndex) {
      dayRefs.current[nextIndex]?.focus(); // Focus on the next valid day
    }
  };

  return (
    <>
      {/* Render days of the week */}
      <Grid container spacing={0}>
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((dayName, index) => (
          <Grid item xs={12 / 7} key={index}>
            <WeekdayName 
            theme={theme}
            variant="subtitle2"
            fullName={dayName}
            align="center">
            </WeekdayName>
          </Grid>
        ))}
      </Grid>
      {/* Render days in the calendar */}
      <ScrollableContainer
        theme={theme}>
        <Grid container spacing={1}>
          {days.map((day, index) => {
            const dayStr = day.toDateString();
            const isDifferentMonth = selectedDate.getMonth() !== day.getMonth();

            // Filter events by the selected day and category
            const dayEvents = events.filter(
              (event) =>
                new Date(event.date).toDateString() === dayStr &&
                (selectedCategory === 'All' || event.category === selectedCategory)
            );
            const hasEvents = dayEvents.length > 0;

            // Determine the background color based on selected category
            const applicableCategories = dayEvents.map((event) => event.category);
            const uniqueCategories = [...new Set(applicableCategories)];
            const isCurrentDate = day.toDateString() === new Date().toDateString();
            const hasCategoryEvents = selectedCategory !== 'All' && uniqueCategories.includes(selectedCategory);
            const bgColor =
              isCurrentDate && (!hasEvents || !hasCategoryEvents)
                ? '#e0f7fa'
                : selectedCategory !== 'All' && uniqueCategories.includes(selectedCategory)
                ? `${categoryColors[selectedCategory]}80` || theme.palette.background.paper
                : theme.palette.background.paper; // Default background color from the theme

            const displayMore = dayEvents.length > 2;

            return (
              <Grid item xs={12 / 7} key={index}>
                <DayBox
                  ref={(el: HTMLDivElement | null) => (dayRefs.current[index] = el)}
                  theme={theme}
                  isDifferentMonth={isDifferentMonth}
                  bgColor={bgColor}
                  tabIndex={isDifferentMonth ? -1 : 0}
                  role="button"
                  aria-label={`Day ${format(day, 'd')}, ${hasEvents ? dayEvents.length : 0} events`}
                  onClick={() => {
                    if (!isDifferentMonth) {
                      if (!hasEvents) {
                        openModal(null, day, 'add');
                      } else {
                        openModal(null, day, 'view');
                      }
                    }
                  }}
                  onKeyDown={(e) => handleKeyDown(e, index, day, null)}
                >
                  <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                    {format(day, 'd')}
                  </Typography>

                  {/* Display event dots */}
                  {hasEvents && (
                    <EventList
                    >
                      {dayEvents.slice(0, 2).map((event) => (
                        <Tooltip
                          title={isDifferentMonth ? '' : `${event.title} (${event.startTime} - ${event.endTime})`}
                          key={event.id}
                          disableHoverListener={isDifferentMonth}
                        >
                          <EventDot
                            color={event.color}
                            isDifferentMonth={isDifferentMonth}
                            tabIndex={isDifferentMonth ? -1 : 0}
                            role="button"
                            aria-label={`${event.title} (${event.startTime} - ${event.endTime})`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isDifferentMonth) {
                                openModal(event, day, 'viewEvent');
                              }
                            }}
                          />
                        </Tooltip>
                      ))}
                    </EventList>
                  )}

                  {displayMore && (
                    <ViewMoreLabel
                      theme={theme}
                      isDifferentMonth={isDifferentMonth}
                      tabIndex={isDifferentMonth ? -1 : 0}
                      role="button"
                      aria-label={`View more events for ${format(day, 'd')}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isDifferentMonth) {
                          openModal(null, day, 'view');
                        }
                      }}
                    >
                    </ViewMoreLabel>
                  )}
                </DayBox>
              </Grid>
            );
          })}
        </Grid>
      </ScrollableContainer>
    </>
  );
};

interface DayBoxProps {
  bgColor: string;
  isDifferentMonth: boolean;
  theme: any; // Pass the theme here
}

const DayBox = styled(Box)<DayBoxProps>`
  height: 80px;
  padding: 8px;
  background-color: ${(props) => props.bgColor};
  border: 1px solid ${(props) => props.theme.palette.grey[300]}; // Access theme color
  border-radius: 4px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  cursor: ${(props) => (props.isDifferentMonth ? 'not-allowed' : 'pointer')};
  &:hover {
    background-color: ${(props) =>
      props.isDifferentMonth ? props.bgColor : props.theme.palette.action.selected}; // Hover color from theme
  }
  opacity: ${(props) => (props.isDifferentMonth ? 0.5 : 1)};
  user-select: ${(props) => (props.isDifferentMonth ? 'none' : 'auto')};
`;


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
`;

const EventList = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-wrap: nowrap;
  overflow: hidden;
  margin-bottom: 2px;

  @media (max-width: 800px) {
    flex-direction: column; /* Stack event dots vertically on small screens */
    justify-content: flex-start; /* Align dots at the top for small screens */
  }
`;

const EventDot = styled(Box)<{ isDifferentMonth: boolean; color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 4px;
  background-color: ${(props) => props.color};
  cursor: ${(props) => (props.isDifferentMonth ? 'not-allowed' : 'pointer')};

  @media (max-width: 800px) {
    width: 8px;
    height: 8px;
    margin-right: 0;
    margin-bottom: 2px; /* Space between vertically stacked dots */
  }
`;

const ViewMoreLabel = styled(Typography)<{ theme: any, isDifferentMonth: boolean }>`
  cursor: ${(props) => props.isDifferentMonth ? 'not-allowed' : 'pointer'};
  color: ${(props) => props.isDifferentMonth ? props.theme.palette.text.disabled : props.theme.palette.primary.main};
  margin-top: auto;
  font-size: clamp(10px, 2vw, 12px); /* Responsive font size */
  font-weight: 500;
  text-align: center;

  @media (max-width: 800px) {
  &:before {
      content: "...";
      display: block;
    }
    margin-top: 0;
    font-size: clamp(8px, 4vw, 8px); /* Smaller font size for small screens */
  }
    @media (min-width: 801px) {
    &:before {
      content: "View More";
      display: block;
    }
    font-size: clamp(14px, 2vw, 16px);
  }
`;


const WeekdayName = styled(Typography)<{ theme: any, fullName: string }>`
  display: block; // Show full name by default

  @media (max-width: 800px) {
    &:before {
      content: "${props => props.fullName.substring(0, 3)}";
      display: block;
    }
    font-size: clamp(10px, 2vw, 12px);
  }

  @media (min-width: 801px) {
    &:before {
      content: "${props => props.fullName}";
      display: block;
    }
    font-size: clamp(14px, 2vw, 16px);
  }
`;

export default MonthlyView;
