import React, { useState } from 'react';
import { Box, Typography, Paper, Container } from '@mui/material';
import UserDetails from '../../components/Profile/UserDetails';
import PendingVideos from '../../components/Profile/VideosPending';
import ProgressTable from '../../components/Profile/ProgressTable';
import CompletedCourses from '../../components/Profile/CompletedCourses';
import StudentList from '../../components/Profile/StudentList';
import Notifications from '../../components/Profile/Notifications';
import ProfileTabs from '../../components/Profile/ProfileTabs';
import { useAuth } from '../../context/contextFiles/AuthContext';

const ProfilePage = () => {
  const {
    state: { user },
  } = useAuth();
  const [activeTab, setActiveTab] = useState('details');
  const isTeacher = false;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'details':
        return <UserDetails />;
      case 'pending':
        return <PendingVideos />;
      case 'progress':
        return <ProgressTable />;
      case 'completed':
        return <CompletedCourses />;
      case 'students':
        return <StudentList />;
      case 'notifications':
        return <Notifications />;
      default:
        return <UserDetails />;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ p: 4 , backgroundColor: 'background.paper', borderRadius: 10}}>
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 'bold', color: 'text.primary' }}
          >
            {user?.name}'s Profile
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mt: 1 }}>
            View and edit your details
          </Typography>
        </Box>
      </Box>

     <Paper elevation={0} sx={{ border: '2px solid #ddd', p: 2, borderRadius: 5 }}>
  
  {renderTabContent()}
  
</Paper>

    </Container>
  );
};

export default ProfilePage;
