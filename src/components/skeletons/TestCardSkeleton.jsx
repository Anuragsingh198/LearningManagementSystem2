import React from 'react';
import { Box, Skeleton, Stack } from '@mui/material';

export const TestCardSkeleton = () => {
  return (
    <Box
      border={1}
      borderColor="grey.300"
      borderRadius={1}
      p={3}
      mb={1}
      sx={{
        width: 550,
        background: '#FFFFFF',
        color: '#222',
      }}
    >
      {/* Top section - Title and Status Chips */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        {/* Title skeleton */}
        <Skeleton variant="text" width="60%" height={26} />

        {/* Status chips skeleton */}
        <Stack spacing={1} direction="row" alignItems="center">
          <Skeleton 
            variant="rectangular" 
            width={80} 
            height={24} 
            sx={{ borderRadius: '4px' }} 
          />
          <Skeleton 
            variant="rectangular" 
            width={100} 
            height={24} 
            sx={{ borderRadius: '4px' }} 
          />
        </Stack>
      </Box>

      {/* Duration and Topics section */}
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
        {/* Duration skeleton */}
        <Box>
          <Skeleton variant="text" width={120} height={20} />
        </Box>

        {/* Topics chips skeleton */}
        <Box>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {[...Array(3)].map((_, idx) => (
              <Skeleton
                key={idx}
                variant="rectangular"
                width={60 + idx * 10}
                height={24}
                sx={{ borderRadius: '4px' }}
              />
            ))}
          </Stack>
        </Box>
      </Box>

      {/* Type and Questions section */}
      <Box mb={1}>
        <Skeleton variant="text" width="70%" height={20} />
      </Box>

      {/* Description section */}
      <Box mb={2}>
        {/* <Skeleton variant="text" width="100%" height={20} sx={{ mb: 0.5 }} /> */}
        {/* <Skeleton variant="text" width="90%" height={20} sx={{ mb: 0.5 }} /> */}
        <Skeleton variant="text" width="75%" height={20} />
      </Box>

      {/* Button section */}
      <Skeleton 
        variant="rectangular" 
        width="100%" 
        height={36} 
        sx={{ borderRadius: '4px' }} 
      />
    </Box>
  );
};
