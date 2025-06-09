import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/contextFiles/AuthContext';
import { Loader } from 'lucide-react';

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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1300,
        }}
      >
        <Header />
      </Box>
      <Box sx={{ display: 'flex', mt: '64px', width: '100%' }}>
        <Box
          component="nav"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            position: 'fixed',
            top: '64px',
            left: 0,
            height: 'calc(100vh - 64px)',
            bgcolor: '#404042',
            zIndex: 1200,
          }}
        >
          <Sidebar currentPath={pathname} />
        </Box>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            display: 'flex',
            p: 3,
            justifyContent: 'center',
            ml: `${drawerWidth}px`,
            bgcolor: '#f5f5f5',
            minHeight: 'calc(100vh - 64px)',
            width: `calc(100% - ${drawerWidth}px)`,
            overflowY: 'auto',
            position: 'fixed'
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
