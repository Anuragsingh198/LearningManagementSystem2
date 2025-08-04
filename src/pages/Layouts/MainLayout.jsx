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
        await getCoursesAction(dispatch);
        await getMyCoursesAction(dispatch);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      width: '100vw',
      backgroundColor:'#FFFFFF',
    }}>
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}>
        <Header />
        {isAuthenticated && <HorizontalNavBar />}
      </Box>

      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems:'center',
        mt: '120px',
        width:'100%',
        mb: 2, 
        // px:3,
        
      }}>
        <Box
          component="main"
          sx={{
            flex: 1,
            p:1,
            bgcolor: '#f5f5f5',
            width: '100%',
          }}
        >
          {children}
        </Box>
      </Box>
      
      {/* Footer Section */}
      <Box
        component="footer"
        sx={{
          backgroundColor: '#ffffff',
          color: '#fff',
          py: 2,
          textAlign: 'center',
          width: '100%',
        }}
      >
        <Typography variant="subtitle1" color="#1976D2" sx={{ maxWidth: 700, mx: 'auto' }}>
          © 2025 DigiVidya | Made with{' '}
          <Box component="span" sx={{ color: 'red', fontSize: 20 }}>❤</Box> by Gopal, Anurag, and Adi
        </Typography>

        <Typography variant="body2" color="#1976D2">
          www.ielektron.com
        </Typography>
      </Box>
    </Box>
  );
}