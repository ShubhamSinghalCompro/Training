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

enum ViewMode {
  Daily = 'daily',
  Weekly = 'weekly',
  Monthly = 'monthly',
}

const CalendarGrid: React.FC = () => {
  const theme = useTheme();

  // Load initial state from localStorage or fallback to defaults
  const [current, setCurrent] = useState<Date>(() => {
    const savedDate = localStorage.getItem('current');
    return savedDate ? new Date(savedDate) : new Date();
  });


  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    const savedViewMode = localStorage.getItem('viewMode');
    return (savedViewMode as ViewMode) || ViewMode.Monthly;
  });

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [mode, setMode] = useState<modalMode>('view');
  const [categoryColors, setCategoryColors] = useState<Record<string, string>>({});
  const [intervalStartTime, setIntervalStartTime] = useState<string | null>(null);
  const [intervalEndTime, setIntervalEndTime] = useState<string | null>(null);

  useEffect(() => {
    // Save current and viewMode to localStorage whenever they change
    localStorage.setItem('current', current.toISOString());
    localStorage.setItem('viewMode', viewMode);
  }, [current, viewMode]);

  const handlePrev = () => {
    if (viewMode === ViewMode.Daily) {
      setCurrent(subDays(current, 1)); // Subtract one day
    } else if (viewMode === ViewMode.Weekly) {
      setCurrent(subWeeks(current, 1)); // Subtract one week
    } else {
      setCurrent(new Date(current.setMonth(current.getMonth() - 1))); // Subtract one month
    }
  };

  const handleNext = () => {
    if (viewMode === ViewMode.Daily) {
      setCurrent(addDays(current, 1)); // Add one day
    } else if (viewMode === ViewMode.Weekly) {
      setCurrent(addWeeks(current, 1)); // Add one week
    } else {
      setCurrent(new Date(current.setMonth(current.getMonth() + 1))); // Add one month
    }
  };

  const handleOpenModal = (event: Event | null = null, day: Date | null = null, mode: 'viewEvent' | 'add' | 'edit' | 'view', intervalStartTime: string | null = null, intervalEndTime: string | null = null) => {
    setSelectedEvent(event);
    setSelectedDay(day);
    setModalOpen(true);
    setMode(mode); // Set the mode based on the parameter
    setIntervalStartTime(intervalStartTime);
    setIntervalEndTime(intervalEndTime);
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
      <HeaderBox >
        {/* Box for buttons */}
        <NavigationBox display = "flex" alignItems={'center'} flex={1} >
          <Button variant="contained" onClick={handlePrev} sx={{ mr: 1 }} aria-label= {viewMode===ViewMode.Monthly ?  'Previous Month' : viewMode===ViewMode.Weekly ? 'Previous Week' :  'Previous Day'}>Prev</Button>
          <Button variant="contained" onClick={handleToday} sx={{ mr: 1 }} aria-label='Today'>Today</Button> {/* Add Today button here */}
          <Button variant="contained" onClick={handleNext} aria-label= {viewMode===ViewMode.Monthly ?  'Next Month' : viewMode===ViewMode.Weekly ? 'Next Week' :  'Next Day'}>Next</Button>
        </NavigationBox>

        {/* Centered month display */}
        <CenteredTypography variant="h4" >
          {format(current, 'MMMM yyyy')}
        </CenteredTypography>


        {/* Box for filter */}
        <FilterBox >
          <Box minWidth={120} >
            <CategoryFilter onChange={handleCategoryChange} categoryColors={categoryColors} />
          </Box>
        </FilterBox>
      </HeaderBox>

      <Box display = 'flex' justifyContent = 'center' marginBottom = {2} >
        <Button variant={viewMode === ViewMode.Monthly ? 'contained' : 'outlined'} onClick={() => handleViewChange(ViewMode.Monthly)} sx={{ mr: 1 }} aria-pressed={viewMode === ViewMode.Monthly} >Monthly</Button>
        <Button variant={viewMode === ViewMode.Weekly ? 'contained' : 'outlined'} onClick={() => handleViewChange(ViewMode.Weekly)} sx={{ mr: 1 }}aria-pressed={viewMode === ViewMode.Weekly}>Weekly</Button>
        <Button variant={viewMode === ViewMode.Daily ? 'contained' : 'outlined'} onClick={() => handleViewChange(ViewMode.Daily)} sx={{ mr: 1 }}aria-pressed={viewMode === ViewMode.Daily}>Daily</Button>
      </Box>
      

      {viewMode === ViewMode.Monthly && (
        <MonthlyView
          selectedDate={current}
          openModal={handleOpenModal}
          selectedCategory={selectedCategory}
          categoryColors={categoryColors}
          />
      )}
      {viewMode === ViewMode.Weekly && (
        <WeeklyView
          selectedDate={current}
          openModal={handleOpenModal}
          selectedCategory={selectedCategory}
          theme={theme}
        />
      )}
      {viewMode === ViewMode.Daily && (
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
        intervalStartTime={intervalStartTime}
        intervalEndTime={intervalEndTime}
        setIntervalStartTime={setIntervalStartTime}
        setIntervalEndTime={setIntervalEndTime}
      />
    </CalendarContainer>
  );
};

const CalendarContainer = styled(Box)<{ theme: any }>`
  max-width: 1200px;
  height: calc(95vh - ${(props) => props.theme.spacing(6)}); /* Dynamic height */
  margin: ${(props) => props.theme.spacing(2)} auto;
  padding: ${(props) => props.theme.spacing(2)};
  border: 2px solid ${(props) => props.theme.palette.grey[800]};
  border-radius: 20px;
  background-color: ${(props) => props.theme.palette.background.default};
  display: flex;
  flex-direction: column; /* To make it stack elements vertically */

  @media (max-width: 600px) {
    height: calc(95vh - ${(props) => props.theme.spacing(6)});
    padding: 10px;
    border-radius: 10px;
    border-width: 1px;
  }
`;

const HeaderBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  position: relative;


  @media (max-width: 800px) {
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;
    justify-content: space-between;
  }
`;
const CenteredTypography = styled(Typography)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;

  @media (max-width: 800px) {
    // delete styling so that it behaves as normal child
    position: unset;
    transform: unset;
    top: unset;
    left: unset;
  }
`;

const NavigationBox = styled(Box)`
  display: flex;
  flex: 1;
  align-items: center;

  @media (max-width: 800px) {
    margin-bottom: 10px;
  }
`;

const FilterBox = styled(Box)`
  display: 'flex';
  justifyContent: 'flex-end';
  alignItems: 'center';

  @media (max-width: 800px) {
    margin-top: 10px;
  }
`;


export default CalendarGrid;
