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
    <Box sx={{ p: 1 }}>
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
          Add Assessment
        </Button>
        {/* <Button
          variant={activeTab === 'assessment' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('assessment')}
        >
          Add Overall Assessment 
        </Button> */}

        {/* Conditional Note */}
        {activeTab === 'quiz' && (
          <Typography variant="body2" color="gray" sx={{ ml: 2 }}>
            *It will be necessary for enrolled users to take the test
          </Typography>
        )}
        {activeTab === 'assessment' && (
          <Typography variant="body2" color="gray" sx={{ ml: 2 }}>
            *Assessments are for the overall course.
          </Typography>
        )}
      </Box>
      <Box sx={{ background: '#F0F0F0', padding: 1, mb: 2, borderRadius: 2 }}>

        <Typography variant="h5" mb={2} color='black'>
          {course ? `Course: ${course.title}` : 'Course not found'}
        </Typography>
        <Box sx={{ maxHeight: '140px', overflowY: 'auto' }}>
          <Typography mb={2} color='black' sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {course ? `Description: ${course.description}` : 'Course not found'}
          </Typography>
        </Box>
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
