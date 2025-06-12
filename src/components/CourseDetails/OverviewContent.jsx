import {
    Box,
    Typography,
    Grid,
    LinearProgress,
    Button,
    Paper,
    Divider,
    Avatar,
    IconButton
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
    ChevronRight as ChevronRightIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { NoVideosFound } from './NoContentFoundPage';
import { useEffect, useState } from 'react';
import NoContentPage from './NoContentPage';



const CourseDescription = ({ description }) => {
    return (
        <Box sx={{
            maxHeight: 120,
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
            <Typography color="rgba(255, 255, 255, 0.8)">
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
export const OverviewContent = ({ oneCourse, completedChapters, totalChapters, progressPercentage, setSelectedChapter }) => {
    const chapters = oneCourse.modules;
    const [totalVideos, setTotalVideos] = useState(0);
    const [totalTests, setTotalTests] = useState(0);
    const navigate = useNavigate();

    const handleSubmit = (chapterId) => {
        setSelectedChapter(chapterId);
        navigate(`/course/module/${chapterId}`);
    };

    useEffect(() => {
        setTotalVideos(0);
        setTotalTests(0);
        const totalVideo = chapters.reduce((acc, ele) => acc + (ele.videos?.length || 0), 0);
        setTotalVideos(totalVideo);
        const totalTest = chapters.reduce((acc, ele) => acc + (ele.tests?.length || 0), 0);
        setTotalTests(totalTest);
    }, [chapters]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
            <Paper sx={{
                background: 'linear-gradient(to right, #2563eb, #9333ea)',
                borderRadius: 3,
                p: 4,
                color: 'white'
            }}>
                <Typography variant="h4" fontWeight="bold" mb={1}>
                    {oneCourse.title}
                </Typography>
                <CourseDescription description={oneCourse.description} />

                <Grid container spacing={3} mb={4} mt={2}>
                    <Grid item xs={6} sm={3} textAlign="center">
                        <Typography variant="h4" fontWeight="bold">
                            {completedChapters}
                        </Typography>
                        <Typography color="rgba(255, 255, 255, 0.8)" fontSize="small">
                            Completed
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3} textAlign="center">
                        <Typography variant="h4" fontWeight="bold">
                            {totalChapters}
                        </Typography>
                        <Typography color="rgba(255, 255, 255, 0.8)" fontSize="small">
                            Total Chapters
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3} textAlign="center">
                        <Typography variant="h4" fontWeight="bold">
                            {totalVideos}
                        </Typography>
                        <Typography color="rgba(255, 255, 255, 0.8)" fontSize="small">
                            Videos
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3} textAlign="center">
                        <Typography variant="h4" fontWeight="bold">
                            {totalTests}
                        </Typography>
                        <Typography color="rgba(255, 255, 255, 0.8)" fontSize="small">
                            Tests
                        </Typography>
                    </Grid>
                </Grid>

                <Box sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 2, p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" fontWeight="medium">
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
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                backgroundColor: 'white'
                            }
                        }}
                    />
                </Box>
            </Paper>

           {chapters.length === 0 ? (
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
        <Button
          variant="contained"
          color="primary"
          startIcon={<DownloadIcon />}
          sx={{ textTransform: 'none' }}
        >
          Generate Certificate
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          startIcon={<ShareIcon />}
          sx={{
            textTransform: 'none',
            color: 'text.secondary',
            borderColor: 'divider'
          }}
        >
          Share Progress
        </Button>
      </Box>
    </Box>

    <Box display="flex" flexDirection="column" gap={2}>
      {chapters.map((chapter) => (
        <Paper
          key={chapter._id}
          elevation={0}
          sx={{
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
            p: 3,
            '&:hover': {
              boxShadow: 3
            },
            transition: 'box-shadow 0.3s'
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: chapter.status === 'completed' ? 'success.light' : 'primary.light',
                  color: chapter.status === 'completed' ? 'success.main' : 'primary.main'
                }}
              >
                {chapter.completed ? <CheckCircleIcon /> : <BookIcon />}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  {chapter.title}
                </Typography>
                <Box display="flex" alignItems="center" gap={2} mt={0.5}>
                  {[
                    {
                      icon: <PlayCircleIcon fontSize="small" />,
                      text: `${chapter.videos?.length || 0} Videos`
                    },
                    {
                      icon: <HelpIcon fontSize="small" />,
                      text: `${chapter.tests?.length || 0} MCQs`
                    },
                    {
                      icon: <AccessTimeIcon fontSize="small" />,
                      text: chapter.duration || 'N/A'
                    }
                  ].map((item, index) => (
                    <Box key={index} display="flex" alignItems="center" gap={0.5}>
                      {item.icon}
                      <Typography variant="body2" color="text.secondary">
                        {item.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                {chapter.tests?.length > 0 && (
                  <Box mt={1}>
                    <TestsDisplay tests={chapter.tests} />
                  </Box>
                )}
              </Box>
            </Box>
            <Button
              onClick={() => handleSubmit(chapter._id)}
              endIcon={<ChevronRightIcon />}
              sx={{
                textTransform: 'none',
                backgroundColor: 'primary.light',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.main'
                }
              }}
            >
              {chapter.completed ? 'Review' : 'Start'}
            </Button>
          </Box>
        </Paper>
      ))}
    </Box>
  </>
)}
        </Box>
    );
};