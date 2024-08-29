import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, Typography, Grid, Tooltip } from '@mui/material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addDays, subDays, subWeeks, addWeeks, startOfWeek, endOfWeek } from 'date-fns';
import EventModal from './EventModal';
import CategoryFilter from './CategoryFilter';
import { categoryColors } from '../utils/categoryColors';
import DailyView from './DailyView';
import WeeklyView from './WeeklyView';
import { Event, Category } from '../utils/types';
import { RootState } from '../utils/types'; // Import RootState interface

type ViewMode = 'monthly' | 'weekly' | 'daily';

const CalendarGrid: React.FC = () => {
  const events = useSelector((state: RootState) => state.events);
  const [current, setCurrent] = useState<Date>(new Date());
  const [days, setDays] = useState<Date[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [viewMode, setViewMode] = useState<ViewMode>('monthly'); // State to manage the view mode

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

  const handleOpenModal = (event: Event | null = null, day: Date | null = null) => {
    setSelectedEvent(event);
    setSelectedDay(day);
    setModalOpen(true);
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
        maxWidth: 800,
        margin: '0 auto',
        padding: 2,
        border: '1px solid #ddd',
        borderRadius: 2,
        backgroundColor: '#f9f9f9',
      }}
    >
      <CategoryFilter onChange={handleCategoryChange} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <Button variant="contained" onClick={handlePrev}>Prev</Button>
        <Typography variant="h5">{format(current, 'MMMM yyyy')}</Typography>
        <Button variant="contained" onClick={handleNext}>Next</Button>
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
              const dayEvents = events.filter(event => new Date(event.date).toDateString() === dayStr);
              const hasEvents = dayEvents.length > 0;

              // Determine the background color based on selected category
              const applicableCategories = dayEvents.map(event => event.category);
              const uniqueCategories = [...new Set(applicableCategories)];
              const isCurrentDate = day.toDateString() === new Date().toDateString();
              const hasCategoryEvents = selectedCategory !== 'All' && uniqueCategories.includes(selectedCategory);
              const bgColor = isCurrentDate && (!hasEvents || !hasCategoryEvents)
                ? '#e0f7fa'
                : selectedCategory !== 'All' && uniqueCategories.includes(selectedCategory)
                  ? `${categoryColors[selectedCategory]}80` || '#fff'
                  : '#fff';

              const displayMore = dayEvents.length > 2;

              return (
                <Grid item xs={12 / 7} key={index}>
                  <Box
                    sx={{
                      // Fixed height for consistency
                      height: 100,
                      padding: 2,
                      backgroundColor: bgColor,
                      border: '1px solid #ddd',
                      borderRadius: 1,
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      position: 'relative',
                      cursor: current.getMonth() !== day.getMonth() ? 'not-allowed' : 'pointer',
                      '&:hover': {
                        backgroundColor: '#e0e0e0',
                      },
                      opacity: current.getMonth() !== day.getMonth() ? 0.5 : 1, // Only show for current month
                    }}
                    onClick={() => current.getMonth() !== day.getMonth() ? null : handleOpenModal(null, day)}
                  >
                    <Typography variant="body2">{format(day, 'd')}</Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: 1 }}>
                      {dayEvents.slice(0, 2).map((event) => (
                        <Tooltip title={`${event.title} (${event.startTime} - ${event.endTime})`} key={event.id}>
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              backgroundColor: event.color,
                              margin: '0 2px 2px 2px',
                              cursor: 'pointer',
                            }}
                            onClick={() => handleOpenModal(event, day)}
                          />
                        </Tooltip>
                      ))}
                    </Box>
                    
                    {displayMore && (
                      <Typography
                        variant="body2"
                        sx={{ cursor: 'pointer', color: 'blue', marginTop: 1 }}
                        onClick={() => handleOpenModal(null, day)}
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
      />
    </Box>
  );
};

export default CalendarGrid;
