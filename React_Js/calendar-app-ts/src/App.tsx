import React, { useEffect } from 'react';
import CalendarGrid from './components/CalendarGrid';
import { CssBaseline, Container } from '@mui/material';
import SnackbarNotification from './components/SnackbarNotification';
import { requestNotificationPermission } from './utils/requestNotificationPermission';



const App: React.FC = () => {
  useEffect(() => {
    requestNotificationPermission();
  }, []);
  return (
    <>
      <CssBaseline />
      <Container>
        <CalendarGrid />
        <SnackbarNotification />
      </Container>
    </>
  );
};

export default App;

