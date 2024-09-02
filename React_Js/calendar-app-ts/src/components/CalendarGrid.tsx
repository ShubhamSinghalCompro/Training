import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, Typography, Grid, Tooltip, useTheme } from '@mui/material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addDays, subDays, subWeeks, addWeeks, startOfWeek, endOfWeek } from 'date-fns';
import EventModal from './EventModal';
import CategoryFilter from './CategoryFilter';
import { categoryColors } from '../utils/categoryColors';
import DailyView from './DailyView';
import WeeklyView from './WeeklyView';
import { Event, Category } from '../utils/types';
import { RootState, modalMode } from '../utils/types'; // Import RootState interface

type ViewMode = 'monthly' | 'weekly' | 'daily';

const CalendarGrid: React.FC = () => {
  const theme = useTheme(); // Get theme from MUI
  const events = useSelector((state: RootState) => state.events);
  const [current, setCurrent] = useState<Date>(new Date());
  const [days, setDays] = useState<Date[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [viewMode, setViewMode] = useState<ViewMode>('monthly'); // State to manage the view mode
  const [mode, setMode] = useState<modalMode>('view'); // State to manage modal mode

  const generateCalendar = () => {
    const start = startOfWeek(startOfMonth(current), { weekStartsOn: 1 }); // Week starts on Monday
    const end = endOfWeek(endOfMonth(current), { weekStartsOn: 1 }); // Week ends on Sunday
    const days = eachDayOfInterval({ start, end });
    setDays(days);
  };

  const handlePrev = () => {
    if (viewMode === 'daily') {
      setCurrent(subDays(current, 1)); // Subtract one day
    } else if (viewMode === 'weekly') {
      setCurrent(subWeeks(current, 1)); // Subtract one week
    } else {
      setCurrent(new Date(current.setMonth(current.getMonth() - 1))); // Subtract one month
    }
  };

  const handleNext = () => {
    if (viewMode === 'daily') {
      setCurrent(addDays(current, 1)); // Add one day
    } else if (viewMode === 'weekly') {
      setCurrent(addWeeks(current, 1)); // Add one week
    } else {
      setCurrent(new Date(current.setMonth(current.getMonth() + 1))); // Add one month
    }
  };

  const handleOpenModal = (event: Event | null = null, day: Date | null = null, mode: 'viewEvent' | 'add' | 'edit' | 'view' = 'view') => {
    setSelectedEvent(event);
    setSelectedDay(day);
    setModalOpen(true);
    setMode(mode); // Set the mode based on the parameter
  };
  

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setModalOpen(false);
  };

  const handleCategoryChange = (category: Category) => {
    setSelectedCategory(category);
  };

  const handleViewChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  useEffect(() => {
    if (viewMode === 'monthly') {
      generateCalendar();
    }
  }, [current, viewMode]);

  return (
    <Box
      sx={{
        maxWidth: 1200,
        margin: '10px auto',
        padding: 2,
        border: `2px solid ${theme.palette.grey[800]}`, // Dark border using theme colors
        borderRadius: 2,
        backgroundColor: theme.palette.background.default, // Background color from theme
      }}
    >
      <Typography
        variant="h3"
        gutterBottom
        align="center"
        sx={{
          backgroundColor: theme.palette.primary.main, // Primary color from theme
          color: theme.palette.primary.contrastText, // Contrast text color for readability
          padding: '10px', // Padding around the text
          borderRadius: '4px', // Optional: rounded corners for the background
        }}
      >
        Event Scheduler
      </Typography>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 2,
        }}
      >
        {/* Box for buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Button variant="contained" onClick={handlePrev} sx={{ mr: 1 }}>Prev</Button>
          <Button variant="contained" onClick={handleNext}>Next</Button>
        </Box>

        {/* Centered month display */}
        <Typography variant="h4" sx={{ flex: 2, textAlign: 'center' }}>
          {format(current, 'MMMM yyyy')}
        </Typography>

        {/* Box for filter */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Box sx={{ minWidth: 120 }}>
            <CategoryFilter onChange={handleCategoryChange} />
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
        <Button variant={viewMode === 'monthly' ? 'contained' : 'outlined'} onClick={() => handleViewChange('monthly')} sx={{ mr: 1 }}>Monthly</Button>
        <Button variant={viewMode === 'weekly' ? 'contained' : 'outlined'} onClick={() => handleViewChange('weekly')} sx={{ mr: 1 }}>Weekly</Button>
        <Button variant={viewMode === 'daily' ? 'contained' : 'outlined'} onClick={() => handleViewChange('daily')} sx={{ mr: 1 }}>Daily</Button>
      </Box>

      {viewMode === 'monthly' && (
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
              // Filter events by the selected day and category
  const dayEvents = events.filter(event => 
    new Date(event.date).toDateString() === dayStr &&
    (selectedCategory === 'All' || event.category === selectedCategory)
  );
              const hasEvents = dayEvents.length > 0;

              // Determine the background color based on selected category
              const applicableCategories = dayEvents.map(event => event.category);
              const uniqueCategories = [...new Set(applicableCategories)];
              const isCurrentDate = day.toDateString() === new Date().toDateString();
              const hasCategoryEvents = selectedCategory !== 'All' && uniqueCategories.includes(selectedCategory);
              const bgColor = isCurrentDate && (!hasEvents || !hasCategoryEvents)
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
                      justifyContent:'start', // Space between date, dots, and view more
                      position: 'relative',
                      cursor: current.getMonth() !== day.getMonth() ? 'not-allowed' : 'pointer',
                      '&:hover': {
                        backgroundColor: theme.palette.action.selected, // Hover color from theme
                      },
                      opacity: current.getMonth() !== day.getMonth() ? 0.5 : 1,
                    }}
                    onClick={() => current.getMonth() !== day.getMonth() ? null : handleOpenModal(null, day)}
                  >
                    {/* Display the date */}
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
                          <Tooltip title={`${event.title} (${event.startTime} - ${event.endTime})`} key={event.id}>
                            <Box
                              sx={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                backgroundColor: event.color,
                                margin: '0 4px 0 0',
                                cursor: 'pointer',
                              }}
                              onClick={(e) => {
                                e.stopPropagation(); // Prevents triggering day click when clicking on dot
                                handleOpenModal(event, day);
                              }}
                            />
                          </Tooltip>
                        ))}
                      </Box>
                    )}

                    {/* Display "View More" if necessary */}
                    {displayMore && (
                      <Typography
                        variant="body2"
                        sx={{ cursor: 'pointer', color: theme.palette.primary.main, marginTop: 'auto' }} // Use primary color for "View More"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents triggering day click when clicking on "View More"
                          handleOpenModal(null, day);
                        }}
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
      )}
      {viewMode === 'weekly' && (
        <WeeklyView
          selectedDate={current}
          openModal={handleOpenModal}
          selectedCategory={selectedCategory}
        />
      )}
      {viewMode === 'daily' && (
        <DailyView
          selectedDate={current}
          openModal={handleOpenModal}
          selectedCategory={selectedCategory}
        />
      )}
      <EventModal
        open={modalOpen}
        onClose={handleCloseModal}
        selectedEvent={selectedEvent}
        selectedDay={selectedDay}
        setSelectedEvent={setSelectedEvent}
        selectedCategory={selectedCategory}
        mode = {mode}
        setMode = {setMode}
      />
    </Box>
  );
};

export default CalendarGrid;
