// OverviewPage.jsx
import React, { useEffect, useState } from 'react';
import { OverviewContent } from '../../components/CourseDetails/OverviewContent';
import { Box } from '@mui/material';
import { getCourseById } from '../../context/Actions/courseActions';
// import { dummyChapters } from './dummyChapters';
import { useParams } from 'react-router-dom';
import { useCourseContext } from '../../context/contextFiles/CourseContext';
const chapters = [
    {
        id: '1',
        title: 'Python Basics',
        videos: 9,
        articles: 9,
        problems: 2,
        mcqs: 15,
        completed: true,
        duration: '2h 30m'
    },
    {
        id: '2',
        title: 'Python Data Types',
        videos: 9,
        articles: 9,
        problems: 10,
        mcqs: 15,
        completed: false,
        duration: '3h 15m'
    },
    {
        id: '3',
        title: 'Input and Output in Python',
        videos: 2,
        articles: 2,
        problems: 4,
        mcqs: 15,
        completed: false,
        duration: '1h 45m'
    },
    {
        id: '4',
        title: 'Control Structures',
        videos: 12,
        articles: 8,
        problems: 15,
        mcqs: 20,
        completed: false,
        duration: '4h 20m'
    },
    {
        id: '5',
        title: 'Functions and Modules',
        videos: 15,
        articles: 12,
        problems: 20,
        mcqs: 25,
        completed: false,
        duration: '5h 10m'
    },
    {
        id: '5',
        title: 'Functions and Modules',
        videos: 15,
        articles: 12,
        problems: 20,
        mcqs: 25,
        completed: false,
        duration: '5h 10m'
    },
    {
        id: '5',
        title: 'Functions and Modules',
        videos: 15,
        articles: 12,
        problems: 20,
        mcqs: 25,
        completed: false,
        duration: '5h 10m'
    },
    {
        id: '5',
        title: 'Functions and Modules',
        videos: 15,
        articles: 12,
        problems: 20,
        mcqs: 25,
        completed: false,
        duration: '5h 10m'
    }
];

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
    <Box sx={{display:'flex' , position:"absolute", width:' 90%' , left:'5%', height:'80%' , overflowY:'auto'}}>
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
