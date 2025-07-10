import  React from 'react'
export const NoVideosFound = () => {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width:'100%',
            textAlign: 'center',
            p: 4,
            color: 'text.secondary'
        }}>
            <VideoIcon sx={{ fontSize: 80, mb: 2, color: 'primary.main' }} />
            <Typography variant="h4" gutterBottom>
                No Content Found
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: '500px', mb: 3 }}>
                We couldn't find any Content for this course. Please check back later or contact support if you believe this is an error.
            </Typography>
            <Button variant="contained" color="primary">
                Back to Courses
            </Button>
        </Box>
    );
};
