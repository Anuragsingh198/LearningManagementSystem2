import React from 'react';
import { Box, Typography, Paper, Stack, Chip } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

const MarkdownRenderer = ({ text }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    rehypePlugins={[rehypeHighlight]}
    components={{
      code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');
        return !inline && match ? (
          <div
            style={{
              backgroundColor: '#f6f8fa',
              padding: '0.5em',
              borderRadius: '3px',
              margin: '0.5em 0',
              overflowX: 'auto',
            }}
          >
            <pre style={{ margin: 0 }}>
              <code className={className} {...props}>
                {children}
              </code>
            </pre>
          </div>
        ) : (
          <code
            style={{
              backgroundColor: '#f0f0f0',
              padding: '2px 4px',
              borderRadius: '4px',
              fontSize: '0.9em',
            }}
            className={className}
            {...props}
          >
            {children}
          </code>
        );
      },
    }}
  >
    {text}
  </ReactMarkdown>
);

const QuestionAnswerViewer = ({ question, index, role }) => {
  const isMCQ = question.type === 'mcq';
  const isCorrect = question.yourAnswer && question.yourAnswer === question.correctAnswer;

  const getOptionBorder = (optionId) => {
    if (question.yourAnswer === optionId && isCorrect) return '2px solid green';
    if (question.yourAnswer === optionId && !isCorrect) return '2px solid red';
    if (question.correctAnswer === optionId && question.yourAnswer !== optionId)
      return '2px solid green';
    return '1px solid #ccc';
  };

  const getBorderColor = () => {
    if (!question.yourAnswer) return '#1976d2'; // Blue for "Not Answered"
    return isCorrect ? 'green' : 'red';
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
        {/* Question text with Markdown */}
        <Typography variant="h6">Q{index + 1}.</Typography>
        <MarkdownRenderer text={question.questionText} />

        {/* Correct/Incorrect/Not Answered badge */}
        {role === 'employee' && (
          <Chip
            label={
              !question.yourAnswer
                ? 'Not Answered'
                : isCorrect
                ? 'Correct'
                : 'Incorrect'
            }
            sx={{
              fontWeight: 'bold',
              backgroundColor: !question.yourAnswer ? '#e3f2fd' : '#f5f5f5',
              border: `2px solid ${
                !question.yourAnswer ? '#1976d2' : isCorrect ? 'green' : 'red'
              }`,
              color: !question.yourAnswer ? '#1976d2' : isCorrect ? 'green' : 'red',
              width: 'fit-content',
            }}
          />
        )}

        {/* MCQ options with Markdown */}
        {isMCQ && (
          <Stack spacing={1}>
            {question.options.map((opt) => {
              const isYourAnswer = question.yourAnswer === opt._id;
              const isCorrectAnswer = question.correctAnswer === opt._id;

              return (
                <Box
                  key={opt._id}
                  sx={{
                    border: getOptionBorder(opt._id),
                    borderRadius: 2,
                    p: 1.5,
                    backgroundColor: '#f9f9f9',
                  }}
                >
                  <MarkdownRenderer text={opt.optionText} />

                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    {role === 'employee' && isYourAnswer && (
                      <Chip
                        label="Your Answer"
                        size="small"
                        sx={{
                          backgroundColor: '#e3f2fd',
                          color: '#1976d2',
                          fontWeight: 'bold',
                        }}
                      />
                    )}
                    {isCorrectAnswer && (
                      <Chip
                        label="Correct Answer"
                        size="small"
                        sx={{
                          backgroundColor: '#e8f5e9',
                          color: 'green',
                          fontWeight: 'bold',
                        }}
                      />
                    )}
                  </Box>
                </Box>
              );
            })}
          </Stack>
        )}

        {/* Coding/Written answers */}
        {!isMCQ && (
          <>
            <Typography variant="subtitle2">Your Answer:</Typography>
            <Box
              sx={{
                border: '2px solid #ccc',
                borderRadius: 2,
                p: 2,
                backgroundColor: '#f4f4f4',
              }}
            >
              <MarkdownRenderer text={question.yourAnswer || 'Not Answered'} />
            </Box>

            <Typography variant="subtitle2" sx={{ mt: 1 }}>
              Correct Answer:
            </Typography>
            <Box
              sx={{
                border: '2px solid green',
                borderRadius: 2,
                p: 2,
                backgroundColor: '#e8f5e9',
              }}
            >
              <MarkdownRenderer text={question.correctAnswer || 'N/A'} />
            </Box>
          </>
        )}
      </Stack>
    </Paper>
  );
};

export default QuestionAnswerViewer;
