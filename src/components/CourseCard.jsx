import React, { useState, useEffect } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Button,
  useTheme,
  CircularProgress,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useAuth } from '../context/contextFiles/AuthContext';
import axios from 'axios';
import { getCoursesAction, getMyCoursesAction } from '../context/Actions/courseActions';
import { useCourseContext } from '../context/contextFiles/CourseContext';



export const CourseCard = ({ course }) => {
  const theme = useTheme();
  const { state: { user } } = useAuth();
  const role = user?.role;
  const token = user?.token;
  const serverurl = import.meta.env.VITE_SERVER_URL;
  const [enrolled, setEnrolled] = useState(false);
  const [openModal, setOpenModal] = useState(false);


  const [loading, setLoading] = useState(false);
  const { state: { courses, loading: contextLoading, error, myCourses }, dispatch } = useCourseContext();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        await getMyCoursesAction(dispatch);
        console.log('my courses are: ', myCourses)
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };

    fetchCourses();
  }, [dispatch]);


  const [liked, setLiked] = useState(false);

  const handleLikeToggle = () => {
    setLiked(prev => !prev);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleEnroll = async () => {
    if (!user || !token) return;

    try {
      setLoading(true);
      const response = await axios.post(
        `${serverurl}/api/users/enrollCourse`,
        { courseId: course._id },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      await getMyCoursesAction(dispatch);
      setEnrolled(true);
      handleCloseModal();

      console.log('Enrollment success:', response.data);
    } catch (error) {
      console.error('Enrollment failed:', error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   const fetchCourses = async () => {
  //     try {
  //       await getCoursesAction(dispatch);
  //     } catch (error) {
  //       console.error('Failed to fetch courses:', error);
  //     }
  //   };

  //   fetchCourses();
  // }, [dispatch]);


  // Sync local enrolled state with context
  useEffect(() => {
    if (myCourses?.some(c => c._id === course._id)) {
      setEnrolled(true);
    }
  }, [myCourses, course._id]);

  return (
    <Card
      sx={{
        borderRadius: 3,
        overflow: 'hidden',
        width: 320,
        height: role === 'instructor' ? 360 : 420,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: 3
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="160"
          image={course.thumbnail}
          alt={course.title}
        />

        <IconButton
          onClick={handleLikeToggle}
          sx={{
            position: 'absolute',
            top: 170,
            right: 8,
            backgroundColor: 'rgba(255,255,255,0.8)',
            '&:hover': { backgroundColor: 'rgba(255,255,255,1)' }
          }}
        >
          {liked ? (
            <FavoriteIcon sx={{ color: 'red' }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: 'grey.700' }} />
          )}
        </IconButton>

        {course.category && (
          <Chip
            label={course.category}
            size="small"
            sx={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              fontWeight: 500,
              fontSize: '0.7rem',
              height: 22
            }}
          />
        )}
      </Box>


      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          {course.instructorName || (course.instructor?.name ?? 'Instructor')}
        </Typography>

        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          {course.title}
        </Typography>

        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            maxHeight: 80, // fixed height for description area
            pr: 1, // small right padding to avoid scrollbar overlapping text
            '&::-webkit-scrollbar': {
              display: 'none' // for Chrome, Safari, Edge
            }
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {course.description}
          </Typography>
        </Box>

        {Array.isArray(course.students) && (
          <Typography variant="caption" color="text.secondary">
            👩‍🎓 {course.students.length.toLocaleString()} students
          </Typography>
        )}

        {role !== 'instructor' && (
          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 1,
              backgroundColor: enrolled ? 'green' : undefined,
              '&:hover': {
                backgroundColor: enrolled ? 'darkgreen' : undefined
              }
            }}
            onClick={handleOpenModal}
            disabled={loading || enrolled}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : enrolled ? (
              'Enrolled'
            ) : (
              'Enroll'
            )}
          </Button>

        )}

      </CardContent>
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        slotProps={{
          paper: {
            sx: {
              width: 600,
              maxHeight: 600,
              borderRadius: 3,
              p: 2,
              boxShadow: 10,
            }
          }
        }}
      >
        <DialogTitle sx={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e40af' }}>
          🎓 Course Name: {course.title}
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500, ml: 1 }}>
            👨‍🏫 Instructor: {course.instructorName || (course.instructor?.name ?? 'Instructor')}
          </Typography>

          <Typography variant="subtitle2" sx={{ color: 'text.secondary', ml: 1 }}>
            📂 Category: {course.category}
          </Typography>

          <Box
            sx={{
              backgroundColor: '#f3f4f6',
              p: 2,
              borderRadius: 2,
              maxHeight: 180,
              overflowY: 'auto',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              '&::-webkit-scrollbar': {
                width: '0px',
                height: '0px',
              },
              // Hide scrollbar in Firefox
              scrollbarWidth: 'none',
              // Hide scrollbar in IE/Edge
              msOverflowStyle: 'none',
            }}
          >
            {course.description}
          </Box>

          {Array.isArray(course.students) && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              👥 Students enrolled: <strong>{course.students.length.toLocaleString()}</strong>
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
          <Button onClick={handleCloseModal} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleEnroll}
            variant="contained"
            disabled={loading || enrolled}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : enrolled ? (
              '✅ Enrolled'
            ) : (
              '🚀 Enroll'
            )}
          </Button>
        </DialogActions>
      </Dialog>

    </Card>
  );
};
