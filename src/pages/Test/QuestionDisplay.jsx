import React, { useEffect } from 'react';
import { 
  Box,
  Typography,
  Button,
  Radio,
  FormControlLabel,
  Paper,
  Stack,
  Divider,
  useTheme
} from '@mui/material';
import { HelpOutline, ArrowForward } from '@mui/icons-material';
import CodingIDE from './CodingIDE';
import { useAssignmentContext } from '../../context/contextFiles/assignmentContext';
import { getAllLanguageAction } from '../../context/Actions/AssignmentActions';

const QuestionDisplay = ({ 
  question, 
  questionNumber, 
  totalQuestions, 
  selectedOption, 
  onOptionSelect, 
  codingAnswer, 
  onCodingAnswerChange, 
  onSaveAndNext,
  onCodingSubmit,
}) => {
  const theme = useTheme();
  // console.log('this is the  langiages  afwyehqgesahbster  extraction: ' ,codingLanguages.languages )
  if (question.type === 'coding') {
    return (
      <Box sx={{ flex: 1, bgcolor: 'background.paper' }}>
        <CodingIDE
          question={question}
          value={codingAnswer}
          onChange={onCodingAnswerChange}
          onSubmit={onCodingSubmit}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      flex: 1, 
      width: '93vw',
      // bgcolor: 'background.paper',
      [theme.breakpoints.up('md')]: {
        p: 6
      }
    }}>
      <Box sx={{ 
        maxWidth: '100%',
        mx: 'auto'
      }}>
        <Box sx={{ mb: 3 }}>
          <Stack 
            direction="row" 
            justifyContent="space-between" 
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <HelpOutline color="primary" />
              <Typography variant="body2" color="text.secondary">
                Question {questionNumber} of {totalQuestions}
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              Multiple Choice
            </Typography>
          </Stack>
          
          <Paper 
            elevation={0}
            sx={{
              p: 3,
              bgcolor: 'lightGray',
              borderLeft: 4,
              borderColor: 'gray',
              borderRadius: 1
            }}
          >
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              {question.questionText}
            </Typography>
          </Paper>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Stack spacing={2}>
            {question.options?.map((option) => (
              <Paper
                key={option._id}
                elevation={0}
                sx={{
                  p: 2,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  '&:hover': {
                    bgcolor: 'lightGray'
                  },
                  ...(selectedOption === option._id && {
                    borderColor: 'primary.main',
                    bgcolor: 'lightGray'
                  })
                }}
              >
                <FormControlLabel
                  value={option._id}
                  control={
                    <Radio 
                      checked={selectedOption === option._id}
                      onChange={() => onOptionSelect(option._id)}
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body1" color="text.primary">
                      {option.optionText}
                    </Typography>
                  }
                  sx={{
                    width: '100%',
                    m: 0,
                    alignItems: 'flex-start',
                    '& .MuiFormControlLabel-label': {
                      flex: 1
                    }
                  }}
                />
              </Paper>
            ))}
          </Stack>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={onSaveAndNext}
            variant="contained"
            endIcon={<ArrowForward />}
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 'medium',
              textTransform: 'none'
            }}
          >
            Save & Next
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default QuestionDisplay;