import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourseContext } from '../../context/contextFiles/CourseContext';
import { createCourseAction } from '../../context/Actions/courseActions';
import { 
  Box, Typography, Button, TextField, Select, MenuItem, 
  FormControl, IconButton, Paper, CircularProgress, Avatar, Input,
  FormHelperText, Container 
} from '@mui/material';
import { Upload as UploadIcon, Close as CloseIcon } from '@mui/icons-material';

const HeaderForm = () => (
  <Box sx={headerStyles}>
    <Container maxWidth="xl" sx={headerContentStyles}>
      <Box sx={headerTextStyles}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'gray' }}>
          Create New Course
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
          Fill in the details to create your course and upload videos.
        </Typography>
      </Box>
    </Container>
  </Box>
);

const CourseForm = () => {
  const navigate = useNavigate();
  const { dispatch } = useCourseContext();
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.instructor.trim()) newErrors.instructor = 'Instructor is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!thumbnailPreview) newErrors.thumbnail = 'Thumbnail is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setThumbnailPreview(previewUrl);
      setFormData(prev => ({ ...prev, thumbnail: file }));
      if (errors.thumbnail) setErrors(prev => ({ ...prev, thumbnail: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      const newCourse = await createCourseAction(formDataToSend, dispatch);
      if (newCourse) navigate(`/teacher/upload-video/${newCourse._id}`);
    } catch (error) {
      console.error('Failed to create course:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // <Container>

    
    <Box sx={mainContainerStyles}>
      <HeaderForm />
      <Container maxWidth="lg" sx={formContainerStyles}>
        <Paper elevation={1} sx={paperStyles}>
          <Box component="form" onSubmit={handleSubmit} sx={formStyles}>
            <Box sx={gridContainerStyles}>
              <FormField 
                label="Title" 
                name="title" 
                value={formData.title} 
                error={errors.title}
                onChange={handleInputChange}
              />
              
              <FormField 
                label="Instructor" 
                name="instructor" 
                value={formData.instructor} 
                error={errors.instructor}
                onChange={handleInputChange}
              />

              <CategorySelect 
                value={formData.category}
                onChange={handleInputChange}
                error={errors.category}
              />
            </Box>

            <FormField 
              label="Description" 
              name="description" 
              value={formData.description} 
              error={errors.description}
              onChange={handleInputChange}
              multiline
              rows={4}
            />

            <ThumbnailUpload 
              thumbnailPreview={thumbnailPreview}
              onThumbnailChange={handleThumbnailChange}
              onClearThumbnail={() => setThumbnailPreview(null)}
              error={errors.thumbnail}
            />

            <SubmitButton isSubmitting={isSubmitting} />
          </Box>
        </Paper>
      </Container>
    </Box>
    // </Container>
  );
};

// Reusable components
const FormField = ({ label, name, value, error, onChange, multiline, rows }) => (
  <FormControl fullWidth>
    <Typography variant="subtitle2" sx={labelStyles}>
      {label} <RequiredStar />
    </Typography>
    <TextField
      name={name}
      value={value}
      onChange={onChange}
      error={Boolean(error)}
      helperText={error}
      variant="outlined"
      fullWidth
      multiline={multiline}
      rows={rows}
    />
  </FormControl>
);

const CategorySelect = ({ value, onChange, error }) => (
  <FormControl fullWidth error={Boolean(error)}>
    <Typography variant="subtitle2" sx={labelStyles}>
      Category <RequiredStar />
    </Typography>
    <Select
      name="category"
      value={value}
      onChange={onChange}
      displayEmpty
      renderValue={(selected) => selected || 'Select a category'}
    >
      <MenuItem value="" disabled>Select a category</MenuItem>
      {categories.map((cat) => (
        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
      ))}
    </Select>
    {error && <FormHelperText>{error}</FormHelperText>}
  </FormControl>
);

const ThumbnailUpload = ({ thumbnailPreview, onThumbnailChange, onClearThumbnail, error }) => (
  <FormControl fullWidth error={Boolean(error)}>
    <Typography variant="subtitle2" sx={labelStyles}>
      Thumbnail <RequiredStar />
    </Typography>
    {!thumbnailPreview ? (
      <Paper variant="outlined" component="label" htmlFor="thumbnail" sx={uploadPaperStyles}>
        <Avatar sx={uploadAvatarStyles}>
          <UploadIcon />
        </Avatar>
        <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
          Click or drag to upload
        </Typography>
        <Typography variant="caption" color="text.secondary">
          PNG, JPG, GIF up to 10MB
        </Typography>
        <Input
          id="thumbnail"
          type="file"
          inputProps={{ accept: 'image/*' }}
          sx={{ display: 'none' }}
          onChange={onThumbnailChange}
        />
      </Paper>
    ) : (
      <Box sx={thumbnailPreviewStyles}>
        <Box 
          component="img" 
          src={thumbnailPreview} 
          alt="Thumbnail Preview" 
          sx={thumbnailImageStyles} 
        />
        <IconButton 
          onClick={onClearThumbnail} 
          sx={removeThumbnailButtonStyles}
          aria-label="Remove thumbnail"
        >
          <CloseIcon />
        </IconButton>
      </Box>
    )}
    {error && <FormHelperText>{error}</FormHelperText>}
  </FormControl>
);

const SubmitButton = ({ isSubmitting }) => (
  <Box sx={submitButtonContainerStyles}>
    <Button
      type="submit"
      variant="contained"
      disabled={isSubmitting}
      startIcon={isSubmitting ? <CircularProgress size={20} /> : <UploadIcon />}
      sx={submitButtonStyles}
      fullWidth
    >
      {isSubmitting ? 'Creating...' : 'Create Course & Upload Videos'}
    </Button>
  </Box>
);

const RequiredStar = () => <span style={{ color: 'red' }}>*</span>;

// Constants
const categories = [
  'Programming', 'Design', 'Business', 'Marketing', 'Photography',
  'Music', 'Health & Fitness', 'Personal Development', 'Other'
];

const initialFormState = {
  title: '',
  description: '',
  instructor: '',
  category: '',
  price: 0,
  thumbnail: '',
};

// Responsive styles
const mainContainerStyles = {
  display: 'flex',
  flexDirection: 'column',
  // minHeight: '100vh',
  backgroundColor: 'background.default'
};

const headerStyles = {
  width: '100%',
  maxWidth: 'lg',
  mx: 'auto',
  backgroundColor: 'background.paper',
  // borderBottom: '1px solid',
  // borderColor: 'divider',
  // boxShadow: 1,
  py: 2
};

const headerContentStyles = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start'
};

const headerTextStyles = {
  width: '100%'
};

const formContainerStyles = {
  py: 4,
  flex: 1
};

const paperStyles = {
  borderRadius: 2,
  overflow: 'hidden',
  width: '100%'
};

const formStyles = {
  p: { xs: 2, sm: 3, md: 4 },
  display: 'flex',
  flexDirection: 'column',
  gap: 3
};

const gridContainerStyles = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
  gap: 3
};

const labelStyles = {
  fontWeight: 'medium',
  color: 'text.primary',
  mb: 1
};

const uploadPaperStyles = {
  p: { xs: 2, sm: 3, md: 4 },
  border: 2,
  borderStyle: 'dashed',
  borderColor: 'divider',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  textAlign: 'center',
  '&:hover': { borderColor: 'primary.main' }
};

const uploadAvatarStyles = {
  bgcolor: 'primary.light',
  color: 'primary.main',
  mb: 1
};

const thumbnailPreviewStyles = {
  position: 'relative',
  width: '100%'
};

const thumbnailImageStyles = {
  width: '100%',
  height: { xs: 200, sm: 300 },
  objectFit: 'cover',
  borderRadius: 2
};

const removeThumbnailButtonStyles = {
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: 'background.paper',
  '&:hover': { color: 'error.main' }
};

const submitButtonContainerStyles = {
  width: '100%',
  pt: 2
};

const submitButtonStyles = {
  background: 'linear-gradient(to right, #2563eb, #4f46e5)',
  '&:hover': { background: 'linear-gradient(to right, #1d4ed8, #4338ca)' },
  width: '100%',
  py: 1.5
};

export default CourseForm;