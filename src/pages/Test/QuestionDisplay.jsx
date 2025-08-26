import React from 'react';
import { 
  Box,
  Typography,
  Button,
  Radio,
  FormControlLabel,
  Paper,
  Stack,
  useTheme
} from '@mui/material';
import { HelpOutline, ArrowForward } from '@mui/icons-material';
import CodingIDE from './CodingIDE';

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
  showOutput,
        setShowOutput
}) => {
  const theme = useTheme();

  if (question.type === 'coding') {
    return (
      <Box sx={{ flex: 1, bgcolor: 'background.paper' }}>
        <CodingIDE
          question={question}
          value={codingAnswer}
          onChange={onCodingAnswerChange}
          onSubmit={onCodingSubmit}
           showOutput={showOutput}
        setShowOutput={setShowOutput}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        width: '93vw',
        [theme.breakpoints.up('md')]: { p: 6 },
      }}
    >
      <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
        {/* Question Header */}
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

          {/* Question Text with Markdown */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              bgcolor: 'lightGray',
              borderLeft: 4,
              borderColor: 'gray',
              borderRadius: 1,
            }}
          >
            <MarkdownRenderer text={question.questionText} />
          </Paper>
        </Box>

        {/* Options with Markdown */}
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
                  '&:hover': { bgcolor: 'lightGray' },
                  ...(selectedOption === option._id && {
                    borderColor: 'primary.main',
                    bgcolor: 'lightGray',
                  }),
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
                    <Box sx={{ width: '100%' }}>
                      <MarkdownRenderer text={option.optionText} />
                    </Box>
                  }
                  sx={{
                    width: '100%',
                    m: 0,
                    alignItems: 'flex-start',
                    '& .MuiFormControlLabel-label': {
                      flex: 1,
                    },
                  }}
                />
              </Paper>
            ))}
          </Stack>
        </Box>

        {/* Save & Next Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={onSaveAndNext}
            variant="contained"
            endIcon={<ArrowForward />}
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 'medium',
              textTransform: 'none',
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
