import { useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Link,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import ForkRightIcon from '@mui/icons-material/ForkRight';
import CodeIcon from '@mui/icons-material/Code';
import { useAppContext } from '../context/AppContext';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { githubApi } from '../services/githubApi';
import type { GitHubRepo } from '../types/github';
import { ActionType } from '../context/action-types';

export function RepoList() {
  const { state, dispatch } = useAppContext();

  const loadMoreRepos = useCallback(async () => {
    if (!state.userData || state.loading || !state.hasMore) return;

    const nextPage = state.currentPage + 1;
    dispatch({ type: ActionType.SET_LOADING, payload: true });

    try {
      const newRepos = await githubApi.fetchRepos(
        state.userData.login,
        nextPage,
        10
      );
      
      if (newRepos.length === 0) {
        dispatch({ type: ActionType.SET_HAS_MORE, payload: false });
      } else {
        dispatch({ type: ActionType.APPEND_REPOS, payload: newRepos });
        dispatch({ type: ActionType.SET_CURRENT_PAGE, payload: nextPage });
        dispatch({ type: ActionType.SET_HAS_MORE, payload: newRepos.length === 10 });
      }
    } catch (error) {
      console.error('Failed to load more repos:', error);
    } finally {
      dispatch({ type: ActionType.SET_LOADING, payload: false });
    }
  }, [state.userData, state.loading, state.hasMore, state.currentPage, dispatch]);

  const loadMoreRef = useInfiniteScroll({
    loading: state.loading,
    hasMore: state.hasMore,
    onLoadMore: loadMoreRepos,
    threshold: 200,
  });

  if (state.repos.length === 0 && !state.loading) {
    return (
      <Alert severity="info" sx={{ borderRadius: 2 }}>
        No public repositories found.
      </Alert>
    );
  }

  return (
    <Box>
      <Stack spacing={2}>
        {state.repos.map((repo: GitHubRepo) => (
          <RepoCard key={repo.id} repo={repo} />
        ))}
      </Stack>

      {/* Infinite scroll */}
      <Box ref={loadMoreRef} sx={{ py: 2, textAlign: 'center' }}>
        {state.loading && <CircularProgress size={32} />}
        {!state.loading && state.hasMore && (
          <Typography variant="body2" color="text.secondary">
            Scroll for more...
          </Typography>
        )}
        {!state.hasMore && state.repos.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            No more repositories
          </Typography>
        )}
      </Box>
    </Box>
  );
}

interface RepoCardProps {
  repo: GitHubRepo;
}

function RepoCard({ repo }: RepoCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card
      elevation={2}
      sx={{
        borderRadius: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Link
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            sx={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'primary.main',
            }}
          >
            {repo.name}
          </Link>
        </Box>

        {repo.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            {repo.description}
          </Typography>
        )}

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center',
          }}
        >
          {repo.language && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CodeIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {repo.language}
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <StarIcon fontSize="small" sx={{ color: 'warning.main' }} />
            <Typography variant="body2" color="text.secondary">
              {repo.stargazers_count}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <ForkRightIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              {repo.forks_count}
            </Typography>
          </Box>

          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
            Updated {formatDate(repo.updated_at)}
          </Typography>
        </Box>

        {repo.topics && repo.topics.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
            {repo.topics.slice(0, 5).map((topic) => (
              <Chip
                key={topic}
                label={topic}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.75rem' }}
              />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
