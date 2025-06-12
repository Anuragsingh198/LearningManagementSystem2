import React, {useEffect, useState} from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { CourseCard } from '../../components/CourseCard';
import bgImg from '../../assets/bg-img.jpg';
import { useCourseContext } from '../../context/contextFiles/CourseContext';
import { getCoursesAction } from '../../context/Actions/courseActions';




const TeacherDashboard = () => {

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

    console.log('courses fetched in dashboard: ', courses)

    // Separate courses based on the 'compulsory' flag
  const compulsoryCourses = courses.filter(course => course.compulsory);
    const regularCourses = courses.filter(course => !course.compulsory);
  return (
    <Box sx={{ padding: '0px', width: '100%' }} className="dashboard-scroll">
      <Typography variant="h4" gutterBottom sx={{ mb: 0, color: 'black', fontSize: '40px' }}>
        Welcome to DigiVidya Dashboard
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
            DigiVidya
          </Typography>
          <Typography variant="body1">
            Explore all the courses
          </Typography>
        </Box>
      </Box>

      <Typography sx={{ color: 'black', textAlign: 'center', fontSize: '44px' }}>
        Compulsory Courses
      </Typography>
      <Box sx={{ mt: 3, px: 0, width: '100%' }}>
        <Grid container spacing={3} justifyContent="center">
          {compulsoryCourses.map((course, index) => (
            <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
              <CourseCard course={course} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Typography sx={{ color: 'black', textAlign: 'center', fontSize: '44px', mt: 5 }}>
        Regular Courses
      </Typography>
      <Box sx={{ mt: 3, px: 0, width: '100%' }}>
        <Grid container spacing={3} justifyContent="center">
          {regularCourses.map((course, index) => (
            <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
              <CourseCard course={course} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default TeacherDashboard;
