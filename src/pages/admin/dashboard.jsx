import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { CourseCard } from '../../components/CourseCard';
import bgImg from '../../assets/bg-img.jpg'
import { blue } from '@mui/material/colors';

const courses = [
  {
    title: 'React Basics',
    description: 'Learn the fundamentals of React.js.',
    image: 'https://images.unsplash.com/photo-1575314027842-c33656c1f3dc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8amF2YSUyMHNjcmlwdHxlbnwwfHwwfHx8MA%3D%3D',
    students: 1200,
    provider: 'Gopal Adusumilli',
    isLiked: true
  },
  {
    title: 'JavaScript Mastery',
    description: 'Deep dive into modern JavaScript.',
    image: 'https://images.unsplash.com/photo-1672309558498-cfcc89afff25?w=600&auto=format&fit=crop&q=60',
    students: 2000,
    provider: 'Mahesh Reddy Dandu',
    isLiked: true
  },
  {
    title: 'UI/UX Design',
    description: 'Design beautiful user experiences.',
    image: 'https://plus.unsplash.com/premium_photo-1678565879444-f87c8bd9f241?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    students: 950,
    provider: 'Arunjith TV',
    isLiked: false

  },
  {
    title: 'Node.js Backend',
    description: 'Build powerful backend applications.',
    image: 'https://images.unsplash.com/photo-1667372393086-9d4001d51cf1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGphdmElMjBzY3JpcHR8ZW58MHx8MHx8fDA%3D',
    students: 1100,
    provider: 'Gopal Adusumilli',
    isLiked: true
  },
  {
    title: 'TypeScript Essentials',
    description: 'Type-safe JavaScript with TypeScript.',
    image: 'https://images.unsplash.com/photo-1672309558498-cfcc89afff25?w=600&auto=format&fit=crop&q=60',
    students: 800,
    provider: 'Gopal Adusumilli',
    isLiked: false
  },
  {
    title: 'Next.js Advanced',
    description: 'Server-side React with Next.js.',
    image: 'https://images.unsplash.com/photo-1672309558498-cfcc89afff25?w=600&auto=format&fit=crop&q=60',
    students: 1500,
    isLiked: true,
    provider: 'Gopal Adusumilli',

  },
    {
    title: 'Node.js Backend',
    description: 'Build powerful backend applications.',
    image: 'https://images.unsplash.com/photo-1667372393086-9d4001d51cf1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGphdmElMjBzY3JpcHR8ZW58MHx8MHx8fDA%3D',
    students: 1100,
    provider: 'Gopal Adusumilli',
    isLiked: true
  },
  {
    title: 'TypeScript Essentials',
    description: 'Type-safe JavaScript with TypeScript.',
    image: 'https://images.unsplash.com/photo-1672309558498-cfcc89afff25?w=600&auto=format&fit=crop&q=60',
    students: 800,
    provider: 'Gopal Adusumilli',
    isLiked: false
  },
  {
    title: 'Next.js Advanced',
    description: 'Server-side React with Next.js.',
    image: 'https://images.unsplash.com/photo-1672309558498-cfcc89afff25?w=600&auto=format&fit=crop&q=60',
    students: 1500,
    isLiked: true,
    provider: 'Gopal Adusumilli',

  },
    {
    title: 'Node.js Backend',
    description: 'Build powerful backend applications.',
    image: 'https://images.unsplash.com/photo-1667372393086-9d4001d51cf1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGphdmElMjBzY3JpcHR8ZW58MHx8MHx8fDA%3D',
    students: 1100,
    provider: 'Gopal Adusumilli',
    isLiked: true
  },
  {
    title: 'TypeScript Essentials',
    description: 'Type-safe JavaScript with TypeScript.',
    image: 'https://images.unsplash.com/photo-1672309558498-cfcc89afff25?w=600&auto=format&fit=crop&q=60',
    students: 800,
    provider: 'Gopal Adusumilli',
    isLiked: false
  },
  {
    title: 'Next.js Advanced',
    description: 'Server-side React with Next.js.',
    image: 'https://images.unsplash.com/photo-1672309558498-cfcc89afff25?w=600&auto=format&fit=crop&q=60',
    students: 1500,
    isLiked: true,
    provider: 'Gopal Adusumilli',

  },
];



const TeacherDashboard = () => {
  return (
    <Box sx={{ padding: '0px 0px',  width: '100%' }} className="dashboard-scroll">
      <Typography variant="h4" gutterBottom  sx={{ mb: 0, color: 'black', fontSize: '40px' }}>
        Welcome to Your Dashboard
      </Typography>

       <Box sx={{ 
        position: 'relative',
        width: '98%',
        height: '450px',
        borderRadius: 2,
        overflow: 'hidden',
        marginTop: '8px',
        boxShadow: 3,
        mb: 4
      }}>
        <img 
          src={bgImg} 
          alt="Dashboard banner" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center'
          }} 
        />
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: 'rgba(0,0,0,0.5)',
          color: 'white',
          p: 3,
          backdropFilter: 'blur(4px)'
        }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Your Teaching Journey
          </Typography>
          <Typography variant="body1">
            Explore and manage your courses
          </Typography>
        </Box>
        
      </Box>
      <Typography sx={{ color: 'black', textAlign: 'center', fontSize: '44px'}}>
        Explore All Courses
      </Typography>
        <Box sx={{ mt: 3, px: 0, width: '100%' }}>
      <Grid container spacing={3} justifyContent="center">
        {courses.map((course, index) => (
          <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
            <CourseCard course={course} />
          </Grid>
        ))}
      </Grid>
    </Box>
    </Box>
  );
};

export default TeacherDashboard;
