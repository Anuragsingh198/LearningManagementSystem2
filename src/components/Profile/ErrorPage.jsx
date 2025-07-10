import React, { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const ErrorSnackbar = ({ message, open, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        severity="error"
        action={
          <IconButton size="small" color="inherit" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

// Example usage in a parent component
export const ExampleUsage = () => {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const showError = (message) => {
    setErrorMessage(message);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <button onClick={() => showError("This is an error!")}>
        Trigger Error
      </button>
      <ErrorSnackbar
        open={open}
        message={errorMessage}
        onClose={handleClose}
      />
    </div>
  );
};

export default ErrorSnackbar;