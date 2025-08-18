import { Box, Grid, Typography, Button } from '@mui/material';
import TestCard from '../../components/TestCard';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/contextFiles/AuthContext';

const mockTests = [
  {
    name: "Frontend Basics Assessment",
    description: "This test covers HTML, CSS, and basic JavaScript concepts relevant for frontend development roles.",
    topics: ["HTML", "CSS", "JavaScript"],
    dueDate: "2025-07-15",
    duration: 90,
    totalQuestions: 30,
    type: "mcq",
    compulsory: true,
    completed: false,
    _id: 1
  },
  {
    name: "Fullstack Developer Test",
    description: "Covers both frontend and backend development concepts including React and Node.js.",
    topics: ["React", "Node.js", "APIs"],
    dueDate: "2025-07-20",
    duration: 120,
    totalQuestions: 40,
    type: "mcq and coding",
    compulsory: false,
    completed: true,
    _id: 2
  },
  {
    name: "Data Structures & Algorithms",
    description: "Focused on problem-solving skills using DSA. Includes both MCQs and coding exercises.",
    topics: ["Arrays", "Trees", "Dynamic Programming"],
    dueDate: "2025-07-18",
    duration: 150,
    totalQuestions: 25,
    type: "coding",
    compulsory: true,
    completed: false,
    _id: 13
  },
  {
    name: "Frontend Basics Assessment",
    description: "This test covers HTML, CSS, and basic JavaScript concepts relevant for frontend development roles.",
    topics: ["HTML", "CSS", "JavaScript"],
    dueDate: "2025-07-15",
    duration: 90,
    totalQuestions: 30,
    type: "mcq",
    compulsory: true,
    completed: false,
    _id: 14
  },
  {
    name: "Fullstack Developer Test",
    description: "Covers both frontend and backend development concepts including React and Node.js.",
    topics: ["React", "Node.js", "APIs"],
    dueDate: "2025-07-20",
    duration: 120,
    totalQuestions: 40,
    type: "mcq and coding",
    compulsory: false,
    completed: false,
    _id: 15
  },
  {
    name: "Data Structures & Algorithms",
    description: "Focused on problem-solving skills using DSA. Includes both MCQs and coding exercises.",
    topics: ["Arrays", "Trees", "Dynamic Programming"],
    dueDate: "2025-07-18",
    duration: 150,
    totalQuestions: 25,
    type: "coding",
    compulsory: true,
    completed: true,
    _id: 16
  }
];

function MainAssessment() {

  const { state: {user} } = useAuth();

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
          >
            Create Assessment
          </Button>
        </Box>
      )}
    
      <Grid container spacing={2} sx={{display: 'flex', justifyContent: 'center'}}>
        {mockTests.map((test, idx) => (

          <Grid item xs={12} sm={6} md={4} key={idx}>
            <TestCard test={test} role={role}/>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default MainAssessment;
