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
      code({ inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');
        return !inline && match ? (
          <pre
            style={{
              backgroundColor: '#f6f8fa',
              padding: '0.2em',
              borderRadius: '4px',
              margin: '0.1em 0',
              fontSize: '0.85em',
              overflowX: 'auto',
            }}
          >
            <code className={className} {...props}>{children}</code>
          </pre>
        ) : (
          <code
            style={{
              backgroundColor: '#f0f0f0',
              padding: '1px 2px',
              borderRadius: '3px',
              fontSize: '0.85em',
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
  const isCoding = question.type === 'coding';
  const yourAnswer = isMCQ ? question.yourAnswer : isCoding ? question.yourCodingAnswer : question.yourAnswer;
  const isCorrect = isMCQ ? yourAnswer === question.correctAnswer : question.isCorrect;

  const getBorderColor = () => {
    if (!yourAnswer) return '#1976d2';
    return isCorrect ? 'green' : 'red';
  };

  const languageMap = { 71: 'python', 50: 'c', 54: 'cpp', 62: 'java' };

  return (
    <Paper
      sx={{
        mb: 2,
        p: 1.5,
        backgroundColor: 'white',
        borderLeft: `6px solid ${getBorderColor()}`,
        borderRadius: 2,
      }}
    >
      <Stack spacing={1}>
        {/* Question heading */}
        <Typography variant="subtitle1" fontWeight="bold">
          Q{index + 1}.
        </Typography>

        {/* Question content */}
        {isMCQ ? (
          <MarkdownRenderer text={question.questionText} />
        ) : (
          <>
            <Typography variant="subtitle1" fontWeight="bold">{question.title}</Typography>
            <MarkdownRenderer text={question.description} />
            {question.constraints && (
              <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'gray' }}>
                Constraints: {question.constraints}
              </Typography>
            )}
          </>
        )}

        {/* Badge */}
        {role === 'employee' && (
          <Chip
            label={!yourAnswer ? 'Not Answered' : isCorrect ? 'Correct' : 'Incorrect'}
            size="small"
            sx={{
              fontSize: '0.75rem',
              height: 22,
              fontWeight: 500,
              backgroundColor: !yourAnswer ? '#e3f2fd' : '#fafafa',
              border: `1px solid ${!yourAnswer ? '#1976d2' : isCorrect ? 'green' : 'red'}`,
              color: !yourAnswer ? '#1976d2' : isCorrect ? 'green' : 'red',
              width: 'fit-content',
            }}
          />
        )}

        {/* MCQ Answer */}
        {isMCQ && (
          <Stack spacing={1}>
            <Box>
              <Typography variant="caption" fontWeight="bold">Your Answer:</Typography>
              <Box
                sx={{
                  border: yourAnswer ? (isCorrect ? '1px solid green' : '1px solid red') : '1px solid #ccc',
                  borderRadius: 1,
                  p: 1,
                  backgroundColor: yourAnswer ? (isCorrect ? '#e8f5e9' : '#ffebee') : '#f9f9f9',
                }}
              >
                <MarkdownRenderer text={yourAnswer || 'Not answered'} />
              </Box>
            </Box>

            {yourAnswer && !isCorrect && (
              <Box>
                <Typography variant="caption" fontWeight="bold">Correct Answer:</Typography>
                <Box sx={{ border: '1px solid green', borderRadius: 1, p: 1, backgroundColor: '#e8f5e9' }}>
                  <MarkdownRenderer text={question.correctAnswer} />
                </Box>
              </Box>
            )}
          </Stack>
        )}

        {/* Coding Answer */}
        {isCoding && (
          <>
            <Typography variant="caption" fontWeight="bold">Your Code:</Typography>
            <Box sx={{ border: '1px solid #ddd', borderRadius: 1, p: 1, backgroundColor: '#f9f9f9' }}>
              <MarkdownRenderer
                text={`\`\`\`${languageMap[question.language_id] || 'text'}\n${yourAnswer || 'Not Answered'}\n\`\`\``}
              />
            </Box>
            <Typography variant="caption" fontWeight="bold">
              Test Results: {question.total_test_cases_passed || 0} / {question.total_test_cases || 0}
            </Typography>
          </>
        )}

        {/* Written Answers */}
        {!isMCQ && !isCoding && yourAnswer && (
          <>
            <Typography variant="caption" fontWeight="bold">Your Answer:</Typography>
            <Box sx={{ border: '1px solid #ddd', borderRadius: 1, p: 1, backgroundColor: '#f9f9f9' }}>
              <MarkdownRenderer text={yourAnswer} />
            </Box>
          </>
        )}
      </Stack>
    </Paper>
  );
};

export default QuestionAnswerViewer;
