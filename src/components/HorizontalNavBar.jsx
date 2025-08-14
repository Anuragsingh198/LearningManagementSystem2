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
  styled
} from '@mui/material';
import {
  LayoutDashboard,
  BookOpen,
  FolderPlus,
  Video,
  LaptopMinimalCheck,
  Users
} from 'lucide-react';
import { useAuth } from '../context/contextFiles/AuthContext';

// Colors
const primaryMain = '#1976d2';
const primaryDark = '#004ba0';
const primaryLight = '#63a4ff';

// Load Inter font globally in index.html
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">

const HorizontalNavContainer = styled(Box)(() => ({
  backgroundColor: 'white',
  borderBottom: '1px solid rgba(0,0,0,0.05)',
  padding: '0 16px',
  overflowX: 'auto',
  height: '60px',
  display: 'flex',
  alignItems: 'center'
}));

const Nav = styled(List)({
  display: 'flex',
  flexDirection: 'row',
  padding: 0,
  margin: 0,
  gap: '24px'
});

const StyledLink = styled(Link)(({ active }) => ({
  textDecoration: 'none',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  transition: 'color 0.3s ease',
  '& .MuiListItemButton-root': {
    padding: 0,
    background: 'transparent',
    '&:hover': {
      background: 'transparent'
    }
  },
  '& .MuiTypography-root': {
    fontSize: '0.75rem',
    letterSpacing: '1px',
    fontWeight: 500,
    color: active ? primaryMain : '#222',
    textTransform: 'uppercase',
    transition: 'color 0.3s ease'
  },
  '& svg': {
    color: active ? primaryMain : '#555',
    transition: 'color 0.3s ease, transform 0.3s ease',
    marginRight: '6px'
  },
  '&:hover .MuiTypography-root': {
    color: primaryMain
  },
  '&:hover svg': {
    color: primaryMain,
    transform: 'translateY(-1px)'
  },
  // underline animation
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-4px',
    left: 0,
    width: active ? '100%' : '0%',
    height: '2px',
    backgroundColor: primaryMain,
    transition: 'width 0.3s ease'
  },
  '&:hover::after': {
    width: '100%'
  }
}));

const HorizontalNavBar = () => {
  const {
    state: { user }
  } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;
  const role = user?.role;

  const isActive = (path) => pathname.startsWith(path);

  return (
    <HorizontalNavContainer>
      <Nav component="nav">
        {role === 'instructor' ? (
          <>
            <SidebarLink
              to="/dashboard"
              icon={<LayoutDashboard size={16} />}
              label="Dashboard"
              active={isActive('/dashboard')}
            />
            <SidebarLink
              to="/teacher/my-courses"
              icon={<BookOpen size={16} />}
              label="My Courses"
              active={isActive('/teacher/my-courses')}
            />
            <SidebarLink
              to="/assessments"
              icon={<LaptopMinimalCheck size={16} />}
              label="Assessments"
              active={isActive('/assessments')}
            />
            <SidebarLink
              to="/teacher/create-course"
              icon={<FolderPlus size={16} />}
              label="Create Course"
              active={isActive('/teacher/create-course')}
            />
            <Divider orientation="vertical" flexItem sx={{ borderColor: '#eee' }} />
            {/* <SidebarLink
              to="/teacher/my-courses"
              icon={<Video size={16} />}
              label="Upload Videos"
              active={isActive('/teacher/my-courses')}
            /> */}
            <SidebarLink
              to="/profile"
              icon={<Users size={16} />}
              label="View Profile"
              active={isActive('/profile')}
            />
          </>
        ) : (
          <>
            <SidebarLink
              to="/dashboard"
              icon={<LayoutDashboard size={16} />}
              label="Dashboard"
              active={isActive('/dashboard')}
            />
            <SidebarLink
              to="/student/my-courses"
              icon={<BookOpen size={16} />}
              label="My Courses"
              active={isActive('/student/my-courses')}
            />
            <SidebarLink
              to="/assessments"
              icon={<LaptopMinimalCheck size={16} />}
              label="Assessments"
              active={isActive('/assessments')}
            />
            <Divider orientation="vertical" flexItem sx={{ borderColor: '#eee' }} />
            <SidebarLink
              to="/profile"
              icon={<Users size={16} />}
              label="View Profile"
              active={isActive('/profile')}
            />
          </>
        )}
      </Nav>
    </HorizontalNavContainer>
  );
};

const SidebarLink = ({ to, icon, label, active }) => (
  <StyledLink to={to} active={active ? 1 : 0}>
    <ListItem disablePadding>
      <ListItemButton disableRipple sx={{ display: 'flex', alignItems: 'center' }}>
        <ListItemIcon
          sx={{
            minWidth: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </ListItemIcon>
        <ListItemText primary={label} />
      </ListItemButton>
    </ListItem>
  </StyledLink>
);

export default HorizontalNavBar;
