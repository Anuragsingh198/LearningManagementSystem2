import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Button,
  Divider,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { Email, Phone, LocationOn, Person } from '@mui/icons-material';
import GroupsIcon from '@mui/icons-material/Groups';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useAuth } from '../../context/contextFiles/AuthContext';

const UserDetails = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    employeesRegistered: 25,
    coursesCreated: 6,
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    bio: 'Software developer and online course enthusiast. Passionate about learning new technologies and sharing knowledge.',
    avatar: 'https://static.vecteezy.com/system/resources/previews/051/270/245/non_2x/cartoon-people-avatar-minimalist-human-avatar-versatile-icon-for-online-projects-an-avatar-for-the-profile-picture-of-someone-vector.jpg',
    joinDate: 'January 2022',
    coursesTaken: 15,
    lastActive: '2 hours ago',
  });

  const { state: { user: currentUser, loading }, dispatch } = useAuth();

  const { name, email, role } = user;

  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(user);

  const handleOpen = () => {
    setEditData(user); // preload current data
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setUser(editData);
    setOpen(false);
  };

  return (
    <Box sx={{ p: 4, bgcolor: '#f8f9fd' }}>
      <Grid container spacing={3} justifyContent="center">
        {/* Profile Info Card */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '70%' }} >
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4, display: 'flex', width: '60%', justifyContent: 'space-between' }}>
            <Box>

              <Box display="flex" flexDirection="row" alignItems="center">
                <Avatar src={user.avatar} sx={{ width: 100, height: 100 }} />
                <Typography variant="h6">{currentUser?.name}</Typography>
                {/* <Typography color="textSecondary" fontSize={12}>
                Last active: {user.lastActive}
              </Typography>
              <Typography color="textSecondary" fontSize={12}>
                Joined: {user.joinDate}
              </Typography> */}
              </Box>
              <Button
                onClick={handleOpen}
                fullWidth
                sx={{
                  background: 'linear-gradient(135deg, #ff416c, #ff4b2b)',
                  color: 'white',
                  borderRadius: '20px',
                  mt: 1,
                }}
              >

                Edit
              </Button>
            </Box>

            <Box px={1} sx={{ mt: 2 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <Phone fontSize="small" sx={{ mr: 1 }} />
                <Typography>
                  {currentUser.phone ? currentUser.phone : 'To be added'}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={1}>
                <Email fontSize="small" sx={{ mr: 1 }} />
                <Typography>{currentUser?.email}</Typography>
              </Box>

              <Box display="flex" alignItems="center" mb={1}>
                <LocationOn fontSize="small" sx={{ mr: 1 }} />
                <Typography>
                  {currentUser.location ? currentUser.location : 'To be added'}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center">
                <Person fontSize="small" sx={{ mr: 1 }} />
                <Typography>
                  {currentUser?.role
                    ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)
                    : 'Role not available'}
                </Typography>
              </Box>
            </Box>


          </Paper>
          <Paper elevation={3} sx={{ mt: 2, p: 3, borderRadius: 4, display: 'flex', flexDirection: 'column', width: '60%', justifyContent: 'space-around', color: 'black' }}>
            <Box>
              About
            </Box>
            <Divider sx={{ my: 2 }} />

            {currentUser.about ? currentUser.about : 'To be added'}

          </Paper>

        </Box>

        {/* Stats + About Section */}
        {/* <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant="h6" mb={2}>Account Stats</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-evenly', gap: 2, flexWrap: 'wrap', mt: 2 }}>
              <Paper
                elevation={4}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  borderRadius: 3,
                  minWidth: 220,
                  background: 'linear-gradient(135deg, #3f51b5, #5c6bc0)',
                  color: '#fff',
                }}
              >
                <GroupsIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="body2">Employees Registered</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {user.employeesRegistered}
                  </Typography>
                </Box>
              </Paper>

              <Paper
                elevation={4}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  borderRadius: 3,
                  minWidth: 220,
                  background: 'linear-gradient(135deg, #009688, #26a69a)',
                  color: '#fff',
                }}
              >
                <MenuBookIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="body2">Courses Created</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {user.coursesCreated}
                  </Typography>
                </Box>
              </Paper>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight={600} mb={1}>About</Typography>
            <Typography variant="body2" color="text.secondary">
              {user.bio}
            </Typography>
          </Paper>
        </Grid> */}
      </Grid>

      {/* Edit Modal */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm"  slotProps={{
    paper: {
      sx: {
        borderRadius: 4,
      },
    },
  }}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Typography>
            Hey there!
          </Typography>
          <Typography>
            This section is under development
          </Typography>
          <Typography>
            You will soon be able to edit your profile as well
          </Typography>
          {/* <TextField
            fullWidth
            margin="normal"
            label="Avatar URL"
            name="avatar"
            value={editData.avatar}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Phone Number"
            name="phone"
            value={editData.phone}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Location"
            name="location"
            value={editData.location}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Bio"
            name="bio"
            multiline
            rows={4}
            value={editData.bio}
            onChange={handleChange}
          /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          {/* <Button onClick={handleSave} variant="contained" color="primary">Save</Button> */}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserDetails;
