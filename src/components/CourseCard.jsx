import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton,
  useTheme
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export const CourseCard = ({ course }) => {
  const theme = useTheme();
  const [liked, setLiked] = useState(course.isLiked || false); // initialize from course

  const handleLikeToggle = () => {
    setLiked(prev => !prev);
  };

  return (
    <Card sx={{ borderRadius: 3, overflow: 'hidden', width: 280, boxShadow: 3 }}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="160"
          image={course.image}
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
      </Box>

      <CardContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {course.provider || "Instructor Name"}
        </Typography>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          {course.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {course.description}
        </Typography>
        {course.students && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            👩‍🎓 {course.students.toLocaleString()} students
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
