import React from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Divider,
  Alert
} from '@mui/material';

const SubmitModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  answeredCount, 
  totalCount,
  isFullScreen // Add this new prop
}) => {
  const unansweredCount = totalCount - answeredCount;

  return (
    <Modal open={isOpen} onClose={onClose}  container={document.fullscreenElement || undefined} >
      <Box
        sx={{
          position: isFullScreen ? 'fixed' : 'absolute', // Change based on fullscreen
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: '400px' },
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
          outline: 'none',
          zIndex: 9999 // Ensure high z-index
        }}
      >
        {/* Rest of your modal content remains the same */}
        <Stack direction="row" alignItems="center" spacing={1} mb={2}>
          <AlertTriangle size={24} color="orange" />
          <Typography variant="h6" component="h2" color="text.primary">
            Submit Test
          </Typography>
        </Stack>
        
        <Box mb={3}>
          <Typography variant="body1" color="text.secondary" mb={2}>
            Are you sure you want to submit the test? This action cannot be undone.
          </Typography>
          
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Total Questions:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {totalCount}
                </Typography>
              </Stack>
              
              <Divider />
              
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Answered:
                </Typography>
                <Typography variant="body2" fontWeight="medium" color="success.main">
                  {answeredCount}
                </Typography>
              </Stack>
              
              <Divider />
              
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Unanswered:
                </Typography>
                <Typography variant="body2" fontWeight="medium" color="error.main">
                  {unansweredCount}
                </Typography>
              </Stack>
            </Stack>
          </Paper>
          
          {unansweredCount > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              You have {unansweredCount} unanswered question(s).
            </Alert>
          )}
        </Box>

        <Stack direction="row" spacing={2}>
          <Button
            onClick={onClose}
            variant="outlined"
            fullWidth
            sx={{ py: 1 }}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="contained"
            fullWidth
            sx={{ py: 1 }}
          >
            Submit Test
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default SubmitModal;