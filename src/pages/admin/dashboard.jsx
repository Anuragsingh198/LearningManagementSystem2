import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, Container, CircularProgress, Paper } from '@mui/material';
import { CourseCard } from '../../components/CourseCard';
import bgImg from '../../assets/bg-img.jpg';
import { useCourseContext } from '../../context/contextFiles/CourseContext';
import { getCoursesAction, getMyCoursesAction } from '../../context/Actions/courseActions';

const TeacherDashboard = () => {
  const { state: { courses, loading, error, myCourses }, dispatch } = useCourseContext();
  const [allCourses, setAllCourses] = useState([])
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCoursesAction(dispatch);
        await getMyCoursesAction(dispatch);
        if (data.length !== 0) {
          setAllCourses(data);
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };

    fetchCourses();
  }, []);
  // console.log('hello')
  const compulsoryCourses = allCourses?.filter(course => course.compulsory);
  const regularCourses = allCourses?.filter(course => !course.compulsory);

  return (
    <Box sx={{ padding: '0px', width: '100%' }} className="dashboard-scroll">
      <Typography variant="h4" gutterBottom sx={{ mb: 0, color: 'black', fontSize: '40px', fontWeight: 'bold' }}>
        Welcome to DigiVidya
      </Typography>

      <Box sx={{
        position: 'relative',
        width: '100%',
        height: '450px',
        borderRadius: 2,
        overflow: 'hidden',
        marginTop: '8px',
        boxShadow: 3,
        mb: 4
      }}>
        <Box
  component="img"
  src={bgImg}
  alt="Description"
  sx={{ width: '100%', height: '100%', borderRadius: 2 }}
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
          <Typography variant="h5" sx={{ fontWeight: 'bold', fontFamily: 'Michroma, sans-serif' }}>
            DigiVidya
          </Typography>
          <Typography variant="body1" sx={{ fontFamily: 'Michroma, sans-serif' }}>
            Explore all the courses
          </Typography>
        </Box>
      </Box>

      <Box sx={{ px: 2 }}>
        {/* Compulsory Courses */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              color: 'black',
              textAlign: 'left',
              fontSize: '32px',
              fontWeight: 600,
              mb: 1,
            }}
          >
            Mandatory Courses
          </Typography>

          <Box
            sx={{
              borderBottom: '2px solid #bdbdbd',
              width: '99%',
              mb: 3,
            }}
          />

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4, mt: 12 }}>
              <CircularProgress size={60} />
            </Box>
          ) : compulsoryCourses?.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
              <Paper
                elevation={3}
                sx={{
                  padding: 4,
                  // maxWidth: 00,
                  width: '100%',
                  textAlign: 'center',
                  backgroundColor: '#f9f9f9',
                  borderRadius: 3,
                  border: '1px solid #e0e0e0',
                }}
              >
                <Typography variant="h6" sx={{ color: '#424242', fontWeight: 500 }}>
                  No Mandatory Courses Available
                </Typography>
                <Typography sx={{ mt: 1, color: '#757575', fontStyle: 'italic' }}>
                  Please check back later or contact the administrator.
                </Typography>
              </Paper>
            </Box>
          ) : (
            <Grid container spacing={3} justifyContent="flex-start">
              {compulsoryCourses?.map((course, index) => (
                <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                  <CourseCard course={course} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Regular Courses */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              color: 'black',
              textAlign: 'left',
              fontSize: '32px',
              fontWeight: 600,
              mb: 1,
              mt: 5,
            }}
          >
            Technical Courses
          </Typography>
          <Box
            sx={{
              borderBottom: '2px solid #bdbdbd',
              width: '99%',
              mb: 3,
            }}
          />

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : regularCourses?.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 6 }}>
              <Paper
                elevation={3}
                sx={{
                  padding: 4,
                  // maxWidth: 00,
                  width: '100%',
                  textAlign: 'center',
                  backgroundColor: '#f9f9f9',
                  borderRadius: 3,
                  border: '1px solid #e0e0e0',
                }}
              >
                <Typography variant="h6" sx={{ color: '#424242', fontWeight: 500 }}>
                  No Technical Courses Available
                </Typography>
                <Typography sx={{ mt: 1, color: '#757575', fontStyle: 'italic' }}>
                  Please check back later or contact the administrator.
                </Typography>
              </Paper>
            </Box>
          ) : (
            <Grid container spacing={3} justifyContent="flex-start">
              {regularCourses?.map((course, index) => (
                <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                  <CourseCard course={course} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default TeacherDashboard;
