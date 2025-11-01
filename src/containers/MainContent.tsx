import { useMemo, useState } from 'react';
import {
  ThemeProvider,
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import GitHubIcon from '@mui/icons-material/GitHub';
import { useAppContext } from '../context/AppContext';
import { SearchBar } from '../components/SearchBar';
import { ProfileCard } from '../components/ProfileCard';
import { RepoList } from '../components/RepoList';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';
import { Empty } from '../components/Empty';
import { About } from '../components/About';
import { createAppTheme } from '../config/theme';
import { ActionType } from '../context/action-types';

export function MainContent() {
  const { state, dispatch } = useAppContext();
  const [activeTab, setActiveTab] = useState(0);

  const theme = useMemo(() => createAppTheme(state.darkMode), [state.darkMode]);

  const handleToggleDarkMode = () => {
    dispatch({ type: ActionType.TOGGLE_DARK_MODE });
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        {/* App Bar */}
        <AppBar position="static" elevation={2}>
          <Toolbar>
            <GitHubIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="h1" sx={{ flexGrow: 1, fontWeight: 600 }}>
              GitHub User Finder
            </Typography>
            <IconButton
              color="inherit"
              onClick={handleToggleDarkMode}
              aria-label="toggle dark mode"
            >
              {state.darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <SearchBar />

          {state.error && <Error message={state.error} />}

          {!state.userData && !state.loading && !state.error && <Empty />}

          {state.loading && !state.userData && <Loading />}

          {state.userData && !state.error && (
            <Box>
              <ProfileCard user={state.userData} />

              <Box sx={{ mt: 3 }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  aria-label="user info tabs"
                  sx={{ mb: 3 }}
                >
                  <Tab label={`Repositories (${state.userData.public_repos})`} />
                  <Tab label="About" />
                </Tabs>

                {activeTab === 0 && <RepoList />}

                {activeTab === 1 && (
                  <About />
                )}
              </Box>
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );    
}