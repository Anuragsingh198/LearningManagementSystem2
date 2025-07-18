import React, { useEffect } from "react";
import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Tabs,
  Tab,
  Typography,
  Grid,
  Button,
  LinearProgress,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  CircularProgress,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Book as BookIcon,
  PlayCircle as PlayCircleIcon,
  Help as HelpIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { QuizContent } from "./QuizContent";
import { VideoContent } from "./VideoContent";
import { Sidebar } from "./SideBar";
import { getCourseWithProgress, getModulebyModuleId } from "../../context/Actions/courseActions";
import { useCourseContext } from "../../context/contextFiles/CourseContext";
import NoContentPage from "./NoContentPage";
import QuizHistory from "./QuizHistory";
import BlurLoading from "../../pages/common/BlurLoading";
import { useNavigate } from "react-router-dom"; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from "../../context/contextFiles/AuthContext";


const CourseDetails = ({ courseId, moduleId }) => {
    const { state: { user } } = useAuth();
  const [module, setModule] = useState(null);
  const [videos, setVideos] = useState([]);
  const [tests, setTests] = useState([]);
  const { state: {courses,oneCourse, oneCourseProgress,allModuleProgress, allVideoProgess, allTestProgress , currentVideoProgress} , dispatch } = useCourseContext();
  const [activeTab, setActiveTab] = useState("chapters");
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [currentView, setCurrentView] = useState("video");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [isVideoZoomed, setIsVideoZoomed] = useState(false);
  const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

  const handleAnswerSelect = (questionIndex, optionText) => {
  };

  const particularCourse = courses.find(course => course._id === courseId);
  const isCompulsory = particularCourse?.compulsory;
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // console.log('loading in courseDetailsMainPage just after calling the function: ', isLoading)
      try {
        const allModule = await getModulebyModuleId(moduleId, dispatch);
        setModule(allModule || []);
        setVideos(allModule.videos || []);
        setTests(allModule.tests || []);
        // console.log('loading in try block: ', isLoading)
      } catch (error) {
        console.error("Error fetching module data:", error);
      } finally {
        setIsLoading(false); // Now this runs after everything is done
        // console.log('loading in courseDetailsMainPage as soon as the funtion is completed : ', isLoading)

      }
    };

    fetchData();
  }, [moduleId, dispatch]);

  
  useEffect(()=>{
    console.log("this is sidebar",currentVideoProgress, allModuleProgress );
  }, [currentVideoProgress, allModuleProgress]);


  useEffect(() => { 
    const fetchCourseProgress = async () => {
      console.log('we have entered use effect')
      if (!courseId || !user?._id) return;
      console.log('we have passed return statement')
      try {
      console.log('we are in try block')
  
        dispatch({ type: 'COURSE_LOADING' });
        await getCourseWithProgress(courseId, user._id, dispatch);
      } catch (error) {
        console.error('Failed to fetch course progress:', error);
      }
    };
  
    // Always fetch on mount or when courseId changes
      if (!oneCourse || oneCourse?._id !== courseId) {
      // Only fetch if no data, or data is for another course
      fetchCourseProgress();
    }
  }, [courseId, user?._id, dispatch]);
  
useEffect(() => {
  if (allModuleProgress?.length && moduleId && courseId) {
    const moduleProgress = allModuleProgress.find(
      (x) => x.moduleId === moduleId && x.courseId === courseId
    );

    if (moduleProgress) {
      dispatch({ type: "MODULE_PROGRESS", payload: moduleProgress });
    }
  }
}, [moduleId, courseId, allModuleProgress]);


  return (
    <Box
      sx={{
        bgcolor: "background.default",
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        gap: 6,
        overflow: "hidden",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        scrollbarWidth: "none",
      }}
    >
<Button
  onClick={() => navigate(-1)}
  startIcon={<ArrowBackIcon sx={{ color: '#1976D2', fontSize: 10 }} />}
  sx={{
    position: 'absolute',
    top: 143,
    left: 32,
    backgroundColor: 'transparent',
    color: '#1976D2',
    textTransform: 'none',
    fontSize: 12,
    padding: '5px 8px',
    minWidth: 'auto',
    boxShadow: 'none',
    '& .MuiButton-startIcon': {
      marginRight: '4px', // reduce this value as needed (default is 8px)
    },
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
      boxShadow: 'none',
    },
  }}
>
  Back
</Button>

      <Box sx={{
        width: "30%", display: 'flex', flexDirection: 'column', px: 6,

        maxHeight: '100vh',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          width: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'white',
          borderRadius: '8px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#e0e0e0',
        },

      }}>
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          videos={videos}
          currentVideo={currentVideo}
          setCurrentVideo={setCurrentVideo}
          tests={tests}
          currentTest={currentQuiz}
          setCurrentTest={setCurrentQuiz}
          currentQuestion={currentQuestion}
          setCurrentQuestion={setCurrentQuestion}
          moduleId={moduleId}
          courseId={courseId}
        />
        {tests.length > 0 && tests[currentQuiz]?.questions?.length > 0 ? (
          <QuizHistory questions={tests[currentQuiz]?.questions || []} moduleId={moduleId}
            currentTest={currentQuiz}
          />
        ) : null}
      </Box>

      <Box sx={{ width: "60%", overflow: "hidden" }}>
        {currentView === "quiz" && (
          isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4, mt: 10 }}>
              <CircularProgress size={80} />
            </Box>
          ) : (
            tests.length > 0 && tests[0]?.questions?.length > 0 ? (
              <QuizContent
                questions={tests[currentQuiz]?.questions || []}
                currentQuestion={currentQuestion}
                handleAnswerSelect={handleAnswerSelect}
                setCurrentQuestion={setCurrentQuestion}
                currentTest={currentQuiz}
                tests={tests}
              />
            ) : (
              <NoContentPage
                title="Assessment"
                description="No Assessments available for this module"
              />
            )
          )
        )}

        {currentView === "video" && (
          isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4, mt: 10 }}>
              <CircularProgress size={80} />
            </Box>
          ) : (
            videos.length !== 0 ? (
              <Box>
                <VideoContent
                  currentVideo={currentVideo}
                  isVideoZoomed={isVideoZoomed}
                  isVideoFullscreen={isVideoFullscreen}
                  isPlaying={isPlaying}
                  setCurrentVideo={setCurrentVideo}
                  setIsVideoZoomed={setIsVideoZoomed}
                  setIsVideoFullscreen={setIsVideoFullscreen}
                  setIsPlaying={setIsPlaying}
                  videos={videos}
                  courseId={courseId}
                  moduleId={moduleId}
                  isCompulsory={isCompulsory}
                />
              </Box>
            ) : (
              <NoContentPage
                title="Videos"
                description="No videos available for this module"
              />
            )
          )
        )}

      </Box>
    </Box>
  );
};

export default CourseDetails;