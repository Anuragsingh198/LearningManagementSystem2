import React, { useState, useEffect } from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Button, Stack, Divider, Chip } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { useCourseContext } from '../../context/contextFiles/CourseContext';
import { useAuth } from '../../context/contextFiles/AuthContext';
const serverURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

import axios from 'axios';
import { useAssignmentContext } from '../../context/contextFiles/assignmentContext';


function formatDuration(mins) {
  const hrs = String(Math.floor(mins / 60)).padStart(2, '0');
  const minutes = String(mins % 60).padStart(2, '0');
  return `${hrs}:${minutes}:00`;
}

function TestStartPage() {
  const { id } = useParams();
  const [checked, setChecked] = useState(false);
  const { state: { user } } = useAuth();
  const userToken = user.token;
  const [loading, setLoading] = useState(false);

  const { state: { currentAssessment }, dispatch } = useCourseContext();
  const { state: { testData }, dispatch: assignmentDispatch } = useAssignmentContext();

  const navigate = useNavigate();

  // console.log('the test id is: ', id)
  // console.log('the current test partial data is from context is: ', currentAssessment)

  const getTestData = async () => {
    try {
      const res = await axios.post(
        `${serverURL}/api/assessments/start-assessment`,
        { assessmentId: id },
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      );

      const testData = res.data.data;

      console.log('the question data for coding dispatch is: ', testData.questions)

      const codingQuestions = testData.questions.filter(q => q.type === "coding")

      console.log('the coding questions array is final', codingQuestions)

      
      assignmentDispatch({type: "SET_TEST_DATA", payload: testData })
      assignmentDispatch({ type: "SET_QUESTIONS", payload: codingQuestions });

      
      console.log('the test data from context is in test start page is:', testData)
      return testData;

    } catch (error) {
      console.error('Failed to Start Test', error);
    }
  };


  const handleStart = async () => {
    if (!checked) {
      toast.error("Please confirm you have read all instructions.");
      return;
    }

    setLoading(true);

    console.log("Start Test!");
      let dataToUse = testData;

      if (!testData || testData.assessment !== id) {
        dataToUse = await getTestData();
        }

    setLoading(false);


    navigate(`/assessments/start-test/test/${id}`, { state: { dataToUse } })


  };

  // if (!currentAssessment) {
  //   return <Typography>Loading test info...</Typography>;
  // }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 4, color: 'black' }}>
      <Box mb={2}>
        {/* Title */}
        <Typography variant="h4" fontWeight="bold">
          {currentAssessment?.title}
        </Typography>

        {/* Description */}
        <Typography variant="body1" color="text.secondary" mt={1}>
          {currentAssessment?.description}
        </Typography>

        {/* Topics as rectangular chips */}
        <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
          {currentAssessment?.topics?.map((topic, idx) => (
            <Chip
              key={idx}
              label={topic}
              variant="outlined"
              sx={{
                borderRadius: "6px", // rectangular feel
                fontWeight: 500,
              }}
            />
          ))}
        </Stack>
      </Box>
      {/* Top section */}
      <Box mb={2}>
        <Typography variant="h4" fontWeight="bold">{currentAssessment?.name}</Typography>
        <Typography variant="subtitle1" color="text.secondary">Duration: {formatDuration(currentAssessment?.duration)}</Typography>
      </Box>

      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="body1"><strong>Type:</strong> {currentAssessment?.testType?.toUpperCase()}</Typography>
        <Typography variant="body1"><strong>Questions:</strong> {currentAssessment?.numberOfQuestions}</Typography>
      </Stack>

      <Box
        sx={{
          border: '1px solid #ccc',
          borderRadius: 2,
          p: 2,
          minHeight: 200,
          mb: 3
        }}
      >
        <Typography variant="body1" mb={2}>
          {currentAssessment?.description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>Instructions:</Typography>
        <ul style={{ paddingLeft: 18, margin: 0 }}>
          <li>
            Do not refresh the page during the test as <strong>Test will auto submit</strong>
          </li>
          <li>
            Do not open other tabs or use external help as <strong>Test will auto submit</strong>
          </li>

          <li>Once started, the test must be completed in one go.</li>
          <li>Make sure your internet connection is stable.</li>
        </ul>
      </Box>

      <Box
        sx={{
          borderTop: '1px solid #ccc',
          pt: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
          }
          label="I have read and understood the instructions."
        />
        <Button
          variant="contained"
          disabled={!checked}
          onClick={handleStart}
        >
          {loading ? 'Starting...' : 'Start Test'}
        </Button>
      </Box>


    </Box>
  );
}

export default TestStartPage;
