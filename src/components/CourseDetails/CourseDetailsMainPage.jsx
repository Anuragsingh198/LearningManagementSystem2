import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { QuizContent } from "./QuizContent";
import { VideoContent } from "./VideoContent";
import { ArticlesContent } from "./ArticlesContent";
import { Sidebar } from "./SideBar";
import { getCourseWithProgress, getModulebyModuleId } from "../../context/Actions/courseActions";
import { useCourseContext } from "../../context/contextFiles/CourseContext";
import NoContentPage from "./NoContentPage";
import { useNavigate, useLocation } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuth } from "../../context/contextFiles/AuthContext";
// const serverurl = import.meta.env.VITE_SERVER_URL;



const CourseDetails = ({ courseId, moduleId }) => {
  const { state: { user } } = useAuth();
  const [module, setModule] = useState(null);
  const [videos, setVideos] = useState([]);
  const [tests, setTests] = useState([]);
  const [articles, setArticles] = useState([]);
  const { state: { courses, oneCourse, oneCourseProgress, allModuleProgress, oneModuleProgress, allVideoProgess, allTestProgress, currentVideoProgress }, dispatch } = useCourseContext();
  const [currentView, setCurrentView] = useState("video");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(0);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [currentArticle, setCurrentArticle] = useState(0);
  const [isVideoZoomed, setIsVideoZoomed] = useState(false);
  const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [lastTimeTracker, setLastTimeTracker] = useState(0);
  const [currVidData, setCurrVidData] = useState(null);
  const [completedArticles, setCompletedArticles] = useState([]);


  const navigate = useNavigate();

  // const hasSetInitialVideo = useRef(false);

  // useEffect(() => {
  //   const currVid = oneModuleProgress?.videoIndex;

  //   if (!hasSetInitialVideo.current && currVid !== undefined) {
  //     setCurrentVideo(currVid);
  //     hasSetInitialVideo.current = true;
  //   }
  // }, [oneModuleProgress]);

  const handleAnswerSelect = (questionIndex, optionText) => {
  };

  const particularCourse = courses.find(course => course._id === courseId);
  const isCompulsory = particularCourse?.compulsory;


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const allModule = await getModulebyModuleId(moduleId, dispatch);
        setModule(allModule || []);
        setVideos(allModule.videos || []);
        setTests(allModule.tests || []);
        // console.log(allModule, allModule.articles)
        const arts = allModule.articles || [];
        setArticles(Array.isArray(arts) ? arts : []);
      } catch (error) {
        console.error("Error fetching module data:", error);
      } finally {
        setIsLoading(false); // Now this runs after everything is done
      }
    };

    fetchData();
  }, [moduleId, dispatch]);




  useEffect(() => {
    const fetchCourseProgress = async () => {
      console.log('fetch course progress use effect, fetch Course progress')
      if (!courseId || !user?._id) return;
      try {

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
        width: "98%",
        display: "flex",
        justifyContent: "space-between",
        gap: 1,
        overflow: "hidden",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        scrollbarWidth: "none",
      }}
    >
      <Button
        onClick={() => {
          setTimeout(() => navigate(-1), 100);
        }}
        startIcon={<ArrowBackIcon sx={{ color: '#1976D2', fontSize: 10 }} />}
        sx={{
          position: 'absolute',
          top: 130,
          left: 55,
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
        width: "30%", display: 'flex', flexDirection: 'column', px: 6, mt: 2,

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
          articles={articles}
          currentArticle={currentArticle}
          setCurrentArticle={setCurrentArticle}
          moduleId={moduleId}
          courseId={courseId}
          currVidData={currVidData}
          lastTimeTracker={lastTimeTracker}
          completedArticles={completedArticles}
        />
        {/*tests.length > 0 && tests[currentQuiz]?.questions?.length > 0 ? (
          <QuizHistory questions={tests[currentQuiz]?.questions || []} moduleId={moduleId}
            currentTest={currentQuiz}
          />
        ) : null*/}
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
                key={`${courseId}-${moduleId}`}
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

        {currentView === "articles" && (
          isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4, mt: 10 }}>
              <CircularProgress size={80} />
            </Box>
          ) : (
            <ArticlesContent
              articles={articles}
              currentArticle={currentArticle}
              setCurrentArticle={setCurrentArticle}
              onArticleComplete={(id) => {
                setCompletedArticles((prev) => prev.includes(id) ? prev : [...prev, id]);
              }}
            />
          )
        )}

      </Box>
    </Box>
  );
};

export default CourseDetails;