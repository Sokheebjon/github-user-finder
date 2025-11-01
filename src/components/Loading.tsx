import { Box, CircularProgress, Typography } from '@mui/material';

export function Loading() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        gap: 2,
      }}
    >
      <CircularProgress size={48} />
      <Typography variant="body1" color="text.secondary">
        Loading GitHub data...
      </Typography>
    </Box>
  );
}
