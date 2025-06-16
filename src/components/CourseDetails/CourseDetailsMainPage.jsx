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
import { OverviewContent } from "./OverviewContent";
import { QuizContent } from "./QuizContent";
import { VideoContent } from "./VideoContent";
import { Sidebar } from "./SideBar";
import { getModulebyModuleId } from "../../context/Actions/courseActions";
import { useCourseContext } from "../../context/contextFiles/CourseContext";
import NoContentPage from "./NoContentPage";

const CourseDetails = ({ moduleId }) => {
  const [module, setModule] = useState(null);
  const [videos, setVideos] = useState([]);
  const [tests, setTests] = useState([]);
  const { state, dispatch } = useCourseContext();
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleAnswerSelect = (questionIndex, optionText) => {
    // This function is passed to QuizContent to handle answer selection
    // The actual state management is now handled within QuizContent
  };

  useEffect(() => {
    const fetchdata = async () => {
      const allModule = await getModulebyModuleId(moduleId, dispatch);
      console.log("this is the data from CourseDetails:", allModule);
      setModule(allModule || []);
      setVideos(allModule.videos || []);
      setTests(allModule.tests || []);
    };
    fetchdata();
  }, [moduleId, dispatch]);

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
      <Box sx={{ width: "30%" }}>
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
        />
      </Box>

      <Box sx={{ width: "60%", overflow: "hidden" }}>
        {currentView === "quiz" &&
          (tests.length > 0 && tests[0]?.questions?.length > 0 ? (
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
              title="Quizzes"
              description="No quizzes available for this module"
            />
          ))}
        {currentView === "video" &&
          (videos.length !== 0 ? (
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
              />
            </Box>
          ) : (
            <NoContentPage
              title="Videos"
              description="No videos available for this module"
            />
          ))}
      </Box>
    </Box>
  );
};

export default CourseDetails;