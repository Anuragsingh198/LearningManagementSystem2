import {
  Box,
  Typography,
  Grid,
  LinearProgress,
  Button,
  Paper,
  Avatar,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Share as ShareIcon,
  CheckCircle as CheckCircleIcon,
  Book as BookIcon,
  PlayCircle as PlayCircleIcon,
  Article as ArticleIcon,
  Psychology as PsychologyIcon,
  Help as HelpIcon,
  AccessTime as AccessTimeIcon,
  ChevronRight as ChevronRightIcon,
  Delete as DeleteIcon,
  ContactPageSharp
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { NoVideosFound } from './NoContentFoundPage';
import { useEffect, useState } from 'react';
import NoContentPage from './NoContentPage';
import { useAuth } from '../../context/contextFiles/AuthContext';
import { useCourseContext } from '../../context/contextFiles/CourseContext';
import { checkProgress, deleteModule, getCoursesAction, moduleProgress } from '../../context/Actions/courseActions';
import axios from 'axios';


const CourseDescription = ({ description }) => {
  return (
    <Box sx={{
      minHeight: 60,
      maxHeight:100,
      overflowY: 'auto',
      pr: 1,
      '&::-webkit-scrollbar': {
        width: 5,
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 2,
      },
    }}>
      <Typography color="rgba(255, 255, 255, 0.8)" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize:'15px' }}>
        {description}
      </Typography>
    </Box>
  );
};

const TestsDisplay = ({ tests }) => {
  if (!tests || tests.length === 0) {
    return <Typography variant="body2" color="text.secondary">No tests available</Typography>;
  }

  return (
    <Box>
      <Typography variant="subtitle2" fontWeight="bold" mb={1}>
        Tests in this chapter:
      </Typography>
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {tests.map((test, index) => (
          <li key={index}>
            <Typography variant="body2" color="text.secondary">
              {test.title || `Test ${index + 1}`}
            </Typography>
          </li>
        ))}
      </ul>
    </Box>
  );
};
export const OverviewContent = ({ oneCourse, completedChapters, totalChapters, progressPercentage, setSelectedChapter, courseProgressData }) => {
  const chapters = oneCourse?.modules;
  const courseId = oneCourse?._id;
  const courseTitle = oneCourse?.title;
  const certificateType = 'completion'
  const [totalVideos, setTotalVideos] = useState(0);
  const [totalTests, setTotalTests] = useState(0);
  const navigate = useNavigate();

  const [clickedModuleProgress, setClickedModuleProgress] = useState(null);

  const { state: { user }, dispatch } = useAuth();
  // const {state:{ oneModuleProgress, allModuleProgress }, dispatch:courseDispatch} = useCourseContext();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);

  const role = user?.role;
  const token = user?.token;
  const name = user?.name;
  const empId = user?.employeeId;
  const serverurl = import.meta.env.VITE_SERVER_URL;

  const { state: { oneCourseProgress, allCourseProgress, oneModuleProgress, allModuleProgress }, dispatch: courseDispatch } = useCourseContext();

  //just checking
  const moduleProgressMap = {};

  if (Array.isArray(allModuleProgress)) {
    allModuleProgress.forEach((module) => {
      moduleProgressMap[module.moduleId] = module.status;
    });
  } else {
    console.warn('Expected allModuleProgress to be an array:', allModuleProgress);
  }


  useEffect(() => {
    console.log("this is the  course progress data from : ", oneCourseProgress, allModuleProgress, oneModuleProgress)
  })

  useEffect(() => {
    moduleProgressMap
  }, [moduleProgressMap])

  useEffect(() => {
    const fetchCourseProgress = async () => {
      console.log('we have entered use effect')
      if (!courseId || !user?._id) return;
      console.log('we have passed return statement')
      try {
        console.log('we are in try block')

        dispatch({ type: 'COURSE_LOADING' });
        await getCoursesAction(courseId, user._id, dispatch);
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
  // useEffect(() => {
  //   if (allModuleProgress?.length && moduleId && courseId) {
  //     const moduleProgress = allModuleProgress.find(
  //       (x) => x.moduleId === moduleId && x.courseId === courseId
  //     );

  //     if (moduleProgress) {
  //       dispatch({ type: "MODULE_PROGRESS", payload: moduleProgress });
  //     }
  //   }
  // }, [moduleId, courseId, allModuleProgress]);
  // console.log('progress percentage in overview content is: ', percentageCompleted)
  // console.log('progress percentage completed is: ', progressPercentage)

  const handleDelete = (courseId) => {
    setModuleToDelete(courseId);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = async (chapterId, chapter) => {
    setClickedModuleProgress(null);

    const clickedModuleExistingProgress = allModuleProgress.find(
      (x) => x._id === chapterId
    );
    setClickedModuleProgress(clickedModuleExistingProgress);
    setSelectedChapter(chapterId);

    try {
      await moduleProgress(courseId, chapterId, clickedModuleExistingProgress, courseDispatch);
      navigate(`/course/module/${courseId}/${chapterId}`);
    } catch (error) {
      console.error("Error updating module progress:", error);
    }
  };


  const handleGenerateCertificate = async () => {
    const newTab = window.open('', '_blank');
    if (!newTab) {
      alert('Please allow popups for this site.');
      return;
    }


    try {
      const response = await axios.post(
        `${serverurl}/api/courses/generate-certificate`,
        { name, courseId, courseTitle, empId, certificateType },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const certHtml = response.data.certificate?.certificateHtml;
        // console.log('cert html is: ', certHtml)
        // console.log('response html is: ', response.data.certificate)

        if (certHtml) {
          newTab.document.open();
          newTab.document.write(certHtml);
          newTab.document.close();
        } else {
          newTab.close();
          alert('Certificate content not found');
        }
      } else {
        newTab.close();
        alert(response.data.message || 'Certificate generation failed');
      }
    } catch (error) {
      newTab.close();
      console.error('Certificate generation failed:', error?.response?.data || error.message);
      alert('Failed to generate certificate');
    }
  };


  useEffect(() => {
    console.log("allModuleProgress  is : ", allModuleProgress)
    console.log("oneModuleProgress is: ", oneModuleProgress)
  }, [allModuleProgress, oneModuleProgress])


  useEffect(() => {
    setTotalVideos(0);
    setTotalTests(0);
    const totalVideo = chapters?.reduce((acc, ele) => acc + (ele.videos?.length || 0), 0);
    setTotalVideos(totalVideo);
    const totalTest = chapters?.reduce((acc, ele) => acc + (ele.tests?.length || 0), 0);
    setTotalTests(totalTest);
  }, [chapters]);

  const handleDeleteChapter = async (chapterId) => {
    setModuleToDelete(courseId);
    setDeleteDialogOpen(true);
  };




  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setModuleToDelete(null);
  };

  const confirmDelete = async () => {


  };


  return (
    <Box
  sx={{
    width: '100%', 
    boxSizing: 'border-box', 
    display: 'flex',
    flexDirection: 'column',
    gap: 3,
    py: 3, 
    px: 4,
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'lightGray',
      borderRadius: '8px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: '#e0e0e0',
    },
  }}
>
      <Paper sx={{
        background: 'linear-gradient(to right, #2563eb, #9333ea)',
        borderRadius: 3,
        p: 3,
        color: 'white',
        // height:"27vh"
      }}>
        <Typography variant="h4" fontWeight="bold" mb={1} fontSize={25}>
          {oneCourse?.title}
        </Typography>

        <CourseDescription description={oneCourse?.description} />

        <Grid container spacing={3} mb={4} mt={2}>

          <Grid item xs={6} sm={3} textAlign="center">
            <Typography variant="h4" fontWeight="bold" fontSize='25px'>
              {totalChapters}
            </Typography>
            <Typography color="rgba(255, 255, 255, 0.8)" fontSize="small">
              Total Chapters
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3} textAlign="center">
            <Typography variant="h4" fontWeight="bold" fontSize='25px'>
              {totalVideos}
            </Typography>
            <Typography color="rgba(255, 255, 255, 0.8)" fontSize="small">
              Videos
            </Typography>
          </Grid>
          <Grid item xs={6} sm={3} textAlign="center">
            <Typography variant="h4" fontWeight="bold" fontSize='25px'>
              {totalTests}
            </Typography>
            <Typography color="rgba(255, 255, 255, 0.8)" fontSize="small">
              Tests
            </Typography>
          </Grid>
          {role !== 'instructor' && <Grid item xs={6} sm={3} textAlign="center" fontSize='25px'>
            <Typography variant="h4" fontWeight="bold" fontSize='25px'>
              {completedChapters}
            </Typography>
            <Typography color="rgba(255, 255, 255, 0.8)" fontSize="small">
              Completed
            </Typography>
          </Grid>}
        </Grid>

        {role !== 'instructor' && <Box sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 2, py:1 , px:2,  position:'relative'}}>
          <Box display="flex" justifyContent="space-between" alignItems="center" >
            <Typography variant="body2" fontWeight="medium" mb='4px'>
              Course Progress
            </Typography>
            <Typography variant="body2">
              {Math.round(progressPercentage)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progressPercentage}
            sx={{
              height: 6,
              mb:'4px',
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                backgroundColor: 'white'
              }
            }}
          />
        </Box>}
      </Paper>

      {chapters?.length === 0 ? (
        <NoContentPage
          title="Modules"
          description="No Modules Found for this course"
        />
      ) : (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="bold" color="text.primary">
              Course Chapters
            </Typography>
            <Box display="flex" gap={1}>
              {role !== 'instructor' && <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateCertificate}
                startIcon={<DownloadIcon />}
                sx={{ textTransform: 'none' }}
                disabled={progressPercentage != 100}

              >
                Generate Certificate
              </Button>}
            </Box>
          </Box>

          <Box display="flex" flexDirection="column" gap={1}>
            {chapters?.map((chapter) => (
              <Paper
                key={chapter._id}
                elevation={0}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,
                  height:'60px',
                  py:1,
                  px:2,
                  '&:hover': {
                    boxShadow: 3
                  },
                  transition: 'box-shadow 0.3s'
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={2}>
                    {(() => {
                      const progressStatus = moduleProgressMap[chapter._id] || 'not-started';
                      const isCompleted = progressStatus === 'completed';

                      return (
                        <Avatar
                          sx={{
                            width: 48,
                            height: 48,
                            bgcolor: isCompleted ? 'success.light' : 'primary.light',
                            color: isCompleted ? 'success.main' : 'primary.main'
                          }}
                        >
                          {isCompleted ? <CheckCircleIcon /> : <BookIcon />}
                        </Avatar>
                      );
                    })()}
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-arounds', alignItems: 'center' }}>

                        <Typography variant="h6" fontWeight={600} color="text.primary" fontSize='16px'>
                          {chapter.title}
                        </Typography>
                        {role !== 'instructor' && <Typography variant="body2" fontWeight={400} sx={{ ml: 1 }} color="text.secondary">
                          ( Status: {moduleProgressMap[chapter._id] || 'Not Started'} )
                        </Typography>}
                      </Box>
                      <Box display="flex" alignItems="center" gap={2} mt={0.5}>
                        {[
                          {
                            icon: <PlayCircleIcon fontSize="small" />,
                            text: `${chapter.videos?.length || 0} Videos`
                          },
                          {
                            icon: <HelpIcon fontSize="small" />,
                            text: `${chapter.tests?.length || 0} Assessment(s)`
                          },
                          // {
                          //   icon: <AccessTimeIcon fontSize="small" />,
                          //   text: chapter.duration || 'N/A'
                          // }
                        ].map((item, index) => (
                          <Box key={index} display="flex" alignItems="center" gap={0.5}>
                            {item.icon}
                            <Typography variant="body2" color="text.secondary">
                              {item.text}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                      {/* {chapter.tests?.length > 0 && (
                        <Box mt={1}>
                          <TestsDisplay tests={chapter.tests} />
                        </Box>
                      )} */}
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Button
                      onClick={() => handleSubmit(chapter._id, chapter)}
                      endIcon={<ChevronRightIcon />}
                      sx={{
                        textTransform: 'none',
                        backgroundColor: 'primary.light',
                        color: 'white',
                        height:'35px',
                        '&:hover': {
                          backgroundColor: 'primary.main'
                        }
                      }}
                    >
                      {role === 'instructor'
                        ? 'View'
                        : (moduleProgressMap[chapter._id] === 'completed' ? 'Completed' : 'Start')}

                    </Button>
                    {role === 'instructor' ? <IconButton
                      color="error"
                      onClick={() => handleDeleteChapter(chapter._id)}
                      sx={{ '&:hover': { backgroundColor: 'rgba(255,0,0,0.1)' } }}
                    >
                      <DeleteIcon />
                    </IconButton> : ''}
                  </Box>

                </Box>
              </Paper>
            ))}
          </Box>
          <Dialog
            open={deleteDialogOpen}
            onClose={cancelDelete}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            slotProps={{
              paper: {
                sx: {
                  width: 600,
                  maxHeight: 600,
                  borderRadius: 3,
                  boxShadow: 10,
                }
              }
            }}
          >
            <DialogTitle id="alert-dialog-title">{"Confirm Module Deletion"}</DialogTitle>
            <DialogContent>
              <Box id="alert-dialog-description">
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  We will be adding this feature shortly...
                  Deleting this Module will permanently remove:
                </Typography>
                <ul style={{ paddingLeft: '1.5rem', marginTop: 0, marginBottom: 0 }}>
                  <li>All the uploaded videos in this module</li>
                  <li>All uploaded Assessments and test</li>
                </ul>
                <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                  This action cannot be undone. Are you sure you want to continue?
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ mb: 1, mr: 1 }}>
              <Button onClick={cancelDelete} color="primary">
                Cancel
              </Button>
              {/* <Button
                        onClick={confirmDelete}
                        color={isLoading ? 'inherit' : 'error'}
                        autoFocus
                        disabled={isLoading}
                        
                        variant="contained"
                        sx={{width: 205}}
                      >
                        {isLoading ? 'Deleting...' : 'Delete Module'}
                      </Button> */}

            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};