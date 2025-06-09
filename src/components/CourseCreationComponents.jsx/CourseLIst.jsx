import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import CourseCard from './CourseCard';
import { useCourseContext } from '../../context/contextFiles/CourseContext';
import { getCoursesAction } from '../../context/Actions/courseActions';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  styled
} from '@mui/material';

const PageContainer = styled(Box)({
  minHeight: '100vh',
  overflowY:"auto",
  border : "1px solid red",
  backgroundColor: '#f3f4f6',
  paddingTop: '140px',
  paddingLeft: '16px',
  paddingRight: '16px',
  position: 'fixed',
  left: '290px',
  width: 'calc(100% - 350px)',
  top: '80px',
});

const ContentContainer = styled(Box)({
  width: '100%',
  maxWidth: '100%',
  overflowY:"auto",
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});

const HeaderContainer = styled(Paper)(() => ({
  position: 'fixed',
  top: '95px',
  left: '270px',
  width: 'calc(100% - 300px)',
  zIndex: 20,
  backgroundColor: 'white',
  borderBottom: '1px solid #e5e7eb',
  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
}));

const HeaderContent = styled(Box)({
  maxWidth: '90%',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  marginLeft: '15px',
  '@media (min-width: 768px)': {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
});

const EmptyStateContainer = styled(Paper)({
  borderRadius: '12px',
  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  border: '1px solid #f3f4f6',
  padding: '48px',
  textAlign: 'center'
});

const EmptyStateIcon = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '64px',
  width: '64px',
  borderRadius: '50%',
  backgroundColor: '#eff6ff',
  margin: '0 auto 16px auto'
});

const GradientButton = styled(Button)({
  background: 'linear-gradient(to right, #2563eb, #4f46e5)',
  color: 'white',
  fontWeight: 500,
  borderRadius: '8px',
  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  '&:hover': {
    background: 'linear-gradient(to right, #1d4ed8, #4338ca)'
  }
});

const CourseList = () => {
  const { state: { courses, loading, error }, dispatch } = useCourseContext();
  console.log('Courses:', courses, 'Loading:', loading, 'Error:', error);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        await getCoursesAction(dispatch);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };

    fetchCourses();
    console.log('all courses  from  course list', courses);
  }, [dispatch]);

  const Header = () => (
    <HeaderContainer elevation={0} >
      <HeaderContent>
        <Box sx={{ marginBottom: { xs: '8px', md: 0 } }}>
          <Typography variant="h5" fontWeight="bold" color="text.primary">
            Your Courses
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            {loading
              ? "Loading your courses..."
              : !courses || courses.length === 0
                ? "Get started by creating your first course"
                : `You have ${courses?.length} course${courses?.length !== 1 ? 's' : ''}`}

          </Typography>
        </Box>
        <Link to="/teacher/create-course" style={{ textDecoration: 'none' }}>
          <GradientButton
            startIcon={<PlusCircle size={20} />}
            variant="contained"
          >
            Create New Course
          </GradientButton>
        </Link>
      </HeaderContent>
    </HeaderContainer>
  );

  if (loading && courses?.length === 0) {
    return (
      <PageContainer>
        <ContentContainer>
          <Header />
          <EmptyStateContainer>
            <Box sx={{ maxWidth: '448px', margin: '0 auto' }}>
              <EmptyStateIcon>
                <CircularProgress size={32} color="primary" />
              </EmptyStateIcon>
              <Box sx={{ height: '24px', width: '192px', bgcolor: '#e5e7eb', borderRadius: '4px', margin: '0 auto 8px auto' }} />
              <Box sx={{ height: '16px', width: '256px', bgcolor: '#e5e7eb', borderRadius: '4px', margin: '0 auto 24px auto' }} />
              <Box sx={{ height: '40px', width: '192px', bgcolor: '#e5e7eb', borderRadius: '8px', margin: '0 auto' }} />
            </Box>
          </EmptyStateContainer>
        </ContentContainer>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ContentContainer>
          <Header />
          <EmptyStateContainer>
            <Box sx={{ maxWidth: '448px', margin: '0 auto' }}>
              <EmptyStateIcon sx={{ backgroundColor: '#fef2f2' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#dc2626">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </EmptyStateIcon>
              <Typography variant="h6" fontWeight="medium" color="text.primary" mb={2}>
                Error loading courses
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                {error}
              </Typography>
              <GradientButton
                onClick={() => window.location.reload()}
                variant="contained"
              >
                Try Again
              </GradientButton>
            </Box>
          </EmptyStateContainer>
        </ContentContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentContainer >
        <Header />
        {courses?.length === 0 ? (
          <EmptyStateContainer>
            <Box sx={{ maxWidth: '448px', margin: '0 auto' }}>
              <EmptyStateIcon>
                <PlusCircle size={32} color="#2563eb" />
              </EmptyStateIcon>
              <Typography variant="h6" fontWeight="medium" color="text.primary" mb={2}>
                No courses yet
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Create your first course to start sharing knowledge with students.
              </Typography>
              <Link to="/teacher/create-course" style={{ textDecoration: 'none' }}>
                <GradientButton
                  startIcon={<PlusCircle size={20} />}
                  variant="contained"
                >
                  Create Your First Course
                </GradientButton>
              </Link>
            </Box>
          </EmptyStateContainer>
        ) : (
          //  <Grid container spacing={3} sx={{ width: '100%', margin: 0 }}>
          //       {courses?.map((course) => (
          //         <Grid item key={course._id || course.id} xs={12} sm={6} lg={4} xl={3}>
          //           <CourseCard course={course} />
          //         </Grid>
          //       ))}
          //     </Grid>
          <Grid container spacing={3} sx={{ width: '100%', margin: 0 }}>
            {courses?.map((course) => (

              <Grid item key={course._id || course.id} xs={12} sm={6} lg={4} xl={3}>
                <Link to={`/course/details/${course._id}`} style={{ textDecoration: 'none' }}>
                  <CourseCard course={course} />
                </Link>
              </Grid>
            ))}
          </Grid>

        )}
      </ContentContainer>
    </PageContainer>
  );
};

export default CourseList;