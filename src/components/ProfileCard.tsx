import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  Chip,
  Link,
  Divider,
  Stack,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import LinkIcon from '@mui/icons-material/Link';
import EmailIcon from '@mui/icons-material/Email';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import type { GitHubUser } from '../types/github';

interface ProfileCardProps {
  user: GitHubUser;
}

export function ProfileCard({ user }: ProfileCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 2,
        overflow: 'visible',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: 3,
            mb: 3,
          }}
        >
          <Avatar
            src={user.avatar_url}
            alt={user.name || user.login}
            sx={{
              width: 120,
              height: 120,
              border: 4,
              borderColor: 'background.paper',
              boxShadow: 3,
            }}
          />
          
          <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              {user.name || user.login}
            </Typography>
            
            <Link
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.5,
                mb: 2,
                color: 'text.secondary',
              }}
            >
              <GitHubIcon fontSize="small" />
              @{user.login}
            </Link>

            {user.bio && (
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mb: 2, fontStyle: 'italic' }}
              >
                {user.bio}
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
              <Chip
                label={`${user.followers} Followers`}
                variant="outlined"
                size="small"
              />
              <Chip
                label={`${user.following} Following`}
                variant="outlined"
                size="small"
              />
              <Chip
                label={`${user.public_repos} Repos`}
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1.5}>
          {user.company && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BusinessIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {user.company}
              </Typography>
            </Box>
          )}

          {user.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOnIcon fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {user.location}
              </Typography>
            </Box>
          )}

          {user.email && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon fontSize="small" color="action" />
              <Link
                href={`mailto:${user.email}`}
                variant="body2"
                color="text.secondary"
                underline="hover"
              >
                {user.email}
              </Link>
            </Box>
          )}

          {user.blog && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LinkIcon fontSize="small" color="action" />
              <Link
                href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="body2"
                color="text.secondary"
                underline="hover"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user.blog}
              </Link>
            </Box>
          )}

          {user.twitter_username && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TwitterIcon fontSize="small" color="action" />
              <Link
                href={`https://twitter.com/${user.twitter_username}`}
                target="_blank"
                rel="noopener noreferrer"
                variant="body2"
                color="text.secondary"
                underline="hover"
              >
                @{user.twitter_username}
              </Link>
            </Box>
          )}

          <Box sx={{ pt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Joined GitHub {formatDate(user.created_at)}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
