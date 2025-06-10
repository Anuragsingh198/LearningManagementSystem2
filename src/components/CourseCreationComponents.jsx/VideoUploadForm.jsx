import React, { useEffect, useState  } from 'react';
import { useCourseContext } from '../../context/contextFiles/CourseContext';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  LinearProgress,
  Paper,
  Divider,
  IconButton,
  Card,
  Avatar,
  Input,
  FormHelperText,
  Alert,
} from '@mui/material';
import {
  Upload as UploadIcon,
  Close as CloseIcon,
  Add as AddIcon,
  VideoLibrary as VideoLibraryIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { createModuleAction, createVideoAction, getCourseById, getModulesByCourseId } from '../../context/Actions/courseActions';

// Header Component
const Header = () => (
  <Box
    sx={{
      zIndex: 20,
      backgroundColor: 'background.paper',
      py: 3, // add padding for spacing
    }}
  >
    <Box sx={{ maxWidth: 'lg', mx: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ mb: { xs: 2, md: 0 } }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{ fontWeight: 'bold', color: 'text.primary' }}
          >
            Upload Video
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Get started by uploading your course video
          </Typography>
        </Box>
      </Box>
    </Box>
  </Box>
);


const VideoUploadForm = ({ courseId }) => {
const { state: { modules }, dispatch } = useCourseContext();

const [course, setCourse] = useState(null);
const [existingModules, setExistingModules] = useState([]);


  
  const [selectedModule, setSelectedModule] = useState('');
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [moduleData, setModuleData] = useState({
    title: '',
    description: '',
  });
  
  const [videoData, setVideoData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: 0,
  });
  
  const [videoFile, setVideoFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);

  const validateModuleForm = () => {
    const newErrors = {};
    
    if (!moduleData.title.trim()) {
      newErrors.moduleTitle = 'Module title is required';
    }
    
    if (!moduleData.description.trim()) {
      newErrors.moduleDescription = 'Module description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateVideoForm = () => {
    const newErrors = {};
    
    if (!selectedModule && existingModules.length > 0) {
      newErrors.selectedModule = 'Please select a module';
    }
    
    if (!videoData.title.trim()) {
      newErrors.videoTitle = 'Video title is required';
    }
    
    if (!videoData.description.trim()) {
      newErrors.videoDescription = 'Video description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleModuleInputChange = (e) => {
    const { name, value } = e.target;
    setModuleData({
      ...moduleData,
      [name]: value,
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleVideoInputChange = (e) => {
    const { name, value } = e.target;
    setVideoData({
      ...videoData,
      [name]: name === 'duration' ? parseFloat(value) : value,
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const handleModuleChange = (e) => {
    setSelectedModule(e.target.value);
    
    if (errors.selectedModule) {
      setErrors({
        ...errors,
        selectedModule: '',
      });
    }
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      console.log("this is the  uploaded  vidoe file : " , file)
      if (errors.videoFile) {
        setErrors({
          ...errors,
          videoFile: '',
        });
      }
    }
  };

  const clearVideoFile = () => {
    setVideoFile(null);
  };

  const handleCreateModule = async (e) => {
    e.preventDefault();
    
    if (!validateModuleForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      const newModule = {
        courseId,
        title: moduleData.title,
        description: moduleData.description,
        order: existingModules.length + 1,
      };
      
      const createdModule = await createModuleAction(newModule , dispatch);
      setSelectedModule(createdModule._id);
      console.log("this is   createed module id  from videoUploadform: ", createdModule._id )
      setModuleData({ title: '', description: '' });
      setShowModuleForm(false);
    } catch (error) {
      console.error("Failed to create module:", error);
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

const handleUploadVideo = async (e) => {
  e.preventDefault();

  if (!validateVideoForm()) return;

  if (!videoFile) {
    setErrors({ videoFile: 'Please select a video file' });
    return;
  }

  setIsSubmitting(true);
  setUploadProgress(0);

  try {
    const formData = new FormData();
    formData.append('title', videoData.title);
    formData.append('description', videoData.description);
    formData.append('duration', videoData.duration || 0);
    formData.append('courseId', courseId);
    formData.append('moduleId', selectedModule);
    formData.append('video', videoFile); 
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    await createVideoAction(formData, dispatch);
    setUploadProgress(100);
    setIsUploaded(true);
    setVideoData({ title: '', description: '', videoUrl: '', duration: 0 });
    setVideoFile(null);
    setSelectedModule('');
    setIsSubmitting(false);
  } catch (error) {
    console.error("Failed to upload video:", error);
    setErrors({ submit: error.message });
    setIsSubmitting(false);
  }
};


useEffect(() => {
  if (!courseId) return; 

  // Fetch course
  getCourseById(courseId, dispatch)
    .then((fetchedCourse) => setCourse(fetchedCourse))
    .catch((err) => console.error(err));

  // Fetch modules
  getModulesByCourseId(courseId, dispatch)
    .then((fetchedModules) => setExistingModules(fetchedModules))
    .catch((err) => console.error(err));

}, [courseId, dispatch]); 

  if (!course) {
    return (
      <Paper elevation={1} sx={{ p: 3, maxWidth: 'md', mx: 'auto' }}>
        <Typography color="error" fontWeight="medium">Course not found</Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ 
      
      backgroundColor: 'background.default', py: 3, width: '99%', borderRadius:10 }}>
      <Header />
      
      <Box sx={{ maxWidth: 'lg', mx: 'auto', mt: '120px' }}>
        <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ p: 2 }}>
            {isUploaded && (
              <Alert severity="success" sx={{ mb: 3 }}>
                <Typography fontWeight="medium">Video uploaded successfully!</Typography>
                <Typography variant="body2">Your video has been added to the course.</Typography>
              </Alert>
            )}

            {/* First Row - Two Sections */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3, mb: 3 }}>
              {/* Module Section - Left Column */}
              <Box sx={{ width: { lg: '50%' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" fontWeight="semibold">
                    {showModuleForm ? "Create New Module" : "Select Module"}
                  </Typography>
                  <Button
                    onClick={() => setShowModuleForm(!showModuleForm)}
                    startIcon={!showModuleForm && <AddIcon />}
                    size="small"
                  >
                    {showModuleForm ? "Cancel" : "New Module"}
                  </Button>
                </Box>
                
                {showModuleForm ? (
                  <Card component="form" onSubmit={handleCreateModule} sx={{ p: 2, backgroundColor: 'background.paper' }}>
                    <TextField
                      fullWidth
                      label="Module Title"
                      id="title"
                      name="title"
                      value={moduleData.title}
                      onChange={handleModuleInputChange}
                      error={Boolean(errors.moduleTitle)}
                      helperText={errors.moduleTitle}
                      margin="normal"
                      required
                    />
                    
                    <TextField
                      fullWidth
                      label="Module Description"
                      id="description"
                      name="description"
                      value={moduleData.description}
                      onChange={handleModuleInputChange}
                      error={Boolean(errors.moduleDescription)}
                      helperText={errors.moduleDescription}
                      margin="normal"
                      required
                      multiline
                      rows={3}
                    />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                      >
                        Create Module
                      </Button>
                    </Box>
                  </Card>
                ) : (
                  <Box sx={{ mb: 3 }}>
                    {existingModules.length > 0 ? (
                      <Box>
                        <FormControl fullWidth error={Boolean(errors.selectedModule)}>
                          <InputLabel id="module-select-label">Select a Module *</InputLabel>
                          <Select
                            labelId="module-select-label"
                            id="moduleSelect"
                            value={selectedModule}
                            onChange={handleModuleChange}
                            label="Select a Module *"
                            IconComponent={KeyboardArrowDownIcon}
                          >
                            <MenuItem value="">-- Select a module --</MenuItem>
                            {existingModules.map((module) => (
                              <MenuItem key={module.id} value={module.id}>
                                {module.title}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.selectedModule && (
                            <FormHelperText>{errors.selectedModule}</FormHelperText>
                          )}
                        </FormControl>
                      </Box>
                    ) : (
                      <Card sx={{ textAlign: 'center', py: 4, backgroundColor: 'background.paper' }}>
                        <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', mx: 'auto', mb: 2 }}>
                          <VideoLibraryIcon />
                        </Avatar>
                        <Typography variant="h6" fontWeight="medium" gutterBottom>
                          No modules yet
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Create a module first to upload videos.
                        </Typography>
                        <Button
                          onClick={() => setShowModuleForm(true)}
                          variant="contained"
                          color="primary"
                          startIcon={<AddIcon />}
                        >
                          Create Module
                        </Button>
                      </Card>
                    )}
                  </Box>
                )}
              </Box>

              {/* Video Info Section - Right Column */}
              <Box sx={{ width: { lg: '50%' } }}>
                <Typography variant="h6" fontWeight="semibold" sx={{ mb: 2 }}>
                  Video Information
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Video Title"
                    id="videoTitle"
                    name="title"
                    value={videoData.title}
                    onChange={handleVideoInputChange}
                    error={Boolean(errors.videoTitle)}
                    helperText={errors.videoTitle}
                    required
                  />
                  
                  <TextField
                    fullWidth
                    label="Video Description"
                    id="videoDescription"
                    name="description"
                    value={videoData.description}
                    onChange={handleVideoInputChange}
                    error={Boolean(errors.videoDescription)}
                    helperText={errors.videoDescription}
                    required
                    multiline
                    rows={3}
                  />
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Video Upload Section */}
            <Box>
              <Typography variant="h6" fontWeight="semibold" sx={{ mb: 2 }}>
                Upload Video File
              </Typography>
              
              <Box>
                <Typography variant="body2" component="label" sx={{ display: 'block', mb: 1, color: 'text.primary', fontWeight: 'medium' }}>
                  Video File <span style={{ color: 'red' }}>*</span>
                </Typography>
                
                {!videoFile ? (
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 4,
                      border: 2,
                      borderColor: errors.videoFile ? 'error.main' : 'divider',
                      borderStyle: 'dashed',
                      backgroundColor: errors.videoFile ? 'error.light' : 'background.paper',
                      textAlign: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: 'primary.main'
                      }
                    }}
                  >
                    <label htmlFor="videoFile" style={{ cursor: 'pointer' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                          <CloudUploadIcon />
                        </Avatar>
                        <Typography variant="body1" fontWeight="medium">
                          <Box component="span" sx={{ color: 'primary.main' }}>Click to upload</Box> or drag and drop
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          MP4, MOV, WEBM up to 2GB
                        </Typography>
                      </Box>
                      <Input
                        id="videoFile"
                        name="videoFile"
                        type="file"
                        inputProps={{ accept: 'video/*' }}
                        sx={{ display: 'none' }}
                        onChange={handleVideoFileChange}
                      />
                    </label>
                  </Paper>
                ) : (
                  <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <VideoLibraryIcon color="action" />
                      <Box>
                        <Typography variant="body2" fontWeight="medium" noWrap sx={{ maxWidth: '300px' }}>
                          {videoFile.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton onClick={clearVideoFile}>
                      <CloseIcon />
                    </IconButton>
                  </Paper>
                )}
                
                {errors.videoFile && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    {errors.videoFile}
                  </Typography>
                )}
              </Box>
              
              {isSubmitting && (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" fontWeight="medium">
                      Upload Progress
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {uploadProgress}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(to right, #3b82f6, #6366f1)'
                      }
                    }}
                  />
                </Box>
              )}
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                <Button
                  onClick={handleUploadVideo}
                  disabled={isSubmitting || (!selectedModule && existingModules.length > 0)}
                  variant="contained"
                  color="primary"
                  startIcon={isSubmitting && <CircularProgress size={20} color="inherit" />}
                >
                  {isSubmitting ? 'Uploading...' : 'Upload Video'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default VideoUploadForm;