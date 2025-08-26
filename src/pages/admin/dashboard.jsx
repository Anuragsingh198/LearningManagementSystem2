import React, { useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Typography,
  Paper
} from '@mui/material';
import { CourseCard } from '../../components/CourseCard';
import { useCourseContext } from '../../context/contextFiles/CourseContext';
import { getCoursesAction, getMyCoursesAction } from '../../context/Actions/courseActions';
import CourseCardHoverWrapper from '../common/CourseCardHoverWrapper';
import { keyframes } from '@mui/system';

// --------------------
// Loader Animations
// --------------------
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
`;

const fall = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-80px) rotateX(90deg);
  }
  60% {
    opacity: 1;
    transform: translateY(10px) rotateX(0deg);
  }
  100% {
    transform: translateY(0);
  }
`;

// DigiVidya Loader Component
const DigiVidyaLoader = () => {
  const text = "DigiVidya".split("");
  return (
    <Box
      role="status"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%", // fixed frame
        width: "100%",
        backgroundColor: "#f3f4f6",
        borderRadius: "8px",
        animation: `${pulse} 2s ease-in-out infinite`,
      }}
    >
      {text.map((letter, index) => (
        <Typography
          key={index}
          variant="h3"
          sx={{
            fontWeight: "bold",
            color: "#1976d2",
            mx: 0.3,
            display: "inline-block",
            animation: `${fall} 0.9s ease-out forwards`,
            animationDelay: `${index * 0.15}s`,
          }}
        >
          {letter}
        </Typography>
      ))}
    </Box>
  );
};

// --------------------
// Teacher Dashboard
// --------------------
const TeacherDashboard = () => {
  const {
    state: { courses, myCourses, loading },
  } = useCourseContext();

  const [selectedVideo, setSelectedVideo] = useState("");
  const [videoLoading, setVideoLoading] = useState(true);

  // Random video selection
  useEffect(() => {
    const videos = ["/bg-video.mp4", "/bg-video-2.mp4"];
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    setSelectedVideo(randomVideo);

    // Simulate load delay (remove in prod)
    const timer = setTimeout(() => setVideoLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const compulsoryCourses = courses?.filter((course) => course.compulsory);
  const regularCourses = courses?.filter((course) => !course.compulsory);

  // Scroll to mandatory section
  const scrollToMandatoryCourses = () => {
    const element = document.getElementById("mandatory-courses");
    if (element) {
      const offset = 122;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // console.log("this is  the  my project data : ", myCourses);

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#FFFFFF",
        flexDirection: "column",
        justifyContent: "center",
        py: 2,
        px: 4,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ mb: 0, color: "black", fontSize: "30px", fontWeight: "bold" }}
      >
        Welcome to DigiVidya
      </Typography>

      {/* Video or Loader */}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "99%",
          height: "61vh",
          borderRadius: "4px",
          marginTop: "8px",
          mb: 4,
          cursor: "pointer",
          "&:hover": {
            opacity: 0.9,
            transition: "opacity 0.3s ease",
          },
        }}
        onClick={scrollToMandatoryCourses}
      >
        {videoLoading ? (
          <DigiVidyaLoader />
        ) : (
          selectedVideo && (
            <Box
              component="video"
              src={selectedVideo}
              autoPlay
              muted
              loop
              playsInline
              sx={{
                width: "100%",
                height: "100%",
                borderRadius: "4px",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          )
        )}
      </Box>

      <Box sx={{ px: 2 }}>
        {/* Mandatory Courses */}
        <Box sx={{ mb: 4 }} id="mandatory-courses">
          <Typography
            sx={{
              color: "black",
              textAlign: "left",
              fontSize: "32px",
              fontWeight: 600,
              mb: 1,
            }}
          >
            Mandatory Courses
          </Typography>

          <Box
            sx={{
              borderBottom: "1px solid #bdbdbd",
              width: "99%",
              mb: 3,
            }}
          />

          {!compulsoryCourses ? (
            <DigiVidyaLoader />
          ) : compulsoryCourses?.length === 0 ? (
            <Box
              sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 6 }}
            >
              <Paper
                elevation={3}
                sx={{
                  padding: 4,
                  width: "100%",
                  textAlign: "center",
                  backgroundColor: "#f9f9f9",
                  borderRadius: 3,
                  border: "1px solid #e0e0e0",
                }}
              >
                <Typography variant="h6" sx={{ color: "#424242", fontWeight: 500 }}>
                  No Mandatory Courses Available
                </Typography>
                <Typography sx={{ mt: 1, color: "#757575", fontStyle: "italic" }}>
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
              color: "black",
              textAlign: "left",
              fontSize: "32px",
              fontWeight: 600,
              mb: 1,
              mt: 5,
            }}
          >
            Technical Courses
          </Typography>
          <Box
            sx={{
              borderBottom: "1px solid #bdbdbd",
              width: "99%",
              mb: 3,
            }}
          />

          {!regularCourses ? (
            <DigiVidyaLoader />
          ) : regularCourses?.length === 0 ? (
            <Box
              sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 6 }}
            >
              <Paper
                elevation={3}
                sx={{
                  padding: 4,
                  width: "100%",
                  textAlign: "center",
                  backgroundColor: "#f9f9f9",
                  borderRadius: 3,
                  border: "1px solid #e0e0e0",
                }}
              >
                <Typography variant="h6" sx={{ color: "#424242", fontWeight: 500 }}>
                  No Technical Courses Available
                </Typography>
                <Typography sx={{ mt: 1, color: "#757575", fontStyle: "italic" }}>
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
