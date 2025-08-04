
import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  Button,
  InputBase,
  Badge,
  useTheme,
  Menu, MenuItem
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/contextFiles/AuthContext';
import logo from '../assets/logo.png'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import MuiLoading from '../pages/common/Loading';
import axios from 'axios';
import { userLogout } from '../context/Actions/AuthActions';


  
export default function Header() {
  const theme = useTheme();
  const { state: { user, loading }, dispatch } = useAuth();
  const serverurl = import.meta.env.VITE_SERVER_URL;
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const token = user?.token;
  // const { name, email, role } = user || {};

  // console.log('the user in header is: ', user?.user?.name)
  // console.log('the name in header is: ', user?.user?.name)

  const name = user?.name || user?.user?.name || 'User';



  
  const [searchText, setSearchText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
const handleAvatarClick = (event) => {
  setAnchorEl(event.currentTarget);
};
const handleMenuClose = () => {
  setAnchorEl(null);
};
const handleLogout = async () => {
  try {
    console.log('logout button clicked')
    setIsLoading(true)
    await userLogout(dispatch); 

   navigate('/');

   setIsLoading(false)
   handleMenuClose();
   
  } catch (error) {
  console.error('Enrollment failed:', error?.response?.data || error.message);
  } finally {
      setIsLoading(false);
    }
};


  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  if(isLoading){
    return <MuiLoading/>
  }

  const handleLoginClick = () => {
    navigate('/login')
  }

  

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
        borderBottom: `1px solid ${theme.palette.divider}`,
        padding: '1px',
        justifyContent: 'space-evenly',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height:'40px',
          px: { xs: 2, md: 4 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mr: 3,
            textDecoration: 'none',
          }}
          component="a"
          href="/"
        > <img src={logo} style={{height: 60, marginRight: 10 }} />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              lineHeight: 1.2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
              }}
            >
              DigiVidya
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: theme.palette.text.secondary,
                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                letterSpacing: 0.5,
                fontWeight: 'bold'
              }}
            >
              Learning Management System
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            maxWidth: 600,
            mx: { xs: 1, sm: 3 },
            display: { xs: 'none', sm: 'flex' },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: theme.palette.action.hover,
              borderRadius: '8px',
              px: 2,
              py: 1,
              width: '100%',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: theme.palette.action.selected,
              },
            }}
          >
            <SearchIcon sx={{ color: theme.palette.text.disabled, mr: 1 }} />
            <InputBase
              value={searchText}
              onChange={handleSearchChange}
              placeholder="Search courses, materials..."
              sx={{
                flex: 1,
                fontSize: '0.875rem',
                '& input::placeholder': {
                  opacity: 0.8,
                  color: theme.palette.text.disabled,
                },
              }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 1, sm: 2 },
            marginRight: 2
          }}
        >
          <IconButton
            size="medium"
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            {/* <Badge badgeContent={4} color="error">
              <NotificationsIcon fontSize="medium" />
            </Badge> */}
          </IconButton>
              {/* here add one logout button */}
          { user ? <Box
  onClick={handleAvatarClick}
  sx={{
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    ml: 1,
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.9,
    },
  }}
>
  <Avatar
    alt={name}
    src="/profile.jpg"
    sx={{
      width: 36,
      height: 36,
      border: '2px solid',
      borderColor: theme.palette.divider,
    }}
  />
  <Typography
    variant="subtitle2"
    sx={{
      fontWeight: 500,
      display: { xs: 'none', sm: 'block' },
    }}
  >
    {name}

  </Typography>
</Box> : <Button
    variant="contained"
    color="primary"
    sx={{
      ml: 1,
      borderRadius: '8px',
      textTransform: 'none',
      fontWeight: 500,
      px: 2.5,
      py: 1,
      fontSize: '0.875rem',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      '&:hover': {
        backgroundColor: 'primary.dark',
      },
    }}
    onClick={handleLoginClick} // optional: add navigation or modal
  >
    Login
  </Button>}
<Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={handleMenuClose}
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'right',
  }}
  transformOrigin={{
    vertical: 'top',
    horizontal: 'right',
  }}
  slotProps={{
    paper: {
      sx: {
        borderRadius: 2,
        mt: 1,
        ml: 4,
        border: '1px solid #ccc', // light gray border
        minWidth: 150,
        boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
        transition: 'background-color 0.2s ease',
        '&:hover': {
          backgroundColor: '#f5f5f5', // light gray on hover
        },
      },
    },
  }}
>
  <MenuItem
  sx={{
    '&:hover': { backgroundColor: 'transparent' },
    '&.Mui-focusVisible': { backgroundColor: 'transparent' },

  }}
   onClick={handleLogout}>Logout</MenuItem>
</Menu>




        </Box>
      </Toolbar>
    </Box>
  );
}