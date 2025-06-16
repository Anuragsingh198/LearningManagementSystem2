// OverviewPage.jsx
import React, { useEffect, useState } from 'react';
import { OverviewContent } from '../../components/CourseDetails/OverviewContent';
import { Box } from '@mui/material';
import { getCourseById } from '../../context/Actions/courseActions';
// import { dummyChapters } from './dummyChapters';
import { useParams } from 'react-router-dom';
import { useCourseContext } from '../../context/contextFiles/CourseContext';

const OverviewPage = () => {

    const { courseId } = useParams();
    const  {state , dispatch} =  useCourseContext();
    const  [courseData , setCourseData]  =    useState(null);
    const [completedChapters , setCompleteChapters] =  useState(0);
    const  [totalChaptes ,  setTotalChapters] =  useState(0);
    const [ProgressPercentage ,   setProgressPercentage] =  useState(0)
    const [selectedChapter, setSelectedChapter] = useState(null);

    
    const   handelgetCourseById = async(courseId)=>{
        return await getCourseById(courseId , dispatch)
    }
    useEffect(() => {
        const fetchCourse = async () => {
            const course = await handelgetCourseById(courseId);
            console.log("overviewPage courseData is:", course);
            setCourseData(course)             
    const getcompletedChapters = course.modules.filter(c => c.status ==='completed').length;
    const gettotalChapters = course.modules.length;
    const getprogressPercentage = (getcompletedChapters / gettotalChapters) * 100;
    setCompleteChapters(getcompletedChapters)
    setProgressPercentage(getprogressPercentage)
    setTotalChapters(gettotalChapters)
        };
        fetchCourse();
    }, [dispatch, courseId]);
    
    console.log("the data  for he  state is  courseData : " ,courseData )

  return (
    <>
    <Box sx={{display:'flex' , width:' 99%' , height:'100vh' , overflowY:'auto'}}>
        {courseData && (
        <OverviewContent
            oneCourse={courseData}
            completedChapters={completedChapters}
            totalChapters={totalChaptes}
            progressPercentage={ProgressPercentage}
            setSelectedChapter={setSelectedChapter}
        />
        )}


      {selectedChapter && <p style={{ marginTop: 20 }}>Selected Chapter ID: {selectedChapter}</p>}
    </Box>
    </>
  );
};

export default OverviewPage;
