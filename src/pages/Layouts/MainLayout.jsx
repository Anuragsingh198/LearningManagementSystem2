import React, { useEffect } from 'react';
import { Box, Typography, useTheme, IconButton, Stack, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/contextFiles/AuthContext';
import { Loader } from 'lucide-react';
import HorizontalNavBar from '../../components/HorizontalNavBar';
import {
  Facebook,
  Twitter,
  Google,
  YouTube,
  LinkedIn,
} from '@mui/icons-material';
import { useCourseContext } from '../../context/contextFiles/CourseContext';
import { getCoursesAction, getMyCoursesAction } from '../../context/Actions/courseActions';

const drawerWidth = 240;

export default function Layout({ children }) {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const { state: { isAuthenticated } } = useAuth();
  const { state: { courses, loading, error, myCourses }, dispatch } = useCourseContext();
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log('in use effect of mainlayout.jsx')
        await getCoursesAction(dispatch);
        await getMyCoursesAction(dispatch);

      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };

    fetchCourses();
  }, []);
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
        {isAuthenticated ? <HorizontalNavBar />: ''}
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
          backgroundColor: '#ffffff',
          color: '#fff',
          py: 3,
          textAlign: 'center',
        }}
      >
        {/* <Typography variant="h4" color="#1976D2" gutterBottom sx={{ fontWeight: 'bold' }}>
          Digividya
        </Typography> */}



      <Typography variant="subtitle1" color="#1976D2" sx={{ maxWidth: 700, mx: 'auto' }}>
  © 2025 DigiVidya | Made with{' '}
  <Box component="span" sx={{ color: 'red', fontSize: 20 }}>❤</Box> by Gopal, Anurag, and Adi
</Typography>

        <Typography variant="body2" color="#1976D2"  >
          www.ielektron.com
        </Typography>
      </Box>
    </Box>
  );

}
