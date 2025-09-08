import React, { useEffect, useRef } from 'react';
import { 
  Box, Typography, Paper, Stack, Chip, Grid, Button,
  Card, CardContent, Divider, Dialog, DialogContent, IconButton
} from "@mui/material";
import { useAssignmentContext } from '../../context/contextFiles/assignmentContext';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import { CheckCheck, XCircle, HelpCircle, Printer, X } from "lucide-react";

const MarkdownRenderer = ({ text }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    rehypePlugins={[rehypeHighlight]}
    components={{
      code({ inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || "");
        return !inline && match ? (
          <pre
            style={{
              backgroundColor: "#f6f8fa",
              padding: "0.2em",
              borderRadius: "4px",
              margin: "0.1em 0",
              fontSize: "0.85em",
              overflowX: "auto",
            }}
          >
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        ) : (
          <code
            style={{
              backgroundColor: "#f0f0f0",
              padding: "1px 2px",
              borderRadius: "3px",
              fontSize: "0.85em",
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

const QuestionAnswerViewer = ({ question, index, assessmentDetails }) => {
  const isMCQ = question.type === "mcq";
  const isCoding = question.type === "coding";
  const yourAnswer = isMCQ
    ? question.yourAnswer
    : isCoding
    ? question.yourCodingAnswer
    : question.yourAnswer;
  
  // For MCQ questions, we need to find the correct answer from assessmentDetails
  let correctAnswer = question.correctAnswer;
  let isCorrect = false;
  
  if (isMCQ && assessmentDetails) {
    // Find the question in assessmentDetails to get the full options
    const originalQuestion = assessmentDetails.questions.find(
      q => q._id === question.questionId
    );
    
    if (originalQuestion) {
      correctAnswer = originalQuestion.correctAnswer;
      isCorrect = yourAnswer === correctAnswer;
    } else {
      // Fallback to the correctAnswer from overAllResult
      isCorrect = yourAnswer === correctAnswer;
    }
  } else {
    isCorrect = question.isCorrect;
  }

  const getBorderColor = () => {
    if (!yourAnswer) return "#1565c0";
    return isCorrect ? "#2e7d32" : "#c62828";
  };

  const languageMap = { 71: "python", 50: "c", 54: "cpp", 62: "java" };

  // Get options for MCQ questions from assessmentDetails if available
  let options = [];
  if (isMCQ && assessmentDetails) {
    const originalQuestion = assessmentDetails.questions.find(
      q => q._id === question.questionId
    );
    if (originalQuestion) {
      options = originalQuestion.options;
    }
  }

  return (
    <Paper
      sx={{
        mb: 2,
        p: 1.5,
        backgroundColor: "white",
        borderLeft: `6px solid ${getBorderColor()}`,
        borderRadius: 2,
      }}
      className="question-item"
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
            <Typography variant="subtitle1" fontWeight="bold">
              {question.title}
            </Typography>
            <MarkdownRenderer text={question.description} />
            {question.constraints && (
              <Typography
                variant="caption"
                sx={{ fontStyle: "italic", color: "gray" }}
              >
                Constraints: {question.constraints}
              </Typography>
            )}
          </>
        )}

        {/* Status Chip */}
        <Chip
          variant="outlined"
          icon={
            !yourAnswer ? (
              <HelpCircle size={18} color="#1565c0" />
            ) : isCorrect ? (
              <CheckCheck size={18} color="#2e7d32" />
            ) : (
              <XCircle size={18} color="#c62828" />
            )
          }
          label={
            !yourAnswer
              ? "Not Answered"
              : isCorrect
              ? "Correct"
              : "Incorrect"
          }
          sx={{
            fontWeight: "600",
            borderRadius: "4px",
            borderColor: !yourAnswer
              ? "#1565c0"
              : isCorrect
              ? "#2e7d32"
              : "#c62828",
            color: !yourAnswer
              ? "#1565c0"
              : isCorrect
              ? "#2e7d32"
              : "#c62828",
            backgroundColor: !yourAnswer
              ? "#e3f2fd"
              : isCorrect
              ? "#e8f5e9"
              : "#ffebee",
            width: "fit-content",
          }}
          className="status-chip"
        />

        {/* MCQ Answer */}
        {isMCQ && (
          <Stack spacing={1}>
            <Box>
              <Typography variant="caption" fontWeight="bold">
                Your Answer:
              </Typography>
              <Box
                sx={{
                  border: yourAnswer
                    ? isCorrect
                      ? "1px solid green"
                      : "1px solid red"
                    : "1px solid #ccc",
                  borderRadius: 1,
                  p: 1,
                  backgroundColor: yourAnswer
                    ? isCorrect
                      ? "#e8f5e9"
                      : "#ffebee"
                    : "#f9f9f9",
                }}
                className="answer-box"
              >
                <MarkdownRenderer text={yourAnswer || "Not answered"} />
              </Box>
            </Box>

            {/* Show correct answer if not answered OR answered incorrectly */}
            {(!yourAnswer || !isCorrect) && (
              <Box>
                <Typography variant="caption" fontWeight="bold">
                  Correct Answer:
                </Typography>
                <Box
                  sx={{
                    border: "1px solid green",
                    borderRadius: 1,
                    p: 1,
                    backgroundColor: "#e8f5e9",
                  }}
                  className="correct-answer-box"
                >
                  <MarkdownRenderer text={correctAnswer} />
                </Box>
              </Box>
            )}

            {/* Show all options if available from assessmentDetails */}
            {options.length > 0 && (
              <Box>
                <Typography variant="caption" fontWeight="bold">
                  All Options:
                </Typography>
                <Stack spacing={0.5} sx={{ mt: 1 }}>
                  {options.map((option, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        p: 1,
                        borderRadius: 1,
                        backgroundColor: option.optionText === correctAnswer 
                          ? "#e8f5e9" 
                          : option.optionText === yourAnswer 
                            ? "#ffebee" 
                            : "#f9f9f9",
                        border: option.optionText === correctAnswer 
                          ? "1px solid green" 
                          : option.optionText === yourAnswer 
                            ? "1px solid red" 
                            : "1px solid #ddd",
                      }}
                    >
                      <Typography variant="body2">
                        {String.fromCharCode(65 + idx)}. {option.optionText}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        )}

        {/* Coding Answer */}
        {isCoding && (
          <>
            <Typography variant="caption" fontWeight="bold">
              Your Code:
            </Typography>
            <Box
              sx={{
                border: "1px solid #ddd",
                borderRadius: 1,
                p: 1,
                backgroundColor: "#f9f9f9",
              }}
              className="code-box"
            >
              <MarkdownRenderer
                text={`\`\`\`${languageMap[question.language_id] || "text"}\n${
                  yourAnswer || "Not Answered"
                }\n\`\`\``}
              />
            </Box>
            <Typography variant="caption" fontWeight="bold">
              Test Results: {question.total_test_cases_passed || 0} /{" "}
              {question.total_test_cases || 0}
            </Typography>
          </>
        )}

        {/* Written Answers */}
        {!isMCQ && !isCoding && yourAnswer && (
          <>
            <Typography variant="caption" fontWeight="bold">
              Your Answer:
            </Typography>
            <Box
              sx={{
                border: "1px solid #ddd",
                borderRadius: 1,
                p: 1,
                backgroundColor: "#f9f9f9",
              }}
            >
              <MarkdownRenderer text={yourAnswer} />
            </Box>
          </>
        )}
      </Stack>
    </Paper>
  );
};

function DetailedAssessmentResult() {
  const { state: { overAllResult, AssessmentOverviewDetails } } = useAssignmentContext();
  const [printMode, setPrintMode] = React.useState(false);
  const contentRef = useRef(null);
  
  useEffect(() => {
    console.log('the individual data is: ', overAllResult);
    console.log('the test details are: ', AssessmentOverviewDetails);
  }, [overAllResult, AssessmentOverviewDetails]);

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Calculate duration in minutes
  const calculateDuration = (start, end) => {
    if (!start || !end) return "N/A";
    const startTime = new Date(start);
    const endTime = new Date(end);
    const durationMs = endTime - startTime;
    return Math.floor(durationMs / 60000); // Convert to minutes
  };

  const handlePrint = () => {
    setPrintMode(true);
  };

  const handleClosePrint = () => {
    setPrintMode(false);
  };

  const handlePrintDirectly = () => {
    const content = contentRef.current;
    if (!content) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Assessment Results</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              color: #333;
            }
            .print-header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
            }
            .metrics-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 15px;
              margin-bottom: 20px;
            }
            .metric-item {
              padding: 10px;
              background-color: #f5f5f5;
              border-radius: 5px;
            }
            .question-item {
              margin-bottom: 20px;
              padding: 15px;
              border-left: 6px solid;
              border-radius: 5px;
              page-break-inside: avoid;
            }
            .code-box, .answer-box, .correct-answer-box {
              border: 1px solid #ddd;
              border-radius: 4px;
              padding: 10px;
              background-color: #f9f9f9;
              margin: 5px 0;
            }
            .correct-answer-box {
              border-color: green;
              background-color: #e8f5e9;
            }
            .status-chip {
              padding: 5px 10px;
              border-radius: 4px;
              font-weight: bold;
              display: inline-block;
              margin: 5px 0;
            }
            pre {
              background-color: #f6f8fa;
              padding: 10px;
              border-radius: 4px;
              overflow-x: auto;
            }
            code {
              background-color: #f0f0f0;
              padding: 2px 4px;
              border-radius: 3px;
            }
            @media print {
              .no-print {
                display: none;
              }
              body {
                padding: 0;
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    
    // Wait for content to load then print
    setTimeout(() => {
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
    }, 250);
  };

  if (!overAllResult) {
    return <div>Loading assessment results...</div>;
  }

  const ResultContent = () => (
    <Box ref={contentRef} sx={{ p: 3, color: 'black' }} className="assessment-content">
      {/* Header section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pb: 2, borderBottom: '2px solid #333' }} className="print-header">
        <Typography variant="h4" fontWeight="bold">
          Assessment Results: {AssessmentOverviewDetails?.title || overAllResult.title}
        </Typography>
        <Typography variant="subtitle1">
          {formatDate(overAllResult.completedAt)}
        </Typography>
      </Box>

      {/* Assessment description */}
      {/* {AssessmentOverviewDetails?.description && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Assessment Description
            </Typography>
            <Typography>
              {AssessmentOverviewDetails.description}
            </Typography>
          </CardContent>
        </Card>
      )} */}

      {/* User information */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            User Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography><strong>Name:</strong> {overAllResult.user?.name}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography><strong>Email:</strong> {overAllResult.user?.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography><strong>Employee ID:</strong> {overAllResult.user?.employeeId}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Test metrics */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Test Metrics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center', backgroundColor: overAllResult.status === 'passed' ? '#e8f5e9' : '#ffebee' }}>
                <Typography variant="h6">Status</Typography>
                <Typography variant="h5" color={overAllResult.status === 'passed' ? 'success.main' : 'error.main'}>
                  {overAllResult.status?.toUpperCase()}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">Score</Typography>
                <Typography variant="h5">{overAllResult.PercentageMarksScore}%</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">Marks</Typography>
                <Typography variant="h5">{overAllResult.TotalMarksScored}/{overAllResult.MaxMarks}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h6">Duration</Typography>
                <Typography variant="h5">
                  {calculateDuration(overAllResult.startedAt, overAllResult.completedAt)} mins
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">MCQ Performance</Typography>
              <Typography>
                Correct: {overAllResult.TotalAnsweredAndCorrectMcqQuestions} / {overAllResult.TotalMcqQuestions}
              </Typography>
              <Typography>
                Score: {overAllResult.MarksScoredForMcq} / {overAllResult.TotalMcqQuestions * overAllResult.MarksForEachMcqQuestion}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="h6">Coding Performance</Typography>
              <Typography>
                Correct: {overAllResult.TotalAnsweredAndCorrectCodingQuestions} / {overAllResult.questions.filter(q => q.type === 'coding').length}
              </Typography>
              <Typography>
                Score: {overAllResult.MarksScoredForCoding} / {overAllResult.questions.filter(q => q.type === 'coding').length * overAllResult.MarksForEachCodingQuestion}
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Start Time:</strong> {formatDate(overAllResult.startedAt)}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Completion Time:</strong> {formatDate(overAllResult.completedAt)}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Questions section */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Questions and Answers
          </Typography>
          
          {/* MCQ Questions */}
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Multiple Choice Questions
          </Typography>
          {overAllResult.questions
            .filter(q => q.type === 'mcq')
            .map((question, index) => (
              <QuestionAnswerViewer 
                key={question.questionId} 
                question={question} 
                index={index} 
                assessmentDetails={AssessmentOverviewDetails}
              />
            ))}
          
          {/* Coding Questions */}
          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            Coding Questions
          </Typography>
          {overAllResult.questions
            .filter(q => q.type === 'coding')
            .map((question, index) => (
              <QuestionAnswerViewer 
                key={question._id} 
                question={question} 
                index={index} 
                assessmentDetails={AssessmentOverviewDetails}
              />
            ))}
        </CardContent>
      </Card>
    </Box>
  );

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, mr: 4, mt: 4 }} className="no-print">
        <Button 
          variant="contained" 
          startIcon={<Printer size={18} />}
          onClick={handlePrint}
          sx={{ backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#45a049' } }}
        >
          Print Results
        </Button>
      </Box>
      
      <ResultContent />
      
      <Dialog 
        open={printMode} 
        onClose={handleClosePrint}
        maxWidth="lg"
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }} className="no-print">
            <IconButton onClick={handleClosePrint}>
              <X />
            </IconButton>
          </Box>
          <Box sx={{ p: 3 }}>
            <ResultContent />
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }} className="no-print">
              <Button 
                variant="contained" 
                startIcon={<Printer size={18} />}
                onClick={handlePrintDirectly}
                sx={{ backgroundColor: '#4CAF50', '&:hover': { backgroundColor: '#45a049' } }}
              >
                Print Now
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default DetailedAssessmentResult;