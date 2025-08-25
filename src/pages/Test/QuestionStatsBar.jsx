import React from 'react';
import { 
  Box,
  Typography,
  Button,
  Avatar,
  Stack,
  useTheme,
  Paper
} from '@mui/material';
import { AccessTime, Description } from '@mui/icons-material';

const pastelColors = {
  mcq: { bg: "#fce4ec", border: "#f48fb1" },          // Pink pastel
  visited: { bg: "#e3f2fd", border: "#64b5f6" },      // Blue pastel
  coding: { bg: "#e8f5e9", border: "#81c784" },       // Green pastel
  codingVisited: { bg: "#fff3e0", border: "#ffb74d" } // Orange pastel
};

const NumberChip = ({ value, total, color }) => (
  <Paper
    variant="outlined"
    sx={{
      px: 1.2,
      py: 0.3,
      borderRadius: "4px",
      bgcolor: color.bg,
      borderColor: color.border,
      display: "inline-flex",
      alignItems: "center",
      minWidth: "fit-content"
    }}
  >
    <Typography 
      variant="body2" 
      color="text.primary" 
      fontWeight="medium"
    >
      {value} / {total}
    </Typography>
  </Paper>
);

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
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
        px: 4,
        py: 2,
        color: 'black',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2,
        boxShadow: 'none',
        borderRadius: 2
      }}
    >
      {/* Left Section */}
      <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap">
        <Stack direction="row" spacing={1} alignItems="center">
          <Description color="primary" />
          <Typography variant="h6" component="h1" fontWeight="medium">
            {title}
          </Typography>
        </Stack>
        
        {/* Stats */}
        <Stack direction="row" spacing={3} flexWrap="wrap" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2">MCQ:</Typography>
            <NumberChip 
              value={stats.mcqAnswered} 
              total={stats.totalMCQ} 
              color={pastelColors.mcq} 
            />
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2">Visited:</Typography>
            <NumberChip 
              value={stats.mcqVisited} 
              total={stats.totalMCQ} 
              color={pastelColors.visited} 
            />
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2">Coding:</Typography>
            <NumberChip 
              value={stats.codingAnswered} 
              total={stats.totalCoding} 
              color={pastelColors.coding} 
            />
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2">Coding Visited:</Typography>
            <NumberChip 
              value={stats.codingVisited} 
              total={stats.totalCoding} 
              color={pastelColors.codingVisited} 
            />
          </Stack>
        </Stack>

        {/* Legends */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar
              sx={{
                width: 24,
                height: 24,
                bgcolor: "#e3f2fd",
                color: "#e3f2fd",
                border: 2,
                borderColor: "primary.main"
              }}
            />
            <Typography variant="caption" fontWeight="medium">
              Visited
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Avatar
              sx={{
                width: 24,
                height: 24,
                bgcolor: "#a5d6a7",
                color: "#a5d6a7",
                border: 2,
                borderColor: "#2e7d32"
              }}
            />
            <Typography variant="caption" fontWeight="medium">
              Answered
            </Typography>
          </Stack>
        </Stack>
      </Stack>

      {/* Right Section */}
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
            textTransform: 'none',
            borderRadius: "4px",
            boxShadow: 'none'
          }}
        >
          Submit Test
        </Button>
      </Stack>
    </Box>
  );
};

export default QuestionStatsBar;
