import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Button } from '@mui/material';
import TestCard from '../../components/TestCard';
import { TestCardSkeleton } from '../../components/skeletons';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/contextFiles/AuthContext';
import { fetchAllAssessment } from '../../context/Actions/courseActions';
import { useCourseContext } from '../../context/contextFiles/CourseContext';



function MainAssessment() {

  const { state: { user } } = useAuth();
  const { state: { allAssessments }, dispatch } = useCourseContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssessmentData = async () => {
      setIsLoading(true);
      await fetchAllAssessment(dispatch);
      setIsLoading(false);
    };
    if(allAssessments.length === 0){
      fetchAssessmentData();
    } else {
      setIsLoading(false);
    }
  }, []);

  console.log('the assessment from the context are in All assessment main page: ', allAssessments)

  const role = user?.role;

  return (
    <Box p={2}>

      {/* <Typography
  sx={{
    color: '#d32f2f', // Red shade for warning
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    mb: 6,
    fontSize: '1.5rem',
    fontWeight: 'bold',
    backgroundColor: '#fff3cd', // light yellow background
    padding: '1rem 2rem',
    borderRadius: '12px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    border: '1px solid #f5c6cb'
  }}
>
  ⚠️ This section is under development
</Typography> */}


      {role === 'instructor' && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, mr: '2vw' }}>
          <Button
            component={Link}
            to="/assessments/create"
            variant="contained"
            color="primary"
            sx={{
              boxShadow: 'none',
              borderRadius: '4px',
              fontWeight: 500,
              textTransform: 'uppercase', 

              backgroundColor: '#1976d2',
              color: '#fff',

              '&:hover': {
                backgroundColor: '#1565c0',
                color: '#fff',
                boxShadow: 'none',
              },

              '&:active': {
                backgroundColor: '#0d47a1',
                color: '#fff',
                boxShadow: 'none',
              },

              '&:focus': {
                outline: '2px solid #90caf9',
                outlineOffset: '2px',
                color: '#fff',
              },

              '&.Mui-disabled': {
                backgroundColor: '#e0e0e0',
                color: '#9e9e9e',
              },
            }}
          >
            Create Assessment
          </Button>
        </Box>
      )}

      <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
        {isLoading ? (
          // Show skeleton loading cards
          [...Array(6)].map((_, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <TestCardSkeleton />
            </Grid>
          ))
        ) : (
          // Show actual test cards
          allAssessments.map((test, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <TestCard test={test} role={role} />
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}

export default MainAssessment;
