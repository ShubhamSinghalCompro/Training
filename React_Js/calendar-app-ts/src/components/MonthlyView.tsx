import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, Tooltip, useTheme } from '@mui/material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import { useSelector } from 'react-redux';
import { Event, RootState } from '../utils/types';

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

  const generateCalendar = () => {
    const start = startOfWeek(startOfMonth(selectedDate), { weekStartsOn: 1 }); // Week starts on Monday
    const end = endOfWeek(endOfMonth(selectedDate), { weekStartsOn: 1 }); // Week ends on Sunday
    const days = eachDayOfInterval({ start, end });
    setDays(days);
  };

  useEffect(() => {
    generateCalendar();
  }, [selectedDate]);

  const handleKeyDown = (event: React.KeyboardEvent, day: Date, selectedEvent: Event | null) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openModal(selectedEvent, day, selectedEvent ? 'viewEvent' : undefined);
    }
  };

  return (
    <>
      {/* Render days of the week */}
      <Grid container spacing={0}>
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((dayName, index) => (
          <Grid item xs={12 / 7} key={index}>
            <Typography variant="subtitle2" align="center">
              {dayName}
            </Typography>
          </Grid>
        ))}
      </Grid>
      {/* Render days in the calendar */}
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
              <Box
                sx={{
                  height: 80,
                  padding: 1,
                  backgroundColor: bgColor,
                  border: `1px solid ${theme.palette.grey[300]}`, // Light border using theme colors
                  borderRadius: 1,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column', // Align items in a single column
                  alignItems: 'center', // Center items horizontally
                  justifyContent: 'start', // Space between date, dots, and view more
                  position: 'relative',
                  cursor: isDifferentMonth ? 'not-allowed' : 'pointer',
                  '&:hover': {
                    backgroundColor: isDifferentMonth ? bgColor :theme.palette.action.selected, // Hover color from theme
                  },
                  opacity: isDifferentMonth ? 0.5 : 1,
                }}
                tabIndex={isDifferentMonth ? -1 : 0} // Make focusable
                role="button" // Improve accessibility by making it a button-like element
                aria-label={`Day ${format(day, 'd')}, ${hasEvents ? dayEvents.length : 0} events`}
                onClick={() => !isDifferentMonth && openModal(null, day)}
                onKeyDown={(e) => handleKeyDown(e, day, null)} // Handle keyboard event
              >
                <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                  {format(day, 'd')}
                </Typography>

                {/* Display event dots */}
                {hasEvents && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '100%',
                      flexWrap: 'nowrap',
                      overflow: 'hidden',
                      marginBottom: '2px', // Adds space between dots and "View More"
                    }}
                  >
                    {dayEvents.slice(0, 2).map((event) => (
                      <Tooltip
                        title={isDifferentMonth ? '' : `${event.title} (${event.startTime} - ${event.endTime})`}
                        key={event.id}
                        disableHoverListener={isDifferentMonth}
                      >
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            backgroundColor: event.color,
                            margin: '0 4px 0 0',
                            cursor: isDifferentMonth ? 'not-allowed' : 'pointer',
                          }}
                          tabIndex={isDifferentMonth ? -1 : 0} // Make dots focusable
                          role="button"
                          aria-label={`${event.title} (${event.startTime} - ${event.endTime})`}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevents triggering day click when clicking on dot
                            if (!isDifferentMonth) {
                              openModal(event, day, 'viewEvent');
                            }
                          }}
                          onKeyDown={(e) => handleKeyDown(e, day, event)} // Handle keyboard for event dots
                        />
                      </Tooltip>
                    ))}
                  </Box>
                )}

                {/* Display "View More" if necessary */}
                {displayMore && (
                  <Typography
                    variant="body2"
                    sx={{
                      cursor: isDifferentMonth ? 'not-allowed' : 'pointer',
                      color: theme.palette.primary.main,
                      marginTop: 'auto',
                    }}
                    tabIndex={isDifferentMonth ? -1 : 0}
                    role="button"
                    aria-label={`View more events for ${format(day, 'd')}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isDifferentMonth) {
                        openModal(null, day);
                      }
                    }}
                    onKeyDown={(e) => handleKeyDown(e, day, null)} // Handle keyboard for View More
                  >
                    View More
                  </Typography>
                )}
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default MonthlyView;
