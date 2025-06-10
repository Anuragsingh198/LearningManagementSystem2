import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardMedia, Chip, Divider } from '@mui/material';
import { CheckCircle, Star } from '@mui/icons-material';

const CompletedCourses = () => {
  // Sample completed courses data
  const completedCourses = [
    {
      id: 1,
      title: 'React Masterclass',
      instructor: 'Jane Smith',
      image: '/path/to/react-course.jpg',
      completionDate: 'June 15, 2023',
      rating: 4.8,
      certificate: true
    },
    {
      id: 2,
      title: 'Advanced JavaScript',
      instructor: 'Mike Johnson',
      image: '/path/to/js-course.jpg',
      completionDate: 'May 22, 2023',
      rating: 4.5,
      certificate: true
    },
    {
      id: 3,
      title: 'UI/UX Fundamentals',
      instructor: 'Sarah Williams',
      image: '/path/to/uiux-course.jpg',
      completionDate: 'April 10, 2023',
      rating: 4.2,
      certificate: false
    },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Completed Courses
      </Typography>
      <Typography color="textSecondary" paragraph>
        {completedCourses.length} courses completed
      </Typography>
      
      <Grid container spacing={3}>
        {completedCourses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="140"
                image={course.image}
                alt={course.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h3">
                  {course.title}
                </Typography>
                <Typography color="text.secondary" paragraph>
                  Instructor: {course.instructor}
                </Typography>
                
                <Box display="flex" alignItems="center" mb={1}>
                  <Star color="warning" sx={{ mr: 1 }} />
                  <Typography>{course.rating}/5.0</Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  Completed on: {course.completionDate}
                </Typography>
              </CardContent>
              
              <Box sx={{ p: 2 }}>
                {course.certificate ? (
                  <Chip 
                    icon={<CheckCircle />} 
                    label="Certificate Available" 
                    color="success" 
                    variant="outlined"
                  />
                ) : (
                  <Chip 
                    label="No Certificate" 
                    color="default" 
                    variant="outlined"
                  />
                )}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Divider sx={{ my: 3 }} />
      
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1">
          Total Courses Completed: {completedCourses.length}
        </Typography>
        <Typography variant="subtitle1">
          Average Rating: 4.5/5.0
        </Typography>
      </Box>
    </Box>
  );
};

export default CompletedCourses;