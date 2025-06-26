import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import CourseCard from './CourseCard';
import { useCourseContext } from '../../context/contextFiles/CourseContext';
import { getCoursesAction, getMyCoursesAction } from '../../context/Actions/courseActions';

import {
  Box,
  Button,
  Grid,
  Typography,
  CircularProgress,
  Paper,
  Container
} from '@mui/material';
import { useAuth } from '../../context/contextFiles/AuthContext';

const CourseList = () => {
  const { state: { courses, loading, error, myCourses }, dispatch } = useCourseContext();
  const { state: { user } } = useAuth();
  const role = user?.role;


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        await getMyCoursesAction(dispatch);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };

    fetchCourses();
  }, [dispatch]);

  if (loading && myCourses?.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2, color: 'black' }}>
          Loading your courses...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error" sx={{ mb: 2 }}>
          Error loading courses
        </Typography>
        <Typography variant="body2" sx={{ mb: 3 }}>
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <Container
      maxWidth="100%"
      sx={{
        backgroundColor: 'white',
        p: 2,
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)', // Custom subtle shadow
        border: '1px solid',
        borderColor: 'grey.300', // Even lighter border
        borderRadius: 10, // Smaller radius (4px)
        width: '100%'
      }}
    >
      <Box sx={{ p: 1 }}>
        <Box sx={{ 
  display: 'flex', 
  justifyContent: 'space-between', 
  alignItems: 'center',
  mb: 3,
  mx: 6
}}>
  <Box>
    <Typography variant="h5" fontWeight="bold" sx={{ color: 'black' }}>
      Your Courses
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {!myCourses || myCourses.length === 0
        ? role === 'employee'
          ? "Please enroll in available courses"
          : "Get started by creating your first course"
        : `You have ${myCourses?.length} course${myCourses?.length !== 1 ? 's' : ''}`}
    </Typography>
  </Box>

  {role === 'instructor' && (
    <Link to="/teacher/create-course" style={{ textDecoration: 'none' }}>
      <Button
        variant="contained"
        color="primary"
        startIcon={<PlusCircle size={20} />}
        sx={{
          background: 'linear-gradient(to right, #2563eb, #4f46e5)',
          '&:hover': {
            background: 'linear-gradient(to right, #1d4ed8, #4338ca)'
          }
        }}
      >
        Create New Course
      </Button>
    </Link>
  )}
</Box>


        {myCourses?.length === 0 ? (
  <Paper
  elevation={6}
  sx={{
    p: 5,
    maxWidth: 520,
    mx: 'auto',
    textAlign: 'center',
    borderRadius: 4,
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    backgroundColor: 'background.paper',
  }}
>
  {role === 'instructor' && (
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
      <PlusCircle size={56} color="#2563eb" />
    </Box>
  )}

  <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 600 }}>
    {role === 'instructor' ? 'No courses yet' : 'No enrolled courses yet'}
  </Typography>

  <Typography variant="body1" color="text.secondary" sx={{ mb: 4, px: 2 }}>
    {role === 'instructor'
      ? 'Create your first course to start sharing knowledge with students.'
      : 'Please enroll in courses under Dashboard tab to begin learning!'}
  </Typography>

  {role === 'instructor' && (
    <Link to="/teacher/create-course" style={{ textDecoration: 'none' }}>
      <Button
        variant="contained"
        size="large"
        startIcon={<PlusCircle size={20} />}
        sx={{
          px: 3,
          py: 1.5,
          fontWeight: 600,
          background: 'linear-gradient(to right, #2563eb, #4f46e5)',
          borderRadius: 3,
          textTransform: 'none',
          transition: '0.3s ease',
          '&:hover': {
            background: 'linear-gradient(to right, #1d4ed8, #4338ca)',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.4)',
          },
        }}
      >
        Create Your First Course
      </Button>
    </Link>
  )}
</Paper>

        ) : (
          <Box sx={{ mt: 3, px: 5, width: '100%' , }}>
            <Grid container spacing={3} justifyContent="flex-start" >
              {myCourses?.map((course) => (
                <Grid item key={course._id || course.id} xs={12} sm={6} md={4} lg={4} xl={3}>

                  <CourseCard course={course} />

                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default CourseList;