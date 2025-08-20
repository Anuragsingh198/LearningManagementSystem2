import React, { useEffect } from 'react';
import { Box, Grid, Typography, Button } from '@mui/material';
import TestCard from '../../components/TestCard';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/contextFiles/AuthContext';
import { fetchAllAssessment } from '../../context/Actions/courseActions';
import { useCourseContext } from '../../context/contextFiles/CourseContext';

const mockTests = [
  {
    title: "Frontend Basics Assessment",
    description: "This test covers HTML, CSS, and basic JavaScript concepts relevant for frontend development roles.",
    topics: ["HTML", "CSS", "JavaScript"],
    dueDate: "2025-07-15",
    duration: 90,
    numberOfQuestions: 30,
    testType: "mcq",
    isMandatory: true,
    completed: false,
    _id: 1
  },
  {
    title: "Fullstack Developer Test",
    description: "Covers both frontend and backend development concepts including React and Node.js.",
    topics: ["React", "Node.js", "APIs"],
    dueDate: "2025-07-20",
    duration: 120,
    numberOfQuestions: 40,
    testType: "mcq and coding",
    isMandatory: false,
    completed: true,
    _id: 2
  },
  {
    title: "Data Structures & Algorithms",
    description: "Focused on problem-solving skills using DSA. Includes both MCQs and coding exercises.",
    topics: ["Arrays", "Trees", "Dynamic Programming"],
    dueDate: "2025-07-18",
    duration: 150,
    numberOfQuestions: 25,
    testType: "coding",
    isMandatory: true,
    completed: false,
    _id: 13
  },
  {
    title: "Frontend Basics Assessment",
    description: "This test covers HTML, CSS, and basic JavaScript concepts relevant for frontend development roles.",
    topics: ["HTML", "CSS", "JavaScript"],
    dueDate: "2025-07-15",
    duration: 90,
    numberOfQuestions: 30,
    testType: "mcq",
    isMandatory: true,
    completed: false,
    _id: 14
  },
  {
    title: "Fullstack Developer Test",
    description: "Covers both frontend and backend development concepts including React and Node.js.",
    topics: ["React", "Node.js", "APIs"],
    dueDate: "2025-07-20",
    duration: 120,
    numberOfQuestions: 40,
    testType: "mcq and coding",
    isMandatory: false,
    completed: false,
    _id: 15
  },
  {
    title: "Data Structures & Algorithms",
    description: "Focused on problem-solving skills using DSA. Includes both MCQs and coding exercises.",
    topics: ["Arrays", "Trees", "Dynamic Programming"],
    dueDate: "2025-07-18",
    duration: 150,
    numberOfQuestions: 25,
    testType: "coding",
    isMandatory: true,
    completed: true,
    _id: 16
  }
];

function MainAssessment() {

  const { state: { user } } = useAuth();
  const { state: { allAssessments }, dispatch } = useCourseContext();

  useEffect(() => {
    const fetchAssessmentData = async () => {
      await fetchAllAssessment(dispatch);
      
    };
    if(allAssessments.length === 0){
      fetchAssessmentData();
    }
  }, []);

  // console.log('the assessment from the context are: ', allAssessments)

  const role = user?.role;

  if (!allAssessments) {
    return <Box>Loading...</Box>
  }

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
          >
            Create Assessment
          </Button>
        </Box>
      )}

      <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
        {allAssessments.map((test, idx) => (

          <Grid item xs={12} sm={6} md={4} key={idx}>
            <TestCard test={test} role={role} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default MainAssessment;
