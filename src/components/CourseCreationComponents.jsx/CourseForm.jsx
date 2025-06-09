import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourseContext } from '../../context/contextFiles/CourseContext';
import { createCourseAction } from '../../context/Actions/courseActions';
import {
  Box,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Paper,
  Divider,
  CircularProgress,
  Avatar,
  Input,
  InputAdornment,
  FormHelperText
} from '@mui/material';
import {
  Upload as UploadIcon,
  Close as CloseIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon
} from '@mui/icons-material';

const HeaderForm = () => (
  <Box
    sx={{
      position: 'fixed',
      top: '95px',
      width: '85%',
      zIndex: 20,
      backgroundColor: 'background.paper',
      borderBottom: '1px solid',
      borderColor: 'divider',
      boxShadow: 1,
      left: '265px'
    }}
  >
    <Box sx={{ maxWidth: '8xl', mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { md: 'center' }, justifyContent: { md: 'space-between' } }}>
        <Box sx={{ mb: { xs: 2, md: 0 } }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
            Create New Course
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Fill in the details to create your course and upload videos.
          </Typography>
        </Box>
      </Box>
    </Box>
  </Box>
);

const CourseForm = () => {
  const navigate = useNavigate();
  const { state: { courses }, dispatch } = useCourseContext();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    category: '',
    price: 0,
    thumbnail: '',
  });

  const [errors, setErrors] = useState({});
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.instructor.trim()) newErrors.instructor = 'Instructor is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (formData.price < 0) newErrors.price = 'Price cannot be negative';
    if (!thumbnailPreview) newErrors.thumbnail = 'Thumbnail is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  // const handleThumbnailChange = (e) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const previewUrl = URL.createObjectURL(file);
  //     setThumbnailPreview(previewUrl);
  //     setFormData({ ...formData, thumbnail: previewUrl });
  //     if (errors.thumbnail) setErrors({ ...errors, thumbnail: '' });
  //   }
  // };

const handleThumbnailChange = (e) => {
  const file = e.target.files?.[0];
  if (file) {
    const previewUrl = URL.createObjectURL(file);
    setThumbnailPreview(previewUrl);
    setFormData({ ...formData, thumbnail: file });  // store file object directly
    if (errors.thumbnail) setErrors({ ...errors, thumbnail: '' });
  }
};

  const clearThumbnail = () => {
    // if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    setThumbnailPreview(null);
    setFormData({ ...formData, thumbnail: '' });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;
  setIsSubmitting(true);

  try {
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('thumbnail', formData.thumbnail); // the file object

    const newCourse = await createCourseAction(formDataToSend, dispatch);

    if (newCourse) {
      setIsSubmitting(false);
      navigate(`/teacher/upload-video/${newCourse._id}`);
    }
  } catch (error) {
    console.error('Failed to create course:', error);
    setIsSubmitting(false);
  }
};
  const categories = [
    'Programming', 'Design', 'Business', 'Marketing', 'Photography',
    'Music', 'Health & Fitness', 'Personal Development', 'Other'
  ];

  return (
    <>
      <HeaderForm />
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', py: 3, px: { xs: 2, sm: 3, md: 4 }, width: '60%' , mt:'120px' , borderRadius: 5 }}>
        <Box sx={{ maxWidth: 'md', mx: 'auto' }}>
          <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Horizontal layout container */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
                {/* Title */}
                <FormControl fullWidth>
                  <InputLabel shrink htmlFor="title" sx={{ fontWeight: 'medium', color: 'text.primary', mb: 1 }}>
                    Title <span style={{ color: 'red' }}>*</span>
                  </InputLabel>
                  <TextField
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    error={Boolean(errors.title)}
                    helperText={errors.title}
                    placeholder="Course title"
                    variant="outlined"
                    fullWidth
                  />
                </FormControl>

                {/* Instructor */}
                <FormControl fullWidth>
                  <InputLabel shrink htmlFor="instructor" sx={{ fontWeight: 'medium', color: 'text.primary', mb: 1 }}>
                    Instructor <span style={{ color: 'red' }}>*</span>
                  </InputLabel>
                  <TextField
                    id="instructor"
                    name="instructor"
                    value={formData.instructor}
                    onChange={handleInputChange}
                    error={Boolean(errors.instructor)}
                    helperText={errors.instructor}
                    placeholder="Instructor name"
                    variant="outlined"
                    fullWidth
                  />
                </FormControl>

                {/* Category */}
                <FormControl fullWidth error={Boolean(errors.category)}>
                  <InputLabel shrink htmlFor="category" sx={{ fontWeight: 'medium', color: 'text.primary', mb: 1 }}>
                    Category <span style={{ color: 'red' }}>*</span>
                  </InputLabel>
                  <Select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    IconComponent={KeyboardArrowDownIcon}
                    displayEmpty
                    renderValue={(selected) => selected || 'Select a category'}
                    variant="outlined"
                  >
                    <MenuItem value="" disabled>Select a category</MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                  {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
                </FormControl>

                {/* Price (commented out as in original) */}
                {/* <FormControl fullWidth>
                  <InputLabel shrink htmlFor="price" sx={{ fontWeight: 'medium', color: 'text.primary', mb: 1 }}>
                    Price (USD)
                  </InputLabel>
                  <TextField
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    error={Boolean(errors.price)}
                    helperText={errors.price}
                    placeholder="0.00"
                    variant="outlined"
                    fullWidth
                    inputProps={{ min: "0", step: "0.01" }}
                  />
                </FormControl> */}
              </Box>

              {/* Description */}
              <FormControl fullWidth>
                <InputLabel shrink htmlFor="description" sx={{ fontWeight: 'medium', color: 'text.primary', mb: 1 }}>
                  Description <span style={{ color: 'red' }}>*</span>
                </InputLabel>
                <TextField
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  error={Boolean(errors.description)}
                  helperText={errors.description}
                  placeholder="Describe your course"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                />
              </FormControl>

              {/* Thumbnail Upload */}
              <FormControl fullWidth error={Boolean(errors.thumbnail)}>
                <InputLabel shrink sx={{ fontWeight: 'medium', color: 'text.primary', mb: 1 }}>
                  Thumbnail <span style={{ color: 'red' }}>*</span>
                </InputLabel>
                {!thumbnailPreview ? (
                  <Paper
                    variant="outlined"
                    component="label"
                    htmlFor="thumbnail"
                    sx={{
                      p: 4,
                      border: 2,
                      borderStyle: 'dashed',
                      borderColor: errors.thumbnail ? 'error.main' : 'divider',
                      backgroundColor: errors.thumbnail ? 'error.light' : 'background.paper',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: 'primary.main'
                      }
                    }}
                  >
                    <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main', mb: 1 }}>
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
                      onChange={handleThumbnailChange}
                    />
                  </Paper>
                ) : (
                  <Box sx={{ position: 'relative', '&:hover .thumbnail-remove-button': { opacity: 1 } }}>
                    <Box
                      component="img"
                      src={thumbnailPreview}
                      alt="Thumbnail Preview"
                      sx={{ height: 256, width: '100%', objectFit: 'cover', borderRadius: 2 }}
                    />
                    <IconButton
                      className="thumbnail-remove-button"
                      onClick={clearThumbnail}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        backgroundColor: 'background.paper',
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        '&:hover': { color: 'error.main' }
                      }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </Box>
                )}
                {errors.thumbnail && <FormHelperText>{errors.thumbnail}</FormHelperText>}
              </FormControl>

              {/* Submit */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  startIcon={
                    isSubmitting ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <UploadIcon />
                    )
                  }
                  sx={{
                    background: 'linear-gradient(to right, #2563eb, #4f46e5)',
                    '&:hover': {
                      background: 'linear-gradient(to right, #1d4ed8, #4338ca)'
                    }
                  }}
                >
                  {isSubmitting ? 'Creating...' : 'Create Course & Upload Videos'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default CourseForm;