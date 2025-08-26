import React, { useState, useEffect, useRef } from 'react';
// import { testData } from './testData';
import QuestionStatsBar from './QuestionStatsBar';
import QuestionSidebar from './QuestionSidebar';
import QuestionDisplay from './QuestionDisplay';
import SubmitModal from './SubmitModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button,
} from '@mui/material';
import { useNavigate , useParams} from 'react-router-dom';
import { useAssignmentContext } from '../../context/contextFiles/assignmentContext';
import { getAllLanguageAction, submitAssessment } from '../../context/Actions/AssignmentActions';
import { fetchAllAssessment } from '../../context/Actions/courseActions';
import { useCourseContext } from '../../context/contextFiles/CourseContext';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
  },
});

const CustomModal = ({ open, onClose, title, children, actions }) => {
  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          padding: 3,
          borderRadius: 2,
          minWidth: 300,
          maxWidth: 500,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        {children}
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          {actions}
        </Box>
      </Box>
    </Box>
  );
};

const TestPage = () => {
    const { id } = useParams();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionStatus, setQuestionStatus] = useState({});
  const [codingAnswers, setCodingAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(1800); 
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [backButtonDisabled, setBackButtonDisabled] = useState(true);
  const [currentCodingAnswer , setCurrentCodingAnswer] =  useState("");
  const testPageRef = useRef(null);
  const {state: {testData}, dispatch} = useAssignmentContext();
  const {state: {}, dispatch: courseDispatch} = useCourseContext()
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [pendingIndex, setPendingIndex] = useState(null);
    const [showOutput, setShowOutput] = useState(false);

  // console.log('the test data from context in test page is: ', contextTestData)

  let warningToastId = null;

  const testId = testData?._id;
  const storageKey = `test_${testId}`;

  const navigate = useNavigate();

  // console.log('the id from param is: ', id)

  useEffect(() => {
  console.log('the show submit modal is: ', showSubmitModal);
}, [showSubmitModal]);

if(!testData || (testData.assessment !== id)){
  console.log('the context test data is:', testData)
  console.log('the context test data is:', testData?.assessment)
  // console.log('the context test data is:', id)
  return <Box sx={{color: 'black'}}> Loading... </Box>
}

useEffect(() => {
  const testDuration = testData.duration  
  console.log('the test duration is: ', testDuration)
  setTimeRemaining(testDuration * 60)
}, [testData])


useEffect(() => {
    getAllLanguageAction(dispatch);
}, []);

  // Initialize question status and mark first question as visited
  useEffect(() => {
    const initialStatus = {};
    const saved = localStorage.getItem(`test_${testData._id}`);
    const savedAnswers = saved ? JSON.parse(saved) : [];
    console.log('new count:', violationCount)

    testData.questions.forEach((q, index) => {
      const isAnswered = savedAnswers.some(a => a.question_id === q._id);

      if (isAnswered) {
        initialStatus[q._id] = 'answered';
      } else if (index === 0) {
        initialStatus[q._id] = 'visited';
      } else {
        initialStatus[q._id] = 'not_visited';
      }
    });

    setQuestionStatus(initialStatus);
    // Enter fullscreen when component mounts
    enterFullscreen();
    
    // Set up event listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Handle back button/popstate
  const handlePopState = (event) => {
    if (backButtonDisabled) {
      toast.warn('Back button disabled. Submit test to exit.', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      window.history.pushState(null, '', window.location.pathname);
    }
  };

  // Handle page refresh/close
  const handleBeforeUnload = (event) => {
    if (backButtonDisabled) {
      event.preventDefault();
      event.returnValue = 'Your test will be auto-submitted if you leave this page.';
      return event.returnValue;
    }
  };


  const enterFullscreen = async () => {
  if (!testPageRef.current) return false;

  try {
    if (testPageRef.current.requestFullscreen) {
      await testPageRef.current.requestFullscreen();
      setIsFullScreen(true);
      return true;
    }
    // Add other browser prefixes if needed
  } catch (err) {
    console.error('Fullscreen error:', err);
    return false;
  }
};

  // Exit fullscreen function
  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen()
        .then(() => setIsFullScreen(false))
        .catch(err => console.error('Error attempting to exit fullscreen:', err));
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
      setIsFullScreen(false);
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
      setIsFullScreen(false);
    }
  };

  // Handle fullscreen change
  const handleFullscreenChange = () => {
    if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.msFullscreenElement) {
      setIsFullScreen(false);
      handleViolation();
    } else {
      setIsFullScreen(true);
    }
  };

  // Handle visibility change (tab switching)
  const handleVisibilityChange = () => {
    if (document.hidden) {
      handleViolation();
    }
  };

  // Handle violations (exit fullscreen or switch tab)
 const handleViolation = () => {
  setViolationCount(prevCount => {
    const newCount = prevCount + 1;
    console.log('New violation count:', newCount);

    if (newCount >= 3) {
      toast.error('Test auto-submitted due to multiple violations!', {
        position: 'top-center',
        autoClose: 5000,
      });
      handleSubmitTest();
    } else {
      // Show warning toast
      if (warningToastId !== null) {
        toast.dismiss(warningToastId); // Dismiss previous toast if still open
      }

      warningToastId = toast.warn(
        ({ closeToast }) => (
          <div>
            <p>Warning: {3 - newCount} attempts remaining.</p>
            <button
              onClick={() => {
                enterFullscreen();
                closeToast(); // Close the toast when button clicked
              }}
              style={{
                padding: '8px 16px',
                background: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Continue Test
            </button>
          </div>
        ),
        {
          position: 'top-center',
          autoClose: false,
          closeOnClick: false,
          hideProgressBar: true,
          pauseOnHover: true,
          draggable: false,
        }
      );
    }

    return newCount;
  });
};

  // Timer effect
  // useEffect(() => {
  //   if (timeRemaining > 0) {
  //     const timer = setTimeout(() => {
  //       setTimeRemaining(prev => prev - 1);
  //     }, 1000);
  //     return () => clearTimeout(timer);
  //   } else {
  //     // Auto-submit when time runs out
  //     handleSubmitTest();
  //   }
  // }, [timeRemaining]);

  // Add these constants at the top of your file
const WARNING_5_MIN = 5 * 60; // 5 minutes in seconds
const WARNING_2_MIN = 2 * 60; // 2 minutes in seconds
const TIMER_CHECK_INTERVAL = 1000; // Check every second

// Inside your TestPage component, update the timer effect:
useEffect(() => {
  const timer = setInterval(() => {
    setTimeRemaining(prev => {
      const newTime = prev - 1;
      
      // Show warning toasts at specific times
      if (newTime === WARNING_5_MIN) {
        toast.warn('Only 5 minutes remaining!', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      else if (newTime === WARNING_2_MIN) {
        toast.warn('Only 2 minutes remaining! Submit your test soon!', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      else if (newTime <= 0) {
        clearInterval(timer);
        handleAutoSubmit();
        return 0;
      }
      
      return newTime;
    });
  }, TIMER_CHECK_INTERVAL);

  return () => clearInterval(timer);
}, []);

// Add this new function for auto-submission
const handleAutoSubmit = () => {
  handleSubmitTest();
};

  // Load saved MCQ answers from localStorage
  const loadSavedAnswers = () => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  };

  // Save MCQ answer to localStorage
  const saveMCQAnswer = (questionId, optionId) => {
    const savedAnswers = loadSavedAnswers();
    const existingIndex = savedAnswers.findIndex(a => a.question_id === questionId);

    if (existingIndex >= 0) {
      savedAnswers[existingIndex].option_id = optionId;
    } else {
      savedAnswers.push({ question_id: questionId, option_id: optionId });
    }

    localStorage.setItem(storageKey, JSON.stringify(savedAnswers));
  };

  // Get saved MCQ answer
  const getSavedMCQAnswer = (questionId) => {
    const savedAnswers = loadSavedAnswers();
    const answer = savedAnswers.find(a => a.question_id === questionId);
    return answer?.option_id || null;
  };

  // Handle question selection
  const handleQuestionSelect = (index) => {
    const currentQuestion = testData.questions[currentQuestionIndex];
    const isCoding = currentQuestion.type === "coding";

    if (isCoding && index !== currentQuestionIndex) {
      // Block navigation and show modal
      setPendingIndex(index);
      setShowModal(true);
    } else {
      // Allow navigation
      setCurrentQuestionIndex(index);
      const question = testData.questions[index];
      setQuestionStatus((prev) => ({
        ...prev,
        [question._id]: prev[question._id] === "answered" ? "answered" : "visited",
      }));
    }

     setShowOutput(false);
  };

   // modal action
    const handleContinue = () => {
    if (pendingIndex !== null) {
      setCurrentQuestionIndex(pendingIndex);
      const question = testData.questions[pendingIndex];
      setQuestionStatus((prev) => ({
        ...prev,
        [question._id]: prev[question._id] === "answered" ? "answered" : "visited",
      }));
    }
    setPendingIndex(null);
    setShowModal(false);
  };

  const handleCancel = () => {
    setPendingIndex(null);
    setShowModal(false);
  };

  // Handle MCQ option selection
  const handleOptionSelect = (optionId) => {
    const question = testData.questions[currentQuestionIndex];
    saveMCQAnswer(question._id, optionId);

    // Mark as answered
    setQuestionStatus(prev => ({
      ...prev,
      [question._id]: 'answered'
    }));
  };

  // Handle coding answer change
  const handleCodingAnswerChange = (answer) => {
    console.log( 'this is  the  coding  answer : ' ,  answer)
    setCurrentCodingAnswer(answer)
    const question = testData.questions[currentQuestionIndex];
    setCodingAnswers(prev => ({
      ...prev,
      [question._id]: answer
    }));

    
    // Mark as answered if there's content
    setQuestionStatus(prev => ({
      ...prev,
      [question._id]: answer.trim() ? 'answered' : 'visited'
    }));
  };

  // Handle save and next
  const handleSaveAndNext = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < testData.questions.length) {
      handleQuestionSelect(nextIndex);
    }
  };

  // Handle coding question submission
  const handleCodingSubmit = () => {
    const question = testData.questions[currentQuestionIndex];

    // Mark as answered
    setQuestionStatus(prev => ({
      ...prev,
      [question._id]: 'answered'
    }));
  };
 
   const  handleCodingRun =()=>{
    
   }
  // Calculate stats
  const calculateStats = () => {
    const mcqQuestions = testData.questions.filter(q => q.type === 'mcq');
    const codingQuestions = testData.questions.filter(q => q.type === 'coding');

    const mcqAnswered = mcqQuestions.filter(q => questionStatus[q._id] === 'answered').length;
    const mcqVisited = mcqQuestions.filter(q => questionStatus[q._id] === 'visited' || questionStatus[q._id] === 'answered').length;

    const codingAnswered = codingQuestions.filter(q => questionStatus[q._id] === 'answered').length;
    const codingVisited = codingQuestions.filter(q => questionStatus[q._id] === 'visited' || questionStatus[q._id] === 'answered').length;

    return {
      totalMCQ: mcqQuestions.length,
      mcqVisited,
      mcqAnswered,
      totalCoding: codingQuestions.length,
      codingVisited,
      codingAnswered
    };
  };

  // Handle submit test
  const handleSubmitTest = async () => {
    // Get MCQ answers from localStorage
    setLoading(true)
    const mcqAnswers = loadSavedAnswers();

    // Get coding answers from state
    const codingAnswersArray = Object.entries(codingAnswers)
      .filter(([_, answer]) => answer.trim())
      .map(([question_id, answer]) => ({ question_id, answer }));

    // Combine all answers
    const allAnswers = [...mcqAnswers, ...codingAnswersArray];

    const assessmentId = testData._id
    
    await submitAssessment(dispatch, {allAnswers, assessmentId})
    
    console.log(
      'console log before fetch all assessment'
    )
    
    await fetchAllAssessment(courseDispatch);

    console.log(
      'console log before fetch all assessment'
    )
    

    //here call the api to fetch the test data again, so that the latest data is there




    // Clear localStorage
    localStorage.removeItem(storageKey);

    // Close modal
    setShowSubmitModal(false);

    // Enable back button after submission
    setBackButtonDisabled(false);

    // Remove event listeners
    window.removeEventListener('beforeunload', handleBeforeUnload);
    window.removeEventListener('popstate', handlePopState);

    // Show success message
    toast.success('Test submitted successfully! You may now exit.', {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    setLoading(false)

    setTimeout(() => {
      exitFullscreen();

    }, 2000)
        
    
    navigate(`/assessments/review/${id}`);
    
  };

  const currentQuestion = testData.questions[currentQuestionIndex];
  const stats = calculateStats();
  const totalAnswered = stats.mcqAnswered + stats.codingAnswered;

  

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box 
        ref={testPageRef}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          minHeight: '100vh',
          backgroundColor: 'background.default'
        }}
      >
        <ToastContainer />
        <Box sx={{ width: '100vw' }}>
          <QuestionStatsBar
            title={testData.title}
            stats={stats}
            timeRemaining={timeRemaining}
            onSubmit={() => setShowSubmitModal(true)}
          />
        </Box>

        <Box sx={{
          display: 'flex',
          flexGrow: 1,
          flexDirection: { xs: 'column', md: 'row' }
        }}>
          <QuestionSidebar
            questions={testData.questions}
            currentQuestionIndex={currentQuestionIndex}
            questionStatus={questionStatus}
            onQuestionSelect={handleQuestionSelect}
          />

          <Box width="100%" sx={{ flexGrow: 1 }}>
            <QuestionDisplay
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={testData.questions.length}
              selectedOption={currentQuestion.type === 'mcq' ? getSavedMCQAnswer(currentQuestion._id) : null}
              onOptionSelect={handleOptionSelect}
              codingAnswer={codingAnswers[currentQuestion._id] || ''}
              onCodingAnswerChange={handleCodingAnswerChange}
              onSaveAndNext={handleSaveAndNext}
              onCodingSubmit={handleCodingSubmit}
              showOutput={showOutput}
              setShowOutput={setShowOutput}
              id={id}
            />
          </Box>
        </Box>

        <SubmitModal
          isOpen={showSubmitModal}
          onClose={() => setShowSubmitModal(false)}
          onConfirm={handleSubmitTest}
          answeredCount={totalAnswered}
          totalCount={testData.questions.length}
           isFullScreen={isFullScreen}
           loading={loading}
        />
             <CustomModal
  open={showModal}
  onClose={handleCancel}
  title="Submit Code First"
  actions={
    <>
      <Button onClick={handleCancel} color="secondary">
        Cancel
      </Button>
      <Button onClick={handleContinue} variant="contained" color="primary">
        I have Submitted Current Question
      </Button>
    </>
  }
>
  <Typography>
    Please submit your code before moving to another question.
  </Typography>
</CustomModal>
      </Box>
    </ThemeProvider>
  );
};

export default TestPage;