import React from 'react';
import { Box, Typography, Paper, Stack, Chip } from '@mui/material';

const QuestionAnswerViewer = ({ question, index, role }) => {
  const isMCQ = question.type === 'mcq';

  const getOptionBorder = (optionId) => {
    if (question.yourAnswer === optionId && question.correct) return '2px solid green';
    if (question.yourAnswer === optionId && !question.correct) return '2px solid red';
    if (question.correctAnswer === optionId && question.yourAnswer !== optionId) return '2px solid green';
    return '1px solid #ccc';
  };

  const getBorderColor = () => {
    if (question.yourAnswer === null) return '#1976d2'; // Blue
    return question.correct ? 'green' : 'red';
  };

  return (
    <Paper
      sx={{
        mb: 3,
        p: 2,
        backgroundColor: 'white',
        borderLeft: `10px solid ${getBorderColor()}`,
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h6">
          Q{index + 1}. {question.questionText}
        </Typography>

        { role === 'employee' && (question.yourAnswer === null ? (
          <Chip
            label="Not Answered"
            sx={{
              fontWeight: 'bold',
              backgroundColor: '#e3f2fd', // light blue
              border: '2px solid #1976d2', // blue border
              color: '#1976d2',
              width: 'fit-content',
            }}
          />

        ) : (
          <Chip
            label={question.correct ? 'Correct' : 'Incorrect'}
            sx={{
              fontWeight: 'bold',
              backgroundColor: '#f5f5f5', // light gray
              border: `2px solid ${question.correct ? 'green' : 'red'}`,
              color: question.correct ? 'green' : 'red',
              width: 'fit-content',
            }}
          />
        ))}

        {isMCQ && (
          <Stack spacing={1}>
            {question.options.map((opt) => {
              const isYourAnswer = question.yourAnswer === opt._id;
              const isCorrectAnswer = question.correctAnswer === opt._id;
              const showCorrectOnly = question.yourAnswer === null && isCorrectAnswer;

              return (
                <Box
                  key={opt._id}
                  sx={{
                    border: getOptionBorder(opt._id),
                    borderRadius: 2,
                    p: 1.5,
                    backgroundColor: '#f9f9f9',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography>{opt.optionText}</Typography>

                  <Box sx={{ display: 'flex', gap: 1 }}>
                    { role === 'employee' && ( isYourAnswer && (
                      <Chip
                        label="Your Answer"
                        size="small"
                        sx={{ backgroundColor: '#e3f2fd', color: '#1976d2', fontWeight: 'bold' }}
                      />
                    ))}
                    {isCorrectAnswer && (
                      <Chip
                        label={question.yourAnswer === null ? 'Correct Answer' : 'Correct Answer'}
                        size="small"
                        sx={{ backgroundColor: '#e8f5e9', color: 'green', fontWeight: 'bold' }}
                      />
                    )}
                  </Box>
                </Box>
              );
            })}
          </Stack>
        )}

        {!isMCQ && (
          <>
            <Typography variant="subtitle2">Your Answer:</Typography>
              <Box
              sx={{
                whiteSpace: 'pre-wrap',
                backgroundColor: '#f4f4f4',
                p: 2,
                borderRadius: 2,
                  fontFamily: 'Fira Code, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                border: '2px solid #ccc',
              }}
            >
              {question.yourAnswer || 'Not Answered'}
            </Box>
          </>
        )}
      </Stack>
    </Paper>
  );
};

export default QuestionAnswerViewer;
