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

  const {
    state: { overAllResult },
  } = useAssignmentContext();
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    state: { user },
  } = useAuth();
  const role = user?.role;

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
    <Box sx={{ p: 4, backgroundColor: "#fff" }}>
      {/* Summary */}
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          p: 3,
          borderRadius: "4px",
          backgroundColor: "#fff",
          border: "1px solid #e0e0e0",
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: "600", mb: 2, color: "#333" }}
        >
          {testAnswerData?.title}
        </Typography>

        {role === "employee" && (
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {/* Result Chip */}
            <Chip
              variant="outlined"
              icon={
                testAnswerData?.isPassed ? (
                  <CheckCircle size={18} style={{ color: "#2e7d32" }} />
                ) : (
                  <XCircle size={18} style={{ color: "#c62828" }} />
                )
              }
              label={`Result: ${testAnswerData?.isPassed ? "Passed" : "Failed"}`}
              sx={{
                borderRadius: "4px",
                fontWeight: "600",
                borderColor: testAnswerData?.isPassed ? "#2e7d32" : "#c62828",
                color: testAnswerData?.isPassed ? "#2e7d32" : "#c62828",
                backgroundColor: testAnswerData?.isPassed
                  ? "#e8f5e9" // soft green bg
                  : "#ffebee", // soft red bg
              }}
            />

            {/* Total Questions Chip */}
            <Chip
              variant="outlined"
              icon={<List size={18} style={{ color: "#1565c0" }} />}
              label={`Total Questions: ${testAnswerData.totalQuestions}`}
              sx={{
                borderRadius: "4px",
                fontWeight: "600",
                borderColor: "#1565c0",
                color: "#1565c0",
                backgroundColor: "#e3f2fd", // soft blue bg
              }}
            />
          </Box>
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

      {/* Back button */}
      <Box textAlign="center" mt={4}>
        <Button
          variant="outlined"
          onClick={() => navigate("/assessments")}
          sx={{
            borderRadius: "4px",
            textTransform: "none",
            fontWeight: "600",
            px: 3,
            py: 1,
            border: "1.5px solid #1976d2",
            color: "#1976d2",
            backgroundColor: "#fff",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: "#e3f2fd",
              borderColor: "#1565c0",
            },
            "&:active": {
              backgroundColor: "#bbdefb",
              borderColor: "#0d47a1",
            },
          }}
        >
          Go back to All Assessments
        </Button>

      </Box>
    </Box>
  );
};

export default TestResultPage;
