
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { CourseCard } from '../components/CourseCard';

const TeacherCourses = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Welcome to Your Dashboard
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Here you can find all your Created courses.
          </Typography>
        </Box>
        <Button
          variant="contained"
          sx={{
            bgcolor: 'green',
            color: 'white',
            fontSize: '0.8rem',
            '&:hover': {
              bgcolor: 'white',
              color: 'blue',
            },
          }}
          onClick={() => (window.location.href = '/teacher/create-course')}
        >
          Create Course
        </Button>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'space-between',
        }}
      >
        {courses.map((course, index) => (
          <CourseCard course={course} key={index} />
        ))}
      </Box>
    </Box>
  );
};

export default TeacherCourses;
