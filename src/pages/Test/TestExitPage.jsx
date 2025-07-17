import React from 'react';
import { Box, Typography, Paper, Grid, Chip, Button } from '@mui/material';
import QuestionAnswerViewer from './QuestionAnswerViewer'; // imported component
import { testAnswerData } from './TestAnswerData'; // assuming this is defined
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/contextFiles/AuthContext';

function secondsToTime(sec) {
  const minutes = Math.floor(sec / 60);
  const seconds = sec % 60;
  return `${minutes}m ${seconds}s`;
}

const infoItemStyle = {
  padding: '8px 12px',
  borderRadius: 2,
  width: 200,
  backgroundColor: '#e3f2fd', // light blue, try #f3e5f5 for light purple or #e8f5e9 for light green
  mb: 1, // spacing between items
  height: 50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

};

const TestResultPage = () => {
  const {
    title,
    correct,
    wrong,
    unanswered,
    answered,
    totalQuestions,
    passed,
    completedIn,
    questions
  } = testAnswerData;

  const navigate = useNavigate();
  const { state: { user } } = useAuth();
  const role = user?.role;

  return (
    <Box sx={{ p: 4 }}>
      {/* Big Summary Box */}
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          p: 3,
          borderRadius: 1,


        }}
      >
        <Typography variant="h4" sx={{ ml: 1 }} gutterBottom>
          {title}
        </Typography>
      { role === 'employee' && ( 
       <Grid container spacing={3} mt={1}>

          <Box sx={{ ...infoItemStyle, backgroundColor: '#ede7f6' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }} display="flex" alignItems="center">
              Result:{' '}
              <Chip
                label={passed ? 'Passed' : 'Failed'}
                color={passed ? 'success' : 'error'}
                size="small"
                sx={{ fontWeight: 'bold', ml: 1 }}
              />
            </Typography>
          </Box>



          <Box sx={infoItemStyle}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Total Questions: {totalQuestions}</Typography>
          </Box>
          <Box sx={infoItemStyle}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Answered: {answered}</Typography>
          </Box>
          <Box sx={infoItemStyle}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Unanswered: {unanswered}</Typography>
          </Box>



          <Box sx={{ ...infoItemStyle, backgroundColor: '#e8f5e9' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }} color="success.main">
              Correct: {correct}
            </Typography>
          </Box>
          <Box sx={{ ...infoItemStyle, backgroundColor: '#ffebee' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }} color="error.main">
              Wrong: {wrong}
            </Typography>
          </Box>



          <Box sx={infoItemStyle}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Completed In: {secondsToTime(completedIn)}</Typography>
          </Box>


        </Grid>)}
      </Paper>

      {/* Questions Breakdown */}
      <Box>
        {questions.map((question, index) => (
          <QuestionAnswerViewer key={question.questionId} question={question} index={index} role={role} />
        ))}
      </Box>
      <Box textAlign="center" mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/assessments')}
        >
          Go back to All Assessments Tab
        </Button>
      </Box>
    </Box>
  );
};

export default TestResultPage;
