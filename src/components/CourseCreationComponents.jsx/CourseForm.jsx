import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourseContext } from '../../context/contextFiles/CourseContext';
import { createCourseAction } from '../../context/Actions/courseActions';
import {
  Box, Typography, Button, TextField, Select, MenuItem,
  FormControl, CircularProgress, Avatar, Input,
  FormHelperText, Container, Switch, IconButton
} from '@mui/material';
import { Upload, Image, X } from 'lucide-react'; // Lucide icons

const HeaderForm = () => (
  <Box sx={headerStyles}>
    <Container maxWidth="lg">
      <Typography variant="h4" sx={headerTitleStyles}>
        Create New Course
      </Typography>
      <Typography variant="body2" sx={headerSubtitleStyles}>
        Fill in the details to create your course and upload videos.
      </Typography>
    </Container>
  </Box>
);

const CourseForm = () => {
  const navigate = useNavigate();
  const { state: { myCourses }, dispatch } = useCourseContext();
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.courseDuration.trim()) newErrors.courseDuration = 'Course Duration is required';
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
        const value = formData[key];
        formDataToSend.append(key, typeof value === 'boolean' ? String(value) : value);
      }
      const newCourse = await createCourseAction(formDataToSend, myCourses, dispatch);
      if (newCourse) navigate(`/teacher/upload-video/${newCourse._id}`);
    } catch (error) {
      console.error('Failed to create course:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={pageStyles}>
      <HeaderForm />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box component="form" onSubmit={handleSubmit} sx={formStyles}>
          <FormControl sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={labelStyles}>
              Compulsory Course?
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2">No</Typography>
              <Switch
                checked={formData.compulsory}
                onChange={(e) => setFormData(prev => ({ ...prev, compulsory: e.target.checked }))}
                color="primary"
              />
              <Typography variant="body2">Yes</Typography>
            </Box>
          </FormControl>

          <Box sx={gridContainerStyles}>
            <FormField label="Title" name="title" value={formData.title} error={errors.title} onChange={handleInputChange} />
            <FormField label="Instructor" name="instructor" value={formData.instructor} error={errors.instructor} onChange={handleInputChange} />
            <CategorySelect value={formData.category} onChange={handleInputChange} error={errors.category} />
          </Box>

          <Box sx={gridThreeStyles}>
            <FormField label="Course Duration (In Days)" name="courseDuration" type="number" value={formData.courseDuration} error={errors.courseDuration} onChange={handleInputChange} />
            <Box sx={{ gridColumn: 'span 2' }}>
              <FormField label="Remark" name="remark" required={false} value={formData.remark} onChange={handleInputChange} />
            </Box>
          </Box>

          <FormField label="Description" name="description" value={formData.description} error={errors.description} onChange={handleInputChange} multiline rows={4} />

          <ThumbnailUpload
            thumbnailPreview={thumbnailPreview}
            onThumbnailChange={handleThumbnailChange}
            onClearThumbnail={() => setThumbnailPreview(null)}
            error={errors.thumbnail}
          />

          <SubmitButton isSubmitting={isSubmitting} />
        </Box>
      </Container>
    </Box>
  );
};

const FormField = ({ label, name, value, error, onChange, multiline, rows, required = true, type = 'text' }) => (
  <FormControl fullWidth>
    <Typography variant="subtitle2" sx={labelStyles}>
      {label} {required && <RequiredStar />}
    </Typography>
    <TextField
      name={name}
      value={value}
      onChange={onChange}
      error={Boolean(error)}
      helperText={error}
      variant="outlined"
      type={type}
      fullWidth
      multiline={multiline}
      rows={rows}
      inputProps={{
        inputMode: type === 'number' ? 'numeric' : undefined,
        pattern: type === 'number' ? '[0-9]*' : undefined,
      }}
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
      <Box
        component="label"
        htmlFor="thumbnail"
        sx={uploadBoxStyles}
      >
        <Avatar sx={uploadAvatarStyles}>
          <Image size={20} />
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
      </Box>
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
          <X size={16} />
        </IconButton>
      </Box>
    )}
    {error && <FormHelperText>{error}</FormHelperText>}
  </FormControl>
);

const SubmitButton = ({ isSubmitting }) => (
  <Box sx={{ pt: 2 }}>
    <Button
      type="submit"
      variant="contained"
      disabled={isSubmitting}
      startIcon={isSubmitting ? <CircularProgress size={20} /> : <Upload size={18} />}
      sx={submitButtonStyles}
      fullWidth
    >
      {isSubmitting ? 'Creating...' : 'Create Course & Upload Videos'}
    </Button>
  </Box>
);

const RequiredStar = () => <span style={{ color: 'red' }}>*</span>;

const categories = [
  'Programming', 'Design', 'Business', 'Marketing', 'Photography',
  'Music', 'Health & Fitness', 'Personal Development', 'Other'
];

const initialFormState = {
  title: '',
  description: '',
  instructor: '',
  category: '',
  courseDuration: '',
  remark: '',
  thumbnail: '',
  compulsory: false
};

// ---------------- STYLES ----------------
const pageStyles = {
  backgroundColor: '#fff',
  minHeight: '100vh',
  color: 'rgba(0,0,0,0.87)'
};

const headerStyles = {
  borderBottom: '1px solid #e0e0e0',
  py: 3,
  backgroundColor: '#fff'
};

const headerTitleStyles = {
  fontWeight: 600,
  color: 'rgba(0,0,0,0.87)'
};

const headerSubtitleStyles = {
  color: 'rgba(0,0,0,0.6)'
};

const formStyles = {
  display: 'flex',
  flexDirection: 'column',
  gap: 3
};

const gridContainerStyles = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
  gap: 3
};

const gridThreeStyles = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 3
};

const labelStyles = {
  fontWeight: 600,
  color: 'rgba(0,0,0,0.87)',
  mb: 1
};

const uploadBoxStyles = {
  p: { xs: 2, sm: 3 },
  border: '2px dashed #cbd5e0',
  borderRadius: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: '#fafafa',
  '&:hover': { borderColor: '#1976d2' }
};

const uploadAvatarStyles = {
  bgcolor: '#e3f2fd',
  color: '#1976d2',
  mb: 1
};

const thumbnailPreviewStyles = {
  position: 'relative',
  width: '100%',
  borderRadius: 1,
  overflow: 'hidden'
};

const thumbnailImageStyles = {
  width: '100%',
  height: { xs: 200, sm: 300 },
  objectFit: 'cover'
};

const removeThumbnailButtonStyles = {
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: 'rgba(255,255,255,0.85)',
  '&:hover': { color: 'error.main' }
};

const submitButtonStyles = {
  backgroundColor: '#1976d2',
  fontWeight: 'bold',
  py: 1.5,
  textTransform: 'none',
  fontSize: '1rem',
  '&:hover': {
    backgroundColor: '#1565c0'
  }
};

export default CourseForm;
