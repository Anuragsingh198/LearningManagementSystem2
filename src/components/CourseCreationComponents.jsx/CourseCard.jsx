import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@mui/material'
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
    <Card
      sx={{
        width: 355,
        height: '98%',
        border: '1px solid rgba(218, 217, 217, 0.87)',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: 'transparent',
        boxShadow: 'none',
        transition: 'transform 0.3s ease, border-color 0.3s ease',
        '&:hover': {
          transform: 'translateY(-6px)',
          borderColor: 'rgba(180, 180, 180, 0.95)',
          backgroundColor: 'transparent',
        },
      }}
    >

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
                borderRadius: '4px',
                boxShadow: 'none',
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
              sx={{ width: 205, boxShadow: 'none' }}
            >
              {isLoading ? 'Deleting...' : 'Delete Permanently'}
            </Button>

          </DialogActions>
        </Dialog>
        <CardMedia
          component="img"
          image={course.thumbnail || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
          alt={course.title}
          sx={{
            width: '100%',
            maxWidth: '400px',
            height: '200px',
            maxHeight: '200px',
            objectFit: 'cover',
            objectPosition: 'center'
          }}
        />
        {/* <Box sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)'
        }}>
          {course.category && (
            <Chip
              label={course.category}
              size="small"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 500,
                fontSize: '0.7rem',
                borderRadius: '4px',
                height: 22
              }}
            />
          )}
        </Box> */}
      </Box>

      <CardContent sx={{ p: 1.5 }}>
        {/* Course Title and Status */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}>
          <Typography
            variant="h6"
            sx={{
              color: 'text.primary',
              fontWeight: 700,
              lineHeight: 1.3,
              fontSize: '1.1rem',
              flex: 1,
              mr: 2
            }}
          >
            {course.title}
          </Typography>
          {/* 
          // Status Chip 
          {role !== 'instructor' && (
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
                px: 1,
                height: 24,
                fontSize: '12px',
                minWidth: 80,
                borderRadius: '4px',
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
          )}
          */}
        </Box>

        {role !== 'instructor' ? (
          <Box sx={{ mb: 2, position: 'relative' }}>
            {/* Top row: Category | Status | Days left */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
                gap: 1,
                flexWrap: 'nowrap',
              }}
            >
              {/* Category Chip - fixed width with tooltip */}
              {course.category && (
                <Tooltip title={course.category} arrow placement="top">
                  <Chip
                    label={
                      <span
                        style={{
                          display: 'inline-block',
                          maxWidth: '100%',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          verticalAlign: 'middle',
                        }}
                      >
                        {course.category}
                      </span>
                    }
                    size="small"
                    sx={{
                      height: 28,
                      fontSize: '12px',
                      px: 1.5,
                      borderRadius: '4px',
                      fontWeight: 500,
                      minWidth: 90,
                      maxWidth: 120,
                      backgroundColor: 'rgba(52, 152, 219, 0.05)',
                      border: '1px solid #3498db',
                      color: '#3498db',
                      cursor: 'pointer',
                    }}
                  />
                </Tooltip>
              )}

              {/* Status Chip - tooltip */}
              <Tooltip title={
                status === 'pending'
                  ? 'Ongoing'
                  : status === 'completed'
                    ? 'Completed'
                    : status === 'enrolled'
                      ? 'Pending'
                      : 'N/A'
              } arrow placement="top">
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
                    flex: 1,
                    height: 28,
                    fontSize: '12px',
                    px: 1.5,
                    borderRadius: '4px',
                    fontWeight: 500,
                    backgroundColor:
                      status === 'completed'
                        ? 'rgba(11, 208, 93, 0.1)'
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
                    display: 'flex',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                />
              </Tooltip>

              {/* Days left Chip - tooltip */}
              {remainingDays !== undefined && status !== 'completed' && (
                <Tooltip
                  title={remainingDays === 0 ? 'Overdue' : `${remainingDays} days left`}
                  arrow
                  placement="top"
                >
                  <Chip
                    label={remainingDays === 0 ? 'Overdue' : `${remainingDays} days left`}
                    size="small"
                    sx={{
                      flex: 1,
                      height: 28,
                      fontSize: '12px',
                      px: 1.5,
                      borderRadius: '4px',
                      fontWeight: 500,
                      backgroundColor:
                        remainingDays === 0
                          ? 'rgb(255, 25, 0)'
                          : 'rgba(52, 152, 219, 0.05)',
                      border: `1px solid ${remainingDays === 0 ? '#e74c3c' : '#3498db'
                        }`,
                      color: remainingDays === 0 ? '#ffffff' : '#3498db',
                      display: 'flex',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  />
                </Tooltip>
              )}
            </Box>
            {/* Progress bar with circular indicator */}
            <Box sx={{ position: 'relative' }}>
              <LinearProgress
                variant="determinate"
                value={overallPercentage || 0}
                sx={{
                  height: 6,
                  borderRadius: 4,
                  backgroundColor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor:
                      overallPercentage < 40
                        ? '#f9e79f' // pastel yellow
                        : overallPercentage < 80
                          ? '#aed6f1' // pastel blue
                          : '#abebc6', // pastel green
                  },
                }}
              />

              {/* Small circular percentage indicator */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: `${overallPercentage}%`,
                  transform: 'translate(-50%, -50%)',
                  transition: 'left 0.3s ease',
                }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '8px',
                    fontWeight: 600,
                    backgroundColor: '#fff',
                    border: `2px solid ${overallPercentage < 40
                      ? '#f9e79f'
                      : overallPercentage < 80
                        ? '#aed6f1'
                        : '#abebc6'
                      }`,
                    color:
                      overallPercentage < 40
                        ? '#d4ac0d'
                        : overallPercentage < 80
                          ? '#2874a6'
                          : '#1d8348',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  }}
                >
                  {Math.round(overallPercentage) || 0}%
                </Box>
              </Box>
            </Box>
          </Box>


        ) : (
          ''
        )}


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
            variant="outlined"
            onClick={handleUploadClick}
            startIcon={<Video size={16} />}
            sx={{
              background: '#eff6ff',
              border: '1px solid #3b82f6',
              borderRadius: '4px',
              py: 1,
              fontSize: '0.875rem',
              fontWeight: 600,
              letterSpacing: '0.5px',
              textTransform: 'none',
              color: '#1e3a8a',
              boxShadow: 'none',
              '&:hover': {
                background: '#dbeafe',
                border: '1px solid #2563eb',
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              }
            }}
          >
            Manage Content
          </Button>

        )}
        <Button
          fullWidth
          variant="outlined"
          onClick={handleViewClick}
          startIcon={<Book size={16} />}
          sx={{
            background: '#ecfdf5',
            border: '1px solid #10b981',
            borderRadius: '4px',
            py: 1,
            marginTop: role !== 'instructor' ? 0 : 2,
            fontSize: '0.875rem',
            fontWeight: 600,
            letterSpacing: '0.5px',
            textTransform: 'none',
            color: '#065f46',
            boxShadow: 'none',
            '&:hover': {
              background: '#d1fae5',
              border: '1px solid #059669',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
            }
          }}
        >
          {isLoading ? "Loading..." : "View Course"}
        </Button>

        {role !== 'instructor' ? '' : (
          <Button
            fullWidth
            variant="outlined"
            onClick={handleViewEmployeesClick}
            startIcon={<Users size={16} />}
            sx={{
              background: '#fffbeb',
              border: '1px solid #f59e0b',
              borderRadius: '4px',
              py: 1,
              marginTop: 2,
              fontSize: '0.875rem',
              fontWeight: 600,
              letterSpacing: '0.5px',
              textTransform: 'none',
              color: '#92400e',
              boxShadow: 'none',
              '&:hover': {
                background: '#fef3c7',
                border: '1px solid #d97706',
                boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
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