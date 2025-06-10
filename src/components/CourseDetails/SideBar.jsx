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


export const Sidebar = ({
    currentView,
    setCurrentView,
    sidebarOpen,
    setSidebarOpen,
    videos,
    currentVideo,
    setCurrentVideo,
    questions,
    currentQuestion,
    setCurrentQuestion
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));


    return (
          <Box sx={{ 
      width: '100%',
      bgcolor: 'background.paper',
      borderRadius: 2,
      p: 2,
      boxShadow: 1,
      height: 'fit-content'
    }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Course Content
      </Typography>
      
      <List>
        {/* <ListItem disablePadding>
          <ListItemButton
            selected={currentView === 'overview'}
            onClick={() => setCurrentView('overview')}
            sx={{
              borderRadius: 1,
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': { bgcolor: 'primary.dark' },
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              <BookIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem> */}

        <ListItem disablePadding>
          <ListItemButton
            selected={currentView === 'video'}
            onClick={() => setCurrentView('video')}
            sx={{
              borderRadius: 1,
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': { bgcolor: 'primary.dark' },
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              <PlayCircleIcon />
            </ListItemIcon>
            <ListItemText primary={`Videos (${videos.length})`} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            selected={currentView === 'quiz'}
            onClick={() => setCurrentView('quiz')}
            sx={{
              borderRadius: 1,
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': { bgcolor: 'primary.dark' },
              },
            }}
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              <HelpIcon />
            </ListItemIcon>
            <ListItemText primary={`Quiz (${questions.length})`} />
          </ListItemButton>
        </ListItem>
      </List>

      {currentView === 'video' && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="overline" color="text.secondary">
            Videos
          </Typography>
          <List>
            {videos.map((video, index) => (
              <ListItem key={video.id} disablePadding>
                <ListItemButton
                  selected={currentVideo === index}
                  onClick={() => setCurrentVideo(index)}
                  sx={{
                    borderRadius: 1,
                    borderLeft: video.completed ? '4px solid' : 'none',
                    borderColor: 'success.main',
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                    },
                  }}
                >
                  <ListItemIcon>
                    {video.completed ? (
                      <CheckCircleIcon color="success" />
                    ) : (
                      <PlayCircleIcon color="action" />
                    )}
                  </ListItemIcon>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography noWrap>{video.title}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {video.duration}
                    </Typography>
                  </Box>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {currentView === 'quiz' && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="overline" color="text.secondary">
            Questions
          </Typography>
          <Grid container spacing={1} sx={{ p: 1 }}>
            {questions.map((question, index) => (
              <Grid item key={index}>
                <Button
                  variant={
                    currentQuestion === index
                      ? "contained"
                      : question.answered !== null
                        ? "contained"
                        : "outlined"
                  }
                  color={
                    currentQuestion === index
                      ? "primary"
                      : question.answered !== null
                        ? "success"
                        : "inherit"
                  }
                  onClick={() => setCurrentQuestion(index)}
                  sx={{ minWidth: 40, height: 40 }}
                >
                  {index + 1}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
    );
};
