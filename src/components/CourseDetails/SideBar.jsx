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
import NoContentPage from './NoContentPage';


export const Sidebar = ({
    currentView,
    setCurrentView,
    sidebarOpen,
    setSidebarOpen,
    videos,
    currentVideo,
    setCurrentVideo,
    tests,
    currentTest,
    setCurrentTest,
    currentQuestion,
    setCurrentQuestion
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    // console.log("this is the  tedsts : ", tests)
    return (
        <Box sx={{
            width: '100%',
            bgcolor: 'background.paper',
            borderRadius: 2,
            p: 2,
            mt: 2,
            border: '1px solid #ccc', // light gray border
            borderRadius: 4,      // optional: small rounded corners for better aesthetics
            boxShadow: 1,
            height: 'fit-content'
        }}>
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

                            border: '1px solid #ccc', // light gray border
                            mb: '4px',
                            borderRadius: '8px',
                            '&.Mui-selected': {
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                '&:hover': { bgcolor: 'primary.dark' },
                            },
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                color: currentView === 'video' ? 'primary.contrastText' : 'black',
                            }}
                        >
                            <PlayCircleIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Typography
                                    sx={{
                                        color: currentView === 'video' ? 'primary.contrastText' : 'black',
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
                        selected={currentView === 'quiz'}
                        onClick={() => setCurrentView('quiz')}
                        sx={{

                            border: '1px solid #ccc', // light gray border
                            borderRadius: '8px',
                            '&.Mui-selected': {
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                '&:hover': { bgcolor: 'primary.dark' },
                            },
                        }}
                    >
                        <ListItemIcon
                            sx={{
                                color: currentView === 'quiz' ? 'primary.contrastText' : 'black',
                            }}
                        >
                            <HelpIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                <Typography
                                    sx={{
                                        color: currentView === 'quiz' ? 'primary.contrastText' : 'black',
                                    }}
                                >
                                    {`Quizzes (${tests?.length})`}
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
                                width: '8%',
                                mb: 2,
                                background: 'gray',
                                borderRadius: 1,
                                opacity: 0.6, // subtle feel
                            }}
                        />
                        <List >
                            {videos.map((video, index) => (
                                <ListItem key={video.id} disablePadding>
                                    <ListItemButton
                                        selected={currentVideo === index}
                                        onClick={() => setCurrentVideo(index)}
                                        sx={{
                                            borderRadius: 1,
                                            borderLeft: video.completed ? '4px solid' : 'none',
                                            borderColor: 'success.main',
                                            border: '1px solid #ccc', // light gray border
                                            mb: '4px',
                                            borderRadius: '8px',


                                            '&.Mui-selected': {
                                                bgcolor: 'primary.main',
                                                color: 'primary.contrastText',
                                            },

                                            '&.Mui-selected:hover': {
                                                bgcolor: '#003c8f', // deeper blue for better contrast
                                                color: 'white',
                                            },


                                            '&:hover': {
                                                bgcolor: 'grey.100',
                                            },
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                color: currentVideo === index ? 'primary.contrastText' : 'black',
                                            }}
                                        >
                                            {video.status === 'completed' ? (
                                                <CheckCircleIcon color="success" />
                                            ) : (
                                                <PlayCircleIcon color="action" />
                                            )}
                                        </ListItemIcon>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography
                                                noWrap
                                                sx={{
                                                    color: currentVideo === index ? 'primary.contrastText' : 'black',
                                                }}
                                            >
                                                {video.title}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: currentVideo === index ? 'primary.contrastText' : 'text.secondary',
                                                }}
                                            >
                                                {video.duration}
                                            </Typography>
                                        </Box>
                                    </ListItemButton>
                                </ListItem>
                            ))}

                        </List>
                    </Box>
                ) : (
                    <NoContentPage title={"Videos"} description='No Videos Found' />
                )
            ) : null}

            {currentView === 'quiz' ? (
                tests.length !== 0 ? (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="overline" color="text.secondary">
                            Quizzes
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
                                            borderRadius: 1,
                                            borderLeft: quiz.completed ? '4px solid' : 'none',
                                            borderColor: 'success.main',
                                            border: '1px solid #ccc', // light gray border
                                            mb: '4px',
                                            borderRadius: '8px',      // optional: small rounded corners for better aesthetics

                                            '&.Mui-selected': {
                                                bgcolor: 'primary.main',
                                                color: 'primary.contrastText',
                                            },


                                            '&.Mui-selected:hover': {
                                                bgcolor: '#003c8f', // stronger blue for better contrast
                                                color: 'white',     // ensures text stays readable
                                            },
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                color: currentTest === index ? 'primary.contrastText' : 'black',
                                            }}
                                        >
                                            {quiz.status === 'completed' ? (
                                                <CheckCircleIcon color="success" />
                                            ) : (
                                                <HelpIcon />
                                            )}
                                        </ListItemIcon>
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography
                                                noWrap
                                                sx={{
                                                    color: currentTest === index ? 'primary.contrastText' : 'black',
                                                }}
                                            >
                                                {quiz.title}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                sx={{
                                                    color: currentTest === index ? 'primary.contrastText' : 'text.secondary',
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


                                                    ...(currentQuestion === index && {
                                                        bgcolor: '#1976d2', // blue
                                                        color: '#ffffff', // white text
                                                        '&:hover': {
                                                            bgcolor: '#115293', // darker blue on hover
                                                        },
                                                    }),


                                                    ...(question.answered !== null && currentQuestion !== index && {
                                                        bgcolor: '#2e7d32', // green
                                                        color: '#ffffff',
                                                        '&:hover': {
                                                            bgcolor: '#1b5e20', // darker green
                                                        },
                                                    }),

                                                    // ⚪ Unanswered + not selected (gray border & text)
                                                    ...(question.answered === null && currentQuestion !== index && {
                                                        border: '1px solid #9e9e9e', // medium gray
                                                        color: '#424242', // dark gray text
                                                        '&:hover': {
                                                            bgcolor: '#e0e0e0', // light gray on hover
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