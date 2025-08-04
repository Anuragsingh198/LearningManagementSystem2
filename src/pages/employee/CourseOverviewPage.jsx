import React, { useEffect, useState } from "react";
import { OverviewContent } from "../../components/CourseDetails/OverviewContent";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { useCourseContext } from "../../context/contextFiles/CourseContext";
import { useAuth } from "../../context/contextFiles/AuthContext";
import BlurLoading from "../common/BlurLoading";
import { getCourseWithProgress } from "../../context/Actions/courseActions";

const OverviewPage = () => {
  const { state: { user } } = useAuth();
  const { courseId } = useParams();

  const {
    state: {
      oneCourse,
      oneCourseProgress,
      allModuleProgress,
      loading
    },
    dispatch
  } = useCourseContext();

  console.log( "One course in CourseOverviewPage is:" , oneCourse);
  const [completedChapters, setCompletedChapters] = useState(0);
  const [totalChapters, setTotalChapters] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0)
  console.log("one course, oneCourseProgress and allModuleProgress from CourseOverviewPage is: " , oneCourse, oneCourseProgress , allModuleProgress)

useEffect(() => {
  const fetchCourseProgress = async () => {
    console.log('we have entered use effect')
    if (!courseId || !user?._id) return;
    console.log('we have passed return statement')
    try {
    console.log('we are in try block')

      dispatch({ type: 'COURSE_LOADING' });
      await getCourseWithProgress(courseId, user._id, dispatch);
    } catch (error) {
      console.error('Failed to fetch course progress:', error);
    }
  };

  // Always fetch on mount or when courseId changes
    if (!oneCourse || oneCourse?._id !== courseId) {
    // Only fetch if no data, or data is for another course
    fetchCourseProgress();
  }
}, [courseId, user?._id, dispatch]);


useEffect(() => {
  if (!oneCourse || !oneCourseProgress || !allModuleProgress) return;
  const modules = oneCourse.modules || [];
  const completed = allModuleProgress.filter(m => m.status === "completed").length;
  const total = modules.length;
  const percentage = oneCourseProgress.overallPercentage ||  0;

  setCompletedChapters(completed);
  setTotalChapters(total);
  setProgressPercentage(percentage);
}, [oneCourse, oneCourseProgress, allModuleProgress]);

  // const isPageLoading = loading || !oneCourse || !oneCourseProgress;
  const isPageLoading =false;
  return (
    <Box
      sx={{
        // display: "flex",
        width: "100%",
      }}
    >
      {isPageLoading ? (
        <BlurLoading />
      ) : (
        <OverviewContent
          oneCourse={oneCourse}
          completedChapters={completedChapters}
          totalChapters={totalChapters}
          progressPercentage={progressPercentage}
          setSelectedChapter={() => {}}
        />
      )}
    </Box>
  );
};

export default OverviewPage;
