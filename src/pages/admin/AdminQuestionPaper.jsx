import React from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Divider,
  Stack,
  Paper
} from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxHeight: '80vh',
  bgcolor: 'background.paper',
  // boxShadow: 24,
  p: 4,
  overflowY: 'auto',
  borderRadius: 2,
  '&::-webkit-scrollbar': {
    width: '0.4em',
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'gray',
    outline: '1px solid white',
    borderRadius: '4px',
  },
};

const MarkdownRenderer = ({ children }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        code({node, inline, className, children, ...props}) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <div style={{ 
              backgroundColor: '#f6f8fa',
              padding: '0.5em',
              borderRadius: '3px',
              margin: '0.5em 0',
              overflowX: 'auto'
            }}>
              <pre style={{ margin: 0 }}>
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            </div>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        }
      }}
    >
      {children}
    </ReactMarkdown>
  );
};

const AdminQuestionPaper = ({ isModalOpen, closeModal, questions, handleUploadAssessment }) => {
  return (
    <Modal open={isModalOpen} onClose={closeModal}>
      <Box sx={style}>
        <Typography variant="h5" sx={{ color: 'black' }}>
          Preview: Question Paper
        </Typography>

        <Divider 
          sx={{ 
            my: 2, 
            height: 3,
            backgroundColor: 'lightGray',
            border: 'none'
          }} 
        />

        <Typography sx={{ color: 'red', mb: 1 }}>
          Please check the questions carefully, these cannot be changed later!
        </Typography>

<Stack spacing={3}>
  {questions.map((q, index) => (
    <React.Fragment key={index}>
      <Paper elevation={0} sx={{ p: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Q{index + 1}.
        </Typography>
        <Box sx={{ 
          mb: 2,
          '& p': { margin: 0 },
          '& pre': { margin: 0 }
        }}>
          <MarkdownRenderer>{q.questionText}</MarkdownRenderer>
        </Box>
        
        <Typography variant="body2" sx={{ mt: 1 }}>
          Options:
        </Typography>
        <ul style={{ marginTop: 0 }}>
          {q.options.map((opt, i) => (
            <li key={i} style={{ 
              color: opt === q.correctAnswer ? 'green' : 'inherit',
              marginBottom: '0.5em'
            }}>
              <Box sx={{ 
                '& p': { margin: 0 },
                '& pre': { margin: 0 }
              }}>
                <MarkdownRenderer>{opt}</MarkdownRenderer>
              </Box>
            </li>
          ))}
        </ul>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          Correct Answer: <span style={{ color: 'green' }}>
            <MarkdownRenderer>{q.correctAnswer}</MarkdownRenderer>
          </span>
        </Typography>
      </Paper>
      
      {/* Add divider after each question except the last one */}
      {index < questions.length - 1 && (
        <Divider sx={{ 
          my: 1, 
          height: 2,
          backgroundColor: 'lightgray',
          border: 'none'
        }} />
      )}
    </React.Fragment>
  ))}
</Stack>

        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
          <Button onClick={closeModal} variant="outlined" color="secondary">
            Close
          </Button>
          <Button onClick={handleUploadAssessment} variant="contained" color="primary">
            Upload Assessment
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default AdminQuestionPaper;