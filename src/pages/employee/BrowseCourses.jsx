import React from 'react';
import { Box, Typography } from '@mui/material';
import CourseCard from './components/CourseCard'; // Adjust this path based on your file structure

const courses = [
  {
    title: 'React Basics',
    description: 'Learn the fundamentals of React.js.',
    image: 'https://images.unsplash.com/photo-1672309558498-cfcc89afff25?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29kaWclMjAlMjBjb3Vyc2VzfGVufDB8fDB8fHww',
    students: 1200,
  },
  {
    title: 'JavaScript Mastery',
    description: 'Deep dive into modern JavaScript.',
    image: 'https://images.unsplash.com/photo-1672309558498-cfcc89afff25?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29kaWclMjAlMjBjb3Vyc2VzfGVufDB8fDB8fHww',
    students: 2000,
  },
  {
    title: 'UI/UX Design',
    description: 'Design beautiful user experiences.',
    image: 'https://images.unsplash.com/photo-1672309558498-cfcc89afff25?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29kaWclMjAlMjBjb3Vyc2VzfGVufDB8fDB8fHww',
    students: 950,
  },
  {
    title: 'Node.js Backend',
    description: 'Build powerful backend applications.',
    image: 'https://images.unsplash.com/photo-1672309558498-cfcc89afff25?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29kaWclMjAlMjBjb3Vyc2VzfGVufDB8fDB8fHww',
    students: 1100,
  },
  {
    title: 'TypeScript Essentials',
    description: 'Type-safe JavaScript with TypeScript.',
    image: 'https://images.unsplash.com/photo-1672309558498-cfcc89afff25?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29kaWclMjAlMjBjb3Vyc2VzfGVufDB8fDB8fHww',
    students: 800,
  },
  {
    title: 'Next.js Advanced',
    description: 'Server-side React with Next.js.',
    image: 'https://images.unsplash.com/photo-1672309558498-cfcc89afff25?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29kaWclMjAlMjBjb3Vyc2VzfGVufDB8fDB8fHww',
    students: 1500,
  },
];

const BrowseCourses = () => {
  return (
    <Box sx={{ p: 3 }} className="dashboard-scroll">
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 0 }}>
          Explore All Courses
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" sx={{ mt: 0 }}>
          Here you can find all the courses.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'space-between' }}>
        {courses.map((course, index) => (
          <CourseCard course={course} key={index} />
        ))}
      </Box>
    </Box>
  );
};

export default BrowseCourses;
