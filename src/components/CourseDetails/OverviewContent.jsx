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
import {  useNavigate } from 'react-router-dom';

export const OverviewContent = ({ chapters, completedChapters, totalChapters, progressPercentage, setSelectedChapter }) => {

    const   navigate = useNavigate()

    const handelSubmit=(chapterId)=>{
            setSelectedChapter(chapterId)
            navigate(`/course/module/${chapterId}`)
    }

    return (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 , width:'100%' }}>
    <Paper sx={{
      background: 'linear-gradient(to right, #2563eb, #9333ea)',
      borderRadius: 3,
      p: 4,
      color: 'white'
    }}>
      <Typography variant="h4" fontWeight="bold" mb={1}>
        Python Full Course Online
      </Typography>
      <Typography color="rgba(255, 255, 255, 0.8)" mb={3}>
        Complete Beginner to Advanced
      </Typography>
      
      <Grid container spacing={3} mb={4}>
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
            45
          </Typography>
          <Typography color="rgba(255, 255, 255, 0.8)" fontSize="small">
            Videos
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3} textAlign="center">
          <Typography variant="h4" fontWeight="bold">
            120
          </Typography>
          <Typography color="rgba(255, 255, 255, 0.8)" fontSize="small">
            Problems
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
          sx={{ textTransform: 'none', color: 'text.secondary', borderColor: 'divider' }}
        >
          Share Progress
        </Button>
      </Box>
    </Box>

    <Box display="flex" flexDirection="column" gap={2}>
      {chapters.map((chapter) => (
        <Paper 
          key={chapter.id} 
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
                  bgcolor: chapter.completed ? 'success.light' : 'primary.light',
                  color: chapter.completed ? 'success.main' : 'primary.main'
                }}
              >
                {chapter.completed ? <CheckCircleIcon /> : <BookIcon />}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="semibold" color="text.primary">
                  {chapter.title}
                </Typography>
                <Box display="flex" alignItems="center" gap={2} mt={0.5}>
                  {[
                    { icon: <PlayCircleIcon fontSize="small" />, text: `${chapter.videos} Videos` },
                    { icon: <ArticleIcon fontSize="small" />, text: `${chapter.articles} Articles` },
                    { icon: <PsychologyIcon fontSize="small" />, text: `${chapter.problems} Problems` },
                    { icon: <HelpIcon fontSize="small" />, text: `${chapter.mcqs} MCQs` },
                    { icon: <AccessTimeIcon fontSize="small" />, text: chapter.duration }
                  ].map((item, index) => (
                    <Box key={index} display="flex" alignItems="center" gap={0.5}>
                      {item.icon}
                      <Typography variant="body2" color="text.secondary">
                        {item.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
            <Button 
              onClick={()=> handelSubmit(chapter.id)}
              endIcon={<ChevronRightIcon />}
              sx={{
                textTransform: 'none',
                backgroundColor: 'primary.light',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.lighter'
                }
              }}
            >
              {chapter.completed ? 'Review' : 'Start'}
            </Button>            
          </Box>
        </Paper>
      ))}
    </Box>
  </Box>
 );
}