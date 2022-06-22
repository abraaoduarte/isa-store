import { Box, CircularProgress } from '@mui/material';

const LoadingProgress = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        padding: 6,
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingProgress;
