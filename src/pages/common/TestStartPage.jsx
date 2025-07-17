import React, { useState, useEffect } from 'react';
import { Box, Typography, Checkbox, FormControlLabel, Button, Stack, Divider } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

// Sample data for mocking (replace with actual fetch if needed)
const mockTests = [
  {
    _id: "1",
    name: "Fullstack Developer Test",
    description: "Covers both frontend and backend development concepts including React and Node.js.",
    topics: ["React", "Node.js", "APIs"],
    dueDate: "2025-07-20",
    duration: 120,
    totalQuestions: 40,
    type: "mcq and coding",
    compulsory: false,
    completed: false
  }
];

function formatDuration(mins) {
  const hrs = String(Math.floor(mins / 60)).padStart(2, '0');
  const minutes = String(mins % 60).padStart(2, '0');
  return `${hrs}:${minutes}:00`;
}

function TestStartPage() {
  const { id } = useParams();
  const [checked, setChecked] = useState(false);
  const [testData, setTestData] = useState(null);

  const navigate = useNavigate(); 


  useEffect(() => {
    // Replace this with an API call
    const found = mockTests.find(test => String(test._id) === id);
    setTestData(found);
  }, [id]);

  const handleStart = () => {
    if (!checked) {
      toast.error("Please confirm you have read all instructions.");
      return;
    }

    console.log("Start Test!");
    navigate('/assessments/start-test/test')
    // Navigate to actual test-taking page or logic
  };

  if (!testData) {
    return <Typography>Loading test info...</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 4, color: 'black' }}>
      {/* Top section */}
      <Box mb={2}>
        <Typography variant="h4" fontWeight="bold">{testData?.name}</Typography>
        <Typography variant="subtitle1" color="text.secondary">Duration: {formatDuration(testData?.duration)}</Typography>
      </Box>

      <Stack direction="row" justifyContent="space-between" mb={2}>
        <Typography variant="body1"><strong>Type:</strong> {testData?.type.toUpperCase()}</Typography>
        <Typography variant="body1"><strong>Questions:</strong> {testData?.totalQuestions}</Typography>
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
          {testData?.description}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" gutterBottom>Instructions:</Typography>
        <ul style={{ paddingLeft: 18, margin: 0 }}>
          <li>Do not refresh the page during the test.</li>
          <li>Do not open other tabs or use external help.</li>
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
          Start Test
        </Button>
      </Box>


    </Box>
  );
}

export default TestStartPage;
