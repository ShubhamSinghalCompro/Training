import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Grid, Tooltip } from '@mui/material';
import { format, startOfWeek, addDays, eachDayOfInterval, isBefore, isAfter } from 'date-fns';
import { Event, Category } from '../utils/types';
import { RootState } from '../utils/types';
import { categoryColors } from '../utils/categoryColors';

interface WeeklyViewProps {
  selectedDate: Date;
  openModal: (event: Event | null, day: Date | null) => void;
  selectedCategory: Category;
}

const WeeklyView: React.FC<WeeklyViewProps> = ({
  selectedDate,
  openModal,
  selectedCategory,
}) => {
  const events = useSelector((state: RootState) => state.events);
  const [showMore, setShowMore] = useState<{ [key: string]: boolean }>({});

  const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const end = addDays(start, 6);
  const days = eachDayOfInterval({ start, end });

  return (
    <Box>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        {`Week of ${format(start, 'MMMM d, yyyy')} - ${format(end, 'MMMM d, yyyy')}`}
      </Typography>
      <Grid container spacing={2}>
        {days.map((day) => {
          const dayStr = day.toDateString();
          const dayEvents = events.filter(
            (event) =>
              new Date(event.date).toDateString() === dayStr &&
              (selectedCategory === 'All' || event.category === selectedCategory)
          );

          const hasEvents = dayEvents.length > 0;
          const applicableCategories = dayEvents.map(event => event.category);
          const uniqueCategories = [...new Set(applicableCategories)];
          const isCurrentDate = day.toDateString() === new Date().toDateString();
          const hasCategoryEvents = selectedCategory !== 'All' && uniqueCategories.includes(selectedCategory);

          const bgColor = isCurrentDate && (!hasEvents || !hasCategoryEvents)
            ? '#e0f7fa'
            : selectedCategory !== 'All' && uniqueCategories.includes(selectedCategory)
            ? categoryColors[selectedCategory] + '80' || '#fff'
            : '#fff';

          const displayMore = dayEvents.length > 2 && !showMore[dayStr];

          return (
            <Grid item xs={12} sm={6} md={4} key={dayStr}>
              <Box
                sx={{
                  padding: 2,
                  border: '1px solid #ddd',
                  borderRadius: 1,
                  backgroundColor: bgColor,
                  textAlign: 'center',
                  '&:hover': {
                    backgroundColor: '#e0e0e0',
                  },
                }}
              >
                <Typography variant="h6" color="primary">
                  {`${format(day, 'EEEE')}, ${format(day, 'd')}`}
                </Typography>
                {hasEvents ? (
                  <>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, marginTop: 2 }}>
                      {dayEvents.slice(0, displayMore ? 2 : dayEvents.length).map((event) => (
                        <Tooltip title={`${event.title} ( ${event.startTime} - ${event.endTime})`} key={event.id}>
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: '50%',
                              backgroundColor: event.color,
                              cursor: 'pointer',
                            }}
                            onClick={() => openModal(event, new Date(event.date))}
                          />
                        </Tooltip>
                      ))}
                      {displayMore && (
                        <Typography
                          variant="body2"
                          sx={{ cursor: 'pointer', color: 'blue' }}
                          onClick={() => setShowMore({ ...showMore, [dayStr]: true })}
                        >
                          View More
                        </Typography>
                      )}
                    </Box>

                    {showMore[dayStr] && (
                      <Box sx={{ marginTop: 1 }}>
                        {dayEvents.map((event) => (
                          <Box
                            key={event.id}
                            sx={{
                              padding: 1,
                              backgroundColor: event.color,
                              borderRadius: 1,
                              cursor: 'pointer',
                              marginBottom: 1,
                            }}
                            onClick={() => openModal(event, new Date(event.date))}
                          >
                            <Typography>{event.title}</Typography>
                            <Typography variant="body2">
                            {`${event.startTime} - ${event.endTime}`}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </>
                ) : (
                  <Typography fontSize={14}>No events</Typography>
                )}
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default WeeklyView;
