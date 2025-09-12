import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
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
        console.log('error is here')
        await getCoursesAction(dispatch);
        console.log('error is not here')

        await getMyCoursesAction(dispatch);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100vw',              // ensure full viewport width
      overflowX: 'hidden',         // avoid unwanted horizontal scroll
      backgroundColor: '#FFFFFF',
    }}
  >
    {/* Header */}
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      <Header />
      {isAuthenticated && <HorizontalNavBar />}
    </Box>

    {/* Main content area */}
    <Box
      component="main"
      sx={{
        flex: 1,
        mt: '120px',
        p: 1,
        bgcolor: '#fff',
        width: '100%',
      }}
    >
      {children}
    </Box>

    {/* Footer */}
    <Box
      component="footer"
      sx={{
        backgroundColor: '#ffffff',
        py: 2,
        textAlign: 'center',
        width: '100%',
      }}
    >
      <Typography
        variant="subtitle1"
        color="#1976D2"
        sx={{ maxWidth: 700, mx: 'auto' }}
      >
        © 2025 DigiVidya | Made with{' '}
        <Box component="span" sx={{ color: 'red', fontSize: 20 }}>
          ❤
        </Box>{' '}
        by Gopal, Anurag, Adi and Sreeraaj
      </Typography>

      <Typography variant="body2" color="#1976D2">
        www.ielektron.com
      </Typography>
    </Box>
  </Box>
);

}