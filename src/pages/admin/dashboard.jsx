import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography, Container, CircularProgress, Paper } from '@mui/material';
import { CourseCard } from '../../components/CourseCard';
import bgVideo from '../../assets/bg-video.mp4';
import bgVideo2 from '../../assets/bg-video-2.mp4';
import { useCourseContext } from '../../context/contextFiles/CourseContext';
import { getCoursesAction, getMyCoursesAction } from '../../context/Actions/courseActions';
import CourseCardHoverWrapper from '../common/CourseCardHoverWrapper';

const TeacherDashboard = () => {
  const { state: { courses, myCourses, loading }, dispatch } = useCourseContext();
  const [allCourses, setAllCourses] = useState([])
  const [selectedVideo, setSelectedVideo] = useState('')

  // Randomly select a video on component mount
  useEffect(() => {
    const videos = [bgVideo, bgVideo2];
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    setSelectedVideo(randomVideo);
  }, []);

  const compulsoryCourses = courses?.filter(course => course.compulsory);
  const regularCourses = courses?.filter(course => !course.compulsory);

  // Function to scroll to mandatory courses section
  const scrollToMandatoryCourses = () => {
    const element = document.getElementById('mandatory-courses');
    if (element) {
      const offset = 122; // Offset to account for any fixed headers or spacing
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // console.log("this is  the  my project data : ", myCourses);

  return (
    <Box sx={{
      display: 'flex',
      backgroundColor: '#FFFFFF',
      flexDirection: 'column',
      justifyContent: 'center',
      py: 2,
      px: 4,
    }} >
      <Typography variant="h4" gutterBottom sx={{ mb: 0, color: 'black', fontSize: '30px', fontWeight: 'bold' }}>
        Welcome to DigiVidya
      </Typography>
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '99%',
          height: '61vh',
          borderRadius: '4px',
          // overflow: 'hidden',
          marginTop: '8px',

          // mr: 2,
          mb: 4,
          cursor: 'pointer',
          '&:hover': {
            opacity: 0.9,
            transition: 'opacity 0.3s ease'
          }
        }}
        onClick={scrollToMandatoryCourses}
      >
        <Box
          component="video"
          src={selectedVideo}
          autoPlay
          muted
          loop
          playsInline
          sx={{ width: '100%', height: '100%', borderRadius: '4px', objectFit: 'cover', objectPosition: 'center' }}
        />
      </Box>

      <Box sx={{ px: 2 }}>
        <Box sx={{ mb: 4 }} id="mandatory-courses">
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
              borderBottom: '1px solid #bdbdbd',
              width: '99%',
              mb: 3,
            }}
          />

          {!compulsoryCourses ? (
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
            <Grid container spacing={2} justifyContent="flex-start">
              {compulsoryCourses?.map((course, index) => (
                <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                  {/* <CourseCardHoverWrapper course={course}> */}
                  <CourseCard course={course} />
                  {/* </CourseCardHoverWrapper> */}
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
              borderBottom: '1px solid #bdbdbd',
              width: '99%',
              mb: 3,
            }}
          />

          {!regularCourses ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={60} />
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
            <Grid container spacing={2} justifyContent="flex-start">
              {regularCourses?.map((course, index) => (
                <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
                  {/* <CourseCardHoverWrapper course={course}> */}
                  <CourseCard course={course} />
                  {/* </CourseCardHoverWrapper> */}
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
