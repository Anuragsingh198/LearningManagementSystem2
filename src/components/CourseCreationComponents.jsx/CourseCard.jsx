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
  DialogContentText,
  DialogActions
} from '@mui/material';
import { useAuth } from '../../context/contextFiles/AuthContext';
import IconButton from '@mui/material/IconButton';

const CourseCard = ({ course }) => {

  const { state: { user } } = useAuth();
  const role = user?.role;
  const navigate = useNavigate();
  console.log("coures id from coure card : ", course._id)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

    const handleDelete = (courseId) => {
    setCourseToDelete(courseId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      // Call your API to delete the course
      // await api.delete(`/courses/${courseToDelete}`);
      
      // Handle successful deletion (update state, show notification, etc.)
      console.log(`Course ${courseToDelete} deleted successfully`);
      
      setDeleteDialogOpen(false);
    } catch (error) {
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

  const handleViewClick = () => {
    navigate(`/course/details/${course._id}`)

  }

  const handleViewEmployeesClick = () => {
    navigate(`/teacher/employees/${course._id}`)

  }


  // const formattedDate = new Intl.DateTimeFormat('en-US', {
  //   year: 'numeric',
  //   month: 'short',
  //   day: 'numeric',
  // }).format(new Date(course.createdAt));

  return (
    <Card sx={{
      width: 350,
      // maxWidth: 360,
      height: '100%',
      border: '1px solid',
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
        <DialogActions sx={{mb: 1, mr:1}}
        >
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={confirmDelete} 
            color="error"
            autoFocus
            variant="contained"
          >
            Delete Permanently
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

      {/* Card Content */}
      <CardContent sx={{ p: 2.5 }}>
        {/* Course Metadata */}
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1.5,
          mb: 2,
          '& > div': {
            display: 'flex',
            alignItems: 'center',
            color: 'text.secondary',
            fontSize: '0.8rem'
          }
        }}>
          <Box>
            <Users size={14} style={{ marginRight: 4 }} />
            <span>{course.instructorName || 'Unknown Instructor'}</span>
          </Box>
          {/* <Box>
            <Calendar size={14} style={{ marginRight: 4 }} />
            <span>{formattedDate}</span>
          </Box> */}
          {course.duration && (
            <Box>
              <Clock size={14} style={{ marginRight: 4 }} />
              <span>{course.courseDuration}</span>
            </Box>
          )}
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2.5,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',          // Prevent vertical growth
            textOverflow: 'ellipsis',    // Adds ... to clipped content
            wordBreak: 'break-word',
            whiteSpace: 'normal',
            minHeight: '60px'            // Optional: reserve space for 3 lines
          }}
        >
          {course.description || "No description provided"}
        </Typography>


        {/* Action Button */}
        {role != 'instructor' ? '' : <Button
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
        </Button>}
        <Button
          fullWidth
          variant="contained"
          onClick={()=> navigate(`/course/details/${course._id}`)} 
          startIcon={<Book size={16} />}
          sx={{
            background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)', // Teal to emerald
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
              background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }
          }}
        >
          View Course
        </Button>
        {role != 'instructor' ? '' : <Button
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
        </Button>}

      </CardContent>
    </Card>
  );
};

export default CourseCard;