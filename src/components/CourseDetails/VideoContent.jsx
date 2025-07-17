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
    Chip,
    CircularProgress
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
    MenuBook as BookOpenIcon,
    DuoTwoTone
} from '@mui/icons-material';
import ReactPlayer from 'react-player';
import { useEffect, useRef, useState } from 'react';
import { getCourseProgress, updateVideoCompletion } from '../../context/Actions/courseActions';
import { useCourseContext } from '../../context/contextFiles/CourseContext';
import { useAuth } from '../../context/contextFiles/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
const serverURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';
export const VideoContent = ({
    currentVideo,
    isVideoZoomed,
    isVideoFullscreen,
    isPlaying,
    setCurrentVideo,
    setIsVideoZoomed,
    setIsVideoFullscreen,
    setIsPlaying,
    videos,
    courseId,
    moduleId,
    isCompulsory
}) => {
    const playerRef = useRef(null);
    
    // Get current video data first
    const currentVideoData = Array.isArray(videos) && videos.length > currentVideo && currentVideo >= 0
        ? videos[currentVideo]
        : null;

    // Then use it in state initialization
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(currentVideoData?.duration || 0);
    const [readableDuration, setReadableDuration] = useState('');
    const [currentTime, setCurrentTime] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [showControls, setShowControls] = useState(false);
    const [hasMarkedComplete, setHasMarkedComplete] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);
    const [isVideoReady, setIsVideoReady] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const { state: { loading, courseProgress }, dispatch } = useCourseContext();
    const { state: { user } } = useAuth();
    const userId = user._id;
    const hoursToExpire = 24; 
    const userToken = user.token;
    // Buffer and loading state handling
    useEffect(() => {
        return () => {
            // Cleanup if needed
        };
    }, [isPlaying]);

    // console.log('so the course is compulory: ', isCompulsory)

    
useEffect(() => {
    console.log("this is the current video data: ", currentVideoData);
  const fetchSasUrl = async () => {
    try {
      const res = await axios.get(
        `${serverURL}/api/courses/videos/${currentVideoData?.videoBlobName}/expires?hours=${hoursToExpire}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }
      );
      setVideoUrl(res.data.sasToken);
    } catch (error) {
      console.error('Failed to fetch SAS URL:', error);
    }
  };
  fetchSasUrl();
}, [currentVideoData]);

    useEffect(() => {
        setHasMarkedComplete(false); // this function is there to reset has marked completed when video changes so we can make api call for completed video
    }, [currentVideo]);

    useEffect(() => {
        const formatDuration = (rawSeconds) => {
            const totalSeconds = Math.floor(rawSeconds);
            const hrs = Math.floor(totalSeconds / 3600);
            const mins = Math.floor((totalSeconds % 3600) / 60);
            const secs = totalSeconds % 60;
            return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        };
        setReadableDuration(formatDuration(duration));
    }, [duration]);

    useEffect(() => {
        const markVideoAndFetchProgress = async () => {
            if ( progress >=10 && progress >= 90 && !hasMarkedComplete && currentVideoData?._id) {
                setHasMarkedComplete(true);
                try {
                    await updateVideoCompletion(courseId, currentVideoData._id, moduleId, dispatch);
                    await getCourseProgress(courseId, userId, dispatch);
                } catch (error) {
                    console.error('Error updating video completion:', error);
                }
            }
        };
        markVideoAndFetchProgress();
    }, [progress]);

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleProgress = (state) => {
        setProgress(state.played * 100);
        setCurrentTime(state.playedSeconds);
        // Mark as ready when we have enough buffer
        if (state.loadedSeconds - state.playedSeconds > 2) {
            setIsVideoReady(true);
            setIsBuffering(false);
        }
    };

    const handleDuration = (duration) => {
        setDuration(duration);
    };

    const handleSeek = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if(isCompulsory){
            toast.error('This is a compulsory course, please watch it completely!')
        }
        if (playerRef.current && !isCompulsory) {
            const seekFraction = e.nativeEvent.offsetX / e.currentTarget.offsetWidth;
            playerRef.current.seekTo(seekFraction);
            const seekTime = seekFraction * duration;
            setCurrentTime(seekTime);
            setProgress(seekFraction * 100);
        }

    };

    const seekTo = (time) => {
        if (playerRef.current) {
            playerRef.current.seekTo(time);
            setCurrentTime(time);
            setProgress((time / duration) * 100);
        }
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
    };

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const toggleFullscreen = () => {
        if (!isVideoFullscreen) {
            const playerWrapper = document.querySelector('.player-wrapper');
            if (playerWrapper?.requestFullscreen) {
                playerWrapper.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
        setIsVideoFullscreen(!isVideoFullscreen);
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (!playerRef.current || !isVideoReady) return;

            switch (event.code) {
                case 'Space':
                    event.preventDefault();
                    togglePlayPause();
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    if( !isCompulsory){
                        seekTo(Math.min(currentTime + 10, duration));
                    }
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    seekTo(Math.max(currentTime - 5, 0));
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentTime, duration, isVideoReady]);

    // Fullscreen change handler
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsVideoFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    return (
        <Box sx={{ display: 'flex',
                flexDirection: 'column',
                height: '100vh',       
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                    display: 'none',
                },
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',}}>
            <Box sx={{  height: '80%',
                display: 'flex',
                flexDirection: 'column',
                p: 1}}>
                <Paper sx={{ backgroundColor: 'black',
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
                    flexDirection: 'column'}}>
                    <Box className="player-wrapper" sx={{
                        aspectRatio: '16/9',
                        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                        position: 'relative',
                        flexGrow: 1,
                        '&:hover .controls-overlay': { opacity: 1 }
                    }}>
                        <ReactPlayer
                            ref={playerRef}
                            url={videoUrl}
                            width="100%"
                            height="100%"
                            playing={isPlaying}
                            muted={isMuted}
                            volume={isMuted ? 0 : volume}
                            controls={false}
                            onReady={() => setIsVideoReady(true)}
                            onStart={() => setIsVideoReady(true)}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            onEnded={() => setIsPlaying(false)}
                            onProgress={handleProgress}
                            onDuration={handleDuration}
                            onBuffer={() => setIsBuffering(true)}
                            onBufferEnd={() => setIsBuffering(false)}
                            onError={(e) => {
                                console.error('ReactPlayer error:', e);
                                setIsVideoReady(false);
                            }}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                transform: isVideoZoomed && !isVideoFullscreen ? 'scale(1.1)' : 'none',
                                transition: 'transform 0.3s'
                            }}
                        />

                        {isBuffering && (
                            <Box sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                zIndex: 999,
                                color: 'white',
                                textAlign: 'center',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                borderRadius: 2,
                                padding: 2,
                            }}>
                                <CircularProgress color="inherit" />
                                <Typography mt={2} variant="body2">Buffering...</Typography>
                            </Box>
                        )}

                        {!isPlaying && (
                            <Box sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                zIndex: 100,
                                transform: 'translate(-50%, -50%)',
                                cursor: 'pointer',
                                textAlign: 'center',
                                color: 'white'
                            }} onClick={togglePlayPause}>
                                <PlayCircleIcon sx={{ width: 80, height: 80, mx: 'auto', mb: 2, color: 'rgba(255, 255, 255, 0.8)' }} />
                                <Typography variant="h5" fontWeight="bold" mb={1}>{currentVideoData?.title}</Typography>
                                <Typography color="rgba(255, 255, 255, 0.7)">Duration: {currentVideoData?.duration}</Typography>
                            </Box>
                        )}

                        <Box className="controls-overlay" sx={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.2)',
                            opacity: showControls ? 1 : 0,
                            transition: 'opacity 0.3s',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between'
                        }}
                            onMouseEnter={() => setShowControls(true)}
                            onMouseLeave={() => setShowControls(false)}
                        >
                            <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
                                <IconButton
                                    onClick={() => setIsVideoZoomed(!isVideoZoomed)}
                                    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' } }}
                                    title={isVideoZoomed ? "Zoom Out" : "Zoom In"}
                                >
                                    {isVideoZoomed ? <ZoomOutIcon /> : <ZoomInIcon />}
                                </IconButton>
                                <IconButton
                                    onClick={toggleFullscreen}
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
                                        onClick={togglePlayPause}
                                        sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' } }}
                                    >
                                        {isPlaying ? <PauseIcon /> : <PlayIcon />}
                                    </IconButton>
                                    <Box
                                        sx={{
                                            flexGrow: 1,
                                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                            borderRadius: 4,
                                            height: 4,
                                            cursor: 'pointer'
                                        }}
                                        onClick={handleSeek}
                                    >
                                        <Box sx={{
                                            backgroundColor: 'primary.main',
                                            borderRadius: 4,
                                            height: '100%',
                                            width: `${progress}%`
                                        }} />
                                    </Box>
                                    <Typography variant="body2" color="white">
                                        {formatTime(currentTime)} / {formatTime(duration)}
                                    </Typography>
                                    <IconButton
                                        onClick={toggleMute}
                                        sx={{ color: 'rgba(255, 255, 255, 0.8)', '&:hover': { color: 'white' } }}
                                    >
                                        <VolumeUpIcon />
                                    </IconButton>
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={isMuted ? 0 : volume}
                                        onChange={handleVolumeChange}
                                        style={{
                                            width: '80px',
                                            cursor: 'pointer'
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Box>
                    </Box>

                    <Box sx={{ p: 2, backgroundColor: '#0f172a' }}>
                        <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box display="flex" alignItems="center" gap={2}>
                                <Button
                                    onClick={togglePlayPause}
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
                            {/* <Box display="flex" alignItems="center" gap={1}>
                                <Button startIcon={<ThumbsUpIcon />} sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: 'white' } }}>
                                    2168
                                </Button>
                                <Button startIcon={<MessageSquareIcon />} sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: 'white' } }}>
                                    Comments
                                </Button>
                                <Button startIcon={<FlagIcon />} sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: 'white' } }}>
                                    Report
                                </Button>
                            </Box> */}
                        </Box>
                    </Box>
                </Paper>
            </Box>
            {/* Rest of your component remains the same */}
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
                            Video {currentVideo + 1} of {videos?.length}
                        </Typography>
                        {/* <Typography variant="caption" color="text.disabled">
                            {videos?.filter(v => v.completed).length} completed
                        </Typography> */}
                    </Box>

                    <Button
                        onClick={() => setCurrentVideo(Math.min(videos?.length - 1, currentVideo + 1))}
                        disabled={currentVideo === videos?.length - 1}
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
                        <Typography variant="h4" fontWeight="bold" mb={1}>{currentVideoData?.title}</Typography>
                        <Box display="flex" alignItems="center" gap={2}>
                            <Chip icon={<ClockIcon />} label={readableDuration} size="small" />
                            {/* <Chip icon={<UsersIcon />} label="12,543 students" size="small" /> */}
                            {/* <Chip icon={<AwardIcon />} label="Beginner Level" size="small" /> */}
                        </Box>
                    </Box>

                    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Box>
                            <Typography variant="h6" fontWeight="semibold" mb={1}>Description</Typography>

                            <Typography color="text.secondary" sx={{ lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{currentVideoData?.description}</Typography>

                        </Box>

                      
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};