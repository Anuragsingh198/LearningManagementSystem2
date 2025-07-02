// src/pages/common/Loading.jsx
import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  LinearProgress,
  Fade,
  useTheme,
} from '@mui/material';
import { keyframes } from '@emotion/react';

const bounce = keyframes`
  0%, 40%, 100% {
    transform: translateY(0);
  }
  20% {
    transform: translateY(-10px);
  }
`;

const BlurLoading = () => {
  const theme = useTheme();

  return (
    <Fade in={true} timeout={500}>
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(5px)',
          zIndex: 1300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            borderRadius: 4,
            // boxShadow: 6,
            px: 5,
            py: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minWidth: 280,
            maxWidth: '90%',
          }}
        >
          {/* Bouncing title */}
          {/* <Typography
            variant="h4"
            sx={{
              mb: 2,
              fontWeight: 700,
              animation: `${bounce} 1.8s infinite`,
              color: theme.palette.primary.main,
            }}
          >
            DigiVidya
          </Typography> */}

          {/* Spinner */}
          <CircularProgress
            size={50}
            thickness={4}
            sx={{
              color: theme.palette.secondary.main,
              mb: 2,
            }}
          />

          {/* Linear progress bar
          <Box sx={{ width: '100%' }}>
            <LinearProgress
              sx={{
                height: 6,
                borderRadius: 3,
                '& .MuiLinearProgress-bar': {
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                },
              }}
            />
          </Box> */}

          {/* Optional text */}
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              color: theme.palette.text.secondary,
            }}
          >
            Loading your content...
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
};

export default BlurLoading;
