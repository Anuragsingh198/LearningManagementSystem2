import React from 'react';
import { Box, Typography, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, Badge, IconButton } from '@mui/material';
import { Notifications as NotificationsIcon, Mail, Assignment, Forum } from '@mui/icons-material';

const Notifications = () => {
  // Sample notifications data
  const notifications = [
    {
      id: 1,
      type: 'message',
      title: 'New message from Alice',
      content: 'Hello, I have a question about the last assignment...',
      time: '10 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'assignment',
      title: 'Assignment submitted by Bob',
      content: 'React Fundamentals Quiz submitted for grading',
      time: '2 hours ago',
      read: true
    },
    {
      id: 3,
      type: 'forum',
      title: 'New forum post in Advanced React',
      content: 'Charlie posted a question about useEffect hooks',
      time: '1 day ago',
      read: true
    },
  ];

  const getIcon = (type) => {
    switch (type) {
      case 'message':
        return <Mail color="primary" />;
      case 'assignment':
        return <Assignment color="secondary" />;
      case 'forum':
        return <Forum color="info" />;
      default:
        return <NotificationsIcon />;
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Notifications</Typography>
        <Typography color="textSecondary">
          {notifications.filter(n => !n.read).length} unread
        </Typography>
      </Box>
      
      <List sx={{ width: '100%' }}>
        {notifications.map((notification, index) => (
          <React.Fragment key={notification.id}>
            <ListItem 
              alignItems="flex-start"
              secondaryAction={
                <Typography variant="caption" color="text.secondary">
                  {notification.time}
                </Typography>
              }
              sx={{
                backgroundColor: notification.read ? 'background.paper' : 'action.selected',
                borderRadius: 1
              }}
            >
              <ListItemAvatar>
                <Badge
                  color="error"
                  variant="dot"
                  invisible={notification.read}
                >
                  <Avatar sx={{ bgcolor: 'background.default' }}>
                    {getIcon(notification.type)}
                  </Avatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography 
                    fontWeight={notification.read ? 'normal' : 'bold'}
                    color={notification.read ? 'text.primary' : 'primary.main'}
                  >
                    {notification.title}
                  </Typography>
                }
                secondary={
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {notification.content}
                  </Typography>
                }
              />
            </ListItem>
            {index < notifications.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default Notifications;