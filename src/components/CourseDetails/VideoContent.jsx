import {
    Box,
    Typography,
    Button,
    Paper,
    Divider,
    Avatar,
    IconButton,
    LinearProgress,
    Grid,
    Chip
} from '@mui/material';
import {
    PlayCircle as PlayCircleIcon,
    ZoomIn as ZoomInIcon,
    ZoomOut as ZoomOutIcon,
    Fullscreen as FullscreenIcon,
    FullscreenExit as FullscreenExitIcon,
    Pause as PauseIcon,
    PlayArrow as PlayIcon,
    SkipPrevious as SkipBackIcon,
    SkipNext as SkipForwardIcon,
    VolumeUp as VolumeUpIcon,
    Settings as SettingsIcon,
    ThumbUp as ThumbsUpIcon,
    Comment as MessageSquareIcon,
    Flag as FlagIcon,
    AccessTime as ClockIcon,
    People as UsersIcon,
    School as AwardIcon,
    CheckCircle as CheckCircleIcon,
    Download as DownloadIcon,
    Article as FileTextIcon,
    MenuBook as BookOpenIcon
} from '@mui/icons-material';

export const VideoContent = ({
    currentVideo,
    isVideoZoomed,
    isVideoFullscreen,
    isPlaying,
    setCurrentVideo,
    setIsVideoZoomed,
    setIsVideoFullscreen,
    setIsPlaying,
    videos
}) => {

    const currentVideoData = videos[currentVideo];
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '1000px',
            position: 'absolute',
            overflowY: 'scroll',
        }}>
            <Box sx={{
                height: '80%',
                display: 'flex',
                flexDirection: 'column',
                p: 1
            }}>

                <Paper sx={{
                    backgroundColor: 'black',
                    borderRadius: isVideoFullscreen ? 0 : 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                    position: isVideoFullscreen ? 'fixed' : 'relative',
                    top: isVideoFullscreen ? 0 : undefined,
                    left: isVideoFullscreen ? 0 : undefined,
                    right: isVideoFullscreen ? 0 : undefined,
                    bottom: isVideoFullscreen ? 0 : undefined,
                    zIndex: isVideoFullscreen ? 1300 : undefined,
                    transform: isVideoZoomed && !isVideoFullscreen ? 'scale(1.1)' : undefined,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Box sx={{
                        aspectRatio: '16/9',
                        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        flexGrow: 1,
                        '&:hover .controls-overlay': {
                            opacity: 1
                        }
                    }}>
                        <Box textAlign="center" color="white">
                            <PlayCircleIcon sx={{ width: 80, height: 80, mx: 'auto', mb: 2, color: 'rgba(255, 255, 255, 0.8)' }} />
                            <Typography variant="h5" fontWeight="bold" mb={1}>{currentVideoData.title}</Typography>
                            <Typography color="rgba(255, 255, 255, 0.7)">Duration: {currentVideoData.duration}</Typography>
                        </Box>

                        <Box className="controls-overlay" sx={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.2)',
                            opacity: 0,
                            transition: 'opacity 0.3s'
                        }}>
                            <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
                                <IconButton
                                    onClick={() => setIsVideoZoomed(!isVideoZoomed)}
                                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' } }}
                                    title={isVideoZoomed ? "Zoom Out" : "Zoom In"}
                                >
                                    {isVideoZoomed ? <ZoomOutIcon /> : <ZoomInIcon />}
                                </IconButton>
                                <IconButton
                                    onClick={() => setIsVideoFullscreen(!isVideoFullscreen)}
                                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' } }}
                                    title={isVideoFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                                >
                                    {isVideoFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                                </IconButton>
                            </Box>

                            <Box sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)',
                                p: 2
                            }}>
                                <Box display="flex" alignItems="center" gap={2}>
                                    <IconButton
                                        onClick={() => setIsPlaying(!isPlaying)}
                                        sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' } }}
                                    >
                                        {isPlaying ? <PauseIcon /> : <PlayIcon />}
                                    </IconButton>
                                    <IconButton sx={{ color: 'rgba(255, 255, 255, 0.8)', '&:hover': { color: 'white' } }}>
                                        <SkipBackIcon />
                                    </IconButton>
                                    <IconButton sx={{ color: 'rgba(255, 255, 255, 0.8)', '&:hover': { color: 'white' } }}>
                                        <SkipForwardIcon />
                                    </IconButton>
                                    <Box sx={{ flexGrow: 1, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 4, height: 4 }}>
                                        <Box sx={{ backgroundColor: 'primary.main', borderRadius: 4, height: '100%', width: '33%' }} />
                                    </Box>
                                    <Typography variant="body2" color="white">2:15 / 6:16</Typography>
                                    <IconButton sx={{ color: 'rgba(255, 255, 255, 0.8)', '&:hover': { color: 'white' } }}>
                                        <VolumeUpIcon />
                                    </IconButton>
                                    <IconButton sx={{ color: 'rgba(255, 255, 255, 0.8)', '&:hover': { color: 'white' } }}>
                                        <SettingsIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ p: 2, backgroundColor: '#0f172a' }}>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box display="flex" alignItems="center" gap={2}>
                                <Button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    startIcon={isPlaying ? <PauseIcon /> : <PlayIcon />}
                                    variant="contained"
                                    sx={{ textTransform: 'none' }}
                                >
                                    {isPlaying ? 'Pause' : 'Play'}
                                </Button>
                                <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
                                    You must watch the entire video for progress
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Button startIcon={<ThumbsUpIcon />} sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: 'white' } }}>
                                    2168
                                </Button>
                                <Button startIcon={<MessageSquareIcon />} sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: 'white' } }}>
                                    Comments
                                </Button>
                                <Button startIcon={<FlagIcon />} sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: 'white' } }}>
                                    Report
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Box>
            <Box sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
            }}>

                <Box sx={{
                    pt: 3,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Button
                        onClick={() => setCurrentVideo(Math.max(0, currentVideo - 1))}
                        disabled={currentVideo === 0}
                        startIcon={<SkipBackIcon />}
                        variant="outlined"
                        sx={{ textTransform: 'none' }}
                    >
                        Previous Video
                    </Button>


                    <Box textAlign="center">
                        <Typography variant="body2" color="text.secondary">
                            Video {currentVideo + 1} of {videos.length}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                            {videos.filter(v => v.completed).length} completed
                        </Typography>
                    </Box>

                    <Button
                        onClick={() => setCurrentVideo(Math.min(videos.length - 1, currentVideo + 1))}
                        disabled={currentVideo === videos.length - 1}
                        endIcon={<SkipForwardIcon />}
                        variant="contained"
                        sx={{ textTransform: 'none' }}
                    >
                        Next Video
                    </Button>
                </Box>
                <Paper sx={{
                    backgroundColor: 'warning.light',
                    border: '1px solid',
                    borderColor: 'warning.main',
                    borderRadius: 2,
                    p: 2,
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 2
                }}>
                    <Avatar sx={{ width: 24, height: 24, bgcolor: 'warning.main', flexShrink: 0 }}>
                        <Typography variant="body2" fontWeight="bold" color="white">!</Typography>
                    </Avatar>
                    <Typography color="warning.dark">
                        You must watch the entire video without moving or skipping it for it to count towards your course progress.
                    </Typography>
                </Paper>

                <Paper sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
                    <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="h4" fontWeight="bold" mb={1}>{currentVideoData.title}</Typography>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Chip icon={<ClockIcon />} label={currentVideoData.duration} size="small" />
                            <Chip icon={<UsersIcon />} label="12,543 students" size="small" />
                            <Chip icon={<AwardIcon />} label="Beginner Level" size="small" />
                        </Box>
                    </Box>

                    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* Description */}
                        <Box>
                            <Typography variant="h6" fontWeight="semibold" mb={1}>Description</Typography>
                            <Typography color="text.secondary" sx={{ lineHeight: 1.6 }}>{currentVideoData.description}</Typography>
                        </Box>

                        {/* Key Topics */}
                        <Box>
                            <Typography variant="h6" fontWeight="semibold" mb={1}>Key Topics Covered</Typography>
                            <Grid container spacing={1}>
                                {currentVideoData.keyTopics.map((topic, index) => (
                                    <Grid item xs={12} sm={6} key={index}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Box sx={{ width: 8, height: 8, backgroundColor: 'primary.main', borderRadius: '50%' }} />
                                            <Typography color="text.secondary">{topic}</Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>

                        <Box>
                            <Typography variant="h6" fontWeight="semibold" mb={1}>Learning Objectives</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {currentVideoData.learningObjectives.map((objective, index) => (
                                    <Box key={index} display="flex" alignItems="flex-start" gap={1}>
                                        <CheckCircleIcon color="success" sx={{ mt: '2px' }} />
                                        <Typography color="text.secondary">{objective}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>

                        <Box>
                            <Typography variant="h6" fontWeight="semibold" mb={1}>Additional Resources</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}>
                                    <Button fullWidth sx={{
                                        p: 2,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        justifyContent: 'flex-start',
                                        gap: 2,
                                        '&:hover': { backgroundColor: 'action.hover' }
                                    }}>
                                        <DownloadIcon color="primary" />
                                        <Box textAlign="left">
                                            <Typography fontWeight="medium">Video Transcript</Typography>
                                            <Typography variant="body2" color="text.secondary">Download PDF</Typography>
                                        </Box>
                                    </Button>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Button fullWidth sx={{
                                        p: 2,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        justifyContent: 'flex-start',
                                        gap: 2,
                                        '&:hover': { backgroundColor: 'action.hover' }
                                    }}>
                                        <FileTextIcon color="primary" />
                                        <Box textAlign="left">
                                            <Typography fontWeight="medium">Presentation Slides</Typography>
                                            <Typography variant="body2" color="text.secondary">View online</Typography>
                                        </Box>
                                    </Button>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Button fullWidth sx={{
                                        p: 2,
                                        border: '1px solid',
                                        borderColor: 'divider',
                                        justifyContent: 'flex-start',
                                        gap: 2,
                                        '&:hover': { backgroundColor: 'action.hover' }
                                    }}>
                                        <BookOpenIcon color="primary" />
                                        <Box textAlign="left">
                                            <Typography fontWeight="medium">Reading Materials</Typography>
                                            <Typography variant="body2" color="text.secondary">External links</Typography>
                                        </Box>
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};