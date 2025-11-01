import { Alert, AlertTitle } from '@mui/material';

interface ErrorStateProps {
  message: string;
}

export function Error({ message }: ErrorStateProps) {
  return (
    <Alert severity="error" sx={{ borderRadius: 2 }}>
      <AlertTitle>Error</AlertTitle>
      {message}
    </Alert>
  );
}
