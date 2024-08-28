import React from 'react';
import CalendarGrid from './components/CalendarGrid';
import { CssBaseline, Container, Typography } from '@mui/material';

const App: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <Container>
        <Typography variant="h3" gutterBottom align="center">
          Event Scheduler
        </Typography>
        <CalendarGrid />
      </Container>
    </>
  );
};

export default App;

