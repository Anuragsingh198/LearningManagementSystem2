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
import { useEffect, useRef, useState } from 'react';
import { getCourseProgress, updateVideoCompletion } from '../../context/Actions/courseActions';
import { useCourseContext } from '../../context/contextFiles/CourseContext';
import { useAuth } from '../../context/contextFiles/AuthContext';

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
    moduleId
}) => {

    const videoRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [readableDuration, setReadableDuration] = useState('');
    const [currentTime, setCurrentTime] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [showControls, setShowControls] = useState(false);
    const [hasMarkedComplete, setHasMarkedComplete] = useState(false);
    const { state: { loading, courseProgress }, dispatch, } = useCourseContext();
    const { state: { user } } = useAuth();
    const userId = user._id;
    const [isVideoReady, setIsVideoReady] = useState(false);
    // const currentVideoData = videos[currentVideo];
    const currentVideoData = Array.isArray(videos) && videos.length > currentVideo && currentVideo >= 0
        ? videos[currentVideo]
        : null;

    useEffect(() => {
        // console.log('the current time is: ', currentTime)
        // console.log('the duration of the video is: ', duration)

        if (videoRef.current && isPlaying) {
            videoRef.current.play().catch(error => {
                console.error("Auto-play was prevented:", error);
                setIsPlaying(false);
            });
        }
    }, [currentTime, currentVideo, isPlaying]);

    useEffect(() => {
        setHasMarkedComplete(false); // this function is there to reset has marked completed when video changes so we can make api call for completed video
    }, [currentVideo]);





    // console.log('latest course progress is from video content: ', courseProgress)
    useEffect(() => {
        const formatDuration = (rawSeconds) => {
            const totalSeconds = Math.floor(rawSeconds); // remove decimals

            const hrs = Math.floor(totalSeconds / 3600);
            const mins = Math.floor((totalSeconds % 3600) / 60);
            const secs = totalSeconds % 60;

            // Pad each with 2 digits
            const paddedHrs = String(hrs).padStart(2, '0');
            const paddedMins = String(mins).padStart(2, '0');
            const paddedSecs = String(secs).padStart(2, '0');

            return `${paddedHrs}:${paddedMins}:${paddedSecs}`;
        };

        setReadableDuration(formatDuration(duration));
    }, [duration]);



    useEffect(() => {
        const markVideoAndFetchProgress = async () => {
            if (progress >= 90 && !hasMarkedComplete) {
                setHasMarkedComplete(true);

                const videoId = currentVideoData._id;
                //   console.log('api call to backend to make video as completed with current video id: ', videoId);

                try {
                    await updateVideoCompletion(courseId, videoId, moduleId, dispatch);
                    await getCourseProgress(courseId, userId, dispatch);

                    // console.log('latest course progress is from video content: ', courseProgress);
                } catch (error) {
                    console.error('Error updating video completion or fetching progress:', error);
                }
            }
        };

        markVideoAndFetchProgress();
    }, [progress]);





    const togglePlayPause = () => {

        if (videoRef.current) {
            console.log('play pause toggeled')
            if (videoRef.current.paused) {
                videoRef.current.play().then(() => setIsPlaying(true));
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    // const handleTimeUpdate = () => {
    //     if (videoRef.current && !isNaN(videoRef.current.duration)) {
    //         const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    //         setProgress(currentProgress);
    //         // console.log('the current duration is: ', currentProgress)
    //         setCurrentTime(videoRef.current.currentTime);
    //     }
    // };

    const handleTimeUpdate = () => {
    // console.log('Time update triggered');
    if (videoRef.current) {
        // console.log('Current time:', videoRef.current.currentTime);
        // console.log('Duration:', videoRef.current.duration);
        if (!isNaN(videoRef.current.duration)) {
            const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setProgress(currentProgress);
            setCurrentTime(videoRef.current.currentTime);
        }
    }
};

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleSeek = (e) => {
            e.preventDefault();
            e.stopPropagation();
        if (videoRef.current && videoRef.current.readyState > 0) {
            const seekTime = (e.nativeEvent.offsetX / e.currentTarget.offsetWidth) * videoRef.current.duration;
            videoRef.current.currentTime = seekTime;
        }
        const currentProgress = (seekTime / videoRef.current.duration) * 100;
        setProgress(currentProgress);
        setCurrentTime(seekTime);
    };
    const seekTo = (time) => {
    if (videoRef.current && !isNaN(videoRef.current.duration)) {
        videoRef.current.currentTime = time;
        const currentProgress = (time / videoRef.current.duration) * 100;
        setProgress(currentProgress);
        setCurrentTime(time);
    }
};

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };
    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
            setIsMuted(newVolume === 0);
        }
    };

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = Math.floor(timeInSeconds % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const toggleFullscreen = () => {
        if (!isVideoFullscreen) {
            if (videoRef.current?.requestFullscreen) {
                videoRef.current.requestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
        setIsVideoFullscreen(!isVideoFullscreen);
    };

        useEffect(() => {
    const handleError = () => {
        console.error('Video error:', videoRef.current?.error);
        setIsVideoReady(false);
    };

    if (videoRef.current) {
        videoRef.current.addEventListener('error', handleError);
        return () => videoRef.current?.removeEventListener('error', handleError);
    }
}, []);

        useEffect(() => {

        const handleKeyDown = (event) => {
            if (!videoRef.current || !isVideoReady) return;

            switch (event.code) {
                case 'Space':
                    event.preventDefault();
                    console.log("Key pressed:", event.code);
                    togglePlayPause();
                    break;
                case 'ArrowRight':
                    event.preventDefault(); // Optional: Prevent scroll on some browsers
                    console.log("Key pressed:", event.code);
                    videoRef.current.currentTime = Math.min(
                        videoRef.current.currentTime + 10,
                        videoRef.current.duration
                    );
                    seekTo(videoRef.current.currentTime);
                    console.log("current pointer in video:", videoRef.current.currentTime);

                    break;
                case 'ArrowLeft':
                    event.preventDefault(); // Optional
                    console.log("Key pressed:", event.code);
                    videoRef.current.currentTime = Math.max(
                        videoRef.current.currentTime - 5,
                        0
                    );
                    seekTo(videoRef.current.currentTime);
                    console.log("current pointer in video", videoRef.current.currentTime);

                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [togglePlayPause]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsVideoFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',        // or use a dynamic height if needed
                overflowY: 'auto',
                // Hide scrollbar for Webkit browsers (Chrome, Safari, etc.)
                '&::-webkit-scrollbar': {
                    display: 'none',
                },
                // Hide scrollbar for Firefox
                scrollbarWidth: 'none',
                // Hide scrollbar for IE and Edge
                msOverflowStyle: 'none',
            }}
        >

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
                        <video
                            ref={videoRef}
                             onCanPlay={() => setIsVideoReady(true)}
                            src={currentVideoData?.url}
                            style={{
                                width: '100%',
                                height: '100%',
                                cursor: 'pointer',
                                transform: isVideoZoomed && !isVideoFullscreen ? 'scale(1.1)' : 'none',
                                transition: 'transform 0.3s'
                            }}
                            onClick={togglePlayPause}
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleLoadedMetadata}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            onEnded={() => setIsPlaying(false)}
                            autoPlay={isPlaying}
                            muted={isMuted}
                        >
                            Your browser does not support the video tag.
                        </video>

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

                        {/* <Box>
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
                        </Box> */}
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};