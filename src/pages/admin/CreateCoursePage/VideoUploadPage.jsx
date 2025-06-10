import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VideoUploadForm from '../../../components/CourseCreationComponents.jsx/VideoUploadForm';
import { useCourseContext } from '../../../context/contextFiles/CourseContext';


const VideoUploadPage = () => {
  const { courseId } = useParams();
  const { state: { courses }, dispatch} = useCourseContext();
  console.log('this is he  courseid  from the  videoupload page : ' ,   courseId)
  console.log('all courses  from the  videoupload page : ' ,   courses)
  const navigate = useNavigate();

  useEffect(() => {
    if (!courseId) return; 
  }, [courseId, courses, navigate]);

  if (!courseId) {
    return <div>Loading...</div>; // or null, or a spinner
  }

  return <VideoUploadForm courseId={courseId} />;
};


export default VideoUploadPage;
