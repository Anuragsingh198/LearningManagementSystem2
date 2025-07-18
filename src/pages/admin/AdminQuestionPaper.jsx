import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Divider,
  Stack,
  Paper
} from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxHeight: '80vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  overflowY: 'auto',
  borderRadius: 2,
   '&::-webkit-scrollbar': {
    width: '0.4em',
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'gray',
    outline: '1px solid white',
    borderRadius: '4px',
  },
};

const AdminQuestionPaper = ({ isModalOpen, closeModal, questions, handleUploadAssessment }) => {
  return (
    <Modal open={isModalOpen} onClose={closeModal}>
      <Box sx={style}>
        <Typography variant="h5"  sx={{color: 'black'}}>
          Preview: Question Paper
        </Typography>

        <Divider 
  sx={{ 
    my: 2, 
    height: 3,  // or any other height you want
    backgroundColor: 'lightGray', // or any other color
    border: 'none' // this ensures the default border styling doesn't interfere
  }} 
/>

<Typography sx={{color: 'red', mb: 1,}}>
    Please check the questions carefully, these cannot be changed later!
</Typography>

        <Stack spacing={3}>
          {questions.map((q, index) => (
            <Paper key={index} elevation={3} sx={{ p: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Q{index + 1}. {q.questionText}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Options:
              </Typography>
              <ul>
                {q.options.map((opt, i) => (
                  <li key={i} style={{ color: opt === q.correctAnswer ? 'green' : 'inherit' }}>
                    {opt}
                  </li>
                ))}
              </ul>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Correct Answer: <span style={{ color: 'green' }}>{q.correctAnswer}</span>
              </Typography>
            </Paper>
          ))}
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
          <Button onClick={closeModal} variant="outlined" color="secondary">
            Close
          </Button>
          <Button onClick={handleUploadAssessment} variant="contained" color="primary">
            Upload Assessment
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default AdminQuestionPaper;
