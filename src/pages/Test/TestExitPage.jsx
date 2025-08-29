import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid, Chip, Button } from '@mui/material';
import QuestionAnswerViewer from './QuestionAnswerViewer';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/contextFiles/AuthContext';
import { useAssignmentContext } from '../../context/contextFiles/assignmentContext';
 
const infoItemStyle = {
  padding: '8px 12px',
  borderRadius: 2,
  width: 200,
  backgroundColor: '#e3f2fd',
  mb: 1,
  height: 50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};
 
const normalizeQuestions = (questions) => {
  return questions.map((q) => {
    if (q.type === 'coding') {
      return {
        ...q,
        questionText: `**${q.title}**\n\n${q.description}`,
        yourAnswer: q.yourCodingAnswer,
        correctAnswer: `Passed ${q.total_test_cases_passed}/${q.total_test_cases} test cases`,
        isCorrect: q.isCorrect,
      };
    }
    // MCQ already has right fields
    return q;
  });
};
 
const TestResultPage = () => {
  const [testAnswerData, setTestAnswerData] = useState(null);
 
  const { state: { overAllResult } } = useAssignmentContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const { state: { user } } = useAuth();
  const role = user?.role;
 
  // update local state when overAllResult changes
  useEffect(() => {
    if (overAllResult) {
      setTestAnswerData(overAllResult);
    }
  }, [overAllResult]);
 
  // Debugging
  useEffect(() => {
    console.log('the useState data in test exit page is: ', testAnswerData);
    console.log('the overall reslut data from context in test exit page is: ', testAnswerData);
 
  }, [testAnswerData, overAllResult]);
 
  // handle re-fetch if needed
  useEffect(() => {
    if (!overAllResult || (overAllResult?.assessment !== id)) {
      console.log('now we need to fetch the data again otherwise not');
      // you could trigger an API call here if needed
    }
  }, [id, overAllResult]);
 
  if (!testAnswerData || (testAnswerData?.assessment !== id)) {
    return <Box sx={{ color: 'black' }}> Loading...</Box>;
  }
 
  return (
    <Box sx={{ p: 4 }}>
      {/* Big Summary Box */}
      <Paper elevation={0} sx={{ mb: 4, p: 3, borderRadius: 1 }}>
        <Typography variant="h4" sx={{ ml: 1 }} gutterBottom>
          {testAnswerData?.title}
        </Typography>
 
        {role === 'employee' && (
          <Grid container spacing={3} mt={1}>
            <Box sx={{ ...infoItemStyle, backgroundColor: '#ede7f6' }}>
              <Typography component="span" variant="body1" sx={{ fontWeight: 'bold' }} display="flex" alignItems="center">
                Result:{' '}
                <Chip
                  label={testAnswerData?.isPassed ? 'Passed' : 'Failed'}
                  color={testAnswerData?.isPassed ? 'success' : 'error'}
                  size="small"
                  sx={{ fontWeight: 'bold', ml: 1 }}
                />
              </Typography>
            </Box>
 
            <Box sx={infoItemStyle}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Total Questions: {testAnswerData.totalQuestions}
              </Typography>
            </Box>
          </Grid>
        )}
      </Paper>
 
      {/* Questions Breakdown */}
      <Box>
        {normalizeQuestions(testAnswerData?.questions).map((question, index) => (
    <QuestionAnswerViewer
      key={question._id || question.questionId}
      question={question}
      index={index}
      role={role}
    />
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
 