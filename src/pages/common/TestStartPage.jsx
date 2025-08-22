import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Divider,
  Chip,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { useCourseContext } from '../../context/contextFiles/CourseContext';
import { useAuth } from '../../context/contextFiles/AuthContext';
import axios from 'axios';
import { useAssignmentContext } from '../../context/contextFiles/assignmentContext';
import { Square, CheckSquare2 } from 'lucide-react';

const serverURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

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
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      const testData = res.data.data;

      // console.log('the question data for coding dispatch is: ', testData.questions)

      const codingQuestions = testData.questions.filter(q => q.type === "coding")

      // console.log('the coding questions array is final', codingQuestions)


      assignmentDispatch({ type: 'SET_TEST_DATA', payload: testData });
      assignmentDispatch({ type: 'SET_QUESTIONS', payload: codingQuestions });

      console.log('the test data from context is in test start page is:', testData)
      return testData;

    } catch (error) {
      console.error('Failed to Start Test', error);
    }
  };


  const handleStart = async () => {
    if (!checked) {
      toast.error('Please confirm you have read all instructions.');
      return;
    }

    setLoading(true);

    console.log("Start Test!");
    let dataToUse = testData;

    if (!testData || testData.assessment !== id) {
      dataToUse = await getTestData();
    }

    setLoading(false);
    navigate(`/assessments/start-test/test/${id}`, { state: { dataToUse } });
  };

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

        {/* Topics as outlined chips */}
        <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
          {currentAssessment?.topics?.map((topic, idx) => (
            <Chip
              key={idx}
              label={topic}
              variant="outlined"
              sx={{
                borderRadius: '4px',
                fontWeight: 500,
                borderColor: '#d0d7de',
                backgroundColor: '#f9f9f9',
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* Test info */}
      <Box mb={2}>
        <Typography variant="h4" fontWeight="bold">
          {currentAssessment?.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Duration: {formatDuration(currentAssessment?.duration)}
        </Typography>
      </Box>

      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="body1">
          <strong>Type:</strong> {currentAssessment?.testType?.toUpperCase()}
        </Typography>
        <Typography variant="body1">
          <strong>Questions:</strong> {currentAssessment?.numberOfQuestions}
        </Typography>
      </Stack>

      {/* Instructions box */}
      <Box
        sx={{
          border: '1px solid #d0d7de',
          borderRadius: '4px',
          p: 2,
          minHeight: 200,
          mb: 3,
          backgroundColor: '#fff',
        }}
      >
        <Typography variant="body1" mb={2}>
          {currentAssessment?.description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>
          Instructions:
        </Typography>
        <ul style={{ paddingLeft: 18, margin: 0 }}>
          <li>
            Do not refresh the page during the test as{' '}
            <strong>Test will auto submit</strong>
          </li>
          <li>
            Do not open other tabs or use external help as{' '}
            <strong>Test will auto submit</strong>
          </li>
          <li>Once started, the test must be completed in one go.</li>
          <li>Make sure your internet connection is stable.</li>
        </ul>
      </Box>

      {/* Footer with checkbox + button */}
      <Box
        sx={{
          borderTop: '1px solid #d0d7de',
          pt: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              icon={<Square size={22} />}
              checkedIcon={<CheckSquare2 size={22} />}
              sx={{
                color: '#1976d2',
                '&.Mui-checked': { color: '#1976d2' },
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.08)',
                  borderRadius: '4px',
                },
              }}
            />
          }
          label="I have read and understood the instructions."
          sx={{
            '.MuiFormControlLabel-label': {
              fontSize: '0.95rem',
              fontWeight: 500,
            },
          }}
        />

        <Button
          variant="outlined"
          disabled={!checked || loading}
          onClick={handleStart}
          sx={{
            borderRadius: '4px',
            textTransform: 'none',
            fontWeight: '600',
            px: 3,
            py: 1,
            border: '1.5px solid #1976d2',
            color: '#1976d2',
            backgroundColor: '#fff',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: '#e3f2fd',
              borderColor: '#1565c0',
            },
            '&:active': {
              backgroundColor: '#bbdefb',
              borderColor: '#0d47a1',
            },
          }}
        >
          {loading ? 'Starting...' : 'Start Test'}
        </Button>
      </Box>


    </Box>
  );
}

export default TestStartPage;
