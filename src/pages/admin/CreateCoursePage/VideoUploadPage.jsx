import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoUploadForm from '../../../components/CourseCreationComponents.jsx/VideoUploadForm';
import QuizCreationForm from './QuizCreationForm';
import { useCourseContext } from '../../../context/contextFiles/CourseContext';
import { Box, Button, Typography } from '@mui/material';

const VideoUploadPage = () => {
  const { courseId } = useParams();
  const { state: { courses }, dispatch } = useCourseContext();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('video'); // 'video' or 'quiz'

  useEffect(() => {

    if (!courseId) return;
  }, [courseId, courses, navigate]);

  if (!courseId) {
    return <div>Loading...</div>;
  }

  const course = courses.find(c => c._id === courseId); // assuming _id is the identifier


  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" mb={2} color='black'>
        {course ? `Course: ${course.title}` : 'Course not found'}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 3,
        }}
      >
        <Button
          variant={activeTab === 'video' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('video')}
        >
          Upload Video
        </Button>
        <Button
          variant={activeTab === 'quiz' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('quiz')}
        >
          Add Quiz
        </Button>
      </Box>

      <Box>
        {activeTab === 'video' && <VideoUploadForm courseId={courseId} />}
        {activeTab === 'quiz' && <QuizCreationForm courseId={courseId} />}
      </Box>
    </Box>
  );
};

export default VideoUploadPage;
