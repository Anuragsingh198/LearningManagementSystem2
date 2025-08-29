import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoUploadForm from '../../../components/CourseCreationComponents.jsx/VideoUploadForm';
import ArticleUploadForm from '../../../components/CourseCreationComponents.jsx/ArticleUploadForm';
import { AlertTriangle } from 'lucide-react';
import QuizCreationForm from './QuizCreationForm';
import { useCourseContext } from '../../../context/contextFiles/CourseContext';
import { Box, Button, Typography, Chip } from '@mui/material';
import AddAssessment from '../AddAssessment';
import { getModulesByCourseId, getMyCoursesAction } from '../../../context/Actions/courseActions';

const VideoUploadPage = () => {
  const { courseId } = useParams();
  const { state: { courses, myCourses, moduleNames }, dispatch } = useCourseContext();
  const [existingModules, setExistingModules] = useState([]);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('video'); // 'video' | 'quiz' | 'article' | 'assessment'

  useEffect(()=> {
        getModulesByCourseId(courseId, dispatch)
            // .then((fetchedModules) => setExistingModules(fetchedModules))
            .catch((err) => console.error(err));
            // console.log('the modules from context are: ', moduleNames)
  }, [dispatch])

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
        <Button
          variant={activeTab === 'article' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('article')}
        >
          Add Article
        </Button>
        {/* <Button
          variant={activeTab === 'assessment' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('assessment')}
        >
          Add Overall Assessment
        </Button> */}

        {/* Conditional Note */}
        {activeTab === 'quiz' && (
          <Chip
            icon={
              <AlertTriangle
                size={18}
                strokeWidth={2}
                style={{ color: '#fbc02d' }}
              />
            }
            label="It will be necessary for enrolled users to take the test"
            variant="outlined"
            sx={{
              ml: 2,
              fontSize: '0.85rem',
              fontWeight: 500,
              borderColor: '#fbc02d',
              backgroundColor: '#fffde7',
              color: '#795548',
              borderRadius: '6px',
              padding: '2px 8px',
              '& .MuiChip-icon': {
                marginLeft: '4px',
                marginRight: '-4px',
              },
            }}
          />
        )}

        {activeTab === 'assessment' && (
          <Typography variant="body2" color="gray" sx={{ ml: 2 }}>
            *Assessments are for the overall course.
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          backgroundColor: '#fff',
          padding: 2,
          mb: 2,
          borderRadius: '4px',
          border: '1px solid #e5e7eb',
          borderLeft: '4px solid #1976d2', 
        }}
      >

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
        {activeTab === 'article' && <ArticleUploadForm courseId={courseId} />}
        {/* {activeTab === 'assessment' && <AddAssessment courseId={courseId} />} */}
      </Box>

    </Box>
  );
};

export default VideoUploadPage;
