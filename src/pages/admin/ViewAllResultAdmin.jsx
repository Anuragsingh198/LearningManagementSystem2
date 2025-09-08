import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Modal,
  Stack
} from "@mui/material";
import {
  ExpandMore,
  Visibility,
  VisibilityOff,
  CheckCircle,
  RadioButtonUnchecked,
  Person,
  Quiz,
  Schedule,
  Score,
  Description
} from "@mui/icons-material";
import { useAssignmentContext } from "../../context/contextFiles/assignmentContext";
import MuiLoading from "../common/Loading";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import { reviewAssignmentAdmin } from "../../context/Actions/AssignmentActions";
import { useNavigate } from "react-router-dom";

// Markdown renderer component
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

// Modal style
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxHeight: '80vh',
  bgcolor: 'background.paper',
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

function ViewAllResultsAdmin() {
  const { state: { AllEmployeeResult, AssessmentOverviewDetails }, dispatch } = useAssignmentContext();
  
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [isQuestionPaperOpen, setIsQuestionPaperOpen] = useState(false);

    const navigate = useNavigate();

  if (!AllEmployeeResult || !AssessmentOverviewDetails) {
    return <MuiLoading />;
  }

    const handleRowClick = async (userId) => {
    console.log("Clicked User ID:", userId);
    console.log('the rest of the assessment id : ', assessment._id)
    const assessmentId = assessment._id;

    await reviewAssignmentAdmin(dispatch, assessmentId , userId)

    navigate(`/assessments/view-result/${userId}`)
    
  };

  const results = AllEmployeeResult;
  const assessment = AssessmentOverviewDetails;

  // Component for employee results table
  const EmployeeResultsTable = () => (
    
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: 'primary.main' }}>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Employee</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Score</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Percentage</TableCell>
            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Completed At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {results.map((result, index) => (
            <TableRow key={index} hover
             onClick={() => handleRowClick(result.user?._id)}
            >
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person color="primary" />
                  <Typography>{result.user?.name || 'N/A'}</Typography>
                </Box>
              </TableCell>
              <TableCell>{result.user?.employeeId || 'N/A'}</TableCell>
              <TableCell>{result.user?.email || 'N/A'}</TableCell>
              <TableCell>
                <Chip 
                  label={result.status || 'unknown'} 
                  color={result.status === 'passed' ? 'success' : 'error'}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography fontWeight="bold">
                  {result.totalMarksScored || 0}/{result.maxMarks || 0}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip 
                  label={`${result.percentageMarksScore || 0}%`}
                  color={
                    result.percentageMarksScore >= 70 ? 'success' : 
                    result.percentageMarksScore >= 50 ? 'warning' : 'error'
                  }
                />
              </TableCell>
              <TableCell>
                {result.completedAt ? new Date(result.completedAt).toLocaleString() : 'Incomplete'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Admin Question Paper Modal Component
  const AdminQuestionPaperModal = () => (
    <Modal open={isQuestionPaperOpen} onClose={() => setIsQuestionPaperOpen(false)}>
      <Box sx={modalStyle}>
        <Typography variant="h5" sx={{ color: 'black' }}>
          Assessment Question Paper: {assessment.title}
        </Typography>

        <Divider 
          sx={{ 
            my: 2, 
            height: 3,
            backgroundColor: 'lightGray',
            border: 'none'
          }} 
        />

        {/* MCQs Section */}
        {assessment.questions && assessment.questions.length > 0 && (
          <Stack spacing={3}>
            {assessment.questions.map((q, index) => (
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
                        color: opt.optionText === q.correctAnswer ? 'green' : 'inherit',
                        marginBottom: '0.5em'
                      }}>
                        <Box sx={{ 
                          '& p': { margin: 0 },
                          '& pre': { margin: 0 }
                        }}>
                          <MarkdownRenderer>{opt.optionText}</MarkdownRenderer>
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
                
                {index < assessment.questions.length - 1 && (
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
        )}

        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
          <Button 
            onClick={() => setIsQuestionPaperOpen(false)} 
            variant="outlined" 
            color="secondary"
          >
            Close
          </Button>
        </Stack>
      </Box>
    </Modal>
  );

  return (
    <Box sx={{ p: 3, color: 'text.primary' }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Score color="primary" />
            <Typography variant="h5">Employee Results</Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<Description />}
            onClick={() => setIsQuestionPaperOpen(true)}
          >
            View Question Paper
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        
        <EmployeeResultsTable />
      </Paper>

      {/* Question Paper Modal */}
      <AdminQuestionPaperModal />
    </Box>
  );
}

export default ViewAllResultsAdmin;