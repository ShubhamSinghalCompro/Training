// SnackbarNotification.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Snackbar, Alert } from '@mui/material';
import { hideSnackbar } from '../store/snackbarSlice';
import { RootState } from '../utils/types';

const SnackbarNotification: React.FC = () => {
  const dispatch = useDispatch();
  const { open, message, color } = useSelector((state: RootState) => state.snackbar);

  const handleClose = () => {
    dispatch(hideSnackbar());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Set to top center
    >
      <Alert severity={color} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarNotification;
