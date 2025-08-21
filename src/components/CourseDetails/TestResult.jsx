// TestResult.js
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Container,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  XCircle,
  Check,
  X,
  BookOpenCheck,
} from "lucide-react";
import DoneAllIcon from "@mui/icons-material/DoneAll";

export const TestResult = ({ questions, currentTestProgress, onRetake }) => {
  const theme = useTheme();
  const score = currentTestProgress?.score || 0;
  const isPassed = currentTestProgress?.isPassed;
  const totalQuestions = questions?.length || 0;
  const percentage = Math.round((score / totalQuestions) * 100);
  const passed = percentage >= 70;

  // Map of user answers
  const userAnswersMap = {};
  currentTestProgress?.yourAnswers?.forEach((answer) => {
    userAnswersMap[answer.questionId] = answer.selectedOption;
  });

  return (
    <Container maxWidth="md">
      {/* === Result Summary === */}
      <Paper
        sx={{
          p: 3,
          borderRadius: "6px",
          textAlign: "center",
          mb: 2,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
          bgcolor: "background.paper",
        }}
      >
        {/* Header */}
        <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
          {passed ? (
            <DoneAllIcon sx={{ fontSize: 32, color: theme.palette.success.main }} />
          ) : (
            <XCircle size={32} color={theme.palette.error.main} />
          )}

          <Typography variant="h6" fontWeight={600} sx={{ ml: 1 }}>
            {passed ? "Congratulations!" : "Try Again"}
          </Typography>
        </Box>

        {/* Score with chip */}
        <Divider sx={{ my: 1 }} />
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          You scored <strong>{score}</strong> out of{" "}
          <strong>{totalQuestions}</strong>
          <Chip
            size="small"
            variant="outlined"
            label={`${percentage}%`}
            sx={{
              borderColor: passed ? "success.main" : "error.main",
              color: passed ? "success.main" : "error.main",
              fontWeight: 600,
              fontSize: "0.75rem",
              borderRadius: "4px",
              height: "20px",
            }}
          />
        </Typography>
        <Divider sx={{ my: 1 }} />

        {/* Passed / Correct / Incorrect boxes */}
        <Box sx={{ display: "flex", gap: 2, mt: 2, flexWrap: "wrap" }}>
          {/* Passed/Failed */}
          <Box
            sx={{
              flex: 1,
              p: 1.5,
              borderRadius: "4px",
              border: passed ? "1px solid #c8e6c9" : "1px solid #ffcdd2",
              bgcolor: passed ? "#e8f5e9" : "#ffebee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            {passed ? (
              <DoneAllIcon sx={{ fontSize: 18, color: "#2e7d32" }} />
            ) : (
              <XCircle size={18} color="#c62828" />
            )}
            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                color: passed ? "success.dark" : "error.dark",
              }}
            >
              {passed ? "Passed:" : "Failed:"}
            </Typography>
            <Typography
              variant="body2"
              fontWeight="bold"
              color={passed ? "success.main" : "error.main"}
            >
              {score}
            </Typography>
          </Box>

          {/* Correct */}
          <Box
            sx={{
              flex: 1,
              p: 1.5,
              borderRadius: "4px",
              border: "1px solid #90caf9",
              bgcolor: "#e3f2fd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <BookOpenCheck size={18} color="#1976d2" />
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, color: "primary.dark" }}
            >
              Correct:
            </Typography>
            <Typography variant="body2" fontWeight="bold" color="primary.main">
              {score}
            </Typography>
          </Box>

          {/* Incorrect */}
          <Box
            sx={{
              flex: 1,
              p: 1.5,
              borderRadius: "4px",
              border: "1px solid #ffcdd2",
              bgcolor: "#ffebee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <X size={18} color="#c62828" />
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, color: "error.dark" }}
            >
              Incorrect:
            </Typography>
            <Typography variant="body2" fontWeight="bold" color="error.main">
              {totalQuestions - score}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* === Questions Review === */}
      <Paper
        sx={{
          p: 2,
          borderRadius: "6px",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "none",
          maxHeight: "46vh",
          overflowY: "auto",
          mb: 2,
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: theme.palette.grey[100],
            borderRadius: "3px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.grey[400],
            borderRadius: "3px",
          },
        }}
      >
        <Typography variant="subtitle2" fontWeight={600} mb={1.5}>
          Question Review
        </Typography>

        <List disablePadding>
          {questions?.map((question, index) => {
            const userAnswer = userAnswersMap[question._id];
            const isCorrect = userAnswer === question.correctAnswer;

            return (
              <Box key={question._id} sx={{ mb: 1 }}>
                <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={500}>
                        {index + 1}. {question.questionText}
                      </Typography>
                    }
                    secondary={
                      <>
                        {/* User answer */}
                        <Box
                          sx={{
                            mt: 0.8,
                            p: 1,
                            borderRadius: "4px",
                            border: "1px solid",
                            borderColor: isCorrect
                              ? "success.main"
                              : "error.main",
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          {isCorrect ? (
                            <Check size={18} color={theme.palette.success.main} />
                          ) : (
                            <X size={18} color={theme.palette.error.main} />
                          )}
                          <Typography variant="caption">
                            <strong>Your answer:</strong> {userAnswer}
                          </Typography>
                        </Box>

                        {/* Correct answer if wrong */}
                        {!isCorrect && (
                          <Box
                            sx={{
                              mt: 0.5,
                              p: 1,
                              borderRadius: "4px",
                              border: "1px solid #c8e6c9",
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Check size={18} color={theme.palette.success.main} />
                            <Typography variant="caption">
                              <strong>Correct answer:</strong>{" "}
                              {question.correctAnswer}
                            </Typography>
                          </Box>
                        )}
                      </>
                    }
                  />
                </ListItem>

                {index < questions.length - 1 && (
                  <Divider sx={{ my: 1, borderColor: "divider" }} />
                )}
              </Box>
            );
          })}
        </List>
      </Paper>

      {/* Retake button */}
      {!isPassed && (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="outlined"
            onClick={onRetake}
            sx={{
              borderRadius: "4px",
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Retake Test
          </Button>
        </Box>
      )}
    </Container>
  );
};
