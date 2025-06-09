import React from 'react';
import { Box, Typography, Avatar, Grid, Divider, Button } from '@mui/material';
import { Email, Phone, LocationOn, Edit } from '@mui/icons-material';

const UserDetails = () => {
  // In a real app, this would come from user context or API
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    bio: 'Software developer and online course enthusiast. Passionate about learning new technologies and sharing knowledge.',
    avatar: '/path/to/avatar.jpg',
    joinDate: 'January 2022',
    coursesTaken: 15,
    lastActive: '2 hours ago'
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar 
              src={user.avatar} 
              alt={user.name} 
              sx={{ width: 150, height: 150, mb: 2 }}
            />
            <Typography variant="h5" gutterBottom>
              {user.name}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              Member since {user.joinDate}
            </Typography>
            <Button 
              variant="outlined" 
              startIcon={<Edit />}
              sx={{ mt: 2 }}
            >
              Edit Profile
            </Button>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            About
          </Typography>
          <Typography paragraph>
            {user.bio}
          </Typography>
          
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" gutterBottom>
            Contact Information
          </Typography>
          
          <Box display="flex" alignItems="center" mb={1}>
            <Email color="action" sx={{ mr: 1 }} />
            <Typography>{user.email}</Typography>
          </Box>
          
          <Box display="flex" alignItems="center" mb={1}>
            <Phone color="action" sx={{ mr: 1 }} />
            <Typography>{user.phone}</Typography>
          </Box>
          
          <Box display="flex" alignItems="center" mb={1}>
            <LocationOn color="action" sx={{ mr: 1 }} />
            <Typography>{user.location}</Typography>
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="subtitle1">Courses Taken</Typography>
              <Typography variant="h5">{user.coursesTaken}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1">Last Active</Typography>
              <Typography variant="h5">{user.lastActive}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDetails;