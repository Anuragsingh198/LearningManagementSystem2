import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Users, Calendar } from 'lucide-react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  styled
} from '@mui/material';

const StyledCard = styled(Card)({
  backgroundColor: 'white',
  borderRadius: '12px',
  minWidth:'400px',
  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  border: '1px solid #f3f4f6',
  '&:hover': {
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    borderColor: '#dbeafe'
  }
});

const MediaContainer = styled(Box)({
  position: 'relative',
  height: '192px',
  overflow: 'hidden',
  '&:hover img': {
    transform: 'scale(1.05)'
  }
});

const StyledImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  transition: 'transform 0.3s ease'
});

const GradientOverlay = styled(Box)({
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3), transparent)'
});

const TitleContainer = styled(Box)({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  padding: '16px'
});

const InfoRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  color: '#6b7280',
  fontSize: '0.875rem',
  marginBottom: '12px',
  gap: '16px'
});

const InfoItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  '& svg': {
    width: '16px',
    height: '16px',
    marginRight: '4px',
    color: '#9ca3af'
  }
});

const GradientButton = styled(Button)({
  background: 'linear-gradient(to right, #2563eb, #4f46e5)',
  color: 'white',
  fontWeight: 500,
  borderRadius: '8px',
  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  padding: '8px 16px',
  fontSize: '0.875rem',
  textTransform: 'none',
  '&:hover': {
    background: 'linear-gradient(to right, #1d4ed8, #4338ca)'
  }
});

const CourseCard = ({ course }) => {
  const navigate = useNavigate();
  console.log('this is  the  courser  from  courseCard : ' , course)
  const handleUploadClick = () => {
    
    navigate(`/teacher/upload-video/${course._id}`);
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(course.createdAt));

  return (
    <StyledCard>
      <MediaContainer>
        <StyledImage
          src={course.thumbnail || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
          alt={course.title}
        />
        <GradientOverlay />
        <TitleContainer>
          <Typography
            variant="h6"
            sx={{
              color: 'white',
              fontWeight: 'bold',
              lineHeight: '1.25',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {course.title}
          </Typography>
        </TitleContainer>
      </MediaContainer>

      <CardContent sx={{ padding: '20px' }}>
        <InfoRow>
          <InfoItem>
            <Users size={16} />
            <Typography variant="body2" component="span">
              {course.instructorName}
            </Typography>
          </InfoItem>
          <InfoItem>
            <Calendar size={16} />
            <Typography variant="body2" component="span">
              {formattedDate}
            </Typography>
          </InfoItem>
        </InfoRow>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            marginBottom: '16px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {course.description || "No description provided"}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <GradientButton
            onClick={handleUploadClick}
            startIcon={<Video size={16} />}
          >
            Upload Videos
          </GradientButton>
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default CourseCard;