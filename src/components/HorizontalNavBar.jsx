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
  LaptopMinimalCheck,
  Users,
  Search,
  PlayCircle,
} from 'lucide-react';
import { Assignment } from '@mui/icons-material';
import { useAuth } from '../context/contextFiles/AuthContext';

const HorizontalNavContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  borderBottom: '1px solid #e5e7eb',
//   zIndex: 1100,
  padding: '4px 16px',
  overflowX: 'auto',
  height:'50px',
  whiteSpace: 'nowrap'
}));

const Nav = styled(List)({
  display: 'flex',
  flexDirection: 'row',
  padding: '2px 0 0 0',
  gap: '2px'
});

const StyledLink = styled(Link)(({ active }) => ({
  textDecoration: 'none',
  '& .MuiListItemButton-root': {
    borderRadius: '6px',
    padding: '2px 15px',
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
            <SidebarLink to="/dashboard" icon={<LayoutDashboard />} label="Dashboard" active={isActive('/dashboard')} />
            <SidebarLink to="/teacher/my-courses" icon={<BookOpen />} label="My Courses" active={isActive('/teacher/my-courses')} />
            <SidebarLink to="/assessments" icon={<LaptopMinimalCheck />} label="Assessments" active={isActive('/assessments')} />
            <SidebarLink to="/teacher/create-course" icon={<FolderPlus />} label="Create Course" active={isActive('/teacher/create-course')} />
            <Divider orientation="vertical" flexItem sx={{ borderColor: '#e5e7eb', margin: '8px 4px' }} />
            <SidebarLink to="/teacher/my-courses" icon={<Video />} label="Upload Videos" />
            <SidebarLink to="/profile" icon={<Users />} label="View Profile"active={isActive('/profile')} />
          </>
        ) : (
          <>
            <SidebarLink to="/dashboard" icon={<LayoutDashboard />} label="Dashboard" active={isActive('/dashboard')} />
            <SidebarLink to="/student/my-courses" icon={<BookOpen />} label="My Courses" active={isActive('/student/my-courses')} />
            <SidebarLink to="/assessments" icon={<LaptopMinimalCheck />} label="Assessments" active={isActive('/assessments')} />
            {/* <SidebarLink to="/student/my-courses" icon={<Assignment />} label="Assignments" active={isActive('/student/my-courses')} /> */}
            <Divider orientation="vertical" flexItem sx={{ borderColor: '#e5e7eb', margin: '8px 4px' }} />
            {/* <SidebarLink to="/student/my-courses" icon={<PlayCircle />} label="Continue Learning" /> */}
            <SidebarLink to="/profile" icon={<Users />} label="View Profile" active={isActive('/profile')}/>
          </>
        )}
      </Nav>
    </HorizontalNavContainer>
  );
};

const SidebarLink = ({ to, icon, label, active }) => (
  <StyledLink to={to} active={active ? 1 : 0}>
    <ListItem disablePadding>
      <ListItemButton sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height:'30px' }}>
        <ListItemIcon sx={{ minWidth: 'auto', color: active ? '#6366f1' : 'black' }}>
          {React.cloneElement(icon, { fontSize: '10px' })}
        </ListItemIcon>
        <ListItemText primary={label} sx={{ '& .MuiTypography-root': { fontSize: '0.7rem', fontWeight: '600' },  color: active ? '#6366f1' : 'black'}} />
      </ListItemButton>
    </ListItem>
  </StyledLink>
);

export default HorizontalNavBar;