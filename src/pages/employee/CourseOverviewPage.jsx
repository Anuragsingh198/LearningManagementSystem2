// OverviewPage.jsx
import React, { useEffect, useState } from "react";
import { OverviewContent } from "../../components/CourseDetails/OverviewContent";
import { Box } from "@mui/material";
import { getCourseById, getCourseProgress } from "../../context/Actions/courseActions";
// import { dummyChapters } from './dummyChapters';
import { useParams } from "react-router-dom";
import { useCourseContext } from "../../context/contextFiles/CourseContext";
import { useAuth } from "../../context/contextFiles/AuthContext";
const OverviewPage = () => {
  const {state: { user}} = useAuth();
  // console.log("the user data  from overviewPage  is : " , user._id)
  const { courseId } = useParams();
  const { state :{courseProgress}, dispatch } = useCourseContext();
  const [courseData, setCourseData] = useState(null);
  const [completedChapters, setCompleteChapters] = useState(0);
  const [totalChaptes, setTotalChapters] = useState(0);
  const [ProgressPercentage, setProgressPercentage] = useState(0);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [courseProgressData, setCourseProgressData] = useState(null)
  const handelgetCourseById = async (courseId) => {
    return await getCourseById(courseId, dispatch);
  };
 const handleCourseProgress = async(courseId , userId)=>{
    // console.log("userId from   handleCourseProgress  is : ", userId);
    return  await getCourseProgress(courseId , userId , dispatch)
 }
  useEffect(() => {
    const fetchCourse = async () => {
      if (!user?._id || !courseId || isLoading) return;
      try {
        setIsLoading(true);
        const course = await handelgetCourseById(courseId);
        const courseProg = await handleCourseProgress(courseId , user._id , dispatch) 
        // console.log('course progress in main course overview page', courseProg)
        // console.log("overviewPage courseData is:", course);
        // console.log("overviewPage courseProgress data is :", courseProg);
        setCourseData(course);
        setCourseProgressData(courseProg)

      const completed = courseProg.moduleProgress.filter(
  (m) => m.status === "completed"
).length;

        const total = course.modules.length;
        

        setCompleteChapters(completed);

        const completedPercentage = courseProg.overallPercentage
        console.log('the course overview file courseProg backend data is: ', courseProg)
        console.log('the completed percentage from above level is', completedPercentage)
        setProgressPercentage(completedPercentage);
        setTotalChapters(total);

      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };
    fetchCourse();

  }, [user?._id, courseId ]); 


  // console.log("the data for the state is courseData:", courseProgress);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          width: "99%",
          height: "100vh",
          overflowY: "auto",
        }}
      >
        {courseData && (
          <OverviewContent
            oneCourse={courseData}
            completedChapters={completedChapters}
            totalChapters={totalChaptes}
            progressPercentage={ProgressPercentage}
            setSelectedChapter={setSelectedChapter}
            courseProgressData={courseProgressData}
          />
        )}

        {selectedChapter && (
          <p style={{ marginTop: 20 }}>
            Selected Chapter ID: {selectedChapter}
          </p>
        )}
      </Box>
    </>
  );
};

export default OverviewPage;
