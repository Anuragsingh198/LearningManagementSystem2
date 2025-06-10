
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { CourseCard } from '../components/CourseCard';

const courses = [
  {
    title: 'React Basics',
    description: 'Learn the fundamentals of React.js.',
    image: 'https://images.unsplash.com/photo-1672309558498-cfcc89afff25?w=600&auto=format&fit=crop&q=60',
    students: 1200,
  },
  {
    title: 'JavaScript Mastery',
    description: 'Deep dive into modern JavaScript.',
    image: 'https://images.unsplash.com/photo-1672309558498-cfcc89afff25?w=600&auto=format&fit=crop&q=60',
    students: 2000,
  },
  {
    title: 'UI/UX Design',
    description: 'Design beautiful user experiences.',
    image: 'https://images.unsplash.com/photo-1672309558498-cfcc89afff25?w=600&auto=format&fit=crop&q=60',
    students: 950,
  },
  {
    title: 'Node.js Backend',
    description: 'Build powerful backend applications.',
    image: 'https://images.unsplash.com/photo-1672309558498-cfcc89afff25?w=600&auto=format&fit=crop&q=60',
    students: 1100,
  },
  {
    title: 'TypeScript Essentials',
    description: 'Type-safe JavaScript with TypeScript.',
    image: 'https://images.unsplash.com/photo-1672309558498-cfcc89afff25?w=600&auto=format&fit=crop&q=60',
    students: 800,
  },
  {
    title: 'Next.js Advanced',
    description: 'Server-side React with Next.js.',
    image: 'https://images.unsplash.com/photo-1672309558498-cfcc89afff25?w=600&auto=format&fit=crop&q=60',
    students: 1500,
  },
];

const TeacherCourses = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
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
