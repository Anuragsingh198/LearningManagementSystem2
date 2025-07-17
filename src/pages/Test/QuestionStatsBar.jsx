import React from 'react';
import { 
  Box,
  Typography,
  Button,
  Avatar,
  Stack,
  Divider,
  useTheme
} from '@mui/material';
import { AccessTime, Description } from '@mui/icons-material';

const QuestionStatsBar = ({ 
  title, 
  stats, 
  timeRemaining, 
  onSubmit 
}) => {
  const theme = useTheme();

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
<Box
  sx={{
    bgcolor: 'background.paper',
    borderBottom: 1,
    borderColor: 'divider',
    px: 4, // this adds internal padding from the edge
    py: 2,
    color: 'black',
    width: '100%', // ✅ not 100vw, let parent handle width
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 2,
    boxShadow: 1
  }}
>

      
      <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
        <Stack direction="row" spacing={1} alignItems="center">
          <Description color="primary" />
          <Typography variant="h6" component="h1" fontWeight="medium">
            {title}
          </Typography>
        </Stack>
        
        <Stack 
          direction="row" 
          spacing={3}
          divider={<Divider orientation="vertical" flexItem />}
          alignItems="center"
          flexWrap="wrap"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              <Typography component="span" fontWeight="medium">MCQ:</Typography> {stats.mcqAnswered}/{stats.totalMCQ}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Typography component="span" fontWeight="medium">Visited:</Typography> {stats.mcqVisited}/{stats.totalMCQ}
            </Typography>
          </Stack>
          
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="body2" color="text.secondary">
              <Typography component="span" fontWeight="medium">Coding:</Typography> {stats.codingAnswered}/{stats.totalCoding}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Typography component="span" fontWeight="medium">Coding Visited:</Typography> {stats.codingVisited}/{stats.totalCoding}
            </Typography>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          {/* Visited Legend */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ 
              width: 24, 
              height: 24, 
              color: 'primary.light',
              bgcolor: 'primary.light', 
              border: 1, 
              borderColor: 'primary.main' 
            }} />
            <Typography variant="caption" fontWeight="medium">
              Visited
            </Typography>
          </Stack>

          {/* Answered Legend */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar sx={{ 
              width: 24, 
              height: 24, 
              color: 'success.light',
              bgcolor: 'success.light', 
              border: 1, 
              borderColor: 'success.dark' 
            }} />
            <Typography variant="caption" fontWeight="medium">
              Answered
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={2} alignItems="center">
        <Stack direction="row" spacing={1} alignItems="center">
          <AccessTime color={timeRemaining <= 300 ? 'error' : 'action'} />
          <Typography 
            variant="body1" 
            fontFamily="monospace"
            color={timeRemaining <= 300 ? 'error.main' : 'text.primary'}
          >
            {formatTime(timeRemaining)}
          </Typography>
        </Stack>
        
        <Button
          onClick={onSubmit}
          variant="contained"
          size="medium"
          sx={{
            px: 3,
            fontWeight: 'medium',
            textTransform: 'none'
          }}
        >
          Submit Test
        </Button>
      </Stack>
    </Box>
  );
};

export default QuestionStatsBar;