import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoUploadForm from '../../../components/CourseCreationComponents.jsx/VideoUploadForm';
import QuizCreationForm from './QuizCreationForm';
import { useCourseContext } from '../../../context/contextFiles/CourseContext';
import { Box, Button, Typography } from '@mui/material';
import AddAssessment from '../AddAssessment';
import { getMyCoursesAction } from '../../../context/Actions/courseActions';

const VideoUploadPage = () => {
  const { courseId } = useParams();
  const { state: { courses, myCourses }, dispatch } = useCourseContext();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('video'); // 'video' or 'quiz' or 'assessment'

  useEffect(() => {
    if (!courseId) return;
    const fetchMyCourses = async () => {
      try {
        await getMyCoursesAction(dispatch);
      } catch {
        console.error('unable to fetch my courses');
      }
    };

    fetchMyCourses();
  }, [courseId, courses, navigate]);

  if (!courseId) {
    return <div>Loading...</div>;
  }

  const course = myCourses.find(c => c._id === courseId);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" mb={2} color='black'>
        {course ? `Course: ${course.title}` : 'Course not found'}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 1, alignItems: 'center' }}>
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
        <Button
          variant={activeTab === 'assessment' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('assessment')}
        >
          Add Assessment 
        </Button>

        {/* Conditional Note */}
        {activeTab === 'quiz' && (
          <Typography variant="body2" color="gray" sx={{ ml: 2 }}>
            *Quizzes are for a particular module.
          </Typography>
        )}
        {activeTab === 'assessment' && (
          <Typography variant="body2" color="gray" sx={{ ml: 2 }}>
            *Assessments are for the overall course.
          </Typography>
        )}
      </Box>

      <Box>
        {activeTab === 'video' && <VideoUploadForm courseId={courseId} />}
        {activeTab === 'quiz' && <QuizCreationForm courseId={courseId} />}
        {activeTab === 'assessment' && <AddAssessment courseId={courseId} />}
      </Box>
    </Box>
  );
};

export default VideoUploadPage;
