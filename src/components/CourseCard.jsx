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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useAuth } from '../context/contextFiles/AuthContext';
import axios from 'axios';
import { courseProgress, getCoursesAction, getMyCoursesAction } from '../context/Actions/courseActions';
import { useCourseContext } from '../context/contextFiles/CourseContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { enrollCourseAction } from '../context/Actions/AuthActions';

export const CourseCard = ({ course, onHoverDisablePopup, onHoverEnablePopup }) => {
  const theme = useTheme();
  const { state: { user } } = useAuth();
  console.log("this is user from the  courseCard : ", user)
  const role = user?.role;
  const token = user?.token;
  const serverurl = import.meta.env.VITE_SERVER_URL;
  const [enrolled, setEnrolled] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const { state: { courses, loading: contextLoading, error, myCourses, allCourseProgress, oneCourseProgress }, dispatch } = useCourseContext();
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

  const handelClickForCourseProgressCreation = async () => {

  }

  const handleEnroll = async() => {
    console.log("enroll is clicked : courseCard")
    if (!user || !token) return;
    try {
      setLoading(true);
      const enrolledCourse = await enrollCourseAction(course._id, dispatch);

      if (enrolledCourse) {
        // await getMyCoursesAction(dispatch);
        console.log(" this is the  enrolled course form the course card: " ,enrolledCourse )
        dispatch({ type: 'SET_MY_COURSES', payload: [course] });
        setEnrolled(true);
        navigate(`/course/details/${course._id}`);
        handleCloseModal();
        toast.success("Enrollment successful");
      }



    } catch (error) {
      console.error('Enrollment failed:', error?.response?.data || error.message);
      const errorMessage = error?.response?.data?.message || error.message || "Enrollment failed";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const handleNavigateToLogin = () => {
    navigate(`/login`);

  }
  console.log("this is hte  my courses  from the  courseCard : ", myCourses , course)
  useEffect(() => {
    console.log("use effect running in course card of dashboard")
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
        height: role === 'instructor' ? 340 : 380,
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', }}>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
            {course.instructorName || (course.instructor?.name ?? 'Instructor')}
          </Typography>
          <Chip
            label={`Duration: ${course.courseDuration} days`}
            size="small"
            sx={{
              // ml: 2,
              backgroundColor: 'rgba(52, 152, 219, 0.1)', // light blue background
              border: '1px solid #3498db', // blue border
              color: '#3498db', // blue text
              fontWeight: 600,
              borderRadius: '20px',
              maxWidth: 200,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          />

        </Box>


        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%',
          }}
        >
          {course.title}
        </Typography>

        <Box
          sx={{
            flexGrow: 1,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            textOverflow: 'ellipsis',
            whiteSpace: 'normal',
            pr: 1,
            height: 'auto', // ← FIXED: remove the fixed 10px height!
            minHeight: '40px', // ← Optional: ensures enough space for 2 lines
          }}
        >
          <Typography
            variant="body2"
            color="black"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {course.description || 'No description available'}
          </Typography>
        </Box>



        {Array.isArray(course.students) && (
          <Typography variant="caption" color="text.secondary">
            💻 {course.students.length.toLocaleString()} Employees enrolled
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
            onMouseEnter={onHoverDisablePopup}
            onMouseLeave={onHoverEnablePopup}
            onClick={handleOpenModal}
            // onClick={handelClickForCourseProgressCreation}
            disabled={loading || enrolled}
          >
            {user ? (loading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : enrolled ? (
              'Enrolled'
            ) : (
              'Enroll'
            )) : 'View Details'}
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
              scrollbarWidth: 'none',
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
          {user ? <Button
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
          </Button> :
            <Button
              variant="contained"
              onClick={handleNavigateToLogin}
            >
              Login to Enroll
            </Button>
          }
        </DialogActions>
      </Dialog>
    </Card>
  );
};