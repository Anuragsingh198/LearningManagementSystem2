import {
  Box,
  Typography,
  Grid,
  LinearProgress,
  Button,
  Paper,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Stack,
} from '@mui/material';
import {
  Share,
  CheckCircle,
  BookOpen,
  PlayCircle,
  FileText,
  Brain,
  HelpCircle,
  Clock,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import { Download as DownloadIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NoContentPage from './NoContentPage';
import { useAuth } from '../../context/contextFiles/AuthContext';
import { useCourseContext } from '../../context/contextFiles/CourseContext';
import { getCoursesAction, moduleProgress } from '../../context/Actions/courseActions';
import axios from 'axios';
import noDataImage from '../../assets/no-data.png';

const CourseDescription = ({ description }) => {
  return (
    <Box sx={{
      minHeight: 60,
      maxHeight: 'none',
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
      <Typography color="black" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '15px' }}>
        {description}
      </Typography>
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
  const [loading, setLoading] = useState(false);
  const [loadingChapterId, setLoadingChapterId] = useState(null);


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


  //  useEffect(()=>{
  //   console.log("this is the  course progress data one course progress, all module progress and one module progress: ",oneCourseProgress,allModuleProgress, oneModuleProgress )
  //  })

  //  useEffect(()=> {
  //   moduleProgressMap
  //  }, [moduleProgressMap])

  useEffect(() => {
    const fetchCourseProgress = async () => {
      setLoading(true);
      if (!courseId || !user?._id) return;
      // console.log('we are fetching course')
      try {


        dispatch({ type: 'COURSE_LOADING' });
        await getCoursesAction(courseId, user._id, dispatch);
        setLoading(false)

      } catch (error) {
        console.error('Failed to fetch course progress:', error);
        setLoading(false)

      }
    };

    // Always fetch on mount or when courseId changes
    if (!oneCourse || oneCourse?._id !== courseId) {
      // Only fetch if no data, or data is for another course
      console.log('single course fetched')
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
    setLoadingChapterId(chapterId);
    setLoading(true)
    setClickedModuleProgress(null);

    const clickedModuleExistingProgress = allModuleProgress.find(
      (x) => x._id === chapterId
    );
    setClickedModuleProgress(clickedModuleExistingProgress);
    setSelectedChapter(chapterId);

    try {
      await moduleProgress(courseId, chapterId, clickedModuleExistingProgress, courseDispatch);
      navigate(`/course/module/${courseId}/${chapterId}`);
      setLoading(false)
    } catch (error) {
      console.error("Error updating module progress:", error);
      setLoading(false)

    }
    finally {
      setLoadingChapterId(null); // reset loading for button
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
        width: '98%',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        py: 3,
        px: 2,
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
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'nowrap', flexDirection: { xs: 'column', md: 'row' } }}>
        {/* Left Section - Course Info */}
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
            <Typography
              variant="h4"
              fontWeight="bold"
              mb={1}
              fontSize={{ xs: 20, md: 25 }}
              color="black"
            >
              {oneCourse?.title}
            </Typography>

            {/* Scrollable Description - grows based on progress bar presence */}
            <Box
              sx={{
                color: 'black',
                flexGrow: 1,
                overflowY: 'auto',
                pr: 1,
                mb: role !== 'instructor' ? 2 : 0,
                width: '100%',
                maxHeight: 190,
                minHeight: 190,
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#cbd5e1',
                  borderRadius: '8px',
                },
              }}
            >
              <CourseDescription description={oneCourse?.description} />
            </Box>


            {/* Progress Bar stays pinned at bottom if exists */}
            {role !== 'instructor' && (
              <Box
                sx={{
                  backgroundColor: '#eef2ff',
                  borderRadius: '4px',
                  py: 1.25,
                  px: 2,
                  borderColor: 'divider',
                  mt: 'auto',
                }}
                aria-label="Course progress"
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" fontWeight="medium" mb="4px" color="black">
                    Course Progress
                  </Typography>
                  <Typography variant="body2" color="black">
                    {Math.round(Math.max(0, Math.min(100, progressPercentage || 0)))}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Math.max(0, Math.min(100, progressPercentage || 0))}
                  sx={{
                    height: 8,
                    mb: '2px',
                    borderRadius: '4px',
                    backgroundColor: '#e5e7eb',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: '4px',
                      background: 'linear-gradient(90deg, #2563eb 0%, #0ea5e9 100%)',
                    },
                  }}
                />
              </Box>
            )}
          </Paper>
        </Box>

        {/* Right Section - Stats (Stack layout) */}
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
              minHeight: 283,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}
          >
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              {[
                { label: 'Total Chapters', value: totalChapters },
                { label: 'Total Videos', value: totalVideos },
                { label: 'Total Tests', value: totalTests },
                ...(role !== 'instructor'
                  ? [{ label: 'Chapters Completed', value: completedChapters }]
                  : []),
              ].map((item, index) => (
                <Box
                  key={index}
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
                    fontSize: '1rem',
                    fontWeight: 500,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'grey.100',
                      transform: 'translateY(-2px)',
                      boxShadow: '0px 4px 10px rgba(0,0,0,0.05)',
                    },
                  }}
                >
                  <Typography color="text.secondary">{item.label}</Typography>
                  <Typography color="primary.main" fontWeight="bold">
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Box>

      </Box>


      {chapters?.length === 0 ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            minHeight: 200,
            gap: 3,
            textAlign: 'left',
            mt: '-150px',
          }}
        >
          <img
            src={noDataImage}
            alt="No data"
            style={{
              maxWidth: "200px",
              marginBottom: 0,
              display: "block"
            }}
          />
          <Box>
            <NoContentPage
              title="Modules"
              description="No Modules Found for this course"
            />
          </Box>
        </Box>

      ) : (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="bold" color="text.primary">
              Course Chapters
            </Typography>
            <Box display="flex" gap={1}>
              {role !== 'instructor' && (
                <Button
                  variant="contained"
                  onClick={handleGenerateCertificate}
                  startIcon={<DownloadIcon />}
                  disabled={progressPercentage !== 100}
                  sx={{
                    textTransform: 'none',
                    transition: 'all 0.2s ease-in-out',

                    backgroundColor: '#1976d2',
                    color: '#fff',

                    '&:hover': {
                      backgroundColor: '#1565c0',
                      boxShadow: 3,
                    },

                    '&:active': {
                      backgroundColor: '#115293',
                      transform: 'scale(0.98)',
                      boxShadow: 2,
                    },

                    '&:focus': {
                      outline: '2px solid #42a5f5',
                      outlineOffset: '2px',
                    },

                    '&.Mui-disabled': {
                      backgroundColor: '#d3d3d3',
                      color: '#9e9e9e',
                      boxShadow: 'none',
                      borderRadius: '4px',
                    },
                  }}
                >
                  Generate Certificate
                </Button>
              )}
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
                  borderRadius: '4px',
                  height: '55px',
                  py: 1,
                  px: 2,
                  '&:hover': {
                    boxShadow: 3
                  },
                  transition: 'box-shadow 0.3s'
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={2}>
                    {(() => {
                      const progressStatus = moduleProgressMap[chapter._id] || 'Not Started';
                      const isCompleted = progressStatus === 'completed';

                      return isCompleted ? <CheckCircle size={24} color="#22c55e" /> : <BookOpen size={24} color="#3b82f6" />;
                    })()}
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-arounds', alignItems: 'center' }}>

                        <Typography variant="h6" fontWeight={600} color="text.primary" fontSize='16px'>
                          {chapter.title}
                        </Typography>
                        {role !== 'instructor' && (
                          <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              px: 1,
                              py: 0.25,
                              borderRadius: '4px',
                              fontSize: '0.55rem',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              ml: 1,
                              backgroundColor: (() => {
                                const status = moduleProgressMap[chapter._id] || 'not-started';
                                if (status === 'completed') return '#e6f4ea';
                                if (status === 'in-progress') return '#fff8e6';
                                return '#ffe9e3'; // pastel peach
                              })(),
                              color: (() => {
                                const status = moduleProgressMap[chapter._id] || 'not-started';
                                if (status === 'completed') return '#2d6a4f';
                                if (status === 'in-progress') return '#b08900';
                                return '#d45d00';
                              })(),
                              border: '1px solid',
                              borderColor: (() => {
                                const status = moduleProgressMap[chapter._id] || 'not-started';
                                if (status === 'completed') return '#cce3d4';
                                if (status === 'in-progress') return '#ffeebd';
                                return '#ffd5c2';
                              })(),
                            }}
                          >
                            {(() => {
                              const status = moduleProgressMap[chapter._id] || 'not-started';
                              if (status === 'completed') return 'Completed';
                              if (status === 'in-progress') return 'In Progress';
                              return 'Not Started';
                            })()}
                          </Box>
                        )}

                      </Box>
                      <Box display="flex" alignItems="center" gap={2} mt={0.5}>
                        {[
                          {
                            icon: <PlayCircle size={20} />,
                            text: `${chapter.videos?.length || 0} Videos`
                          },
                          {
                            icon: <HelpCircle size={20} />,
                            text: `${chapter.tests?.length || 0} Assessment(s)`
                          },
                          // {
                          //   icon: <AccessTimeIcon fontSize="small" />,
                          //   text: chapter.duration || 'N/A'
                          // },
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
                      variant="outlined"
                      onClick={() => handleSubmit(chapter._id, chapter)}
                      endIcon={
                        loadingChapterId === chapter._id ? null : <ChevronRight size={18} />
                      }
                      sx={{
                        textTransform: 'none',
                        height: '35px',
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: 'primary.main',
                        '&:hover': {
                          // backgroundColor: 'white',
                          color: 'primary.dark',
                          // boxShadow: '0px 2px 8px rgba(0,0,0,0.1)'
                        },
                        '&:active': {
                          // backgroundColor: 'primary.main',
                          color: 'primary.main',
                          transform: 'scale(0.98)'
                        },
                        '&:focus': {
                          outline: '2px solid',
                          outlineColor: 'primary.main',
                          outlineOffset: '2px'
                        },
                        '&:disabled': {
                          backgroundColor: 'grey.100',
                          color: 'grey.500',
                          cursor: 'not-allowed'
                        }
                      }}
                    >

                      {loadingChapterId === chapter._id
                        ? 'Loading...'
                        : role === 'instructor'
                          ? 'View'
                          : moduleProgressMap[chapter._id] === 'completed'
                            ? 'Completed'
                            : 'Start'}

                    </Button>
                    {role === 'instructor' ? <IconButton
                      color="error"
                      onClick={() => handleDeleteChapter(chapter._id)}
                      sx={{ '&:hover': { backgroundColor: 'rgba(255,0,0,0.1)' } }}
                    >
                      <Trash2 />
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