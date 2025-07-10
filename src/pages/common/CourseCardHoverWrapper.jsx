import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, Paper, Button, Chip } from '@mui/material';

const CourseCardHoverWrapper = ({ course, children }) => {
    const wrapperRef = useRef(null);
    const timeoutRef = useRef(null); // ← for delayed hiding
    const [hovered, setHovered] = useState(false);
    const [popupPosition, setPopupPosition] = useState('right');
    const [externalHoverOff, setExternalHoverOff] = useState(false);
    const testBool = true;
    const handleMouseEnter = () => {
        clearTimeout(timeoutRef.current); // cancel pending hide
        const rect = wrapperRef.current.getBoundingClientRect();
        const leftDistance = rect.left;
        const rightDistance = window.innerWidth - rect.right;

        setPopupPosition(leftDistance < 250 ? 'right' : rightDistance < 250 ? 'left' : 'right');
        setHovered(true);
    };

    const handleMouseLeave = () => {
        // Delay hiding the popup
        timeoutRef.current = setTimeout(() => {
            setHovered(false);
        }, 100); // 200ms delay is enough for most hover transitions
    };

    useEffect(() => {
        return () => clearTimeout(timeoutRef.current); // Cleanup on unmount
    }, []);

    return (
        <Box
            ref={wrapperRef}
            sx={{ position: 'relative', display: 'inline-block' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            
        >
            <Box sx={{ display: 'inline-block' }}>
                {React.cloneElement(children, {
                    onHoverDisablePopup: () => setExternalHoverOff(true),
                    onHoverEnablePopup: () => setExternalHoverOff(false),
                })}
            </Box>

            {
                // testBool
                hovered 
                && !externalHoverOff
                && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            [popupPosition]: -355, // distance from card
                            zIndex: 10,
                            width: 340,
                        }}
                    >
                        {/* Triangle Arrow */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                [popupPosition === 'right' ? 'left' : 'right']: -10,
                                width: 0,
                                height: 0,
                                borderTop: '10px solid transparent',
                                borderBottom: '10px solid transparent',
                                ...(popupPosition === 'right'
                                    ? { borderRight: '10px solid white' }
                                    : { borderLeft: '10px solid white' }),
                            }}
                        />

                        <Paper
                            elevation={4}
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                backgroundColor: 'white',
                                boxShadow: 6,
                            }}
                        >
                            <Typography variant="subtitle1" fontWeight={800} >
                                {course.title}
                            </Typography>

                                 <Typography variant="body2" color="text.secondary">
                                <span style={{ fontWeight: 'bold', marginRight: 3, fontSize: '16px' }}>
                                    Duration:
                                </span>
                               {course.courseDuration} days
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                <span style={{ fontWeight: 'bold', marginRight: 3, fontSize: '16px' }}>
                                    Course Instructor:
                                </span>
                                {course.instructorName || course.instructor?.name || 'Instructor'}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    mt: 1,
                                    maxHeight: 220,
                                    p: 1,            // Adjust height as needed
                                    borderRadius: 2,
                                    overflowY: 'auto',
                                    whiteSpace: 'normal',
                                    background: '#f0f0f0',
                                    pr: 1,
                                    '&::-webkit-scrollbar': {
                                        width: '4px',
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        backgroundColor: '#ccc',
                                        borderRadius: '4px',
                                    },
                                    '&::-webkit-scrollbar-track': {
                                        backgroundColor: '#f0f0f0',
                                    },
                                }}
                            >
                                <span style={{ fontWeight: 'bold', marginRight: 3, fontSize: '16px' }}>
                                    Description:
                                </span>

                                {course.description || 'No description available'}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    mt: 1,
                                    maxHeight: 80,
                                    p: 1,            // Adjust height as needed
                                    borderRadius: 2,
                                    overflowY: 'auto',
                                    whiteSpace: 'normal',
                                    background: '#f0f0f0',
                                    pr: 1,
                                    '&::-webkit-scrollbar': {
                                        width: '4px',
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        backgroundColor: '#ccc',
                                        borderRadius: '4px',
                                    },
                                    '&::-webkit-scrollbar-track': {
                                        backgroundColor: '#f0f0f0',
                                    },
                                }}
                            >
                                <span style={{ fontWeight: 'bold', marginRight: 3, fontSize: '16px' }}>
                                    Remark:
                                </span>

                                {course.remark || 'No Remark available'}
                            </Typography>


                            {course.category && (
                                <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
                                    <span style={{ fontWeight: 'bold', marginRight: 3 }}>
                                        Category:
                                    </span>
                                    {course.category}
                                </Typography>
                            )}

                            {/* <Button
              variant="contained"
              size="small"
              fullWidth
              sx={{
                mt: 2,
                textTransform: 'none',
                fontWeight: 600,
                backgroundColor: '#2563eb',
                '&:hover': {
                  backgroundColor: '#1e40af',
                },
              }}
            >
              Enroll
            </Button> */}
                        </Paper>
                    </Box>
                )}
        </Box>
    );
};

export default CourseCardHoverWrapper;
