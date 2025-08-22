import React from "react";
import { Box, Typography, Paper, Stack, Chip } from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import { CheckCheck, XCircle, HelpCircle } from "lucide-react";

const MarkdownRenderer = ({ text }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    rehypePlugins={[rehypeHighlight]}
    components={{
      code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || "");
        return !inline && match ? (
          <div
            style={{
              backgroundColor: "#f6f8fa",
              padding: "0.5em",
              borderRadius: "4px",
              margin: "0.5em 0",
              overflowX: "auto",
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
              backgroundColor: "#f0f0f0",
              padding: "2px 4px",
              borderRadius: "4px",
              fontSize: "0.9em",
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
  const isMCQ = question.type === "mcq";
  const isCorrect =
    question.yourAnswer && question.yourAnswer === question.correctAnswer;

  const getOptionBorder = (optionId) => {
    if (question.yourAnswer === optionId && isCorrect) return "2px solid #2e7d32";
    if (question.yourAnswer === optionId && !isCorrect) return "2px solid #c62828";
    if (question.correctAnswer === optionId && question.yourAnswer !== optionId)
      return "2px solid #2e7d32";
    return "1px solid #ccc";
  };

  const getBorderColor = () => {
    if (!question.yourAnswer) return "#1565c0";
    return isCorrect ? "#2e7d32" : "#c62828";
  };

  return (
    <Paper
      sx={{
        mb: 3,
        p: 2,
        backgroundColor: "#fff",
        border: "1px solid #e0e0e0",
        borderRadius: "4px",
        borderLeft: `7px solid ${getBorderColor()}`,
        boxShadow: 'none',
      }}
    >
      <Stack spacing={2}>
        {/* Question text with Markdown */}
        <Typography variant="h6">Q{index + 1}.</Typography>
        <MarkdownRenderer text={question.questionText} />

        {/* Correct/Incorrect/Not Answered chip */}
        {role === "employee" && (
          <Chip
            variant="outlined"
            icon={
              !question.yourAnswer ? (
                <HelpCircle size={18} color="#1565c0" />
              ) : isCorrect ? (
                <CheckCheck size={18} color="#2e7d32" />
              ) : (
                <XCircle size={18} color="#c62828" />
              )
            }
            label={
              !question.yourAnswer
                ? "Not Answered"
                : isCorrect
                ? "Correct"
                : "Incorrect"
            }
            sx={{
              fontWeight: "600",
              borderRadius: "4px",
              borderColor: !question.yourAnswer
                ? "#1565c0"
                : isCorrect
                ? "#2e7d32"
                : "#c62828",
              color: !question.yourAnswer
                ? "#1565c0"
                : isCorrect
                ? "#2e7d32"
                : "#c62828",
              backgroundColor: !question.yourAnswer
                ? "#e3f2fd"
                : isCorrect
                ? "#e8f5e9"
                : "#ffebee",
              width: "fit-content",
            }}
          />
        )}

        {/* MCQ options */}
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
                    borderRadius: "4px",
                    p: 1.5,
                    backgroundColor: "#fff",
                  }}
                >
                  <MarkdownRenderer text={opt.optionText} />

                  <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                    {role === "employee" && isYourAnswer && (
                      <Chip
                        variant="outlined"
                        label="Your Answer"
                        size="small"
                        sx={{
                          borderRadius: "4px",
                          borderColor: "#1565c0",
                          color: "#1565c0",
                          backgroundColor: "#e3f2fd",
                          fontWeight: "600",
                        }}
                      />
                    )}
                    {isCorrectAnswer && (
                      <Chip
                        variant="outlined"
                        label="Correct Answer"
                        size="small"
                        sx={{
                          borderRadius: "4px",
                          borderColor: "#2e7d32",
                          color: "#2e7d32",
                          backgroundColor: "#e8f5e9",
                          fontWeight: "600",
                        }}
                      />
                    )}
                  </Box>
                </Box>
              );
            })}
          </Stack>
        )}

        {/* Written / coding answers */}
        {!isMCQ && (
          <>
            <Typography variant="subtitle2">Your Answer:</Typography>
            <Box
              sx={{
                border: "1px solid #d0d7de",
                borderRadius: "4px",
                p: 2,
                backgroundColor: "#fff",
              }}
            >
              <MarkdownRenderer text={question.yourAnswer || "Not Answered"} />
            </Box>

            <Typography variant="subtitle2" sx={{ mt: 1 }}>
              Correct Answer:
            </Typography>
            <Box
              sx={{
                border: "1px solid #2e7d32",
                borderRadius: "4px",
                p: 2,
                backgroundColor: "#e8f5e9",
              }}
            >
              <MarkdownRenderer text={question.correctAnswer || "N/A"} />
            </Box>
          </>
        )}
      </Stack>
    </Paper>
  );
};

export default QuestionAnswerViewer;
