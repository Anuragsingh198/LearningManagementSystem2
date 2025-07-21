import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  LinearProgress,
  Grid,
  Chip,
  Avatar,
  useAutocomplete,
  CircularProgress,
} from "@mui/material";
import { NoVideosFound } from "./NoContentFoundPage";
import { TestResult } from "./TestResult";
import { useCourseContext } from "../../context/contextFiles/CourseContext";
import { useAuth } from "../../context/contextFiles/AuthContext";
import { getCourseProgress, SubmitTest, testProgress } from "../../context/Actions/courseActions";
import { Loader } from "lucide-react";
import { useParams } from "react-router-dom";

// add progress in  inital state and add the the  test also;
export const QuizContent = ({
  questions,
  currentQuestion,
  handleAnswerSelect,
  setCurrentQuestion,
  currentTest,
  tests,
}) => {
  const { state: { user } } = useAuth();
  const moduleId = useParams().moduleId;
  const courseId = useParams().courseId;
  const [userId, setUserId] = useState(null)
  const [progressId, setProgressId] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setisLoading] = useState(false)
  const [score, setScore] = useState(0);
  const [currentTestData, setCurrentTestData] = useState(currentTest);
  const { state: { loading, oneCourseProgress, oneModuleProgress, currentTestProgress, allTestProgress }, dispatch } = useCourseContext();
  // console.log("loading true  Quiz Content: ,", loading)
  const currentQ = questions && questions[currentQuestion];
  // console.log("this is the  current question from quiz content", currentQ);
  // console.log("this is the  allTestProgress from quiz content", oneCourseProgress,oneModuleProgress, allTestProgress );

  const isPassed = currentTestProgress?.isPassed;

  if (!questions || questions.length === 0) {
    return <NoVideosFound />;
  }
  // console.log("this is the  oneCourseProgress test : ", oneCourseProgress);
  // console.log("this is the  current test : ", tests[currentTest]._id);

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
      // console.log("Test progress exists:", progressExists);
      dispatch({ type: 'TEST_PROGRESS', payload: progressExists });
    }
  };

  useEffect(() => {
    handleTestProgress();
    console.log("this is the  text progresss from te  useeffect : ", allTestProgress)
  }, []);

  useEffect(() => {
    console.log('the questiosn are: ', questions)
  }, [questions])




  const handleSubmit = async () => {
    let correctAnswers = 0;
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);

    try {
      setisLoading(true);

      const testId = tests[currentTest]._id;

      const result = await SubmitTest({ testId, userAnswers, moduleId, courseId, dispatch });
      // await getCourseProgress(courseId, user._id, dispatch);
      setisLoading(false);
      setSubmitted(true);
      // console.log('the current test progress is: ', currentTestProgress)
    } catch (error) {
      console.error("Error submitting test:", error);
      setisLoading(false);
    }
  };

  useEffect(() => {
    console.log("this is the current test progress : ", currentTestProgress)
  }, [currentTestProgress])

  const handleRetake = () => {
    setUserAnswers({});
    setSubmitted(false);
    setScore(0);
    setCurrentQuestion(0);
  };

  const handleAnswerClick = (questionIndex, optionText) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionText,
    }));
  };

if (!currentTestProgress) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '60vh', // or "100vh" to center in full viewport
        width: '100%',
      }}
    >
      <CircularProgress color="primary" />
    </Box>
  );
}


  // if (submitted) {
  //   return (
  //     //   <>
  //     //     {loading ? (
  //     //       <Loader />
  //     //     ) : (
  //     <Box
  //       sx={{
  //         position: "relative",
  //         display: "flex",
  //         justifyContent: "center",
  //         alignItems: "center",
  //         minHeight: "100%",
  //         overflow: "scroll",
  //         p: 3,
  //         '&::-webkit-scrollbar': {
  //           width: '8px',
  //           height: '8px', // also styles horizontal scroll if needed
  //         },
  //         '&::-webkit-scrollbar-track': {
  //           backgroundColor: '#f0f0f0',
  //           borderRadius: '4px',
  //         },
  //         '&::-webkit-scrollbar-thumb': {
  //           backgroundColor: '#a0a0a0',
  //           borderRadius: '4px',
  //         },
  //         '&::-webkit-scrollbar-thumb:hover': {
  //           backgroundColor: '#808080',
  //         }
  //       }}
  //     >

  //       <TestResult
  //         questions={questions}
  //         currentTestProgress={currentTestProgress}
  //         totalQuestions={questions.length}
  //         onRetake={handleRetake}
  //       />
  //     </Box>
  //     //     )}
  //     //   </>
  //   );
  // }

  if (isPassed) {
    return (

      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100%",
          overflow: "scroll",
          p: 3,
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px', // also styles horizontal scroll if needed
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

        {console.log('this is good, we are in if conding ')}

        <TestResult
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
          p: 3,
        }}
      >
        <Typography variant="h6" fontWeight="semibold" mb={2}>
          Assessment Statistics
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {Object.keys(userAnswers).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Answered
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {questions.length - Object.keys(userAnswers).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Remaining
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {questions.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
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
          borderRadius: 3,
          p: 3,
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
        >
          <Typography variant="h4" fontWeight="bold">
            Assessment
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Question {currentQuestion + 1} of {questions.length}
          </Typography>
        </Box>

        <Box mb={4}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={1}
          >
            <Typography
              variant="body2"
              fontWeight="medium"
              color="text.secondary"
            >
              Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(((currentQuestion) / questions.length) * 100)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={((currentQuestion) / questions.length) * 100}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: "grey.200",
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
                backgroundColor: "primary.main",
              },
            }}
          />
        </Box>

        <Paper
          sx={{ backgroundColor: "grey.50", borderRadius: 3, p: 3, mb: 3 }}
        >
          <Box
            display="flex"
            alignItems="flex-start"
            justifyContent="space-between"
            mb={2}
          >
            <Typography variant="h6" fontWeight="semibold">
              Question {currentQuestion + 1}
            </Typography>
            <Chip
              label="5 marks"
              sx={{ backgroundColor: "primary.light", color: "primary.dark" }}
            />
          </Box>
          <Typography variant="body1" color="text.primary" mb={3}>
            {currentQ.questionText}
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {currentQ.options.map((option, index) => (
              <Button
                key={option._id}
                onClick={() =>
                  handleAnswerClick(currentQuestion, option.optionText)
                }
                fullWidth
                sx={{
                  justifyContent: "flex-start",
                  textAlign: "left",
                  p: 2,
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
                        : "grey.100",
                  },
                  transition: "all 0.3s",
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      border: "2px solid",
                      borderColor:
                        userAnswers[currentQuestion] === option.optionText
                          ? "primary.main"
                          : "grey.400",
                      backgroundColor:
                        userAnswers[currentQuestion] === option.optionText
                          ? "primary.main"
                          : "transparent",
                    }}
                  >
                    {userAnswers[currentQuestion] === option.optionText && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          backgroundColor: "white",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                  </Avatar>
                  <Typography color="text.primary" sx={{ textTransform: "none" }}>
                    {/* {console.log(option.optionText)} */}
                    {option.optionText}
                  </Typography>
                </Box>
              </Button>
            ))}
          </Box>
        </Paper>

        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            variant="outlined"
            sx={{
              color: "text.primary",
              borderColor: "grey.300",
              "&:hover": {
                backgroundColor: "grey.50",
                borderColor: "grey.400",
              },
            }}
          >
            Previous
          </Button>

          <Box display="flex" gap={1}>
            {currentQuestion === questions.length - 1 ? (
              <Button
                variant="contained"
                color="success"
                onClick={handleSubmit}
                disabled={isLoading}
                sx={{
                  "&:hover": {
                    backgroundColor: "success.dark",
                  },
                }}
              >
                {isLoading ? 'Submitting...' : 'Submit Test'}
              </Button>
            ) : (
              <Button
                onClick={() =>
                  setCurrentQuestion(
                    Math.min(questions.length - 1, currentQuestion + 1)
                  )
                }
                variant="contained"
                sx={{
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
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
