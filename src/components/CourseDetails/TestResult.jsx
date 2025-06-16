// TestResult.js
import { Box, Typography, Paper, Button, Avatar, Chip } from "@mui/material";
import { CheckCircle, Close } from "@mui/icons-material";

export const TestResult = ({ score, totalQuestions, onRetake }) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const passed = percentage >= 70; 

  return (
    <Paper sx={{ p: 4, borderRadius: 3, textAlign: "center" }}>
      <Box sx={{ mb: 4 }}>
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: passed ? "success.light" : "error.light",
            mx: "auto",
            mb: 2,
          }}
        >
          {passed ? (
            <CheckCircle sx={{ fontSize: 60, color: "success.main" }} />
          ) : (
            <Close sx={{ fontSize: 60, color: "error.main" }} />
          )}
        </Avatar>
        <Typography variant="h4" gutterBottom>
          {passed ? "Congratulations!" : "Try Again"}
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          You scored {score} out of {totalQuestions} ({percentage}%)
        </Typography>
        <Chip
          label={passed ? "Passed" : "Failed"}
          color={passed ? "success" : "error"}
          sx={{ mt: 1 }}
        />
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <Button variant="contained" onClick={onRetake}>
          Retake Test
        </Button>
        <Button variant="outlined">Review Answers</Button>
      </Box>
    </Paper>
  );
};
