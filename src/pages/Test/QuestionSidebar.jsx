import React, { useRef } from 'react';
import {
  Box,
  Button,
  Divider,
  Typography,
  Stack,
  IconButton,
  
} from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const QuestionSidebar = ({ 
  questions, 
  currentQuestionIndex, 
  questionStatus, 
  onQuestionSelect 
}) => {
  const scrollRef = useRef(null);

  const scrollAmount = 80; // amount to scroll on each button click

  const scrollUp = () => {
    scrollRef.current?.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
  };

  const scrollDown = () => {
    scrollRef.current?.scrollBy({ top: scrollAmount, behavior: 'smooth' });
  };

  const getButtonStyles = (questionId, isActive) => {
    const status = questionStatus[questionId];
    const baseStyles = {
      width: 48,
      height: 48,
      ml: 4,
      borderRadius: 1,
      fontWeight: 'medium',
      fontSize: '0.875rem',
      borderWidth: 2,
      borderStyle: 'solid',
      minWidth: 0,
      transition: 'all 0.2s',
      '&:hover': {
        transform: 'scale(1.05)'
      }
    };

    if (isActive) baseStyles.boxShadow = '0 0 0 2px #60a5fa';

    switch (status) {
      case 'answered':
        return {
          ...baseStyles,
          bgcolor: 'success.light',
          color: 'common.white',
          borderColor: 'success.main',
          '&:hover': {
            ...baseStyles['&:hover'],
            bgcolor: 'success.main'
          }
        };
      case 'visited':
        return {
          ...baseStyles,
          bgcolor: 'primary.light',
          color: 'text.primary',
          borderColor: 'primary.main',
          '&:hover': {
            ...baseStyles['&:hover'],
            bgcolor: 'primary.main'
          }
        };
      default:
        return {
          ...baseStyles,
          bgcolor: 'grey.300',
          color: 'text.secondary',
          borderColor: 'grey.400',
          '&:hover': {
            ...baseStyles['&:hover'],
            bgcolor: 'grey.400'
          }
        };
    }
  };

  const mcqQuestions = questions.filter(q => q.type === 'mcq');
  const codingQuestions = questions.filter(q => q.type === 'coding');

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        width: 80,
        py: 2,
        px: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {/* Scroll Up Button */}
      <IconButton onClick={scrollUp} size="small">
        <ArrowDropUpIcon />
      </IconButton>

      {/* Scrollable Area */}
      <Box
        ref={scrollRef}
        sx={{
          flexGrow: 1,
          pb: 1,
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 200px)',
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          '-ms-overflow-style': 'none', // IE
          'scrollbar-width': 'none'     // Firefox
        }}
      >
        <Stack spacing={2} marginLeft={1}>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
            MCQ
          </Typography>

          <Stack spacing={1} >
            {mcqQuestions.map((question, index) => {
              const globalIndex = index;
              return (
                <Button
                
                  key={question._id}
                  onClick={() => onQuestionSelect(globalIndex)}
                  sx={getButtonStyles(question._id, currentQuestionIndex === globalIndex)}
                  disableElevation
                >
                  {index + 1}
                </Button>
              );
            })}
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
            Coding
          </Typography>

          <Stack spacing={1} >
            {codingQuestions.map((question, index) => {
              const globalIndex = mcqQuestions.length + index;
              return (
                <Button
                  key={question._id}
                  onClick={() => onQuestionSelect(globalIndex)}
                  sx={getButtonStyles(question._id, currentQuestionIndex === globalIndex)}
                  disableElevation
                >
                  {index + 1}
                </Button>
              );
            })}
          </Stack>
        </Stack>
      </Box>

      {/* Scroll Down Button */}
      <IconButton onClick={scrollDown} size="small">
        <ArrowDropDownIcon />
      </IconButton>
    </Box>
  );
};

export default QuestionSidebar;
