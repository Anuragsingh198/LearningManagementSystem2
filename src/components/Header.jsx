import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  InputBase,
  Badge,
  useTheme,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

export default function Header() {
  const theme = useTheme();
  const [searchText, setSearchText] = useState('');

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        borderBottom: `1px solid ${theme.palette.divider}`,
        height: 80,
        display: 'flex',
        justifyContent: 'center',
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 2, md: 4 },
        }}
      >
        {/* Left: Logo and Title */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mr: 3,
            textDecoration: 'none',
          }}
          component="a"
          href="/"
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              lineHeight: 1.2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
              }}
            >
              EDULearn
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                letterSpacing: 0.5,
              }}
            >
              Learning Management System
            </Typography>
          </Box>
        </Box>

        {/* Center: Search Bar */}
        <Box
          sx={{
            flex: 1,
            maxWidth: 600,
            mx: { xs: 1, sm: 3 },
            display: { xs: 'none', sm: 'flex' },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: theme.palette.action.hover,
              borderRadius: '8px',
              px: 2,
              py: 0.5,
              width: '100%',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: theme.palette.action.selected,
              },
            }}
          >
            <SearchIcon sx={{ color: theme.palette.text.disabled, mr: 1 }} />
            <InputBase
              value={searchText}
              onChange={handleSearchChange}
              placeholder="Search courses, materials..."
              sx={{
                flex: 1,
                fontSize: '0.875rem',
                '& input::placeholder': {
                  opacity: 0.8,
                  color: theme.palette.text.disabled,
                },
              }}
            />
          </Box>
        </Box>

        {/* Right: Icons and Profile */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, sm: 2 },
          }}
        >
          <IconButton
            size="medium"
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <Badge badgeContent={4} color="error">
              <NotificationsIcon fontSize="medium" />
            </Badge>
          </IconButton>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              ml: 1,
              cursor: 'pointer',
              '&:hover': {
                opacity: 0.9,
              },
            }}
          >
            <Avatar
              alt="User Profile"
              src="/profile.jpg"
              sx={{
                width: 36,
                height: 36,
                border: '2px solid',
                borderColor: theme.palette.divider,
              }}
            />
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 500,
                display: { xs: 'none', sm: 'block' },
              }}
            >
              John Doe
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}