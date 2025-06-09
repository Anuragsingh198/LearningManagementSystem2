import React from 'react';
import { Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Button, Divider, Chip } from '@mui/material';
import { PlayCircleOutline, CheckCircleOutline } from '@mui/icons-material';

const PendingVideos = () => {
  // Sample data - in a real app this would come from an API
  const pendingVideos = [
    {
      id: 1,
      title: 'React Hooks Deep Dive',
      course: 'Advanced React',
      duration: '15:30',
      dueDate: 'Due tomorrow'
    },
    {
      id: 2,
      title: 'Material UI Theming',
      course: 'UI Development',
      duration: '22:15',
      dueDate: 'Due in 3 days'
    },
    {
      id: 3,
      title: 'Node.js Authentication',
      course: 'Backend Development',
      duration: '18:45',
      dueDate: 'Due next week'
    },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Pending Videos
      </Typography>
      <Typography color="textSecondary" paragraph>
        You have {pendingVideos.length} videos to watch
      </Typography>
      
      <List sx={{ width: '100%' }}>
        {pendingVideos.map((video, index) => (
          <React.Fragment key={video.id}>
            <ListItem 
              secondaryAction={
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<PlayCircleOutline />}
                >
                  Watch Now
                </Button>
              }
            >
              <ListItemAvatar>
                <Avatar>
                  <PlayCircleOutline />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={video.title}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {video.course}
                    </Typography>
                    {` — ${video.duration}`}
                  </>
                }
              />
              <Chip 
                label={video.dueDate} 
                color={video.dueDate.includes('tomorrow') ? 'error' : 'warning'}
                variant="outlined"
                sx={{ ml: 2 }}
              />
            </ListItem>
            {index < pendingVideos.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
      
      <Box mt={4}>
        <Button 
          variant="outlined" 
          color="primary" 
          startIcon={<CheckCircleOutline />}
        >
          Mark All as Completed
        </Button>
      </Box>
    </Box>
  );
};

export default PendingVideos;