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

export const TestResult = ({ questions, currentTestProgress , onRetake}) => {
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
    <Container maxWidth="md" sx={{ mb: 4, mt: 2,  }}>
      {/* Result Summary Section */}
      <Paper 
        sx={{ 
          p: 4,
          borderRadius: 4, 
          textAlign: "center",
          mb: 4,
          boxShadow: theme.shadows[3]
        }}
      >
        <Box sx={{ mb: 3 }}>
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
            sx={{ mt: 1, mb: 2 }}
          />
          
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Typography variant="body2">
                <Check sx={{ color: "success.main", verticalAlign: "middle" }} /> 
                Correct: {score}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2">
                <Clear sx={{ color: "error.main", verticalAlign: "middle" }} /> 
                Incorrect: {totalQuestions - score}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2">
                Attempts: {currentTestProgress?.retakeCount + 1 || 1}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Questions Review Section */}
   <Paper 
  sx={{ 
    p: 3,
    borderRadius: 4,
    boxShadow: theme.shadows[3],
    maxHeight: "40vh",
    overflowY: "auto",
    mb: 8,
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#f0f0f0',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#a0a0a0',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: '#808080',
    }
  }}
>

        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Question Review
        </Typography>
        
        <List>
          {questions?.map((question, index) => {
            const userAnswer = userAnswersMap[question._id];
            const isCorrect = userAnswer === question.correctAnswer;
            
            return (
              <Box key={question._id} sx={{ mb: 3 }}>
                <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        {index + 1}. {question.questionText}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Box 
                          sx={{ 
                            mt: 2,
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: isCorrect 
                              ? "success.light" 
                              : "error.light",
                            display: "flex",
                            alignItems: "center"
                          }}
                        >
                          {isCorrect ? (
                            <Check sx={{ mr: 1, color: "success.main" }} />
                          ) : (
                            <Clear sx={{ mr: 1, color: "error.main" }} />
                          )}
                          <Typography variant="body2">
                            <strong>Your answer:</strong> {userAnswer}
                          </Typography>
                        </Box>
                        
                        {!isCorrect && (
                          <Box 
                            sx={{ 
                              mt: 1,
                              p: 2,
                              borderRadius: 2,
                              backgroundColor: "success.light",
                              display: "flex",
                              alignItems: "center"
                            }}
                          >
                            <Check sx={{ mr: 1, color: "success.main" }} />
                            <Typography variant="body2">
                              <strong>Correct answer:</strong> {question.correctAnswer}
                            </Typography>
                          </Box>
                        )}
                      </>
                    }
                  />
                </ListItem>
                
                {index < questions.length - 1 && <Divider sx={{ my: 2 }} />}
              </Box>
            );
          })}
        </List>
      </Paper>
      
    { !isPassed && <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <Button variant="contained" onClick={onRetake}>
          Retake Test
        </Button>
      </Box>}
    </Container>
  );
};