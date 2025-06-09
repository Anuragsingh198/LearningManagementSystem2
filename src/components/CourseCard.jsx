// CourseCard.js
import { 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  Stack, 
  Rating,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";


export const CourseCard = ({ course }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Card sx={{ 
      display: 'flex',
      flexDirection: { xs: 'column', sm: 'row' },
      minWidth: '30%',
    //   maxWidth: { xs: '100%', sm: 800 },
      mb: 3,
      borderRadius: 3,
      boxShadow: 2,
      overflow: 'hidden',
      transition: 'transform 0.3s, box-shadow 0.3s',
      minHeight: { xs: 300, sm: 180 },
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: 4
      }
    }}>
      <CardMedia
        component="img"
        sx={{
          width: { xs: '100%', sm: 120 },
          height: { xs: 120, sm: '100%' },
          minHeight: { sm: 180 },
          objectFit: 'cover'
        }}
        image={course.image}
        alt={course.title}
      />
      
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        flexGrow: 1,
        position: 'relative',
        minHeight: { xs: 140, sm: 180 },
      }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            {course.title}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" paragraph sx={{ 
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {course.description}
          </Typography>
          
          <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap', gap: 1 }}>
            {course.categories?.map((category, index) => (
              <Chip 
                key={index} 
                label={category} 
                size="small" 
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating 
              value={course.rating || 0} 
              precision={0.5} 
              readOnly 
              size="small"
            />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              ({course.reviews || 0} reviews)
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1
          }}>
            <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>
              {course.price ? `$${course.price}` : 'Free'}
            </Typography>
            
            <Typography variant="caption" color="text.secondary">
              {course.students} students enrolled
            </Typography>
          </Box>
        </CardContent>
        
        {!isSmallScreen && (
          <Box sx={{ 
            position: 'absolute', 
            top: 8, 
            right: 8,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <IconButton aria-label="add to favorites" size="small">
              <FavoriteBorderIcon fontSize="small" />
            </IconButton>
            <IconButton aria-label="share" size="small">
              <ShareIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>
    </Card>
  );
};