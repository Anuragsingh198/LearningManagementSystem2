import React, { useEffect } from 'react';
import { useState } from 'react';
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
    useTheme
} from '@mui/material';
import {
    Book as BookIcon,
    PlayCircle as PlayCircleIcon,
    Help as HelpIcon,
    CheckCircle as CheckCircleIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import { OverviewContent } from './OverviewContent';
import { QuizContent } from './QuizContent';
import { VideoContent } from './VideoContent';
import { Sidebar } from './SideBar';
import { getModulebyModuleId } from '../../context/Actions/courseActions';
import { useCourseContext } from '../../context/contextFiles/CourseContext';
import { all } from 'axios';
import NoContentPage from './NoContentPage';

const CourseDetails = ({ moduleId }) => {
    const [module, setModule] = useState(null);
    const [videos, setVideos] = useState([]);
    const [tests, setTests] = useState(sampleTests);
    const { state, dispatch } = useCourseContext();
    const [activeTab, setActiveTab] = useState('chapters');
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [currentView, setCurrentView] = useState('video');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [questions, setQuestions] = useState()
    const [currentVideo, setCurrentVideo] = useState(0);
    const [currentQuiz, setCurrentQuiz] = useState(0);
    const [isVideoZoomed, setIsVideoZoomed] = useState(false);
    const [isVideoFullscreen, setIsVideoFullscreen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleAnswerSelect = (questionIndex, answerIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].answered = answerIndex;
        setQuestions(updatedQuestions);
    };
    console.log("this  are the  sample tests  : ", sampleTests)
    useEffect(() => {
        const fetchdata = async () => {
            const allModule = await getModulebyModuleId(moduleId, dispatch);
            console.log("this is the data from CourseDetails:", allModule);
            setModule(allModule || []);
            setVideos(allModule.videos || []);
            // setTests(allModule.tests || sampleTests);
        };
        fetchdata();
    }, []);


    return (
        <Box sx={{
            bgcolor: 'background.default',
            height: '100vh',  // or '100%' if parent has a defined height
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            gap: 6,
            // overflowY: 'hidden',
            overflow: 'hidden',
            '&::-webkit-scrollbar': {
                display: 'none',
            },
            scrollbarWidth: 'none',
        }}>

            <Box sx={{ width: '30%' }}>
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
                    currentQuestion={currentQuestion}             // ✅ ADD THIS
                    setCurrentQuestion={setCurrentQuestion}       // ✅ ADD THIS
                />
            </Box>

            <Box sx={{ width: '60%', overflow: 'hidden' }}>
                {currentView === 'quiz' && (
                    tests.length !== 0 ? (
                        <QuizContent
                            questions={tests[currentQuiz]?.questions || []}
                            currentQuestion={currentQuestion}
                            handleAnswerSelect={handleAnswerSelect}
                            setCurrentQuestion={setCurrentQuestion}
                            tests={tests}
                        />
                    ) : (
                        <NoContentPage
                            title="Quizzes"
                            description="No quizzes available for this module"
                        />
                    )
                )}
                {currentView === 'video' && (
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
                            />
                        </Box>
                    ) : (
                        <NoContentPage
                            title="Videos"
                            description="No videos available for this module"
                        />
                    )
                )}

            </Box>
        </Box>
    );
};

const sampleTests = [
    {
        id: 1,
        title: "Python Basics Quiz",
        status: "incomplete",
        completed: false,
        questions: [
            {
                id: 1,
                question: "What does Python support?",
                options: [
                    "Procedural style programming",
                    "Object oriented programming",
                    "Functional programming",
                    "All of the above"
                ],
                correct: 3,
                answered: null
            },
            {
                id: 2,
                question: "Which of the following is the correct extension of Python file?",
                options: [".python", ".pl", ".py", ".p"],
                correct: 2,
                answered: null
            },
            {
                id: 3,
                question: "What is the correct way to create a function in Python?",
                options: [
                    "function myFunction():",
                    "def myFunction():",
                    "create myFunction():",
                    "func myFunction():"
                ],
                correct: 1,
                answered: null
            },
            {
                id: 4,
                question: "Which keyword is used to create a class in Python?",
                options: ["class", "className", "struct", "object"],
                correct: 0,
                answered: null
            },
            {
                id: 5,
                question: "What is the output of 'print(3 * '7')' in Python?",
                options: ["21", "777", "Error", "37"],
                correct: 1,
                answered: null
            }
        ]
    },
    {
        id: 2,
        title: "Python Data Structures Quiz",
        status: "incomplete",
        completed: false,
        questions: [
            {
                id: 1,
                question: "Which of these is a mutable data structure in Python?",
                options: ["tuple", "string", "list", "all of the above"],
                correct: 2,
                answered: null
            },
            {
                id: 2,
                question: "What is the time complexity of accessing an element in a Python dictionary?",
                options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
                correct: 0,
                answered: null
            },
            {
                id: 3,
                question: "Which method would you use to add an element to a set?",
                options: ["append()", "add()", "insert()", "push()"],
                correct: 1,
                answered: null
            },
            {
                id: 4,
                question: "What does the list method sort() return?",
                options: [
                    "A new sorted list",
                    "The original list, sorted",
                    "A sorted copy of the list",
                    "None"
                ],
                correct: 3,
                answered: null
            },
            {
                id: 5,
                question: "How would you create a shallow copy of a list?",
                options: [
                    "list.copy()",
                    "list[:]",
                    "list.copy() or list[:]",
                    "All of the above"
                ],
                correct: 3,
                answered: null
            }
        ]
    },
    {
        id: 3,
        title: "Python Advanced Concepts Quiz",
        status: "completed",
        completed: true,
        questions: [
            {
                id: 1,
                question: "What is a generator in Python?",
                options: [
                    "A function that returns an iterable set of items",
                    "A special type of iterator",
                    "A function that yields values one at a time",
                    "All of the above"
                ],
                correct: 3,
                answered: 3
            },
            {
                id: 2,
                question: "What does the @property decorator do?",
                options: [
                    "Marks a method as a class method",
                    "Converts a method to a property",
                    "Makes a method private",
                    "Allows method overloading"
                ],
                correct: 1,
                answered: 1
            },
            {
                id: 3,
                question: "What is the purpose of __init__.py in a Python package?",
                options: [
                    "It's required to make Python treat directories as packages",
                    "It can contain package initialization code",
                    "It can define what gets imported with import *",
                    "All of the above"
                ],
                correct: 3,
                answered: 3
            },
            {
                id: 4,
                question: "Which of these is NOT a magic method in Python?",
                options: ["__init__", "__len__", "__iter__", "__hashmap__"],
                correct: 3,
                answered: 3
            },
            {
                id: 5,
                question: "What does the 'with' statement do in Python?",
                options: [
                    "Creates a context manager",
                    "Ensures proper resource cleanup",
                    "Can be used with file operations",
                    "All of the above"
                ],
                correct: 3,
                answered: 3
            }
        ]
    }
];
export default CourseDetails;
