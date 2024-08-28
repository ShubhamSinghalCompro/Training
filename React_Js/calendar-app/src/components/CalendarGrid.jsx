import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Button, Typography, Grid, IconButton } from '@mui/material';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import AddIcon from '@mui/icons-material/Add';
import EventModal from './EventModal';
import CategoryFilter from './CategoryFilter';
import { categoryColors } from '../utils/categoryColors';


const CalendarGrid = () => {
  const events = useSelector((state) => state.events);
  const [current, setCurrent] = useState(new Date());
  const [days, setDays] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');


const generateCalendar = () => {
  const start = startOfMonth(current);
  const end = endOfMonth(current);
  const days = eachDayOfInterval({ start, end });
  setDays(days);
};

const handlePrevMonth = () => {
  setCurrent(new Date(current.setMonth(current.getMonth() - 1)));
};

const handleNextMonth = () => {
  setCurrent(new Date(current.setMonth(current.getMonth() + 1)));
};

const handleOpenModal = (event = null, day = null) => {
  setSelectedEvent(event);
  setSelectedDay(day);
  setModalOpen(true);
};

const handleCloseModal = () => {
  setSelectedEvent(null);
  setModalOpen(false);
};

const handleCategoryChange = (category) => {
  setSelectedCategory(category);
};

useEffect(() => {
  generateCalendar();
}, [current]);

return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 2, border: '1px solid #ddd', borderRadius: 2, backgroundColor: '#f9f9f9' }}>
    <CategoryFilter onChange={handleCategoryChange} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <Button variant="contained" onClick={handlePrevMonth}>Previous</Button>
        <Typography variant="h5">{format(current, 'MMMM yyyy')}</Typography>
        <Button variant="contained" onClick={handleNextMonth}>Next</Button>
    </Box>
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
            ? categoryColors[selectedCategory] || '#fff'
            : '#fff';

            return (
              <Grid item xs={12 / 7} key={index}>
                <Box
                  sx={{
                    padding: 2,
                    backgroundColor: bgColor,
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    textAlign: 'center',
                    position: 'relative',
                    cursor: 'pointer',
                    textDecoration: hasEvents ? 'underline' : 'none',  // Underline if there are events
                    '&:hover': {
                      backgroundColor: '#e0e0e0', // Greyish color on hover
                    },
                  }}
                  onClick={() => handleOpenModal(null, day)}
                >
                  {format(day, 'd')}
                </Box>
              </Grid>
            );
          })}
    </Grid>
    <IconButton
        color="primary"
        onClick={() => handleOpenModal()}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <AddIcon />
      </IconButton>
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
