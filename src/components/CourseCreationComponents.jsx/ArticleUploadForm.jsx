import React, { useEffect, useState } from 'react';
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
  Close as CloseIcon,
  Add as AddIcon,
  Description as DescriptionIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { createModuleAction, getModulesByCourseId, createArticleAction } from '../../context/Actions/courseActions';
import BlurLoading from '../../pages/common/BlurLoading';

const Header = () => (
  <Box sx={{ zIndex: 20, backgroundColor: 'background.paper', paddingTop: 3 }}>
    <Box sx={{ maxWidth: 'lg', mx: 'auto' }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between' }}>
        <Box sx={{ mb: { xs: 2, md: 0 } }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'gray' }}>
            Upload Article
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Add PDFs to your course modules
          </Typography>
        </Box>
      </Box>
    </Box>
  </Box>
);

const ArticleUploadForm = ({ courseId }) => {
  const { state: { courses, moduleNames, loading }, dispatch } = useCourseContext();

  const [course, setCourse] = useState(null);
  const [existingModules, setExistingModules] = useState([]);

  useEffect(() => { setExistingModules(moduleNames); }, [moduleNames]);
  useEffect(() => { setCourse(courses.find(c => c._id === courseId)); }, [courses, courseId]);

  const [selectedModule, setSelectedModule] = useState('');
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [moduleData, setModuleData] = useState({ title: '', description: '' });
  const [articleData, setArticleData] = useState({ title: '', description: '' });

  const [articleFile, setArticleFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);

  useEffect(() => {
    if (isUploaded) {
      const t = setTimeout(() => setIsUploaded(false), 5000);
      return () => clearTimeout(t);
    }
  }, [isUploaded]);

  const validateModuleForm = () => {
    const newErrors = {};
    if (!moduleData.title.trim()) newErrors.moduleTitle = 'Module title is required';
    if (!moduleData.description.trim()) newErrors.moduleDescription = 'Module description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateArticleForm = () => {
    const newErrors = {};
    if (!selectedModule && existingModules.length > 0) newErrors.selectedModule = 'Please select a module';
    if (!articleData.title.trim()) newErrors.articleTitle = 'Article title is required';
    // Article description is optional
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleModuleInputChange = (e) => {
    const { name, value } = e.target;
    setModuleData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleArticleInputChange = (e) => {
    const { name, value } = e.target;
    setArticleData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleModuleChange = (e) => {
    setSelectedModule(e.target.value);
    if (errors.selectedModule) setErrors(prev => ({ ...prev, selectedModule: '' }));
  };

  const handleArticleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setErrors(prev => ({ ...prev, articleFile: 'Only PDF files are allowed' }));
        return;
      }
      setArticleFile(file);
      if (errors.articleFile) setErrors(prev => ({ ...prev, articleFile: '' }));
    }
  };

  const clearArticleFile = () => setArticleFile(null);

  const handleCreateModule = async (e) => {
    e.preventDefault();
    if (!validateModuleForm()) return;
    try {
      setIsSubmitting(true);
      const newModule = { courseId, title: moduleData.title, description: moduleData.description, order: existingModules.length + 1 };
      const createdModule = await createModuleAction(newModule, dispatch);
      setSelectedModule(createdModule._id);
      setModuleData({ title: '', description: '' });
      getModulesByCourseId(courseId, dispatch).catch(console.error);
      setShowModuleForm(false);
    } catch (error) {
      console.error('Failed to create module:', error);
      setErrors({ submit: error.message });
    } finally { setIsSubmitting(false); }
  };

  const handleUploadArticle = async (e) => {
    e.preventDefault();
    if (!validateArticleForm()) return;
    if (!articleFile) { setErrors({ articleFile: 'Please select a PDF file' }); return; }

    setIsSubmitting(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append('title', articleData.title);
      if (articleData.description?.trim()) {
        formData.append('description', articleData.description.trim());
      }
      formData.append('courseId', courseId);
      formData.append('moduleId', selectedModule);
      formData.append('article', articleFile); // backend field expected: 'article'

      await createArticleAction(formData, dispatch, (p) => setUploadProgress(p));
      setUploadProgress(100);
      setIsUploaded(true);
      setArticleData({ title: '', description: '' });
      setArticleFile(null);
      setSelectedModule('');
    } catch (error) {
      console.error('Failed to upload article:', error);
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!course) return <BlurLoading/>;

  return (
    <Box sx={{ backgroundColor: 'background.default', py: 3, width: '99%', borderRadius: 10, border: '1px solid', borderColor: 'grey.300' }}>
      <Header />

      <Box sx={{ maxWidth: 'lg', mx: 'auto', mt: 2 }}>
        <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ p: 2 }}>
            {isUploaded && (
              <Alert severity="success" sx={{ mb: 3 }}>
                <Typography fontWeight="medium">Article uploaded successfully!</Typography>
                <Typography variant="body2">Your document has been added to the course.</Typography>
              </Alert>
            )}

            {/* First Row - Two Sections */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3, mb: 3 }}>
              {/* Module Section - Left Column */}
              <Box sx={{ width: { lg: '50%' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" fontWeight="semibold">
                    {showModuleForm ? 'Create New Module' : 'Select Module'}
                  </Typography>
                  <Button onClick={() => setShowModuleForm(!showModuleForm)} startIcon={!showModuleForm && <AddIcon />} size="small">
                    {showModuleForm ? 'Cancel' : 'New Module'}
                  </Button>
                </Box>

                {showModuleForm ? (
                  <Card component="form" onSubmit={handleCreateModule} sx={{ p: 2, backgroundColor: 'background.paper' }}>
                    <TextField fullWidth label="Module Title" id="title" name="title" value={moduleData.title} onChange={handleModuleInputChange} error={Boolean(errors.moduleTitle)} helperText={errors.moduleTitle} margin="normal" required />
                    <TextField fullWidth label="Module Description" id="description" name="description" value={moduleData.description} onChange={handleModuleInputChange} error={Boolean(errors.moduleDescription)} helperText={errors.moduleDescription} margin="normal" required multiline rows={3} />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>Create Module</Button>
                    </Box>
                  </Card>
                ) : (
                  <Box sx={{ mb: 3 }}>
                    {existingModules.length > 0 ? (
                      <Box>
                        <FormControl fullWidth error={Boolean(errors.selectedModule)}>
                          <InputLabel id="module-select-label">Select a Module *</InputLabel>
                          <Select labelId="module-select-label" id="moduleSelect" value={selectedModule} onChange={handleModuleChange} label="Select a Module *" IconComponent={KeyboardArrowDownIcon}>
                            <MenuItem value="">-- Select a module --</MenuItem>
                            {existingModules.map((module) => (
                              <MenuItem key={module._id} value={module._id}>{module.title}</MenuItem>
                            ))}
                          </Select>
                          {errors.selectedModule && (<FormHelperText>{errors.selectedModule}</FormHelperText>)}
                        </FormControl>
                      </Box>
                    ) : (
                      <Card sx={{ textAlign: 'center', py: 4, backgroundColor: 'background.paper' }}>
                        <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', mx: 'auto', mb: 2 }}>
                          <DescriptionIcon />
                        </Avatar>
                        <Typography variant="h6" fontWeight="medium" gutterBottom>No modules yet</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Create a module first to upload articles.</Typography>
                        <Button onClick={() => setShowModuleForm(true)} variant="contained" color="primary" startIcon={<AddIcon />}>Create Module</Button>
                      </Card>
                    )}
                  </Box>
                )}
              </Box>

              {/* Article Info Section - Right Column */}
              <Box sx={{ width: { lg: '50%' } }}>
                <Typography variant="h6" fontWeight="semibold" sx={{ mb: 2 }}>Article Information</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField fullWidth label="Article Title" id="articleTitle" name="title" value={articleData.title} onChange={handleArticleInputChange} error={Boolean(errors.articleTitle)} helperText={errors.articleTitle} required />
                  <TextField fullWidth label="Article Description (optional)" id="articleDescription" name="description" value={articleData.description} onChange={handleArticleInputChange} multiline rows={3} />
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Article Upload Section */}
            <Box>
              <Typography variant="h6" fontWeight="semibold" sx={{ mb: 2 }}>Upload Article File</Typography>
              <Box>
                <Typography variant="body2" component="label" sx={{ display: 'block', mb: 1, color: 'text.primary', fontWeight: 'medium' }}>
                  PDF File <span style={{ color: 'red' }}>*</span>
                </Typography>

                {!articleFile ? (
                  <Paper variant="outlined" sx={{ p: 4, border: 2, borderColor: errors.articleFile ? 'error.main' : 'divider', borderStyle: 'dashed', backgroundColor: errors.articleFile ? 'error.light' : 'background.paper', textAlign: 'center', cursor: 'pointer', '&:hover': { borderColor: 'primary.main' } }}>
                    <label htmlFor="articleFile" style={{ cursor: 'pointer' }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                          <CloudUploadIcon />
                        </Avatar>
                        <Typography variant="body1" fontWeight="medium">
                          <Box component="span" sx={{ color: 'primary.main' }}>Click to upload</Box> or drag and drop
                        </Typography>
                        <Typography variant="caption" color="text.secondary">PDF up to 50MB</Typography>
                      </Box>
                      <Input id="articleFile" name="articleFile" type="file" inputProps={{ accept: 'application/pdf' }} sx={{ display: 'none' }} onChange={handleArticleFileChange} />
                    </label>
                  </Paper>
                ) : (
                  <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <DescriptionIcon color="action" />
                      <Box>
                        <Typography variant="body2" fontWeight="medium" noWrap sx={{ maxWidth: '300px' }}>{articleFile.name}</Typography>
                        <Typography variant="caption" color="text.secondary">{(articleFile.size / (1024 * 1024)).toFixed(2)} MB</Typography>
                      </Box>
                    </Box>
                    <IconButton onClick={clearArticleFile}><CloseIcon /></IconButton>
                  </Paper>
                )}

                {errors.articleFile && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>{errors.articleFile}</Typography>
                )}
              </Box>

              {isSubmitting && (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" fontWeight="medium">Upload Progress</Typography>
                    <Typography variant="caption" color="text.secondary">{uploadProgress}%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={uploadProgress} sx={{ height: 8, borderRadius: 4, '& .MuiLinearProgress-bar': { background: 'linear-gradient(to right, #3b82f6, #6366f1)' } }} />
                </Box>
              )}

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                <Button onClick={handleUploadArticle} disabled={isSubmitting || (!selectedModule && existingModules.length > 0)} variant="contained" color="primary" startIcon={isSubmitting && <CircularProgress size={20} color="inherit" />}>
                  {isSubmitting ? 'Uploading...' : 'Upload Article'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ArticleUploadForm;

