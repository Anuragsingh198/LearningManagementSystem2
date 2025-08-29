import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  LinearProgress,
  Grid,
  Divider,
  Chip,
  Avatar,
  CircularProgress,
} from "@mui/material";
import { NoVideosFound } from "./NoContentFoundPage";
import { TestResult } from "./TestResult";
import { useCourseContext } from "../../context/contextFiles/CourseContext";
import { SubmitTest, testProgress } from "../../context/Actions/courseActions";
import { useParams } from "react-router-dom";
import { CheckCircle, Clock, ListChecks } from "lucide-react"
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
    // console.log("this is the  text progresss from te  useeffect : ", allTestProgress)
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

  // useEffect(() => {
  //   console.log("this is the current test progress : ", currentTestProgress)
  // }, [currentTestProgress])

  const handleRetake = () => {
    // console.log('handle retake clicked: ');
    setUserAnswers({});
    setSubmitted(false);
    setIsRetaking(true);  // now in retake mode
    setCurrentQuestion(0);
  };


  useEffect(() => {
    // console.log("submitted ", submitted)
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


  if (!TestStatus) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', width: '100%', }} >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if ((TestStatus === 'completed' || TestStatus === 'failed') && !isRetaking) {

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
          borderRadius: '4px',
          p: 2,
          bgcolor: "white",
          boxShadow: 'none',
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{
            color: "text.primary",
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <ListChecks size={20} color="#1976d2" />
          Assessment Statistics
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "space-between",
          }}
        >
          {/* Answered */}
          <Box
            sx={{
              flex: 1,
              p: 1.5,
              borderRadius: '4px',
              border: "1px solid #c8e6c9",
              bgcolor: "#e8f5e9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <CheckCircle size={18} color="#2e7d32" />
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, color: "success.dark" }}
            >
              Answered :
            </Typography>
            <Typography
              variant="body2"
              fontWeight="bold"
              color="success.main"
            >
              {Object.keys(userAnswers).length}
            </Typography>
          </Box>

          {/* Remaining */}
          <Box
            sx={{
              flex: 1,
              p: 1.5,
              borderRadius: '4px',
              border: "1px solid #ffe0b2",
              bgcolor: "#fff8e1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Clock size={18} color="#f57c00" />
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, color: "warning.dark" }}
            >
              Remaining :
            </Typography>
            <Typography
              variant="body2"
              fontWeight="bold"
              color="warning.main"
            >
              {questions.length - Object.keys(userAnswers).length}
            </Typography>
          </Box>

          {/* Total */}
          <Box
            sx={{
              flex: 1,
              p: 1.5,
              borderRadius: '4px',
              border: "1px solid #90caf9",
              bgcolor: "#e3f2fd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <ListChecks size={18} color="#1976d2" />
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, color: "primary.dark" }}
            >
              Total :
            </Typography>
            <Typography
              variant="body2"
              fontWeight="bold"
              color="primary.main"
            >
              {questions.length}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Paper
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: '4px',
          p: 2
        }}
      >
        {/* Header */}
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{
              color: "text.primary",
              mb: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <ListChecks size={20} color="#1976d2" />
            Assessment
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              borderRadius: '4px',
              bgcolor: '#ede7f6',     // soft violet pastel
              color: '#5e35b1',       // deep violet text
              border: '1px solid #d1c4e9',
              px: 1.2,
              py: 0.3,
              fontSize: '0.75rem',
              fontWeight: 500,
            }}
          >
            <Typography variant="caption" fontWeight={600} sx={{ color: 'inherit' }}>
              Q
            </Typography>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ mx: 0.6, borderColor: 'rgba(0,0,0,0.2)' }}
            />
            <Typography variant="caption" fontWeight={500} sx={{ color: 'inherit' }}>
              {currentQuestion + 1} of {questions.length}
            </Typography>
          </Box>
        </Box>


        {/* Progress */}
        <Box my={2}>
          {/* Top stroke */}
          <Divider sx={{ mb: 1, borderColor: "#eee" }} />

          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Typography
              variant="body2"
              fontWeight={500}
              color="text.primary" // global color
            >
              Progress
            </Typography>
            <Typography
              variant="body2"
              fontWeight={600}
              sx={{
                color:
                  (currentQuestion / questions.length) * 100 < 40
                    ? "#FB923C" // pastel orange
                    : (currentQuestion / questions.length) * 100 < 70
                      ? "#5C6BC0" // pastel indigo/blue
                      : "#2E7D32", // chip green
              }}
            >
              {Math.round((currentQuestion / questions.length) * 100)}%
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={(currentQuestion / questions.length) * 100}
            sx={{
              height: 8,
              borderRadius: "4px",
              backgroundColor: "#f3f4f6", // light neutral
              "& .MuiLinearProgress-bar": {
                borderRadius: "4px",
                backgroundColor:
                  (currentQuestion / questions.length) * 100 < 40
                    ? "#FED7AA" // orange pastel
                    : (currentQuestion / questions.length) * 100 < 70
                      ? "#C7D2FE" // indigo/blue pastel
                      : "#81C784", // chip-like green pastel
              },
            }}
          />

          {/* Bottom stroke */}
          <Divider sx={{ mt: 1, borderColor: "#eee" }} />
        </Box>

        {/* Question Box */}
        <Paper
          sx={{
            border: "1.5px solid",
            borderColor: "divider",
            borderRadius: "4px",
            p: 2,
            mb: 2,
            backgroundColor: "background.paper",
            boxShadow: "none"
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={1.5}
          >
            <Typography variant="subtitle2" fontWeight="600">
              Question {currentQuestion + 1}
            </Typography>
            <Chip
              size="small"
              variant="outlined"
              label="5 marks"
              sx={{
                fontSize: "0.75rem",
                borderRadius: "4px",
                borderColor: "primary.main",
                color: "primary.main",
                fontWeight: 500
              }}
            />
          </Box>

          <Typography
            variant="body2"
            color="text.primary"
            mb={2}
            sx={{ lineHeight: 1.6 }}
          >
            {currentQ.questionText}
          </Typography>

          {/* Options */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {currentQ.options.map((option) => {
              const isSelected = userAnswers[currentQuestion] === option.optionText;
              return (
                <Button
                  key={option._id}
                  onClick={() =>
                    handleAnswerClick(currentQuestion, option.optionText)
                  }
                  fullWidth
                  variant="outlined"
                  sx={{
                    justifyContent: "flex-start",
                    textAlign: "left",
                    px: 1.5,
                    py: 1,
                    fontSize: "0.85rem",
                    borderRadius: "4px",
                    border: "1.5px solid",
                    borderColor: isSelected ? "primary.main" : "grey.300",
                    color: isSelected ? "primary.main" : "text.primary",
                    backgroundColor: isSelected ? "#E3F2FD" : "transparent",
                    fontWeight: isSelected ? 600 : 400,
                    "&:hover": {
                      borderColor: isSelected ? "primary.main" : "grey.400",
                      backgroundColor: isSelected ? "#BBDEFB" : "grey.50"
                    },
                    transition: "all 0.25s ease"
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar
                      sx={{
                        width: 20,
                        height: 20,
                        border: "1.5px solid",
                        borderColor: isSelected ? "primary.main" : "grey.400",
                        bgcolor: isSelected ? "primary.main" : "transparent",
                        fontSize: "0.7rem"
                      }}
                    >
                      {isSelected && (
                        <Box
                          sx={{
                            width: 6,
                            height: 6,
                            bgcolor: "white",
                            borderRadius: "50%"
                          }}
                        />
                      )}
                    </Avatar>
                    <Typography
                      variant="body2"
                      sx={{
                        textTransform: "none",
                        color: isSelected ? "primary.main" : "text.primary"
                      }}
                    >
                      {option.optionText}
                    </Typography>
                  </Box>
                </Button>
              );
            })}
          </Box>
        </Paper>


        {/* Navigation */}
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mt: 1 }} >
          <Button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            size="small"
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderRadius: '4px',
              border: '1.5px solid #1976d2',
              color: '#1976d2',
              bgcolor: '#E3F2FD',
              fontWeight: 500,
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#BBDEFB',
                borderColor: '#1565C0',
              },
              '&:disabled': {
                color: '#9e9e9e',
                borderColor: '#bdbdbd',
                bgcolor: '#f5f5f5',
              },
            }}
          >
            Previous
          </Button>

          <Box display="flex" gap={0.5}>
            {currentQuestion === questions.length - 1 ? (
              <Button
                size="small"
                variant="outlined"
                onClick={handleSubmit}
                disabled={isLoading}
                sx={{
                  textTransform: 'none',
                  borderRadius: '4px',
                  fontWeight: 500,
                  boxShadow: 'none',
                  px: 2,

                  // Default (blue pastel)
                  border: '1.5px solid #1976d2',
                  color: '#1976d2',
                  bgcolor: '#E3F2FD',

                  '&:hover': {
                    bgcolor: '#BBDEFB',
                    borderColor: '#1565C0',
                  },

                  '&:disabled': {
                    color: '#9e9e9e',
                    borderColor: '#bdbdbd',
                    bgcolor: '#f5f5f5',
                  },

                  // Green pastel only when it's exactly "Submit Test"
                  ...(!isLoading && {
                    border: '1.5px solid #2e7d32',
                    color: '#2e7d32',
                    bgcolor: '#E8F5E9',
                    '&:hover': {
                      bgcolor: '#C8E6C9',
                      borderColor: '#1b5e20',
                    },
                  }),
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
                variant="outlined"
                sx={{
                  textTransform: 'none',
                  borderRadius: '4px',
                  border: '1.5px solid #1976d2',
                  color: '#1976d2',
                  bgcolor: '#E3F2FD',
                  fontWeight: 500,
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: '#BBDEFB',
                    borderColor: '#1565C0',
                  },
                  '&:disabled': {
                    color: '#9e9e9e',
                    borderColor: '#bdbdbd',
                    bgcolor: '#f5f5f5',
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
