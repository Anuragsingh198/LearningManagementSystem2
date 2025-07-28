import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  styled
} from '@mui/material';
import {
  LayoutDashboard,
  BookOpen,
  FolderPlus,
  Video,
  Users,
  Search,
  PlayCircle,
  Loader,
} from 'lucide-react';
import { Assignment } from '@mui/icons-material';
import { useAuth } from '../context/contextFiles/AuthContext';

const SidebarContainer = styled(Box)(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.up('lg')]: {
    display: 'flex',
    flexDirection: 'column',
    width: '256px',
    position: 'fixed',
    top: 0,
    bottom: 0,
    borderRight: '1px solid #e5e7eb',
    paddingTop: '96px',
    backgroundColor: 'white'
  }
}));

const NavContainer = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto'
});

const Nav = styled(List)({
  flex: 1,
  padding: '8px',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
});

const StyledLink = styled(Link)(({ active }) => ({
  textDecoration: 'none',
  '& .MuiListItemButton-root': {
    borderRadius: '6px',
    padding: '8px 12px',
    ...(active ? {
      backgroundColor: '#e0e7ff',
      '& .MuiTypography-root': {
        color: '#4338ca',
        fontWeight: 600
      },
      '& .MuiSvgIcon-root': {
        color: '#6366f1'
      }
    } : {
      color: '#4b5563',
      '&:hover': {
        backgroundColor: '#f9fafb',
        '& .MuiTypography-root': {
          color: '#111827'
        },
        '& .MuiSvgIcon-root': {
          color: '#6b7280'
        }
      }
    })
  }
}));

const SectionTitle = styled(Typography)({
  padding: '8px 12px',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: '#6b7280',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
});

const Sidebar = () => {
  const {
    state: { user , loading, isAuthenticated}, dispatch
  } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const role = user?.role;

  const isActive = (path) => pathname.startsWith(path);

   useEffect(() => {
    if (!isAuthenticated) { 
        navigate('/auth/login');
        }       
    }, [isAuthenticated,dispatch , user]);

    if(loading) return <Loader/>
  return (
    
    <SidebarContainer>
      <NavContainer>
        <Nav component="nav">
          {role === 'instructor' ? (
            <>
              <SidebarLink to="/teacher/dashboard" icon={<LayoutDashboard />} label="Dashboard" active={isActive('/teacher/dashboard')} />
              <SidebarLink to="/teacher/my-courses" icon={<BookOpen />} label="My Courses" active={isActive('/teacher/my-courses')} />
              <SidebarLink to="/teacher/create-course" icon={<FolderPlus />} label="Create Course" active={isActive('/teacher/create-course')} />

              <Divider sx={{ marginTop: '16px', borderColor: '#e5e7eb' }} />
              <SectionTitle>Quick Actions</SectionTitle>
              <SidebarLink to="/teacher/my-courses" icon={<Video />} label="Upload Videos"/>
              <SidebarLink to="/profile" icon={<Users />} label="View Profile" />
            </>
          ) : (
            <>
              <SidebarLink to="/student/dashboard" icon={<LayoutDashboard />} label="Dashboard" active={isActive('/student/dashboard')} />
              <SidebarLink to="/student/browse-courses" icon={<Search />} label="Browse Courses" active={isActive('/student/browse-courses')} />
              <SidebarLink to="/student/my-courses" icon={<Assignment />} label="Assignments & Bookmarks" active={isActive('/student/my-courses')} />

              <Divider sx={{ marginTop: '16px', borderColor: '#e5e7eb' }} />
              <SectionTitle>Quick Access</SectionTitle>
              <SidebarLink to="/student/my-courses" icon={<PlayCircle />} label="Continue Learning" />
              <SidebarLink to="/profile" icon={<Users />} label="View Profile" />
            </>
          )}
        </Nav>
      </NavContainer>
    </SidebarContainer>
  );
};

const SidebarLink = ({ to, icon, label, active }) => (
  <StyledLink to={to} active={active ? 1 : 0}>
    <ListItem disablePadding>
      <ListItemButton>
        <ListItemIcon sx={{ minWidth: '36px', color: active ? '#6366f1' : '#9ca3af' }}>
          {React.cloneElement(icon, { fontSize: 'small' })}
        </ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  </StyledLink>
);

export default Sidebar;