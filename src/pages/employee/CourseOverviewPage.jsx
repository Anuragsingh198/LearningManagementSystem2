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
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'nowrap',
          flexDirection: { xs: 'column', md: 'row' },
          px: 2,
          py: 3,
          width: '100%',
        }}
      >
        {/* Left Section - Course Info Skeleton */}
        <Box
          sx={{
            flex: { xs: '1 1 auto', md: '0 0 70%' },
            maxWidth: { xs: '100%', md: '70%' },
            minWidth: 0,
          }}
        >
          <Paper
            sx={{
              height: '81%',
              backgroundColor: 'background.paper',
              borderRadius: '4px',
              p: { xs: 2, md: 3 },
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Title */}
            <Skeleton variant="text" width="60%" height={35} sx={{ mb: 2 }} />

            {/* Description block */}
            <Box
              sx={{
                flexGrow: 1,
                overflow: 'hidden',
                mb: 2,
                maxHeight: 190,
                minHeight: 190,
              }}
            >
              {[...Array(5)].map((_, i) => (
                <Skeleton
                  key={i}
                  variant="text"
                  width={`${70 - i * 10}%`}
                  height={20}
                  sx={{ mb: 1 }}
                />
              ))}
            </Box>

            {/* Progress Bar */}
            <Box
              sx={{
                backgroundColor: '#eef2ff',
                borderRadius: '4px',
                py: 1.25,
                px: 2,
                borderColor: 'divider',
                mt: 'auto',
              }}
            >
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Skeleton variant="text" width="40%" height={20} />
                <Skeleton variant="text" width="15%" height={20} />
              </Box>
              <Skeleton variant="rectangular" height={10} sx={{ borderRadius: 2 }} />
            </Box>
          </Paper>
        </Box>

        {/* Right Section - Stats Skeleton */}
        <Box
          sx={{
            flex: { xs: '1 1 auto', md: '0 0 30%' },
            maxWidth: { xs: '100%', md: '30%' },
            minWidth: 0,
          }}
        >
          <Paper
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: '4px',
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none',
              backgroundColor: 'background.paper',
              minHeight: 295,
              maxWidth: '70%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {[...Array(4)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    px: 3,
                    py: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bgcolor: 'grey.50',
                  }}
                >
                  <Skeleton variant="text" width="40%" height={20} />
                  <Skeleton variant="text" width="20%" height={20} />
                </Box>
              ))}
            </Box>
          </Paper>
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
