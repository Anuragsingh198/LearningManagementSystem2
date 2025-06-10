import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Chip, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';

const StudentList = () => {
  // Sample student data
  const students = [
    {
      id: 1,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      avatar: '/path/to/avatar1.jpg',
      coursesEnrolled: 3,
      lastActive: '2 days ago',
      status: 'active'
    },
    {
      id: 2,
      name: 'Bob Smith',
      email: 'bob@example.com',
      avatar: '/path/to/avatar2.jpg',
      coursesEnrolled: 5,
      lastActive: '1 week ago',
      status: 'active'
    },
    {
      id: 3,
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      avatar: '/path/to/avatar3.jpg',
      coursesEnrolled: 2,
      lastActive: '3 weeks ago',
      status: 'inactive'
    },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Enrolled Students
      </Typography>
      
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Typography color="textSecondary">
          {students.length} students enrolled in your courses
        </Typography>
        
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search students..."
          InputProps={{
            startAdornment: <Search color="action" sx={{ mr: 1 }} />
          }}
        />
      </Box>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="center">Courses</TableCell>
              <TableCell align="center">Last Active</TableCell>
              <TableCell align="center">Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar src={student.avatar} alt={student.name} sx={{ mr: 2 }} />
                    {student.name}
                  </Box>
                </TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell align="center">{student.coursesEnrolled}</TableCell>
                <TableCell align="center">{student.lastActive}</TableCell>
                <TableCell align="center">
                  <Chip 
                    label={student.status === 'active' ? 'Active' : 'Inactive'} 
                    color={student.status === 'active' ? 'success' : 'default'} 
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default StudentList;