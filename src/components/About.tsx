import { Box, Typography } from '@mui/material';
import { useAppContext } from '../context/AppContext';

export function About() {
    const { state } = useAppContext();
    return (
            <Box sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        About {state.userData?.name || state.userData?.login}
                    </Typography>
                {state.userData?.bio && (
                    <Typography variant="body1" paragraph>
                        {state.userData?.bio}
                    </Typography>
                )}
                    <Typography variant="body2" color="text.secondary">
                      <strong>Username:</strong> {state.userData?.login}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Public Repositories:</strong> {state.userData?.public_repos}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Public Gists:</strong> {state.userData?.public_gists}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Followers:</strong> {state.userData?.followers}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Following:</strong> {state.userData?.following}
                    </Typography>
            </Box>
    );
}