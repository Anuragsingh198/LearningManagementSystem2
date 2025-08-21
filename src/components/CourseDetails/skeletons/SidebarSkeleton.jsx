import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, Skeleton } from '@mui/material';

export const SidebarSkeleton = () => {
  return (
    <Box sx={{
      width: '100%',
      bgcolor: 'background.paper',
      p: 2,
      mt: 2,
      border: '1px solid #ccc',
      borderRadius: '4px',
      boxShadow: 'none',
      height: 'fit-content'
    }}>
      {/* Course Content Header */}
      <Skeleton variant="text" width="60%" height={32} sx={{ mb: 1 }} />

      {/* Subtle line below the heading */}
      <Box sx={{
        height: '1px',
        width: '25%',
        mb: 2,
        background: 'gray',
        borderRadius: 1,
        opacity: 0.6,
      }} />

      {/* Navigation Tabs Skeleton */}
      <List>
        {/* Videos Tab */}
        <ListItem disablePadding>
          <ListItemButton sx={{
            mb: '6px',
            border: '1px solid #cfcfcf',
            borderRadius: '6px',
            bgcolor: 'transparent',
            boxShadow: 'none',
          }}>
            <ListItemIcon sx={{ color: 'text.secondary' }}>
              <Skeleton variant="circular" width={24} height={24} />
            </ListItemIcon>
            <Skeleton variant="text" width="80%" height={20} />
          </ListItemButton>
        </ListItem>

        {/* Articles Tab */}
        <ListItem disablePadding>
          <ListItemButton sx={{
            mb: '6px',
            border: '1px solid #cfcfcf',
            borderRadius: '6px',
            bgcolor: 'transparent',
            boxShadow: 'none',
          }}>
            <ListItemIcon sx={{ color: 'text.secondary' }}>
              <Skeleton variant="circular" width={24} height={24} />
            </ListItemIcon>
            <Skeleton variant="text" width="85%" height={20} />
          </ListItemButton>
        </ListItem>

        {/* Quiz Tab */}
        <ListItem disablePadding>
          <ListItemButton sx={{
            mb: '6px',
            border: '1px solid #cfcfcf',
            borderRadius: '6px',
            bgcolor: 'transparent',
            boxShadow: 'none',
          }}>
            <ListItemIcon sx={{ color: 'text.secondary' }}>
              <Skeleton variant="circular" width={24} height={24} />
            </ListItemIcon>
            <Skeleton variant="text" width="90%" height={20} />
          </ListItemButton>
        </ListItem>
      </List>

      {/* Video List Section */}
      <Box sx={{ mt: 2 }}>
        <Skeleton variant="text" width="30%" height={16} sx={{ mb: 1 }} />

        {/* Subtle line */}
        <Box sx={{
          height: '1px',
          width: '9%',
          mb: 2,
          background: 'gray',
          borderRadius: 1,
          opacity: 0.6,
        }} />

        <List>
          {[...Array(4)].map((_, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton sx={{
                mb: '6px',
                border: '1px solid #cfcfcf',
                borderRadius: '6px',
                bgcolor: 'transparent',
                boxShadow: 'none',
              }}>
                <ListItemIcon sx={{
                  color: 'text.secondary',
                  minWidth: '32px',
                }}>
                  <Skeleton variant="circular" width={24} height={24} />
                </ListItemIcon>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Skeleton variant="text" width={`${90 - index * 10}%`} height={20} />
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};
