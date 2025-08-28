import React, { useState } from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Button, Stack, Divider, Chip } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useCourseContext } from '../../context/contextFiles/CourseContext';
import { useAuth } from '../../context/contextFiles/AuthContext';
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
  const [loading, setLoading] = useState(false);

  const { state: { user } } = useAuth();
  const userToken = user.token;

  const { state: { currentAssessment } } = useCourseContext();
  const { state: { testData }, dispatch: assignmentDispatch } = useAssignmentContext();

  const navigate = useNavigate();

  const getTestData = async () => {
    try {
      const res = await axios.post(
        `${serverURL}/api/assessments/start-assessment`,
        { assessmentId: id },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      const testData = res.data.data;
      const codingQuestions = testData.questions.filter(q => q.type === "coding");

      assignmentDispatch({ type: "SET_TEST_DATA", payload: testData });
      assignmentDispatch({ type: "SET_QUESTIONS", payload: codingQuestions });

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

    let dataToUse = testData;
    if (!testData || testData.assessment !== id) {
      dataToUse = await getTestData();
    }

    setLoading(false);
    navigate(`/assessments/start-test/test/${id}`, { state: { dataToUse } });
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', p: 2, color: 'black' }}>
      {/* Header */}
      <Typography variant="h5" fontWeight="bold">{currentAssessment?.title}</Typography>
      <Typography variant="body2" color="text.secondary" mt={0.5}>
        {currentAssessment?.description}
      </Typography>

      {/* Chips */}
      <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
        {currentAssessment?.topics?.map((topic, idx) => (
          <Chip key={idx} label={topic} size="small" variant="outlined" />
        ))}
      </Stack>

      {/* Meta Info */}
      <Stack direction="row" justifyContent="space-between" mt={2} mb={2}>
        <Typography variant="body2"><strong>Type:</strong> {currentAssessment?.testType?.toUpperCase()}</Typography>
        <Typography variant="body2"><strong>Duration:</strong> {formatDuration(currentAssessment?.duration)}</Typography>
        <Typography variant="body2"><strong>Questions:</strong> {currentAssessment?.numberOfQuestions}</Typography>
      </Stack>

      {/* Instructions */}
      <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 2, mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold">Instructions:</Typography>
        <ul style={{ paddingLeft: 18, margin: 0, fontSize: '0.9rem' }}>
          <li>Do not refresh the page (test will auto-submit).</li>
          <li>Do not open other tabs (test will auto-submit).</li>
          <li>Complete the test in one go.</li>
          <li>Ensure a stable internet connection.</li>
        </ul>
      </Box>

      {/* Start Button */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <FormControlLabel
          control={<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} />}
          label="I have read and understood the instructions."
          sx={{
            '.MuiFormControlLabel-label': {
              fontSize: '0.95rem',
              fontWeight: 500,
            },
          }}
        />
        <Button variant="contained" disabled={!checked} onClick={handleStart}>
          {loading ? 'Starting...' : 'Start Test'}
        </Button>
      </Stack>
    </Box>
  );
}

export default TestStartPage;
