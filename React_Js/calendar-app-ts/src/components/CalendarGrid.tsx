import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addDays, subDays, subWeeks, addWeeks } from 'date-fns';
import EventModal from './EventModal';
import CategoryFilter from './CategoryFilter';
import DailyView from './DailyView';
import WeeklyView from './WeeklyView';
import { Event, Category } from '../utils/types';
import { modalMode } from '../utils/types';
import MonthlyView from './MonthlyView';

type ViewMode = 'monthly' | 'weekly' | 'daily';

const CalendarGrid: React.FC = () => {
  const theme = useTheme();

  // Load initial state from localStorage or fallback to defaults
  const [current, setCurrent] = useState<Date>(() => {
    const savedDate = localStorage.getItem('current');
    return savedDate ? new Date(savedDate) : new Date();
  });

  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const savedViewMode = localStorage.getItem('viewMode');
    return (savedViewMode as ViewMode) || 'monthly';
  });

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [mode, setMode] = useState<modalMode>('view');

  useEffect(() => {
    // Save current and viewMode to localStorage whenever they change
    localStorage.setItem('current', current.toISOString());
    localStorage.setItem('viewMode', viewMode);
  }, [current, viewMode]);

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

  const handleToday = () => {
    setCurrent(new Date()); // Set the current date to today's date
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'OPEN_MODAL' && event.data.event && event.data.event.date) {
        // Construct the Event object based on the data received
        const eventData: Event = {
          id: event.data.event.id,
          title: event.data.event.title,
          category: event.data.event.category,
          color: event.data.event.color,
          date: event.data.event.date,
          startTime: event.data.event.startTime,
          endTime: event.data.event.endTime,
        };

        // Open the modal with the event data
        handleOpenModal(eventData, new Date(event.data.event.date), 'viewEvent');
      } else {
        console.warn('Invalid message data:', event.data);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <Box
      sx={{
        maxWidth: 1200,
        maxHeight: '95vh',
        margin: '10px auto',
        padding: 2,
        border: `2px solid ${theme.palette.grey[800]}`, // Dark border using theme colors
        borderRadius: 2,
        backgroundColor: theme.palette.background.default, // Background color from theme
        overflowY: 'auto',
        overflowX: 'auto',
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
          <Button variant="contained" onClick={handleToday} sx={{ mr: 1 }}>Today</Button> {/* Add Today button here */}
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
        <MonthlyView
          selectedDate={current}
          openModal={handleOpenModal}
          selectedCategory={selectedCategory}
          />
      )}
      {viewMode === 'weekly' && (
        <WeeklyView
          selectedDate={current}
          openModal={handleOpenModal}
          selectedCategory={selectedCategory}
          theme={theme}
        />
      )}
      {viewMode === 'daily' && (
        <DailyView
          selectedDate={current}
          openModal={handleOpenModal}
          selectedCategory={selectedCategory}
          theme={theme}
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
