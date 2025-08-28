import React from 'react';
import { useState, useEffect } from 'react';
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
// import {
//     Book as BookIcon,
//     PlayCircle as PlayCircleIcon,
//     Help as HelpIcon,
//     CheckCircle as CheckCircleIcon,
//     Close as CloseIcon
// } from '@mui/icons-material';
import {
    TvMinimalPlay,
    Newspaper,
    NotebookPen,
    Book,
    HelpCircle,
    CircleCheckBig,
    PlayCircle,
} from 'lucide-react';
import { toast } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

import NoContentPage from './NoContentPage';
import { useCourseContext } from '../../context/contextFiles/CourseContext';
import { checkVideoOrTestInUserProgressAction, videoProgress } from '../../context/Actions/courseActions';


export const Sidebar = ({
    currentView,
    setCurrentView,
    videos,
    currentVideo,
    setCurrentVideo,
    tests,
    currentTest,
    setCurrentTest,
    currentQuestion,
    setCurrentQuestion,
    articles,
    currentArticle = 0,
    setCurrentArticle,
    completedArticles = [],
    sendWatchTime
}) => {
    const { state: { courseProgress, allModuleProgress, oneModuleProgress: moduleProgress, currentVideoProgress, allVideoProgress }, dispatch } = useCourseContext();
    // console.log("this is hte  corrent  video data : ", videos[currentVideo])
    const videoStatusMap = {};
    const totalVideos = moduleProgress?.totalVideos || 0;
    const completedVideos = moduleProgress?.completedVideos || 0;

    allVideoProgress.forEach((vp) => {
        videoStatusMap[vp.videoId] = vp.status;
    });

    // console.log("all video progress videoStatusMap from   side bar is : ", videoStatusMap)

    useEffect(() => {
        // console.log("this is sidebar", currentVideoProgress, allModuleProgress, allVideoProgress);
    }, [currentVideoProgress, allModuleProgress, allVideoProgress]);

    const handleAssessmentTabSelection = () => {
        // if()
        // setCurrentView('quiz');
        // sendWatchTime();

        if (completedVideos >= totalVideos) {
            setCurrentView('quiz');
        } else {
            toast.error('Please complete all the Videos')
        }

    }


    useEffect(() => {
        // console.log('the tests are: ', tests)
    }, [tests])

    const navigate = useNavigate();

    return (
        <Box sx={{
            width: '100%',
            bgcolor: 'background.paper',
            p: 2,
            mt: 2,
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: 'none',
            height: 'fit-content',
            position: 'relative'
        }}>
            {/* Back Button */}
            <Button
                onClick={() => {
                    setTimeout(() => navigate(-1), 100);
                }}
                startIcon={<ArrowBackIcon sx={{ color: '#1976D2', fontSize: 10 }} />}
                sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    backgroundColor: 'transparent',
                    color: '#1976D2',
                    textTransform: 'none',
                    fontSize: 12,
                    padding: '5px 8px',
                    minWidth: 'auto',
                    boxShadow: 'none',
                    '& .MuiButton-startIcon': {
                        marginRight: '4px',
                    },
                    '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        boxShadow: 'none',
                    },
                }}
            >
                Back
            </Button>

            {/* Stroke line below the button */}
            <Box
                sx={{
                    height: '1px',
                    width: '100%',
                    mt: 5,
                    mb: 2,
                    background: 'gray',
                    borderRadius: 1,
                    opacity: 0.6,
                }}
            />

            <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', mb: 1, color: 'black' }}
            >
                Course Content
            </Typography>

            {/* ✅ Subtle line below the heading */}
            <Box
                sx={{
                    height: '1px',
                    width: '25%',
                    mb: 2,
                    background: 'gray',
                    borderRadius: 1,
                    opacity: 0.6, // subtle feel
                }}
            />


            <List>
                <ListItem disablePadding>
                    <ListItemButton
                        selected={currentView === 'video'}
                        onClick={() => setCurrentView('video')}
                        sx={{
                            mb: '6px',
                            border: '1px solid',
                            borderColor: currentView === 'video' ? 'primary.main' : '#cfcfcf',
                            borderRadius: '6px',
                            bgcolor: currentView === 'video' ? '#E3F2FD' : 'transparent',
                            boxShadow: 'none',

                            '&.Mui-selected': {
                                bgcolor: '#E3F2FD',
                                borderColor: 'primary.main',
                                color: 'primary.main',
                            },

                            '&.Mui-selected:hover': {
                                bgcolor: '#BBDEFB',
                            },

                            '&:hover': {
                                bgcolor: '#f5f5f5',
                            },
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                color: currentView === 'video' ? 'primary.main' : 'text.secondary',
                            }}
                        >
                            <TvMinimalPlay strokeWidth={currentView === 'video' ? 2 : 1} />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Typography
                                    sx={{
                                        fontWeight: currentView === 'video' ? 600 : 400,
                                        color: currentView === 'video' ? 'primary.main' : 'text.primary',
                                    }}
                                >
                                    {`Videos (${videos.length})`}
                                </Typography>
                            }
                        />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton
                        selected={currentView === 'articles'}
                        onClick={() => setCurrentView('articles')}
                        sx={{
                            mb: '6px',
                            border: '1px solid',
                            borderColor: currentView === 'articles' ? 'primary.main' : '#cfcfcf',
                            borderRadius: '6px',
                            bgcolor: currentView === 'articles' ? '#E3F2FD' : 'transparent',
                            boxShadow: 'none',

                            '&.Mui-selected': {
                                bgcolor: '#E3F2FD',
                                borderColor: 'primary.main',
                                color: 'primary.main',
                            },

                            '&.Mui-selected:hover': {
                                bgcolor: '#BBDEFB',
                            },

                            '&:hover': {
                                bgcolor: '#f5f5f5',
                            },
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                color:
                                    currentView === 'articles' ? 'primary.main' : 'text.secondary',
                            }}
                        >
                            <Newspaper strokeWidth={currentView === 'articles' ? 2 : 1} />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Typography
                                    sx={{
                                        fontWeight: currentView === 'articles' ? 600 : 400,
                                        color:
                                            currentView === 'articles' ? 'primary.main' : 'text.primary',
                                    }}
                                >
                                    {`Articles (${articles?.length || 0})`}
                                </Typography>
                            }
                        />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton
                        selected={currentView === 'quiz'}
                        onClick={handleAssessmentTabSelection}
                        sx={{
                            border: '1px solid',
                            borderColor: currentView === 'quiz' ? 'primary.main' : '#cfcfcf',
                            borderRadius: '6px',
                            bgcolor: currentView === 'quiz' ? '#E3F2FD' : 'transparent',
                            boxShadow: 'none',

                            '&.Mui-selected': {
                                bgcolor: '#E3F2FD',
                                borderColor: 'primary.main',
                                color: 'primary.main',
                            },

                            '&.Mui-selected:hover': {
                                bgcolor: '#BBDEFB',
                            },

                            '&:hover': {
                                bgcolor: '#f5f5f5',
                            },
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                color: currentView === 'quiz' ? 'primary.main' : 'text.secondary',
                            }}
                        >
                            <NotebookPen strokeWidth={currentView === 'quiz' ? 2 : 1} />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Typography
                                    sx={{
                                        fontWeight: currentView === 'quiz' ? 600 : 400,
                                        color: currentView === 'quiz' ? 'primary.main' : 'text.primary',
                                    }}
                                >
                                    {`Assessments (${tests?.length})`}
                                </Typography>
                            }
                        />
                    </ListItemButton>
                </ListItem>
            </List>

            {currentView === 'video' ? (
                videos.length !== 0 ? (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="overline" color="text.secondary">
                            Videos
                        </Typography>
                        <Box
                            sx={{
                                height: '1px',
                                width: '9%',
                                mb: 2,
                                background: 'gray',
                                borderRadius: 1,
                                opacity: 0.6, // subtle feel
                            }}
                        />
                        <List>
                            {videos.map((video, index) => {
                                const status = videoStatusMap[video._id];
                                return (
                                    <ListItem key={video._id} disablePadding>
                                        <ListItemButton
                                            selected={currentVideo === index}
                                            onClick={() => {setCurrentVideo(index)
                                                console.log('Change video index clicked', index)
                                            }}
                                            sx={{
                                                mb: '6px',
                                                border: '1px solid',
                                                borderColor: currentVideo === index ? 'primary.main' : '#cfcfcf',
                                                borderRadius: '6px',
                                                bgcolor: currentVideo === index ? '#E3F2FD' : 'transparent',
                                                boxShadow: 'none',

                                                '&.Mui-selected': {
                                                    bgcolor: '#E3F2FD',
                                                    borderColor: 'primary.main',
                                                    color: 'primary.main',
                                                },

                                                '&.Mui-selected:hover': {
                                                    bgcolor: '#BBDEFB',
                                                },

                                                '&:hover': {
                                                    bgcolor: '#f5f5f5',
                                                },
                                            }}
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    color: currentVideo === index ? 'primary.main' : 'text.secondary',
                                                    minWidth: '32px',
                                                }}
                                            >
                                                {status === 'completed' ? (
                                                    <CircleCheckBig strokeWidth={2} color="#1976d2" />
                                                ) : (
                                                    <PlayCircle strokeWidth={1} color="#757575" />
                                                )}
                                            </ListItemIcon>
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography
                                                    noWrap
                                                    sx={{
                                                        fontWeight: currentVideo === index ? 600 : 400,
                                                        color: currentVideo === index ? 'primary.main' : 'text.primary',
                                                    }}
                                                >
                                                    {video.title}
                                                </Typography>
                                            </Box>
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>

                    </Box>
                ) : (
                    <NoContentPage title={""} description='No Videos Found' />
                )
            ) : null}

            {currentView === 'articles' ? (
                (articles && articles.length > 0) ? (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="overline" color="text.secondary">
                            Articles
                        </Typography>
                        <Box
                            sx={{
                                height: '1px',
                                width: '9%',
                                mb: 2,
                                background: 'gray',
                                borderRadius: 1,
                                opacity: 0.6,
                            }}
                        />
                        <List>
                            {(articles || []).map((a, index) => {
                                const id = a._id || a.id || `${index}`;
                                const completed = completedArticles?.includes(id);
                                const isSelected = currentArticle === index;

                                return (
                                    <ListItem key={id} disablePadding>
                                        <ListItemButton
                                            selected={isSelected}
                                            onClick={() => setCurrentArticle && setCurrentArticle(index)}
                                            sx={{
                                                mb: '6px',
                                                border: '1px solid',
                                                borderColor: isSelected ? 'primary.main' : '#cfcfcf',
                                                borderRadius: '6px',
                                                bgcolor: isSelected ? '#E3F2FD' : 'transparent',
                                                boxShadow: 'none',

                                                '&.Mui-selected': {
                                                    bgcolor: '#E3F2FD',
                                                    borderColor: 'primary.main',
                                                    color: 'primary.main',
                                                },

                                                '&.Mui-selected:hover': {
                                                    bgcolor: '#BBDEFB',
                                                },

                                                '&:hover': {
                                                    bgcolor: '#f5f5f5',
                                                },
                                            }}
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    color: isSelected ? 'primary.main' : 'text.secondary',
                                                    minWidth: '32px',
                                                }}
                                            >
                                                {completed ? (
                                                    <CircleCheckBig strokeWidth={2} color={isSelected ? '#1976d2' : '#1976d2'} />
                                                ) : (
                                                    <Book strokeWidth={isSelected ? 2 : 1} color={isSelected ? '#1976d2' : '#757575'} />
                                                )}
                                            </ListItemIcon>
                                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                                <Typography
                                                    noWrap
                                                    sx={{
                                                        fontWeight: isSelected ? 600 : 400,
                                                        color: isSelected ? 'primary.main' : 'text.primary',
                                                    }}
                                                >
                                                    {a.title || a.name || 'Document'}
                                                </Typography>
                                            </Box>
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>

                    </Box>
                ) : (
                    <NoContentPage title={''} description={'No Articles Found'} />
                )
            ) : null}


            {currentView === 'quiz' ? (
                tests.length !== 0 ? (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="overline" color="text.secondary">
                            Assessment
                        </Typography>
                        <Box
                            sx={{
                                height: '1px',
                                width: '9%',
                                mb: 2,
                                background: 'gray',
                                borderRadius: 1,
                                opacity: 0.6, // subtle feel
                            }}
                        />
                        <List>
                            {tests.map((quiz, index) => (
                                <ListItem key={quiz.id} disablePadding>
                                    <ListItemButton
                                        selected={currentTest === index}
                                        onClick={() => setCurrentTest(index)}
                                        sx={{
                                            mb: '6px',
                                            border: '2px solid',
                                            borderColor: currentTest === index ? 'primary.main' : '#bdbdbd',
                                            borderRadius: '6px',
                                            bgcolor: currentTest === index ? '#E3F2FD' : 'transparent',
                                            boxShadow: 'none',
                                            alignItems: 'flex-start',

                                            '&.Mui-selected': {
                                                bgcolor: '#E3F2FD',
                                                borderColor: 'primary.main',
                                                color: 'primary.main',
                                            },

                                            '&.Mui-selected:hover': {
                                                bgcolor: '#BBDEFB',
                                            },

                                            '&:hover': {
                                                bgcolor: '#f5f5f5',
                                            },
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                color: currentTest === index ? 'primary.main' : 'text.secondary',
                                                minWidth: '32px',
                                            }}
                                        >
                                            {quiz.status === 'completed' ? (
                                                <CircleCheckBig strokeWidth={2} color="#2e7d32" />
                                            ) : (
                                                <HelpCircle
                                                    strokeWidth={currentTest === index ? 2 : 1}
                                                    color={currentTest === index ? '#1976d2' : '#757575'}
                                                    style={{ marginTop: '1px' }}
                                                />

                                            )}
                                        </ListItemIcon>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography
                                                noWrap
                                                sx={{
                                                    fontWeight: currentTest === index ? 600 : 400,
                                                    color: currentTest === index ? 'primary.main' : 'text.primary',
                                                }}
                                            >
                                                {quiz.title}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color:
                                                        currentTest === index ? 'primary.main' : 'text.secondary',
                                                }}
                                            >
                                                {quiz.questions?.length || 0} questions
                                            </Typography>
                                        </Box>
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>


                        {tests[currentTest]?.questions?.length > 0 && (
                            <>
                                <Typography variant="overline" color="text.secondary" sx={{ mt: 2 }}>
                                    Questions
                                </Typography>

                                <Grid container spacing={1} sx={{ p: 1 }}>
                                    {tests[currentTest].questions.map((question, index) => (
                                        <Grid item key={index}>
                                            <Button
                                                variant={
                                                    currentQuestion === index || question.answered !== null
                                                        ? 'contained'
                                                        : 'outlined'
                                                }
                                                onClick={() => setCurrentQuestion(index)}
                                                sx={{
                                                    minWidth: 40,
                                                    height: 40,
                                                    borderRadius: '4px',
                                                    boxShadow: 'none',


                                                    ...(currentQuestion === index && {
                                                        bgcolor: '#E3F2FD',
                                                        color: '#1976d2',
                                                        border: '2px solid #1976d2',
                                                        '&:hover': {
                                                            bgcolor: '#BBDEFB',
                                                        },
                                                    }),

                                                    ...(question.answered !== null && currentQuestion !== index && {
                                                        bgcolor: '#E8F5E9',
                                                        color: '#2e7d32',
                                                        border: '2px solid #2e7d32',
                                                        '&:hover': {
                                                            bgcolor: '#C8E6C9',
                                                        },
                                                    }),


                                                    ...(question.answered === null && currentQuestion !== index && {
                                                        border: '1px solid #9e9e9e',
                                                        color: '#424242',
                                                        bgcolor: '#f5f5f5',
                                                        '&:hover': {
                                                            bgcolor: '#e0e0e0',
                                                        },
                                                    }),

                                                }}
                                            >
                                                {index + 1}
                                            </Button>
                                        </Grid>
                                    ))}
                                </Grid>
                            </>

                        )}
                    </Box>
                ) : (
                    // <NoContentPage title={"Quizzes"} description='No Quizzes Found'/>
                    ""
                )
            ) : null}
        </Box>
    );
};