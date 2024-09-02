import React from 'react';
import CalendarGrid from './components/CalendarGrid';
import { CssBaseline, Container, Typography } from '@mui/material';

const App: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <Container>
        <CalendarGrid />
      </Container>
    </>
  );
};

export default App;

