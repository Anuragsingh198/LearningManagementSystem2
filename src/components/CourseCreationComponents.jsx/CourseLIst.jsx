import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import CourseCard from './CourseCard';
import { useCourseContext } from '../../context/contextFiles/CourseContext';
import { getCoursesAction } from '../../context/Actions/courseActions';
import {
  Box,
  Button,
  Grid,
  Typography,
  CircularProgress,
  Paper,
  Container
} from '@mui/material';

const CourseList = () => {
  const { state: { courses, loading, error }, dispatch } = useCourseContext();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        await getCoursesAction(dispatch);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };

    fetchCourses();
  }, [dispatch]);

  if (loading && courses?.length === 0) {
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
    <Container maxWidth="xl">
    <Box sx={{ p: 1 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3,
        mx: 16
      }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" sx={{color: 'black' }}>
            Your Courses
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {!courses || courses.length === 0
              ? "Get started by creating your first course"
              : `You have ${courses?.length} course${courses?.length !== 1 ? 's' : ''}`}
          </Typography>
        </Box>
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
      </Box>

      {courses?.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 500, mx: 'auto' }}>
          <PlusCircle size={48} color="#2563eb" style={{ marginBottom: 16 }} />
          <Typography variant="h6" sx={{ mb: 1 }}>
            No courses yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first course to start sharing knowledge with students.
          </Typography>
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
              Create Your First Course
            </Button>
          </Link>
        </Paper>
      ) : (
          <Box sx={{ mt: 3, px: 0, width: '100%' }}>
        <Grid container spacing={3} justifyContent="center">
          {courses?.map((course) => (
            <Grid item key={course._id || course.id} xs={12} sm={6} lg={4} xl={3}>
             
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