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

const HeaderForm = ({ user }) => (
  <Box
    sx={{
      position: 'fixed',
      top: '95px',
      width: '85%',
      zIndex: 20,
      backgroundColor: 'background.paper',
      borderBottom: '1px solid',
      borderColor: 'divider',
      boxShadow: 1,
      left: '265px'
    }}
  >
    <Box sx={{ maxWidth: '8xl', mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, justifyContent: { md: 'space-between' } }}>
        <Box sx={{ mb: { xs: 2, md: 0 } }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            {user.name + " 's"}  Profile
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Find  All the   information  about  your Progress...
          </Typography>
        </Box>
      </Box>
    </Box>
  </Box>
);


const ProfilePage = () => {

    const {state:{user} , dispatch} =  useAuth()
  const [activeTab, setActiveTab] = useState('details');
  const isTeacher = false; // This would come from user context or props in a real app

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
       
    <Container maxWidth="100%">
     <HeaderForm user={user} />
      <Box sx={{ my: 4 }}>
        
        {/* <Paper elevation={3} sx={{ p: 2, mb: 3 , maxWidth:'95%'}}>
          <ProfileTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isTeacher={isTeacher} 
          />
        </Paper> */}
        
        <Paper elevation={3} sx={{ p: 2 , maxWidth:'95%' , marginTop:'120px' }}>
                    <Paper elevation={3} sx={{ p: 2, mb: 3 , maxWidth:'100%'}}>
          <ProfileTabs 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isTeacher={isTeacher} 
          />
        </Paper>
          {renderTabContent()}
        </Paper>
      </Box>
    </Container>
  );
};

export default ProfilePage;