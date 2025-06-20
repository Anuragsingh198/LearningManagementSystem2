import React, { useEffect } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
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
  const { state: { loading, isAuthenticated }, dispatch } = useAuth();

  // useEffect(() => {
  //   console.log("this is the use effect from mainLayout:");
  //   if (!isAuthenticated) {
  //     console.log('this if condition')
  //     navigate('/login');
  //   }
  //   // else{
  //   //   navigate('/student/dashboard')
  //   // }
  // }, [loading, navigate]);

  if(loading){
    return <div>loading...</div>
  }

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
       <Box
        component="footer"
        sx={{
          textAlign: 'center',
          py: 2,
          bgcolor: '#DCDCDC',
          borderTop: '1px solid #e0e0e0'
        }}
      >
        <Typography variant="body2" color="text.secondary" >
          © 2025 DigiVidya | Built with ❤ by Gopal, Anurag, and Adi
        </Typography>
      </Box>
    </Box>
  );

}
