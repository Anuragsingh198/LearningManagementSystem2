import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
} from 'lucide-react';
import { Assignment } from '@mui/icons-material';
import { useAuth } from '../context/contextFiles/AuthContext';

const HorizontalNavContainer = styled(Box)(({ theme }) => ({
//   width: '100%',
//   position: 'fixed',
//   top: '64px',
//   left: 0,
//   right: 0,
  backgroundColor: 'white',
  borderBottom: '1px solid #e5e7eb',
//   zIndex: 1100,
  padding: '4px 16px',
  overflowX: 'auto',
  whiteSpace: 'nowrap'
}));

const Nav = styled(List)({
  display: 'flex',
  flexDirection: 'row',
  padding: '4px 0 0 0',
  gap: '2px'
});

const StyledLink = styled(Link)(({ active }) => ({
  textDecoration: 'none',
  '& .MuiListItemButton-root': {
    borderRadius: '6px',
    padding: '2px 20px',
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

const HorizontalNavBar = () => {
  const { state: { user } } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;
  const role = user?.role;

  const isActive = (path) => pathname.startsWith(path);

  return (
    <HorizontalNavContainer>
      <Nav component="nav">
        {role === 'instructor' ? (
          <>
            <SidebarLink to="/teacher/dashboard" icon={<LayoutDashboard />} label="Dashboard" active={isActive('/teacher/dashboard')} />
            <SidebarLink to="/teacher/my-courses" icon={<BookOpen />} label="My Courses" active={isActive('/teacher/my-courses')} />
            <SidebarLink to="/teacher/create-course" icon={<FolderPlus />} label="Create Course" active={isActive('/teacher/create-course')} />
            <Divider orientation="vertical" flexItem sx={{ borderColor: '#e5e7eb', margin: '8px 4px' }} />
            <SidebarLink to="/teacher/my-courses" icon={<Video />} label="Upload Videos" />
            <SidebarLink to="/profile" icon={<Users />} label="View Profile" />
          </>
        ) : (
          <>
            <SidebarLink to="/student/dashboard" icon={<LayoutDashboard />} label="Dashboard" active={isActive('/student/dashboard')} />
            <SidebarLink to="/student/browse-courses" icon={<Search />} label="Browse Courses" active={isActive('/student/browse-courses')} />
            <SidebarLink to="/student/my-courses" icon={<Assignment />} label="Assignments" active={isActive('/student/my-courses')} />
            <Divider orientation="vertical" flexItem sx={{ borderColor: '#e5e7eb', margin: '8px 4px' }} />
            <SidebarLink to="/student/my-courses" icon={<PlayCircle />} label="Continue Learning" />
            <SidebarLink to="/profile" icon={<Users />} label="View Profile" />
          </>
        )}
      </Nav>
    </HorizontalNavContainer>
  );
};

const SidebarLink = ({ to, icon, label, active }) => (
  <StyledLink to={to} active={active ? 1 : 0}>
    <ListItem disablePadding>
      <ListItemButton sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <ListItemIcon sx={{ minWidth: 'auto', color: active ? '#6366f1' : '#9ca3af' }}>
          {React.cloneElement(icon, { fontSize: 'small' })}
        </ListItemIcon>
        <ListItemText primary={label} sx={{ '& .MuiTypography-root': { fontSize: '0.75rem' } }} />
      </ListItemButton>
    </ListItem>
  </StyledLink>
);

export default HorizontalNavBar;