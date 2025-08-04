// TestResult.js
import {
  Box,
  Typography,
  Paper,
  Button,
  Avatar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Grid,
  Container
} from "@mui/material";
import { CheckCircle, Close, Check, Clear } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

export const TestResult = ({ questions, currentTestProgress, onRetake }) => {
  const theme = useTheme();
  const score = currentTestProgress?.score || 0;
  const isPassed = currentTestProgress?.isPassed;
  const totalQuestions = questions?.length || 0;
  const percentage = Math.round((score / totalQuestions) * 100);
  const passed = percentage >= 70;

  // Create a map of user's answers for easy lookup
  const userAnswersMap = {};
  currentTestProgress?.yourAnswers?.forEach(answer => {
    userAnswersMap[answer.questionId] = answer.selectedOption;
  });

  return (
    <Container maxWidth="md" >
      {/* Result Summary Section */}
      <Paper
        sx={{
          p: 2,
          borderRadius: 4,
          textAlign: "center",
          mb: 2,
          boxShadow: theme.shadows[3]
        }}
      >
        <Box >
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Avatar
              sx={{
                width: 30,
                height: 30,
                bgcolor: passed ? "success.light" : "error.light",
                mr: 1
              }}
            >
              {passed ? (
                <CheckCircle sx={{ fontSize: 20, color: "success.main" }} />
              ) : (
                <Close sx={{ fontSize: 20, color: "error.main" }} />
              )}
            </Avatar>
            <Typography variant="h6" gutterBottom>
              {passed ? "Congratulations!" : "Try Again"}
            </Typography>
          </Box>


          <Typography
            variant="caption"
            color="text.secondary"
            gutterBottom

          >
            You scored {score} out of {totalQuestions} ({percentage}%)
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              mt: 1
            }}
          >
            <Chip
              size="small"
              label={passed ? "Passed" : "Failed"}
              color={passed ? "success" : "error"}
              sx={{ mt: 0.2, fontSize: '0.75rem', height: 20 }}
            />

            <Grid container spacing={1} alignItems="center" wrap="nowrap">
              <Grid item>
                <Typography variant="caption">
                  <Check sx={{ color: "success.main", fontSize: 16, verticalAlign: "middle", mb: 0.5 }} />
                  Correct: {score}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="caption">
                  <Clear sx={{ color: "error.main", fontSize: 16, verticalAlign: "middle", mb: 0.5 }} />
                  Incorrect: {totalQuestions - score}
                </Typography>
              </Grid>
            </Grid>
          </Box>



        </Box>
      </Paper>

      {/* Questions Review Section */}
      <Paper
        sx={{
          p: 2,
          borderRadius: 2,
          boxShadow: theme.shadows[1],
          maxHeight: "46vh",
          overflowY: "auto",
          mb: 2,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f0f0f0',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#a0a0a0',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#808080',
          }
        }}
      >
        <Typography variant="subtitle1" gutterBottom>
          Question Review
        </Typography>

        <List>
          {questions?.map((question, index) => {
            const userAnswer = userAnswersMap[question._id];
            const isCorrect = userAnswer === question.correctAnswer;

            return (
              <Box key={question._id} sx={{ mb: 0.5 }}>
                <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {index + 1}. {question.questionText}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Box
                          sx={{
                            mt: 1,
                            p: 1,
                            borderRadius: 1,
                            backgroundColor: isCorrect
                              ? "success.light"
                              : "error.light",
                            display: "flex",
                            alignItems: "center"
                          }}
                        >
                          {isCorrect ? (
                            <Check sx={{ mr: 0.5, fontSize: 18, color: "success.main" }} />
                          ) : (
                            <Clear sx={{ mr: 0.5, fontSize: 18, color: "error.main" }} />
                          )}
                          <Typography variant="caption">
                            <strong>Your answer:</strong> {userAnswer}
                          </Typography>
                        </Box>

                        {!isCorrect && (
                          <Box
                            sx={{
                              mt: 0.5,
                              p: 1,
                              borderRadius: 1,
                              backgroundColor: "success.light",
                              display: "flex",
                              alignItems: "center"
                            }}
                          >
                            <Check sx={{ mr: 0.5, fontSize: 18, color: "success.main" }} />
                            <Typography variant="caption">
                              <strong>Correct answer:</strong> {question.correctAnswer}
                            </Typography>
                          </Box>
                        )}
                      </>
                    }
                  />
                </ListItem>

                {index < questions.length - 1 && <Divider sx={{ my: 1 }} />}
              </Box>
            );
          })}
        </List>
      </Paper>


      {!isPassed && <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button variant="contained" onClick={onRetake}>
          Retake Test
        </Button>
      </Box>}
    </Container>
  );
};