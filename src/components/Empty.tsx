import { Typography, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export function Empty() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 6,
        textAlign: 'center',
        backgroundColor: 'background.default',
        borderRadius: 2,
      }}
    >
      <SearchIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Search for a GitHub User
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Enter a username in the search bar above to get started
      </Typography>
    </Paper>
  );
}
