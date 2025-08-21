import React from 'react';
import { Box, Paper, Skeleton, Chip } from '@mui/material';

export const VideoContentSkeleton = () => {
  return (
    <Box sx={{
      width: "100%",
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflowY: 'auto',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    }}>
      <Box sx={{
        height: '80%',
        display: 'flex',
        flexDirection: 'column',
        p: 1
      }}>
        {/* Video Player Skeleton */}
        <Paper sx={{
          backgroundColor: 'black',
          borderRadius: '4px',
          overflow: 'hidden',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Box sx={{
            aspectRatio: '16/9',
            background: 'linear-gradient(135deg, #1e293b, #0f172a)',
            position: 'relative',
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Video placeholder */}
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 0
              }}
            />

            {/* Play button overlay */}
            <Box sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: 'white'
            }}>
              <Skeleton
                variant="circular"
                width={80}
                height={80}
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', mx: 'auto', mb: 2 }}
              />
              <Skeleton variant="text" width={200} height={32} sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', mb: 1 }} />
              <Skeleton variant="text" width={150} height={20} sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
            </Box>
          </Box>

          {/* Video Controls Skeleton */}
          <Box sx={{
            p: 2,
            bgcolor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            {/* Play/Pause button */}
            <Skeleton variant="circular" width={40} height={40} sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }} />

            {/* Progress bar */}
            <Box sx={{ flexGrow: 1 }}>
              <Skeleton variant="rectangular" height={6} sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', borderRadius: 1 }} />
            </Box>

            {/* Time display */}
            <Skeleton variant="text" width={80} height={20} sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }} />

            {/* Volume and fullscreen controls */}
            <Skeleton variant="circular" width={32} height={32} sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
            <Skeleton variant="circular" width={32} height={32} sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)' }} />
          </Box>
        </Paper>
      </Box>

      {/* Video Info Section Skeleton - matching original structure */}
      <Box sx={{ height: '20%', p: 2 }}>
        {/* Warning message skeleton */}
        <Paper sx={{
          bgcolor: '#FFF3E0',
          border: '1px solid #FFB74D',
          borderRadius: '4px',
          p: 2,
          mb: 2
        }}>
          <Skeleton variant="text" width="90%" height={20} />
        </Paper>

        {/* Video details skeleton */}
        <Paper sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '4px', overflow: 'hidden' }}>
          <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
            {/* Video title */}
            <Skeleton variant="text" width="70%" height={40} sx={{ mb: 1 }} />

            {/* Video stats chips */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Skeleton variant="rectangular" width={120} height={32} sx={{ borderRadius: '16px' }} />
            </Box>
          </Box>

          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box>
              {/* Description title */}
              <Skeleton variant="text" width="25%" height={28} sx={{ mb: 1 }} />

              {/* Description content */}
              <Skeleton variant="text" width="95%" height={20} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" width="85%" height={20} sx={{ mb: 0.5 }} />
              <Skeleton variant="text" width="75%" height={20} />
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};
