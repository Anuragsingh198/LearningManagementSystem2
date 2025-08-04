import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  LinearProgress,
  Grid,
  Chip,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { NoVideosFound } from "./NoContentFoundPage";
import { TestResult } from "./TestResult";
import { useCourseContext } from "../../context/contextFiles/CourseContext";
import { SubmitTest, testProgress } from "../../context/Actions/courseActions";
import { useParams } from "react-router-dom";

export const QuizContent = ({
  questions,
  currentQuestion,
  setCurrentQuestion,
  currentTest,
  tests,
}) => {
  const moduleId = useParams().moduleId;
  const courseId = useParams().courseId;
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setisLoading] = useState(false)
  const { state: { oneCourseProgress, oneModuleProgress, currentTestProgress, allTestProgress }, dispatch } = useCourseContext();
  const currentQ = questions && questions[currentQuestion];
  const TestStatus = currentTestProgress?.status;
  const [isRetaking, setIsRetaking] = useState(false);

  
  if (!questions || questions.length === 0) {
    return <NoVideosFound />;
  }

  useEffect(() => {
  setUserAnswers({});
  setSubmitted(false);
  setIsRetaking(false);
  setCurrentQuestion(0);
}, [moduleId, courseId]);

  const handleTestProgress = async () => {
    const progressExists = allTestProgress.find(
      (x) => x.testId === currentTest._id
    );

    if (!progressExists) {
      const createdProgress = await testProgress(
        oneCourseProgress.courseId,
        currentTestProgress,
        oneModuleProgress.moduleId,
        tests[currentTest]._id,
        dispatch
      );
    } else {
      dispatch({ type: 'TEST_PROGRESS', payload: progressExists });
    }
  };

  useEffect(() => {
    handleTestProgress();
    console.log("this is the  text progresss from te  useeffect : ", allTestProgress)
  }, []);

  const handleSubmit = async () => {
    let correctAnswers = 0;
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        correctAnswers++;
      }
    });

    try {
      setisLoading(true);
      const testId = tests[currentTest]._id;
      await SubmitTest({ testId, userAnswers, moduleId, courseId, dispatch });
      setisLoading(false);
      setSubmitted(true);
      setIsRetaking(false)
    } catch (error) {
      console.error("Error submitting test:", error);
      setisLoading(false);
    }
  };

  useEffect(() => {
    console.log("this is the current test progress : ", currentTestProgress)
  }, [currentTestProgress])

const handleRetake = () => {
  console.log('handle retake clicked: ');
  setUserAnswers({});
  setSubmitted(false);
  setIsRetaking(true);  // now in retake mode
  setCurrentQuestion(0);
};


    useEffect(() => {
    console.log("submitted ", submitted)
  }, [submitted])

  const handleAnswerClick = (questionIndex, optionText) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionText,
    }));
  };

if (!currentTestProgress || currentTestProgress.testId !== tests[currentTest]._id) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <CircularProgress />
    </Box>
  );
}


if(!TestStatus )
{ return (
    <Box
      sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center',  height: '60vh',  width: '100%',  }} >
      <CircularProgress color="primary" />
    </Box>
  );}

  if ((TestStatus === 'completed' || TestStatus === 'failed')  && !isRetaking) {

    return (

      <Box
        sx={{
          display: "flex",
          justifyContent: "start",
          minHeight: "100%",
          overflow: "scroll",
          p: 2,
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px', 
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

        <TestResult
         key={`${courseId}-${moduleId}`}
          questions={questions}
          currentTestProgress={currentTestProgress}
          totalQuestions={questions.length}
          onRetake={handleRetake}
        />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        overflowY: "auto",
        width: "100%",
        mt: 2,
        height: "80%",
        "&::-webkit-scrollbar": { width: "8px" },
        "&::-webkit-scrollbar-track": { backgroundColor: "#ffffff" },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#c0c0c0",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb:hover": { backgroundColor: "#a0a0a0" },
        scrollbarColor: "#c0c0c0 #ffffff",
        scrollbarWidth: "thin",
      }}
    >
      <Paper
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          py: 1,
          px: 3
        }}
      >
        <Typography variant="h6" fontWeight="semibold" >
          Assessment Statistics
        </Typography>
    <Grid container spacing={1}>
  <Grid item xs={4}>
    <Box textAlign="center">
      <Typography 
        variant="h6" // smaller than h4
        fontWeight="bold" 
        color="success.main"
        sx={{ fontSize: '1.25rem' }} // force smaller if needed
      >
        {Object.keys(userAnswers).length}
      </Typography>
      <Typography 
        variant="caption" // smaller than body2
        color="text.secondary"
        sx={{ fontSize: '0.7rem' }}
      >
        Answered
      </Typography>
    </Box>
  </Grid>

  <Grid item xs={4}>
    <Box textAlign="center">
      <Typography 
        variant="h6"
        fontWeight="bold" 
        color="warning.main"
        sx={{ fontSize: '1.25rem' }}
      >
        {questions.length - Object.keys(userAnswers).length}
      </Typography>
      <Typography 
        variant="caption"
        color="text.secondary"
        sx={{ fontSize: '0.7rem' }}
      >
        Remaining
      </Typography>
    </Box>
  </Grid>

  <Grid item xs={4} sx={{ml: 1}}>
    <Box textAlign="center">
      <Typography 
        variant="h6"
        fontWeight="bold" 
        color="primary.main"
        sx={{ fontSize: '1.25rem' }}
      >
        {questions.length}
      </Typography>
      <Typography 
        variant="caption"
        color="text.secondary"
        sx={{ fontSize: '0.7rem' }}
      >
        Total
      </Typography>
    </Box>
  </Grid>
</Grid>

      </Paper>

<Paper
  sx={{
    border: "1px solid",
    borderColor: "divider",
    borderRadius: 2,
    p: 2
  }}
>
  {/* Header */}
  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
    <Typography variant="h6" fontWeight="bold">
      Assessment
    </Typography>
    <Typography variant="caption" color="text.secondary">
      Q {currentQuestion + 1} / {questions.length}
    </Typography>
  </Box>

  {/* Progress */}
  <Box mb={2}>
    <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
      <Typography variant="caption" fontWeight="medium" color="text.secondary">
        Progress
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {Math.round((currentQuestion / questions.length) * 100)}%
      </Typography>
    </Box>
    <LinearProgress
      variant="determinate"
      value={(currentQuestion / questions.length) * 100}
      sx={{
        height: 6,
        borderRadius: 3,
        backgroundColor: "grey.200",
        "& .MuiLinearProgress-bar": {
          borderRadius: 3,
          backgroundColor: "primary.main"
        }
      }}
    />
  </Box>

  {/* Question Box */}
  <Paper sx={{ backgroundColor: "grey.50", borderRadius: 2, p: 1, mb: 0 }}>
    <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={1}>
      <Typography variant="subtitle2" fontWeight="semibold">
        Question {currentQuestion + 1}
      </Typography>
      <Chip
        size="small"
        label="5 marks"
        sx={{ backgroundColor: "primary.light", color: "primary.dark", fontSize: "0.75rem" }}
      />
    </Box>
    <Typography variant="body2" color="text.primary" mb={2}>
      {currentQ.questionText}
    </Typography>

    {/* Options */}
    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
      {currentQ.options.map((option) => (
        <Button
          key={option._id}
          onClick={() => handleAnswerClick(currentQuestion, option.optionText)}
          fullWidth
          sx={{
            justifyContent: "flex-start",
            textAlign: "left",
            p: 1.2,
            fontSize: "0.85rem",
            border: "2px solid",
            borderColor:
              userAnswers[currentQuestion] === option.optionText
                ? "primary.main"
                : "grey.300",
            backgroundColor:
              userAnswers[currentQuestion] === option.optionText
                ? "primary.light"
                : "background.paper",
            "&:hover": {
              borderColor:
                userAnswers[currentQuestion] === option.optionText
                  ? "primary.main"
                  : "grey.400",
              backgroundColor:
                userAnswers[currentQuestion] === option.optionText
                  ? "primary.light"
                  : "grey.100"
            },
            transition: "all 0.3s"
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              sx={{
                width: 20,
                height: 20,
                border: "2px solid",
                borderColor:
                  userAnswers[currentQuestion] === option.optionText
                    ? "primary.main"
                    : "grey.400",
                backgroundColor:
                  userAnswers[currentQuestion] === option.optionText
                    ? "primary.main"
                    : "transparent"
              }}
            >
              {userAnswers[currentQuestion] === option.optionText && (
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    backgroundColor: "white",
                    borderRadius: "50%"
                  }}
                />
              )}
            </Avatar>
            <Typography variant="body2" color="text.primary" sx={{ textTransform: "none" }}>
              {option.optionText}
            </Typography>
          </Box>
        </Button>
      ))}
    </Box>
  </Paper>

  {/* Navigation */}
  <Box display="flex" alignItems="center" justifyContent="space-between" sx={{mt: 1}} >
    <Button
      onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
      disabled={currentQuestion === 0}
      size="small"
      variant="outlined"
      sx={{
        
        color: "text.primary",
        borderColor: "grey.300",
        "&:hover": {
          backgroundColor: "grey.50",
          borderColor: "grey.400"
        }
      }}
    >
      Previous
    </Button>

    <Box display="flex" gap={0.5}>
      {currentQuestion === questions.length - 1 ? (
        <Button
          size="small"
          variant="contained"
          color="success"
          onClick={handleSubmit}
          disabled={isLoading}
          sx={{
            "&:hover": {
              backgroundColor: "success.dark"
            }
          }}
        >
          {isLoading ? "Submitting..." : "Submit Test"}
        </Button>
      ) : (
        <Button
          size="small"
          onClick={() =>
            setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))
          }
          variant="contained"
          sx={{
            "&:hover": {
              backgroundColor: "primary.dark"
            }
          }}
        >
          Next
        </Button>
      )}
    </Box>
  </Box>
</Paper>
    </Box>
  );
};
