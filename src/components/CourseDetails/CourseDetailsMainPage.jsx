import React from 'react';
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

const CourseDetails = () => {
    const [activeTab, setActiveTab] = useState('chapters');
    const [selectedChapter, setSelectedChapter] = useState(null);
    const [currentView, setCurrentView] = useState('video');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [questions, setQuestions] = useState(sampleQuestions);
    const [currentVideo, setCurrentVideo] = useState(0);
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

    const completedChapters = chapters.filter(c => c.completed).length;
    const totalChapters = chapters.length;
    const progressPercentage = (completedChapters / totalChapters) * 100;


    return (
        <Box sx={{ bgcolor: 'background.default', height: '1000px',  width:'100%', display:'flex' , justifyContent:'center', gap:6 , position:'absolute' , overflowY:'auto' }}>
                    <Box sx={{width:'30%', position:'relative' }}>
                    <Sidebar
                        currentView={currentView}
                        setCurrentView={setCurrentView}
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                        videos={videos}
                        currentVideo={currentVideo}
                        setCurrentVideo={setCurrentVideo}
                        questions={questions}
                        currentQuestion={currentQuestion}
                        setCurrentQuestion={setCurrentQuestion}
                    />
                    </Box>
                     
                    <Box sx={{width:'60%', overflowY:'auto' , position:'relative'}}>
                        {currentView === 'quiz' && (
                            <QuizContent
                                questions={questions}
                                currentQuestion={currentQuestion}
                                handleAnswerSelect={handleAnswerSelect}
                                setCurrentQuestion={setCurrentQuestion}
                            />
                        )}

                        {currentView === 'video' && (
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
                        )}
                    </Box>
        </Box>
    );
};

export default CourseDetails;


const chapters = [
    {
        id: '1',
        title: 'Python Basics',
        videos: 9,
        articles: 9,
        problems: 2,
        mcqs: 15,
        completed: true,
        duration: '2h 30m'
    },
    {
        id: '2',
        title: 'Python Data Types',
        videos: 9,
        articles: 9,
        problems: 10,
        mcqs: 15,
        completed: false,
        duration: '3h 15m'
    },
    {
        id: '3',
        title: 'Input and Output in Python',
        videos: 2,
        articles: 2,
        problems: 4,
        mcqs: 15,
        completed: false,
        duration: '1h 45m'
    },
    {
        id: '4',
        title: 'Control Structures',
        videos: 12,
        articles: 8,
        problems: 15,
        mcqs: 20,
        completed: false,
        duration: '4h 20m'
    },
    {
        id: '5',
        title: 'Functions and Modules',
        videos: 15,
        articles: 12,
        problems: 20,
        mcqs: 25,
        completed: false,
        duration: '5h 10m'
    }
];

const sampleQuestions = [
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
    }
];

const videos = [
    {
        id: 1,
        title: "Background Part 1 (IO Devices, CPU and Memory)",
        duration: "5 min, 31 sec",
        completed: true,
        description: "In this foundational lesson, we explore the fundamental components of computer systems that form the backbone of programming. We'll dive deep into Input/Output devices, understanding how data flows between the user and the computer system. You'll learn about different types of input devices like keyboards, mice, and sensors, as well as output devices such as monitors, printers, and speakers. We'll also cover the Central Processing Unit (CPU) - the brain of the computer - and examine how it processes instructions and manages computational tasks. Finally, we'll explore computer memory systems, including RAM, cache, and storage, understanding how data is stored, accessed, and managed efficiently.",
        keyTopics: [
            "Input/Output Device Architecture",
            "CPU Components and Functionality",
            "Memory Hierarchy and Management",
            "Data Flow in Computer Systems",
            "Hardware-Software Interaction"
        ],
        learningObjectives: [
            "Understand the role of I/O devices in computer systems",
            "Explain CPU architecture and processing cycles",
            "Differentiate between various types of computer memory",
            "Analyze data flow between hardware components"
        ]
    },
    {
        id: 2,
        title: "Background Part 2 (Computer Organization & Operating System)",
        duration: "3 min, 16 sec",
        completed: true,
        description: "Building upon our hardware foundation, this lesson explores computer organization and operating systems. We'll examine how hardware components work together as a cohesive system and understand the critical role of operating systems in managing resources. You'll learn about system architecture, including the von Neumann model, and how instructions are fetched, decoded, and executed. We'll cover operating system fundamentals, including process management, memory allocation, file systems, and device drivers. This knowledge is essential for understanding how programming languages interact with the underlying system.",
        keyTopics: [
            "Computer Architecture Models",
            "Operating System Functions",
            "Process and Thread Management",
            "File System Organization",
            "System Resource Management"
        ],
        learningObjectives: [
            "Describe computer organization principles",
            "Explain operating system responsibilities",
            "Understand process lifecycle management",
            "Analyze system resource allocation"
        ]
    },
    {
        id: 3,
        title: "Why Do We Need Programming Languages",
        duration: "4 min, 22 sec",
        completed: true,
        description: "This lesson addresses the fundamental question of why programming languages exist and their importance in modern computing. We'll explore the evolution from machine language to high-level programming languages, understanding the abstraction layers that make programming accessible and efficient. You'll learn about the challenges of communicating with computers using binary code and how programming languages bridge the gap between human logic and machine execution. We'll discuss different paradigms of programming languages, their strengths, and use cases, setting the stage for understanding Python's place in the programming ecosystem.",
        keyTopics: [
            "Evolution of Programming Languages",
            "Abstraction Levels in Computing",
            "Programming Language Paradigms",
            "Human-Computer Communication",
            "Language Design Principles"
        ],
        learningObjectives: [
            "Explain the need for programming languages",
            "Compare different programming paradigms",
            "Understand abstraction in software development",
            "Evaluate language selection criteria"
        ]
    },
    {
        id: 4,
        title: "Python Introduction",
        duration: "6 min, 16 sec",
        completed: true,
        description: "Welcome to Python! This comprehensive introduction covers Python's history, philosophy, and unique characteristics that make it one of the most popular programming languages today. We'll explore Python's design principles, including readability, simplicity, and versatility. You'll learn about Python's creator Guido van Rossum and the language's evolution from version 1.0 to the current Python 3.x series. We'll discuss Python's applications across various domains including web development, data science, artificial intelligence, automation, and scientific computing. This lesson establishes the foundation for your Python programming journey.",
        keyTopics: [
            "Python History and Philosophy",
            "Language Design Principles",
            "Python's Ecosystem and Community",
            "Application Domains",
            "Python vs Other Languages"
        ],
        learningObjectives: [
            "Understand Python's design philosophy",
            "Identify Python's key characteristics",
            "Recognize Python's application areas",
            "Appreciate Python's role in modern development"
        ]
    },
    {
        id: 5,
        title: "Python Standard and Implementations",
        duration: "3 min, 36 sec",
        completed: false,
        description: "Dive into the technical aspects of Python standards and various implementations. This lesson covers the Python Enhancement Proposal (PEP) process, which governs Python's development and ensures consistency across the language. We'll explore different Python implementations including CPython (the reference implementation), PyPy (with just-in-time compilation), Jython (for Java integration), and IronPython (for .NET framework). You'll understand how these implementations affect performance, compatibility, and use cases. We'll also discuss Python's standard library and how it contributes to the language's 'batteries included' philosophy.",
        keyTopics: [
            "Python Enhancement Proposals (PEPs)",
            "CPython Reference Implementation",
            "Alternative Python Implementations",
            "Standard Library Overview",
            "Implementation Performance Characteristics"
        ],
        learningObjectives: [
            "Understand Python standardization process",
            "Compare different Python implementations",
            "Explain the role of the standard library",
            "Choose appropriate implementation for specific needs"
        ]
    },
    {
        id: 6,
        title: "How Python Programs are Executed",
        duration: "9 min",
        completed: false,
        description: "Uncover the mystery of Python program execution in this detailed exploration of the Python interpreter. We'll trace the journey of Python code from source file to execution, covering lexical analysis, parsing, compilation to bytecode, and interpretation by the Python Virtual Machine (PVM). You'll learn about the compilation process, bytecode generation, and how the interpreter executes instructions. We'll also cover important concepts like the Python path, module loading, and the difference between compiled and interpreted languages. This technical foundation is crucial for understanding Python's performance characteristics and debugging capabilities.",
        keyTopics: [
            "Python Execution Model",
            "Lexical Analysis and Parsing",
            "Bytecode Compilation",
            "Python Virtual Machine (PVM)",
            "Module Loading and Import System"
        ],
        learningObjectives: [
            "Trace Python code execution process",
            "Understand bytecode compilation",
            "Explain interpreter functionality",
            "Analyze Python's execution performance"
        ]
    }
];