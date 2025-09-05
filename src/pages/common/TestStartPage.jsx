import React, { useState } from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Button, Stack, Chip, Divider } from '@mui/material';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useCourseContext } from '../../context/contextFiles/CourseContext';
import { useAuth } from '../../context/contextFiles/AuthContext';
import { useAssignmentContext } from '../../context/contextFiles/assignmentContext';
import { Info, Timer, ListChecks } from 'lucide-react';

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
    <Box
      sx={{
        maxWidth: 750,
        mx: 'auto',
        p: 3,
        borderRadius: '4px',
        background: '#fff',
      }}
    >
      {/* Header */}
      <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
        {currentAssessment?.title}
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        {currentAssessment?.description}
      </Typography>

      {/* Topics */}
      <Stack direction="row" spacing={1} flexWrap="wrap" mb={3}>
        {currentAssessment?.topics?.map((topic, idx) => (
          <Chip
            key={idx}
            label={topic}
            size="small"
            sx={{
              borderRadius: '4px',
              fontSize: '0.9rem',
              border: '1px solid #1976d2',
              color: '#1976d2',
              backgroundColor: 'rgba(25, 118, 210, 0.08)',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.15)',
              },
            }}
          />

        ))}
      </Stack>
      <Divider sx={{ my: 2 }} />
      {/* Meta Info */}
      <Stack direction="row" justifyContent="space-between" mb={3}>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <ListChecks size={16} />
          <Typography variant="body2">
            <strong>Type:</strong> {currentAssessment?.testType?.toUpperCase()}
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Timer size={16} />
          <Typography variant="body2">
            <strong>Duration:</strong> {formatDuration(currentAssessment?.duration)}
          </Typography>
        </Stack>

        <Typography variant="body2">
          <strong>Questions:</strong> {currentAssessment?.numberOfQuestions}
        </Typography>
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* Instructions */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" alignItems="center" spacing={0.5} mb={1}>
          <Info size={18} color="#1976d2" />
          <Typography variant="subtitle1" fontWeight="bold">
            Instructions
          </Typography>
        </Stack>
        <ul style={{ paddingLeft: 20, margin: 0, fontSize: '0.95rem', color: '#424242' }}>
          <li>Do not refresh the page (test will auto-submit).</li>
          <li>Do not open other tabs (test will auto-submit).</li>
          <li>Complete the test in one go.</li>
          <li>Ensure a stable internet connection.</li>
        </ul>
      </Box>
      <Divider sx={{ my: 2 }} />
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
        <Button
          variant="contained"
          disabled={!checked}
          onClick={handleStart}
          sx={{
            px: 4,
            py: 1,
            fontWeight: 'bold',
            textTransform: 'none',
            borderRadius: '4px',
            background: checked ? '#1976d2' : '#90caf9',
            boxShadow: 'none',
            '&:hover': {
              background: checked ? '#1565c0' : '#90caf9',
              boxShadow: 'none',
            },
          }}
        >
          {loading ? 'Starting...' : 'Start Test'}
        </Button>
      </Stack>
    </Box>
  );
}

export default TestStartPage;
