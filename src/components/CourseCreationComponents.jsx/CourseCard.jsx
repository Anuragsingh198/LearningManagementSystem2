import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Users, Calendar, Clock, Book, Trash2 } from 'lucide-react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,

} from '@mui/material';
import { useAuth } from '../../context/contextFiles/AuthContext';
import IconButton from '@mui/material/IconButton';
import { deleteCourse, getMyCoursesAction } from '../../context/Actions/courseActions';
import { useCourseContext } from '../../context/contextFiles/CourseContext';
import { toast } from 'react-toastify';

const CourseCard = ({ course, onViewCourse }) => {
  const { state: { user } } = useAuth();
  const role = user?.role;
  const navigate = useNavigate();

  const { state: { courses, loading: contextLoading, error, myCourses }, dispatch } = useCourseContext();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [isLoading, setisLoading] = useState(false)

  const handleDelete = (courseId) => {
    setCourseToDelete(courseId);
    setDeleteDialogOpen(true);
  };

  const {
    completionDate: deadline,
    courseDuration,
    enrolledDate,
    status,
    overallPercentage,
    remainingDays
  } = course;

  // console.log('course is: ', course)


  // console.log("this is the  course data  form the  course card : ", course);
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const confirmDelete = async () => {
    setisLoading(true);
    try {
      await deleteCourse(courseToDelete, dispatch);
      await getMyCoursesAction(dispatch);
      setisLoading(false);
      setDeleteDialogOpen(false);
      toast.success('Course deleted successfully')
    } catch (error) {
      setisLoading(false)
      console.error('Error deleting course:', error);
      // Handle error (show error notification)
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setCourseToDelete(null);
  };

  const handleUploadClick = () => {
    navigate(`/teacher/upload-video/${course._id}`);
  };

  const handleViewClick = async () => {
    setisLoading(true)
    if (onViewCourse) {
      await onViewCourse(course);
      setisLoading(false)
    } else {
      navigate(`/course/details/${course._id}`);
      setisLoading(false)
    }
  };

  const handleViewEmployeesClick = () => {
    navigate(`/teacher/employees/${course._id}`)
  }

  return (
    <Card sx={{
      width: 330,
      height: '98%',
      border: '2.5px solid',
      borderColor: 'grey.300',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)'
      }
    }}>
      {/* Header with Image */}
      <Box sx={{ position: 'relative' }}>
        {role === 'instructor' && (
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(course._id);
            }}
            sx={{
              position: 'absolute',
              zIndex: 100,
              top: 8,
              right: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
                color: 'error.main'
              }
            }}
          >
            <Trash2 size={18} color="#ef4444" />
          </IconButton>
        )}
        <Dialog
          open={deleteDialogOpen}
          onClose={cancelDelete}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          slotProps={{
            paper: {
              sx: {
                width: 600,
                maxHeight: 600,
                borderRadius: 3,
                boxShadow: 10,
              }
            }
          }}
        >
          <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
          <DialogContent>
            <Box id="alert-dialog-description">
              <Typography variant="body1" color="textSecondary" gutterBottom>
                Deleting this course will permanently remove:
              </Typography>
              <ul style={{ paddingLeft: '1.5rem', marginTop: 0, marginBottom: 0 }}>
                <li>The course and all its content</li>
                <li>All uploaded modules and videos</li>
                <li>Employee completion records</li>
              </ul>
              <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                This action cannot be undone. Are you sure you want to continue?
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ mb: 1, mr: 1 }}>
            <Button onClick={cancelDelete} color="primary">
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              color={isLoading ? 'inherit' : 'error'}
              autoFocus
              disabled={isLoading}

              variant="contained"
              sx={{ width: 205 }}
            >
              {isLoading ? 'Deleting...' : 'Delete Permanently'}
            </Button>

          </DialogActions>
        </Dialog>
        <CardMedia
          component="img"
          height="200"
          image={course.thumbnail || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
          alt={course.title}
          sx={{
            transition: 'transform 0.5s ease',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
        />
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)'
        }}>
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              fontWeight: 700,
              lineHeight: 1.3,
              mb: 0.5
            }}
          >
            {course.title}
          </Typography>
          {course.category && (
            <Chip
              label={course.category}
              size="small"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 500,
                fontSize: '0.7rem',
                height: 22
              }}
            />
          )}
        </Box>
      </Box>

      <CardContent sx={{ p: 1.5 }}>
        {role !== 'instructor' ? <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="text.secondary" fontSize="13px" fontWeight='700'>
              Progress: { Math.round(overallPercentage)  || 0}%
            </Typography>
            <Box>
              <Chip
                label={
                  status === 'pending'
                    ? 'Ongoing'
                    : status === 'completed'
                      ? 'Completed'
                      : status === 'enrolled'
                        ? 'Pending'
                        : 'N/A'
                }
                size="small"
                sx={{
                  ml: 2,
                  mb: 0.5,
                  px: 1,
                  height: 20,
                  fontSize: '12px',
                  width: 80,
                  borderRadius: '10px',
                  fontWeight: 500,
                  backgroundColor:
                    status === 'completed'
                      ? 'rgba(11, 208, 93, 0.2)'
                      : status === 'pending'
                        ? 'rgba(149, 165, 166, 0.1)'
                        : 'rgba(241, 196, 15, 0.1)',
                  border: `1px solid ${status === 'completed'
                      ? '#2ecc71'
                      : status === 'pending'
                        ? '#95a5a6'
                        : '#f1c40f'
                    }`,
                  color:
                    status === 'completed'
                      ? '#2ecc71'
                      : status === 'pending'
                        ? '#95a5a6'
                        : '#f1c40f',
                }}
              />
            </Box>

{remainingDays !== undefined && status !== 'completed' && (
  <Chip
    label={remainingDays === 0 ? 'Overdue' : `${remainingDays} Days left`}
    size="small"
    sx={{
      height: 20,
      fontSize: '12px',
      px: 1, 
      width: 100,
      borderRadius: '10px',
      fontWeight: 500,
      mb: 0.5,
      backgroundColor:
        remainingDays === 0 ? 'rgb(255, 25, 0)' : 'rgba(52, 152, 219, 0.1)',
      border: `1px solid ${
        remainingDays === 0 ? '#e74c3c' : '#3498db'
      }`,
      color: remainingDays === 0 ? '#ffffff' : '#3498db',
    }}
  />
)}


          </Box>
          <LinearProgress
            variant="determinate"
            value={overallPercentage || 0}
            sx={{
              height: 6,
              borderRadius: 4,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'success.light'
              }
            }}
          />
        </Box> : ''}

        {/* Course Metadata */}
        {role !== 'instructor' ? <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 1,
          mb: 2,
          '& > div': {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start', // Align items to the left
            color: 'text.secondary',
            fontSize: '0.8rem',
            width: '50%' // Give equal width to both columns
          }
        }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Users size={14} style={{ marginRight: 4, }} />
              <span
                style={{
                  display: 'inline-block',
                  maxWidth: '130px', // adjust as needed
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  verticalAlign: 'middle'
                }}
              >
                Instructor: {course.instructorName || 'Unknown Instructor'}
              </span>

            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center' }}>


              <Calendar size={14} style={{ marginRight: 4 }} />
              <span>Enrolled: {formatDate(enrolledDate)} </span>



            </Box>
          </Box>

          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Calendar size={14} style={{ marginRight: 4 }} />
              <span>Deadline: {formatDate(deadline)}</span>
            </Box>
            {courseDuration && (
              <Box sx={{ display: 'flex', alignItems: 'center', }}>
                <Clock size={14} style={{ marginRight: 4 }} />
                <span>Duration: {courseDuration} days</span>
              </Box>
            )}
          </Box>
        </Box> : ''}



        {/* Description */}
        <Typography
          variant="body2"
          color="black"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            wordBreak: 'break-word',
            whiteSpace: 'normal',
            minHeight: '40px', // Adjust based on your line-height
          }}
        >
          {course.description || "No description provided"}
        </Typography>


        {/* Action Button */}
        {role !== 'instructor' ? '' : (
          <Button
            fullWidth
            variant="contained"
            onClick={handleUploadClick}
            startIcon={<Video size={16} />}
            sx={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
              borderRadius: '8px',
              py: 1,
              fontSize: '0.875rem',
              fontWeight: 600,
              letterSpacing: '0.5px',
              textTransform: 'none',
              boxShadow: 'none',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
              }
            }}
          >
            Manage Content
          </Button>
        )}
        <Button
          fullWidth
          variant="contained"
          onClick={handleViewClick}
          startIcon={<Book size={16} />}
          sx={{
            background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
            borderRadius: '8px',
            py: 1,
            marginTop: role !== 'instructor' ? 0 : 2,
            fontSize: '0.875rem',
            fontWeight: 600,
            letterSpacing: '0.5px',
            textTransform: 'none',
            color: 'white',
            boxShadow: 'none',
            '&:hover': {
              background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }
          }}
        >
          { isLoading ? "Loading...": " View Course"}
        </Button>
        {role !== 'instructor' ? '' : (
          <Button
            fullWidth
            variant="contained"
            onClick={handleViewEmployeesClick}
            startIcon={<Users size={16} />}
            sx={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              borderRadius: '8px',
              py: 1,
              marginTop: 2,
              fontSize: '0.875rem',
              fontWeight: 600,
              letterSpacing: '0.5px',
              textTransform: 'none',
              color: 'white',
              boxShadow: 'none',
              '&:hover': {
                background: 'linear-gradient(135deg,rgb(115, 43, 239) 0%, #6d28d9 100%)',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
              }
            }}
          >
            View Enrolled Employees
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseCard;