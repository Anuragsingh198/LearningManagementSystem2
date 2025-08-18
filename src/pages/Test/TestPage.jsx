import React, { useState, useEffect, useRef } from 'react';
import { testData } from './testData';
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
  createTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAssignmentContext } from '../../context/contextFiles/assignmentContext';
import { getAllLanguageAction } from '../../context/Actions/AssignmentActions';

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
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const TestPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionStatus, setQuestionStatus] = useState({});
  const [codingAnswers, setCodingAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(3600); 
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [backButtonDisabled, setBackButtonDisabled] = useState(true);
  const [currentCodingAnswer , setCurrentCodingAnswer] =  useState("");
  const testPageRef = useRef(null);
  let warningToastId = null;

  const testId = testData._id;
  const storageKey = `test_${testId}`;

  const navigate = useNavigate();

  useEffect(() => {
  console.log('the show submit modal is: ', showSubmitModal);
}, [showSubmitModal]);

const { state, dispatch } = useAssignmentContext();

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

  // Enter fullscreen function
  // const enterFullscreen = () => {
  //   if (testPageRef.current) {
  //     if (testPageRef.current.requestFullscreen) {
  //       testPageRef.current.requestFullscreen()
  //         .then(() => setIsFullScreen(true))
  //         .catch(err => console.error('Error attempting to enable fullscreen:', err));
  //     } else if (testPageRef.current.webkitRequestFullscreen) {
  //       testPageRef.current.webkitRequestFullscreen();
  //       setIsFullScreen(true);
  //     } else if (testPageRef.current.msRequestFullscreen) {
  //       testPageRef.current.msRequestFullscreen();
  //       setIsFullScreen(true);
  //     }
  //   }
  // };

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
  toast.info('Time is up! Submitting your test automatically...', {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
  
  // Delay the actual submission slightly to let the toast show
  setTimeout(() => {
    handleSubmitTest();
  }, 3000);
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
    setCurrentQuestionIndex(index);
    const question = testData.questions[index];

    // Mark as visited
    setQuestionStatus(prev => ({
      ...prev,
      [question._id]: prev[question._id] === 'answered' ? 'answered' : 'visited'
    }));
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
  const handleSubmitTest = () => {
    // Get MCQ answers from localStorage
    const mcqAnswers = loadSavedAnswers();

    // Get coding answers from state
    const codingAnswersArray = Object.entries(codingAnswers)
      .filter(([_, answer]) => answer.trim())
      .map(([question_id, answer]) => ({ question_id, answer }));

    // Combine all answers
    const allAnswers = [...mcqAnswers, ...codingAnswersArray];

    console.log('Test submitted with answers:', allAnswers);

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
        
    exitFullscreen();
    
    navigate('/assessments/test-submitted');
    
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
        />
      </Box>
    </ThemeProvider>
  );
};

export default TestPage;