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

  // console.log('the courses are in the parent component: ', myCourses)


  // useEffect(() => {
  //   const fetchCourses = async () => {
  //     try {
  //       await getMyCoursesAction(dispatch);
  //     } catch (error) {
  //       console.error('Failed to fetch courses:', error);
  //     }
  //   };

  //   fetchCourses();
  // }, [dispatch]);

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

  const filteredCoursesPending = myCourses?.filter(
  (course) => course.progressStatus === 'pending' || course.progressStatus === 'enrolled'
    );

    const filteredCoursesCompleted = myCourses?.filter(
      (course) => course.progressStatus === 'completed' 
    )

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
  mx: 5
}}>
  <Box>
    <Typography variant="h5" fontWeight="bold" sx={{ color: 'black' }}>
      {role === 'instructor' ? 'My Uploaded Courses' :'Enrolled Courses'}
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
        <Box sx={{ mt: 3, px: 5, width: '100%' }}>
  {role === 'instructor' ? (
    <Grid container spacing={3}>
      {myCourses?.map((course) => (
        <Grid item key={course._id || course.id} xs={12} sm={6} md={4} lg={4} xl={3}>
          <CourseCard course={course} />
        </Grid>
      ))}
    </Grid>
  ) : (
    <>
      {/* Pending Courses */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: 'gray' }}>
        Ongoing Courses
      </Typography>
         <Box
        sx={{
          height: '1px',
          width: '95%',
          backgroundColor: 'grey.300',
          mb: 4,
        }}
      />
    {filteredCoursesPending && filteredCoursesPending.length > 0 ? (
  <Grid container spacing={3} sx={{ mb: 4 }}>
    {filteredCoursesPending.map((course) => (
      <Grid item key={course._id || course.id} xs={12} sm={6} md={4} lg={4} xl={3}>
        <CourseCard course={course} />
      </Grid>
    ))}
  </Grid>
) : (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
    <Paper
      elevation={3}
      sx={{
        padding: 4,
                mr: 10,
        width: '80%',
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 3,
        border: '1px solid #e0e0e0',
      }}
    >
      <Typography variant="h6" sx={{ color: '#424242', fontWeight: 500 }}>
        No Ongoing Courses Available
      </Typography>
      <Typography sx={{ mt: 1, color: '#757575', fontStyle: 'italic' }}>
        Please Enroll in courses under dashboard to start learning.
      </Typography>
    </Paper>
  </Box>
)}

      {/* Completed Courses */}
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: 'green' }}>
        Completed Courses
      </Typography>
         <Box
        sx={{
          height: '1px',
          width: '95%',
          backgroundColor: 'grey.300',
          mb: 4,
        }}
      />
      {/* <Grid container spacing={3}>
        {myCourses
          ?.filter((course) => course.progressStatus === 'completed')
          .map((course) => (
            <Grid item key={course._id || course.id} xs={12} sm={6} md={4} lg={4} xl={3}>
              <CourseCard course={course} />
            </Grid>
          ))}
      </Grid> */}
      {
        filteredCoursesCompleted && filteredCoursesCompleted.length > 0 ? (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {filteredCoursesCompleted.map((course) => (
              <Grid item key={course._id || course.id} xs={12} sm={6} md={4} lg={4} xl={3}>
               <CourseCard course={course}/>
                </Grid>
            ))}
          </Grid>
        ) : (
           <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
    <Paper
      elevation={3}
      sx={{
        padding: 4,
        mr: 10,
        width: '80%',
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 3,
        border: '1px solid #e0e0e0',
      }}
    >
      <Typography variant="h6" sx={{ color: '#424242', fontWeight: 500 }}>
        No Courses Completed
      </Typography>
      <Typography sx={{ mt: 1, color: '#757575', fontStyle: 'italic' }}>
        Please complete ongoing courses!
      </Typography>
    </Paper>
  </Box>
        )
      }
    </>
  )}
</Box>

        )}
      </Box>
    </Container>
  );
};

export default CourseList;