import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';

const ProfileTabs = ({ activeTab, setActiveTab, isTeacher }) => {
  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={activeTab} onChange={handleChange} aria-label="profile tabs">
        <Tab label="Details" value="details" />
        <Tab label="Pending Videos" value="pending" />
        <Tab label="Progress" value="progress" />
        <Tab label="Completed Courses" value="completed" />
        {isTeacher && (
          <>
            <Tab label="Students" value="students" />
            <Tab label="Notifications" value="notifications" />
          </>
        )}
      </Tabs>
    </Box>
  );
};

export default ProfileTabs;