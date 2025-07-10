import React, { useState } from 'react';
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Chip,
  IconButton,
  Paper,
  Card,
  CardContent,
  CardMedia,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import CloseIcon from '@mui/icons-material/Close';

const CourseDetailPage = () => {
  const course = {
    id: 1,
    title: 'Advanced React Development',
    description: 'Master React with hooks, context API, and advanced patterns. Build complex applications with this comprehensive course.',
    studentsEnrolled: 1245,
    modules: [
      {
        id: 1,
        title: 'React Fundamentals',
        description: 'Learn the core concepts of React',
        videos: [
          {
            id: 1,
            title: 'Introduction to React',
            description: 'Overview of React and its core principles',
            duration: '12:45',
            thumbnail: 'https://via.placeholder.com/300x170',
            videoUrl: 'https://example.com/video1.mp4'
          },
          {
            id: 2,
            title: 'Components and Props',
            description: 'Understanding React components and props',
            duration: '18:30',
            thumbnail: 'https://via.placeholder.com/300x170',
            videoUrl: 'https://example.com/video2.mp4'
          }
        ]
      },
      {
        id: 2,
        title: 'Hooks in Depth',
        description: 'Master all React hooks',
        videos: [
          {
            id: 3,
            title: 'useState and useEffect',
            description: 'Learn the most fundamental hooks',
            duration: '22:15',
            thumbnail: 'https://via.placeholder.com/300x170',
            videoUrl: 'https://example.com/video3.mp4'
          }
        ]
      }
    ]
  };

  const [expandedModule, setExpandedModule] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleModuleChange = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
    setSelectedVideo(null);
    setIsPlaying(false);
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 1.5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.7));
  };

  const closeVideoPlayer = () => {
    setSelectedVideo(null);
    setIsPlaying(false);
    setZoomLevel(1);
  };

  return (
    <Box sx={{ p: 2, width:'100%' }}>
      {/* Course Header Section */}
      <Paper elevation={3} sx={{ p:2, mb: 3,  width:'95%'}}>
        <Typography variant="h4" component="h1" gutterBottom>
          {course.title}
        </Typography>
        <Typography variant="body1" paragraph>
          {course.description}
        </Typography>
        <Box display="flex" alignItems="center">
          <Chip 
            label={`${course.studentsEnrolled} students enrolled`} 
            color="primary" 
            size="small" 
          />
        </Box>
      </Paper>

      {/* Modules Accordion */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 2, width:'95%'}}>
        Course Modules
      </Typography>
      
      <Box sx={{ mb: 2 , width:'97%' }}>
        {course.modules.map((module) => (
          <Accordion 
            key={module.id}
            expanded={expandedModule === module.id}
            onChange={() => handleModuleChange(module.id)}
            sx={{ mb: 1 }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`module-${module.id}-content`}
              id={`module-${module.id}-header`}
            >
              <Typography sx={{ width: '33%', flexShrink: 0 }}>
                {module.title}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                {module.videos.length} videos
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary" paragraph>
                {module.description}
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              {/* Videos List */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {module.videos.map((video) => (
                  <Card 
                    key={video.id} 
                    sx={{ width: 300, cursor: 'pointer' }}
                    onClick={() => handleVideoSelect(video)}
                  >
                    <CardMedia
                      component="img"
                      height="140"
                      image={video.thumbnail}
                      alt={video.title}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div">
                        {video.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {video.description}
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        Duration: {video.duration}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      {/* Video Player Modal */}
      {selectedVideo && (
        <Paper elevation={5} sx={{ 
          position: 'fixed', 
          bottom: 20, 
          right: 20, 
          width: `${400 * zoomLevel}px`, 
          zIndex: 1000,
          transition: 'all 0.3s ease'
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            p: 1, 
            bgcolor: 'primary.main',
            color: 'white'
          }}>
            <Typography variant="subtitle1">
              {selectedVideo.title}
            </Typography>
            <Box>
              <IconButton onClick={handleZoomIn} size="small" sx={{ color: 'white' }}>
                <ZoomInIcon />
              </IconButton>
              <IconButton onClick={handleZoomOut} size="small" sx={{ color: 'white' }}>
                <ZoomOutIcon />
              </IconButton>
              <IconButton onClick={closeVideoPlayer} size="small" sx={{ color: 'white' }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component="video"
              src={selectedVideo.videoUrl}
              controls
              autoPlay={isPlaying}
              sx={{ width: '100%', height: 'auto' }}
            />
            <Box sx={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <IconButton 
                onClick={togglePlayPause} 
                sx={{ 
                  color: 'white', 
                  bgcolor: 'rgba(0,0,0,0.5)',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.7)'
                  }
                }}
                size="large"
              >
                {isPlaying ? <PauseCircleOutlineIcon fontSize="large" /> : <PlayCircleOutlineIcon fontSize="large" />}
              </IconButton>
            </Box>
          </Box>
          
          <Box sx={{ p: 2 }}>
            <Typography variant="body2">
              {selectedVideo.description}
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default CourseDetailPage;