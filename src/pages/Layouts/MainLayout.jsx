import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/contextFiles/AuthContext';
import { Loader } from 'lucide-react';
import HorizontalNavBar from '../../components/HorizontalNavBar';

const drawerWidth = 240;

export default function Layout({ children }) {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const { state: { user, loading }, dispatch } = useAuth();

  useEffect(() => {
    console.log("this is the user from mainLayout:", user);
    if (!user && !loading) {
      navigate('/auth/login');
    }
  }, [user, loading, navigate]);

    return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      width: '100vw', // Use viewport width instead of 100%
      overflowX: 'hidden' // Prevent horizontal scrolling
    }}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        width: '100%'
      }}>
        <Header />
        <HorizontalNavBar/>
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        flex: 1, // Take up remaining space
        width: '100%'
      }}>
        <Box
          component="main"
          sx={{
            flex: 1,
            p: 4,
            bgcolor: '#f5f5f5',
            width: '100%',
            minWidth: 0 // Prevent flex items from overflowing
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );

}
