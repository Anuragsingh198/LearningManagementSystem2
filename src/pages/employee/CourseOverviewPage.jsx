import React, { useEffect, useState } from "react";
import { OverviewContent } from "../../components/CourseDetails/OverviewContent";
import { Box, Skeleton, Paper, Grid  } from "@mui/material";
import { useParams } from "react-router-dom";
import { useCourseContext } from "../../context/contextFiles/CourseContext";
import { useAuth } from "../../context/contextFiles/AuthContext";
import BlurLoading from "../common/BlurLoading";
import { getCourseWithProgress } from "../../context/Actions/courseActions";

const OverviewPage = () => {
  const { state: { user } } = useAuth();
  const { courseId } = useParams();
  const [isPageLoading, setIsPageLoading] = useState(false)

  const {
    state: {
      oneCourse,
      oneCourseProgress,
      allModuleProgress,
      loading
    },
    dispatch
  } = useCourseContext();

  // console.log( "One course in CourseOverviewPage is:" , oneCourse);
  const [completedChapters, setCompletedChapters] = useState(0);
  const [totalChapters, setTotalChapters] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0)
  // console.log("one course, oneCourseProgress and allModuleProgress from CourseOverviewPage is: " , oneCourse, oneCourseProgress , allModuleProgress)

useEffect(() => {
  const fetchCourseProgress = async () => {
    setIsPageLoading(true);
    // console.log('we have entered use effect')
    if (!courseId || !user?._id) return;
    // console.log('we have passed return statement')
    try {
    console.log('we are in try block')
      dispatch({ type: 'COURSE_LOADING' });
      await getCourseWithProgress(courseId, user._id, dispatch);
      setIsPageLoading(false)
    } catch (error) {
      console.error('Failed to fetch course progress:', error);
      setIsPageLoading(false);
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
  // const isPageLoading =false;

   if (isPageLoading) {
    return (
      <Box display="flex" flexDirection="column" gap={4} width="95%" sx={{px: 2, py: 3}}>
        {/* Header */}
        <Paper
          sx={{
            background: "linear-gradient(to right, #2563eb, #9333ea)",
            borderRadius: 3,
            p: 4,
            color: "white"
          }}
        >
          <Skeleton variant="text" width="60%" height={40} sx={{ bgcolor: "grey.200" }} />
          <Skeleton variant="rectangular" height={60} sx={{ my: 2, bgcolor: "grey.200" }} />
          <Grid container spacing={3} mb={4} mt={2}>
            {[...Array(4)].map((_, i) => (
              <Grid item xs={6} sm={3} key={i} textAlign="center">
                <Skeleton variant="text" width="40%" height={30} sx={{ bgcolor: "transparent" }} />
                <Skeleton variant="text" width="60%" height={20} sx={{ bgcolor: "transparent" }} />
              </Grid>
            ))}
          </Grid>
          <Skeleton variant="rectangular" height={20} sx={{ borderRadius: 2, bgcolor: "grey.200" }} />
        </Paper>

        {/* Chapters List */}
        <Box display="flex" flexDirection="column" gap={2}>
          {[...Array(3)].map((_, i) => (
            <Paper
              key={i}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                p: 3
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Skeleton variant="circular" width={48} height={38} sx={{ bgcolor: "grey.200" }} />
                <Box flex={1}>
                  <Skeleton variant="text" width="50%" height={20} sx={{ bgcolor: "grey.200" }} />
                  <Skeleton variant="text" width="30%" height={15} sx={{ bgcolor: "grey.200" }} />
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        // display: "flex",
        width: "100%",
      }}
    >
 
        <OverviewContent
        
          oneCourse={oneCourse}
          completedChapters={completedChapters}
          totalChapters={totalChapters}
          progressPercentage={progressPercentage}
          setSelectedChapter={() => {}}
        />
      
    </Box>
  );
};

export default OverviewPage;
