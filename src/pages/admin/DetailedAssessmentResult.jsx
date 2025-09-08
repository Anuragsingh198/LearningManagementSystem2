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
import { CheckCheck, XCircle, HelpCircle, Printer, X, User, Mail, Badge, CheckCircle2, Percent, BookOpen, Clock } from "lucide-react";

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
                text={`\`\`\`${languageMap[question.language_id] || "text"}\n${yourAnswer || "Not Answered"
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
    if (!overAllResult || !AssessmentOverviewDetails) return;

    // Helper functions
    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      const date = new Date(dateString);
      return date.toLocaleString();
    };
    const calculateDuration = (start, end) => {
      if (!start || !end) return "N/A";
      const startTime = new Date(start);
      const endTime = new Date(end);
      const durationMs = endTime - startTime;
      return Math.floor(durationMs / 60000);
    };
    const languageMap = { 71: "python", 50: "c", 54: "cpp", 62: "java" };

    // Chip HTML
    function chipHtml(label, color, bg, border) {
      return `<span style=\"display:inline-block;padding:5px 12px;border-radius:4px;font-weight:600;border:1.5px solid ${border};background:${bg};color:${color};margin-bottom:8px;\">${label}</span>`;
    }

    // Build Employee Details HTML
    const employeeDetailsHtml = `
      <div style=\"margin-bottom:20px;\">
        <h2 style=\"font-weight:600;\">Employee Details</h2>
        <table style=\"width:100%;border-collapse:collapse;\">
          <tr>
            <td style=\"padding:8px;font-weight:500;\">Name:</td>
            <td style=\"padding:8px;font-weight:600;">${overAllResult.user?.name || "—"}</td>
          </tr>
          <tr>
            <td style=\"padding:8px;font-weight:500;\">Email:</td>
            <td style=\"padding:8px;font-weight:600;">${overAllResult.user?.email || "—"}</td>
          </tr>
          <tr>
            <td style=\"padding:8px;font-weight:500;\">Employee ID:</td>
            <td style=\"padding:8px;font-weight:600;">${overAllResult.user?.employeeId || "—"}</td>
          </tr>
        </table>
      </div>
    `;

    // Build Metrics HTML
    const metricsHtml = `
      <div style=\"margin-bottom:20px;\">
        <h2 style=\"font-weight:600;\">Test Metrics</h2>
        <table style=\"width:100%;border-collapse:collapse;\">
          <tr>
            <td style=\"padding:8px;font-weight:500;\">Status:</td>
            <td style=\"padding:8px;font-weight:600;">${overAllResult.status?.toUpperCase()}</td>
          </tr>
          <tr>
            <td style=\"padding:8px;font-weight:500;\">Score:</td>
            <td style=\"padding:8px;font-weight:600;">${overAllResult.PercentageMarksScore}%</td>
          </tr>
          <tr>
            <td style=\"padding:8px;font-weight:500;\">Marks:</td>
            <td style=\"padding:8px;font-weight:600;">${overAllResult.TotalMarksScored}/${overAllResult.MaxMarks}</td>
          </tr>
          <tr>
            <td style=\"padding:8px;font-weight:500;\">Duration:</td>
            <td style=\"padding:8px;font-weight:600;">${calculateDuration(overAllResult.startedAt, overAllResult.completedAt)} mins</td>
          </tr>
          <tr>
            <td style=\"padding:8px;font-weight:500;\">Start Time:</td>
            <td style=\"padding:8px;font-weight:600;">${formatDate(overAllResult.startedAt)}</td>
          </tr>
          <tr>
            <td style=\"padding:8px;font-weight:500;\">Completion Time:</td>
            <td style=\"padding:8px;font-weight:600;">${formatDate(overAllResult.completedAt)}</td>
          </tr>
        </table>
      </div>
    `;

    // MCQ & Coding Performance HTML
    const mcqPerformanceHtml = `
      <div style=\"margin-bottom:20px;\">
        <h3 style=\"font-weight:600;\">MCQ Performance</h3>
        ${chipHtml(`Correct: ${overAllResult.TotalAnsweredAndCorrectMcqQuestions} / ${overAllResult.TotalMcqQuestions}`, '#1565c0', '#e3f2fd', '#90caf9')}
        ${chipHtml(`Score: ${overAllResult.MarksScoredForMcq} / ${overAllResult.TotalMcqQuestions * overAllResult.MarksForEachMcqQuestion}`, '#1565c0', '#e3f2fd', '#90caf9')}
      </div>
    `;
    const codingPerformanceHtml = `
      <div style=\"margin-bottom:20px;\">
        <h3 style=\"font-weight:600;\">Coding Performance</h3>
        ${chipHtml(`Correct: ${overAllResult.TotalAnsweredAndCorrectCodingQuestions} / ${overAllResult.questions.filter((q) => q.type === "coding").length}`, '#2e7d32', '#e8f5e9', '#81c784')}
        ${chipHtml(`Score: ${overAllResult.MarksScoredForCoding} / ${overAllResult.questions.filter((q) => q.type === "coding").length * overAllResult.MarksForEachCodingQuestion}`, '#2e7d32', '#e8f5e9', '#81c784')}
      </div>
    `;

    // Build Questions HTML (use marked.js for markdown rendering)
    function renderQuestionHtml(question, index, type) {
      let html = `<div style='margin-bottom:20px;padding:15px;border-left:6px solid #1565c0;border-radius:5px;'>`;
      html += `<div style='font-weight:bold;'>Q${index + 1}.</div>`;
      let statusChip = '';
      if (!question.yourAnswer && type === 'mcq') {
        statusChip = chipHtml('Not Answered', '#1565c0', '#e3f2fd', '#1565c0');
      } else if (question.isCorrect) {
        statusChip = chipHtml('Correct', '#2e7d32', '#e8f5e9', '#2e7d32');
      } else {
        statusChip = chipHtml('Incorrect', '#c62828', '#ffebee', '#c62828');
      }
      html += statusChip;
      if (type === "mcq") {
        html += `<div style='margin-bottom:8px;' class='markdown'>${question.questionText}</div>`;
        html += `<div style='font-weight:bold;'>Your Answer:</div>`;
        html += `<div style='border:1px solid ${question.isCorrect ? "green" : "red"};border-radius:4px;padding:8px;background:${question.isCorrect ? "#e8f5e9" : "#ffebee"};margin-bottom:8px;' class='markdown'>${question.yourAnswer || "Not answered"}</div>`;
        if (!question.isCorrect) {
          html += `<div style='font-weight:bold;'>Correct Answer:</div>`;
          html += `<div style='border:1px solid green;border-radius:4px;padding:8px;background:#e8f5e9;margin-bottom:8px;' class='markdown'>${question.correctAnswer}</div>`;
        }
        if (AssessmentOverviewDetails?.questions) {
          const originalQuestion = AssessmentOverviewDetails.questions.find(q => q._id === question.questionId);
          if (originalQuestion && originalQuestion.options) {
            html += `<div style='font-weight:bold;'>All Options:</div>`;
            html += `<ul style='margin:0;padding-left:20px;'>`;
            originalQuestion.options.forEach((option, idx) => {
              let optStyle = '';
              if (option.optionText === question.correctAnswer) {
                optStyle = 'background:#e8f5e9;border:1px solid green;';
              } else if (option.optionText === question.yourAnswer) {
                optStyle = 'background:#ffebee;border:1px solid red;';
              } else {
                optStyle = 'background:#f9f9f9;border:1px solid #ddd;';
              }
              html += `<li style='margin-bottom:4px;padding:6px 10px;border-radius:4px;${optStyle}' class='markdown'>${String.fromCharCode(65 + idx)}. ${option.optionText}</li>`;
            });
            html += `</ul>`;
          }
        }
      } else if (type === "coding") {
        html += `<div style='font-weight:bold;' class='markdown'>${question.title}</div>`;
        html += `<div style='margin-bottom:8px;' class='markdown'>${question.description}</div>`;
        if (question.constraints) {
          html += `<div style='font-style:italic;color:gray;' class='markdown'>Constraints: ${question.constraints}</div>`;
        }
        html += `<div style='font-weight:bold;'>Your Code:</div>`;
        html += `<pre style='background:#f6f8fa;padding:10px;border-radius:4px;' class='markdown'><code>${question.yourCodingAnswer || "Not Answered"}</code></pre>`;
        html += `<div style='font-weight:bold;'>Test Results: ${question.total_test_cases_passed || 0} / ${question.total_test_cases || 0}</div>`;
      }
      html += `</div>`;
      return html;
    }

    let questionsHtml = "<h2 style='font-weight:600;'>Questions and Answers</h2>";
    questionsHtml += "<h3 style='margin-top:20px;'>Multiple Choice Questions</h3>";
    overAllResult.questions.filter(q => q.type === "mcq").forEach((question, idx) => {
      questionsHtml += renderQuestionHtml(question, idx, "mcq");
    });
    questionsHtml += "<h3 style='margin-top:20px;'>Coding Questions</h3>";
    overAllResult.questions.filter(q => q.type === "coding").forEach((question, idx) => {
      questionsHtml += renderQuestionHtml(question, idx, "coding");
    });

    // Final HTML with marked.js for markdown rendering
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Assessment Results</title>
          <script src='https://cdn.jsdelivr.net/npm/marked/marked.min.js'></script>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
            h2, h3 { margin-bottom: 10px; }
            table { margin-bottom: 10px; }
            ul { margin:0; padding-left:20px; }
            li { margin-bottom:4px; }
            code { background:#f0f0f0; padding:2px 4px; border-radius:3px; }
            pre { background:#f6f8fa; padding:10px; border-radius:4px; overflow-x:auto; }
            @media print { .no-print { display: none; } body { padding: 0; margin: 0; } }
          </style>
        </head>
        <body>
          <div style='text-align:center;margin-bottom:20px;border-bottom:2px solid #333;padding-bottom:10px;'>
            <img src='${window.location.origin}/src/assets/logo.png' alt='Logo' style='height:60px;margin-bottom:10px;' />
            <h1 style='font-weight:bold;'>Assessment Results: ${AssessmentOverviewDetails?.title || overAllResult.title}</h1>
            <div>${formatDate(overAllResult.completedAt)}</div>
          </div>
          ${employeeDetailsHtml}
          ${metricsHtml}
          ${mcqPerformanceHtml}
          ${codingPerformanceHtml}
          <div id='questions-section'>${questionsHtml}</div>
          <script>
            // Convert all markdown blocks to HTML using marked
            document.querySelectorAll('.markdown').forEach(function(el) {
              el.innerHTML = marked.parse(el.textContent || el.innerText);
            });
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.onafterprint = () => printWindow.close();
      printWindow.onfocus = () => {
        if (printWindow) {
          printWindow.close();
        }
      };
    }, 350);
  };

  if (!overAllResult) {
    return <div>Loading assessment results...</div>;
  }

  const ResultContent = () => {
    const isPassed = overAllResult.status === "passed"; // ✅ Fix for undefined variable

    return (
      <Box
        ref={contentRef}
        sx={{ p: 3, color: "black" }}
        className="assessment-content"
      >
        {/* Header section */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
            pb: 2,
            borderBottom: "2px solid #333",
          }}
          className="print-header"
        >
          <Typography variant="h4" fontWeight="bold">
            Assessment Results:{" "}
            {AssessmentOverviewDetails?.title || overAllResult.title}
          </Typography>
          <Typography variant="subtitle1">
            {formatDate(overAllResult.completedAt)}
          </Typography>
        </Box>

        {/* Employee Details */}
        <Card sx={{ mb: 1, boxShadow: "none", borderRadius: 0 }}>
          <CardContent >
            <Typography
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: 600,
                mb: 3,
                color: "text.primary",
              }}
            >
              Employee Details
            </Typography>

            <Grid container spacing={4} alignItems="center">
              {/* Name */}
              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <User size={20} strokeWidth={1.6} color="#6b7280" />
                  <Typography variant="body1" color="text.primary" fontWeight={500}>
                    Name:&nbsp;
                    <Typography component="span" fontWeight={600}>
                      {overAllResult.user?.name || "—"}
                    </Typography>
                  </Typography>
                </Box>
              </Grid>

              {/* Email */}
              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Mail size={20} strokeWidth={1.6} color="#6b7280" />
                  <Typography variant="body1" color="text.primary" fontWeight={500}>
                    Email:&nbsp;
                    <Typography component="span" fontWeight={600}>
                      {overAllResult.user?.email || "—"}
                    </Typography>
                  </Typography>
                </Box>
              </Grid>

              {/* Employee ID */}
              <Grid item xs={12} sm={4}>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <Badge size={20} strokeWidth={1.6} color="#6b7280" />
                  <Typography variant="body1" color="text.primary" fontWeight={500}>
                    Employee ID:&nbsp;
                    <Typography component="span" fontWeight={600}>
                      {overAllResult.user?.employeeId || "—"}
                    </Typography>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Divider sx={{ my: 2, mb: -3 }} />
          </CardContent>
        </Card>

        {/* Test metrics */}
        <Card sx={{ mb: 3, boxShadow: "none", borderRadius: 0 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Test Metrics
            </Typography>

            <Grid container spacing={2}>
              {/* Status */}
              <Grid item xs={12} sm={6} md={3}>
                <Chip
                  icon={
                    isPassed ? (
                      <CheckCircle2 size={20} color="#2e7d32" />
                    ) : (
                      <XCircle size={20} color="#c62828" />
                    )
                  }
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body1" fontWeight={500}>
                        Status:
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight={600}
                        color={isPassed ? "success.main" : "error.main"}
                      >
                        {overAllResult.status?.toUpperCase()}
                      </Typography>
                    </Box>
                  }
                  variant="outlined"
                  sx={{
                    width: "100%",
                    justifyContent: "flex-start",
                    borderRadius: "4px",
                    py: 2,
                    px: 1,
                    borderColor: isPassed ? "#a5d6a7" : "#ef9a9a",
                    backgroundColor: isPassed ? "#f1f8f6" : "#fff5f5",
                  }}
                />
              </Grid>

              {/* Score */}
              <Grid item xs={12} sm={6} md={3}>
                <Chip
                  icon={<Percent size={20} color="#1976d2" />}
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body1" fontWeight={500}>
                        Score:
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {overAllResult.PercentageMarksScore}%
                      </Typography>
                    </Box>
                  }
                  variant="outlined"
                  sx={{
                    width: "100%",
                    justifyContent: "flex-start",
                    borderRadius: "4px",
                    py: 2,
                    px: 1,
                    borderColor: "#bbdefb",
                    backgroundColor: "#f5f9ff",
                  }}
                />
              </Grid>

              {/* Marks */}
              <Grid item xs={12} sm={6} md={3}>
                <Chip
                  icon={<BookOpen size={20} color="#6d4c41" />}
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body1" fontWeight={500}>
                        Marks:
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {overAllResult.TotalMarksScored}/{overAllResult.MaxMarks}
                      </Typography>
                    </Box>
                  }
                  variant="outlined"
                  sx={{
                    width: "100%",
                    justifyContent: "flex-start",
                    borderRadius: "4px",
                    py: 2,
                    px: 1,
                    borderColor: "#d7ccc8",
                    backgroundColor: "#fdf9f7",
                  }}
                />
              </Grid>

              {/* Duration */}
              <Grid item xs={12} sm={6} md={3}>
                <Chip
                  icon={<Clock size={20} color="#0288d1" />}
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body1" fontWeight={500}>
                        Duration:
                      </Typography>
                      <Typography variant="body1" fontWeight={600}>
                        {calculateDuration(
                          overAllResult.startedAt,
                          overAllResult.completedAt
                        )}{" "}
                        mins
                      </Typography>
                    </Box>
                  }
                  variant="outlined"
                  sx={{
                    width: "100%",
                    justifyContent: "flex-start",
                    borderRadius: "4px",
                    py: 2,
                    px: 1,
                    borderColor: "#b3e5fc",
                    backgroundColor: "#f4fbfe",
                  }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* MCQ & Coding Performance */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {/* MCQ */}
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 1 }}>
                  MCQ Performance
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid item xs={6}>
                    <Chip
                      label={`Correct: ${overAllResult.TotalAnsweredAndCorrectMcqQuestions} / ${overAllResult.TotalMcqQuestions}`}
                      variant="outlined"
                      sx={{
                        width: "100%",
                        borderRadius: "4px",
                        fontWeight: 500,
                        border: "1px solid #90caf9",
                        backgroundColor: "#f1f8ff",
                        color: "#1565c0",
                        fontSize: "0.9rem",
                        height: "40px",
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Chip
                      label={`Score: ${overAllResult.MarksScoredForMcq} / ${overAllResult.TotalMcqQuestions * overAllResult.MarksForEachMcqQuestion
                        }`}
                      variant="outlined"
                      sx={{
                        width: "100%",
                        borderRadius: "4px",
                        fontWeight: 500,
                        border: "1px solid #90caf9",
                        backgroundColor: "#f1f8ff",
                        color: "#1565c0",
                        fontSize: "0.9rem",
                        height: "40px",
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Coding */}
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 1 }}>
                  Coding Performance
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid item xs={6}>
                    <Chip
                      label={`Correct: ${overAllResult.TotalAnsweredAndCorrectCodingQuestions} / ${overAllResult.questions.filter((q) => q.type === "coding").length
                        }`}
                      variant="outlined"
                      sx={{
                        width: "100%",
                        borderRadius: "4px",
                        fontWeight: 500,
                        border: "1px solid #81c784",
                        backgroundColor: "#f1f8f2",
                        color: "#2e7d32",
                        fontSize: "0.9rem",
                        height: "40px",
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Chip
                      label={`Score: ${overAllResult.MarksScoredForCoding} / ${overAllResult.questions.filter((q) => q.type === "coding").length *
                        overAllResult.MarksForEachCodingQuestion
                        }`}
                      variant="outlined"
                      sx={{
                        width: "100%",
                        borderRadius: "4px",
                        fontWeight: 500,
                        border: "1px solid #81c784",
                        backgroundColor: "#f1f8f2",
                        color: "#2e7d32",
                        fontSize: "0.9rem",
                        height: "40px",
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            {/* Start/End Time */}
            <Grid container spacing={2} sx={{ mt: 3 }}>
              <Grid item xs={12} sm={6}>
                <Chip
                  label={`Start Time: ${formatDate(overAllResult.startedAt)}`}
                  variant="outlined"
                  sx={{
                    width: "100%",
                    borderRadius: "4px",
                    fontWeight: 500,
                    border: "1px solid #b39ddb",
                    backgroundColor: "#f5f0ff",
                    color: "#4527a0",
                    fontSize: "0.9rem",
                    height: "40px",
                    justifyContent: "flex-start",
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Chip
                  label={`Completion Time: ${formatDate(overAllResult.completedAt)}`}
                  variant="outlined"
                  sx={{
                    width: "100%",
                    borderRadius: "4px",
                    fontWeight: 500,
                    border: "1px solid #f48fb1",
                    backgroundColor: "#fff0f5",
                    color: "#880e4f",
                    fontSize: "0.9rem",
                    height: "40px",
                    justifyContent: "flex-start",
                  }}
                />
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
              .filter((q) => q.type === "mcq")
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
              .filter((q) => q.type === "coding")
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
  };


  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, mr: 4, mt: 4 }} className="no-print">
        <Button
          variant="contained"
          startIcon={<Printer size={18} />}
          onClick={handlePrint}
          sx={{ backgroundColor: '#4CAF50', boxShadow: 'none', '&:hover': { backgroundColor: '#45a049', boxShadow: 'none' } }}
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
                sx={{ backgroundColor: '#4CAF50', boxShadow: "none", '&:hover': { backgroundColor: '#45a049', boxShadow: "none" } }}
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