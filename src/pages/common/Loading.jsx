import React from 'react';
import { 
  Box,
  CircularProgress,
  Typography,
  LinearProgress,
  Fade,
  useTheme
} from '@mui/material';
import { keyframes } from '@emotion/react';

const bounce = keyframes`
  0%, 40%, 100% {
    transform: translateY(0);
  }
  20% {
    transform: translateY(-15px);
  }
`;

const MuiLoading = () => {
  const theme = useTheme();

  return (
    <Fade in={true} timeout={500}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(135deg, #121212 0%, #1E1E1E 100%)' 
            : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
        }}
      >
        {/* Multi-color circular progress */}
        <Box
          sx={{
            position: 'relative',
            width: 80,
            height: 80,
            mb: 4,
          }}
        >
          <CircularProgress
            variant="determinate"
            value={100}
            size={80}
            thickness={4}
            sx={{
              color: theme.palette.mode === 'dark' 
                ? theme.palette.grey[800] 
                : theme.palette.grey[300],
              position: 'absolute',
            }}
          />
          <CircularProgress
            variant="indeterminate"
            disableShrink
            size={80}
            thickness={4}
            sx={{
              color: theme.palette.primary.main,
              animationDuration: '1.5s',
              position: 'absolute',
              left: 0,
              [`& .MuiCircularProgress-circle`]: {
                strokeLinecap: 'round',
              },
            }}
          />
          <CircularProgress
            variant="indeterminate"
            disableShrink
            size={80}
            thickness={4}
            sx={{
              color: theme.palette.secondary.main,
              animationDuration: '2.5s',
              position: 'absolute',
              left: 0,
              [`& .MuiCircularProgress-circle`]: {
                strokeLinecap: 'round',
              },
            }}
          />
        </Box>

        {/* Bouncing text */}
        <Typography
          variant="h5"
          sx={{
            display: 'flex',
            mb: 3,
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

              <Box
              
              component="span"
              sx={{
                display: 'inline-block',
                mb: 2,
                fontSize: 40
              }}
            >
              DigiVidya
            </Box>
            <Box>
            </Box>

            </Box>

        </Typography>

        {/* Progress bar */}
        <Box sx={{ width: '30%', maxWidth: 300 }}>
          <LinearProgress
            variant="indeterminate"
            sx={{
              height: 6,
              borderRadius: 3,
              background: theme.palette.mode === 'dark' 
                ? theme.palette.grey[800] 
                : theme.palette.grey[300],
              '& .MuiLinearProgress-bar': {
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                borderRadius: 3,
              },
            }}
          />
        </Box>

        {/* Optional subtitle */}
        <Typography
          variant="body2"
          sx={{
            mt: 3,
            color: theme.palette.text.secondary,
          }}
        >
          Preparing your learning environment...
        </Typography>
      </Box>
    </Fade>
  );
};

export default MuiLoading;