import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, useTheme } from '@mui/material';
import { format, addDays, subDays, subWeeks, addWeeks } from 'date-fns';
import EventModal from './EventModal';
import CategoryFilter from './CategoryFilter';
import DailyView from './DailyView';
import WeeklyView from './WeeklyView';
import MonthlyView from './MonthlyView';
import { Event } from '../utils/types';
import { modalMode } from '../utils/types';
import {styled} from 'styled-components';

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
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [mode, setMode] = useState<modalMode>('view');
  const [categoryColors, setCategoryColors] = useState<Record<string, string>>({});

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

  const handleOpenModal = (event: Event | null = null, day: Date | null = null, mode: 'viewEvent' | 'add' | 'edit' | 'view') => {
    setSelectedEvent(event);
    setSelectedDay(day);
    setModalOpen(true);
    setMode(mode); // Set the mode based on the parameter
  };
  

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setModalOpen(false);
  };

  const handleCategoryChange = (category: string) => {
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

    const storedColors = localStorage.getItem('categoryColors');
    if (storedColors) {
      setCategoryColors(JSON.parse(storedColors));
    } else {
      setCategoryColors({
        All:        '#00000000',  // transparent  
        General:    'rgba(0, 128, 255, 0.2)',  // Soft Blue
        Meeting:    'rgba(0, 128, 128, 0.2)',  // Soft Teal
        Birthday:   'rgba(255, 165, 0, 0.2)',  // Soft Orange
        Anniversary:'rgba(128, 0, 128, 0.2)',  // Soft Purple
        Important:  'rgba(60, 179, 113, 0.2)', // Soft Green
      });
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <CalendarContainer theme={theme}>
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
      <Box display={'flex'} alignItems={'center'} marginBottom={2}>
        {/* Box for buttons */}
        <Box display = "flex" alignItems={'center'} flex={1} >
          <Button variant="contained" onClick={handlePrev} sx={{ mr: 1 }}>Prev</Button>
          <Button variant="contained" onClick={handleToday} sx={{ mr: 1 }}>Today</Button> {/* Add Today button here */}
          <Button variant="contained" onClick={handleNext}>Next</Button>
        </Box>

        {/* Centered month display */}
        <Typography variant="h4" textAlign={'center'} flex={2}>
          {format(current, 'MMMM yyyy')}
        </Typography>

        {/* Box for filter */}
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Box minWidth={120} >
            <CategoryFilter onChange={handleCategoryChange} categoryColors={categoryColors} />
          </Box>
        </Box>
      </Box>

      <Box display = 'flex' justifyContent = 'center' marginBottom = {2} >
        <Button variant={viewMode === 'monthly' ? 'contained' : 'outlined'} onClick={() => handleViewChange('monthly')} sx={{ mr: 1 }}>Monthly</Button>
        <Button variant={viewMode === 'weekly' ? 'contained' : 'outlined'} onClick={() => handleViewChange('weekly')} sx={{ mr: 1 }}>Weekly</Button>
        <Button variant={viewMode === 'daily' ? 'contained' : 'outlined'} onClick={() => handleViewChange('daily')} sx={{ mr: 1 }}>Daily</Button>
      </Box>

      {viewMode === 'monthly' && (
        <MonthlyView
          selectedDate={current}
          openModal={handleOpenModal}
          selectedCategory={selectedCategory}
          categoryColors={categoryColors}
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
        categoryColors={categoryColors}
        setCategoryColors={setCategoryColors}
      />
    </CalendarContainer>
  );
};

const CalendarContainer = styled(Box)`
  max-width: 1200px; 
  height: 95vh; 
  margin: ${(props) => props.theme.spacing(2)} auto;
  padding: ${(props) => props.theme.spacing(2)};
  border: 2px solid ${(props) => props.theme.palette.grey[800]};
  border-radius: 20px; 
  background-color: ${(props) => props.theme.palette.background.default};
  overflow-y: auto; 
  overflow-x: auto; 
`;


export default CalendarGrid;
