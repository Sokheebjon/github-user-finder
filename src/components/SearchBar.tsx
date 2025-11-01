import React, { useState, useCallback } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useDebounce } from '../hooks/useDebounce';
import { useAppContext } from '../context/AppContext';
import { githubApi } from '../services/githubApi';
import { ActionType } from '../context/action-types';

export function SearchBar() {
  const { state, dispatch } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchUserData = useCallback(
    async (username: string) => {
      if (!username.trim()) {
        dispatch({ type: ActionType.RESET_STATE });
        return;
      }

      dispatch({ type: ActionType.SET_LOADING, payload: true });
      dispatch({ type: ActionType.SET_ERROR, payload: null });

      try {
        // Fetch user data
        const userData = await githubApi.fetchUser(username);
        dispatch({ type: ActionType.SET_USER_DATA, payload: userData });

        // Fetch first page of repos
        const repos = await githubApi.fetchRepos(username, 1, 10);
        dispatch({ type: ActionType.SET_REPOS, payload: repos });
        dispatch({ type: ActionType.SET_CURRENT_PAGE, payload: 1 });
        dispatch({ type: ActionType.SET_HAS_MORE, payload: repos.length === 10 });
      } catch (error: any) {
        const errorMessage =
          error.response?.status === 404
            ? 'User not found. Please check the username and try again.'
            : 'Failed to fetch user data. Please try again later.';
        dispatch({ type: ActionType.SET_ERROR, payload: errorMessage });
        dispatch({ type: ActionType.RESET_STATE });
      } finally {
        dispatch({ type: ActionType.SET_LOADING, payload: false });
      }
    },
    [dispatch]
  );

  React.useEffect(() => {
    fetchUserData(debouncedSearchTerm);
  }, [debouncedSearchTerm, fetchUserData]);

  const handleClear = () => {
    setSearchTerm('');
    dispatch({ type: ActionType.RESET_STATE });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 2,
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Enter GitHub username (e.g., octocat)"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        disabled={state.loading}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton
                aria-label="clear search"
                onClick={handleClear}
                edge="end"
                size="small"
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
          },
        }}
      />
    </Paper>
  );
}
