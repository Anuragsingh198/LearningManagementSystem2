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
import {
  GraduationCap,
  User,
  Folder,
  Users,
  CheckCircle,
  Send
} from "lucide-react"
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

  const handleEnroll = async () => {
    if (!user || !token) return;
    try {
      setLoading(true);
      const enrolledCourse = await enrollCourseAction(course._id, dispatch);

      if (enrolledCourse) {
        // await getMyCoursesAction(dispatch);
        dispatch({ type: 'SET_MY_COURSES', payload: [...myCourses, course] });
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
  useEffect(() => {

    if (myCourses?.some(c => c._id === course._id)) {
      setEnrolled(true);
    }
  }, [myCourses, course._id]);

  return (
    <Card
      sx={{
        borderRadius: '8px',
        overflow: 'hidden',
        width: 300,
        height: role === 'instructor' ? 330 : 370,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: 0,
        pb: 1,
        border: '1px solid rgba(218, 217, 217, 0.87)',
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
              height: 22,
              borderRadius: '4px',
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
            label={`Validity: ${course.courseDuration} days`}
            size="small"
            sx={{
              // ml: 2,
              backgroundColor: 'rgba(52, 152, 219, 0.1)', // light blue background
              border: '1px solid #3498db', // blue border
              color: '#3498db', // blue text
              fontWeight: 700,
              borderRadius: '4px',
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
              boxShadow: 'none',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: enrolled ? 'darkgreen' : undefined,
                boxShadow: 'none',
                borderRadius: '4px',
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
              borderRadius: "4px",
              p: 2,
              boxShadow: "none",
            },
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "1.8rem",
            fontWeight: "bold",
            color: "#1976d2",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <GraduationCap size={24} /> Course Name: {course.title}
        </DialogTitle>

        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 500, ml: 1, display: "flex", alignItems: "center", gap: 1 }}
          >
            <User size={20} /> Instructor:{" "}
            {course.instructorName || course.instructor?.name || "Instructor"}
          </Typography>

          <Typography
            variant="subtitle2"
            sx={{ color: "text.secondary", ml: 1, display: "flex", alignItems: "center", gap: 1 }}
          >
            <Folder size={20} /> Category: {course.category}
          </Typography>

          <Box
            sx={{
              backgroundColor: "#f3f4f6",
              p: 2,
              borderRadius: "4px",
              maxHeight: 180,
              overflowY: "auto",
              fontSize: "0.95rem",
              lineHeight: 1.6,
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#cbd5e1",
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#f1f5f9",
              },
            }}
          >
            {course.description}
          </Box>

          {Array.isArray(course.students) && (
            <Typography
              variant="body2"
              sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}
            >
              <Users size={20} /> Students enrolled:{" "}
              <strong>{course.students.length.toLocaleString()}</strong>
            </Typography>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
          <Button
            onClick={handleCloseModal}
            variant="outlined"
            sx={{
              borderRadius: "4px",
              boxShadow: "none",
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          {user ? (
            <Button
              onClick={handleEnroll}
              variant="contained"
              disabled={loading || enrolled}
              sx={{
                backgroundColor: "#1976d2",
                borderRadius: "4px",
                boxShadow: "none",
                textTransform: "none",
                "&:hover": { backgroundColor: "#1565c0" },
              }}
              endIcon={
                !loading && !enrolled ? <Send size={18} /> : undefined
              }
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} />
              ) : enrolled ? (
                <>
                  <CheckCircle size={18} style={{ marginRight: 6 }} /> Enrolled
                </>
              ) : (
                "Enroll"
              )}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNavigateToLogin}
              sx={{
                backgroundColor: "#1976d2",
                borderRadius: "4px",
                boxShadow: "none",
                textTransform: "none",
                "&:hover": { backgroundColor: "#1565c0" },
              }}
            >
              Login to Enroll
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Card>
  );
};