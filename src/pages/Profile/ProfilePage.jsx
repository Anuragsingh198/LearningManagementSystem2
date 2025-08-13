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
    <Container  sx={{ p: 4 }}>
    

      <Paper  sx={{ }}>

        {renderTabContent()}

      </Paper>

    </Container>
  );
};

export default ProfilePage;
