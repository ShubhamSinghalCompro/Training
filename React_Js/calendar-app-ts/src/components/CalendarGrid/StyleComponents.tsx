import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

// Styled components
export const StyledContainer = styled(Box)(({ theme }) => ({
    maxWidth: 1200,
    maxHeight: '95vh',
    margin: '10px auto',
    padding: 2,
    border: `2px solid ${theme.palette.grey[800]}`,
    borderRadius: 2,
    backgroundColor: theme.palette.background.default,
    overflowY: 'auto',
    overflowX: 'auto',
  }));
  