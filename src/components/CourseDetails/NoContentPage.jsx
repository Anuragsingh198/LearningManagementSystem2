import React from 'react';
import { Box, Typography, styled } from '@mui/material';

const NoContentPage = ({ 
  title = "Nothing to display", 
  description = "There is no content available at the moment.",
  icon = null 
}) => {
  return (
    <StyledContainer>
      <Box className="content-wrapper">
        {icon && <Box className="icon-wrapper">{icon}</Box>}
        <Typography variant="h5" className="title">
          {title}
        </Typography>
        <Typography variant="body1" className="description">
          {description}
        </Typography>
      </Box>
    </StyledContainer>
  );
};

const StyledContainer = styled(Box)(({ theme }) => ({

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '60vh',
  textAlign: 'center',
  padding: theme.spacing(4),
  
  '.content-wrapper': {
    maxWidth: '500px',
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
  },
  
  '.icon-wrapper': {
    fontSize: '4rem',
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
  },
  
  '.title': {
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
  
  '.description': {
    color: theme.palette.text.secondary,
    lineHeight: 1.6,
  },
}));

export default NoContentPage;