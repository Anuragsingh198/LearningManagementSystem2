import React, { useState } from 'react';
import { Box, Typography, Chip, Stack, Button, Tooltip } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCourseContext } from '../context/contextFiles/CourseContext';
import { useAssignmentContext } from '../context/contextFiles/assignmentContext';
import { getAllResult, reviewAssignment } from '../context/Actions/AssignmentActions';

function formatDuration(mins) {
    const hrs = String(Math.floor(mins / 60)).padStart(2, '0');
    const minutes = String(mins % 60).padStart(2, '0');
    return `${hrs}:${minutes}:00`;
}

function TestCard({ test, role }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)


    const { state: {  }, dispatch } = useCourseContext();
    const { state: { }, dispatch: assignmentDispatch } = useAssignmentContext();
    // console.log('the test is: ', test)

    const handleOnClick = async () => {
        if (test.attempted) {
            // fetch attempted test details
            await reviewAssignment(assignmentDispatch, { assessmentId: test._id });
            navigate(`/assessments/review/${test._id}`)
        } else {
            dispatch({
                type: "SET_CURRENT_ASSESSMENT",
                payload: test,
            });
            navigate(`/assessments/start-test/${test._id}`);
        }
    };

    const handleOnAdminClick = () => {
        navigate(`/assessments/review-admin`);
    };

    const handleOnResultsClick = async () => {
        setLoading(true);
        dispatch({
                type: "SET_CURRENT_ASSESSMENT",
                payload: test,
            });
        const assessmentId = test._id;
        // here call the api , on success nvigate 
        const response = await getAllResult(assignmentDispatch, assessmentId)
        console.log('the the response is: ', response)
        setLoading(false)
        
        navigate(`/assessments/view-result`);

    }

    // === Description truncation logic ===
    const WORD_LIMIT = 13;
    const descriptionWords = test.description?.split(" ") || [];
    const isLong = descriptionWords.length > WORD_LIMIT;
    const shortDescription = isLong
        ? descriptionWords.slice(0, WORD_LIMIT).join(" ") + "..."
        : test.description;

    return (
        <Box
            border={1}
            borderColor="grey.300"
            borderRadius={1} // 4px
            p={3}
            mb={2}
            sx={{
                width: 550,
                background: '#FFFFFF',
                color: '#222',
            }}
        >
            {/* Top section */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#1976d2' }}>
                    {test.title}
                </Typography>

                <Stack spacing={1} direction="row" alignItems="center">
                    {test.isMandatory && (
                        <Chip
                            label="Mandatory"
                            size="small"
                            sx={{
                                borderRadius: '4px',
                                border: '1px solid #E57373',
                                backgroundColor: 'rgba(229,115,115,0.08)',
                                color: '#D32F2F',
                            }}
                        />
                    )}
                    {role !== 'instructor' && (
                        <Chip
                            label={test.attempted ? "Attempted" : "Not Attempted"}
                            size="small"
                            sx={{
                                borderRadius: '4px',
                                border: test.attempted ? '1px solid #81C784' : '1px solid #FFB74D',
                                backgroundColor: test.attempted
                                    ? 'rgba(129,199,132,0.1)'
                                    : 'rgba(255,183,77,0.1)',
                                color: test.attempted ? '#2E7D32' : '#EF6C00',
                            }}
                        />
                    )}
                </Stack>
            </Box>

            {/* Duration and Topics */}
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Box>
                    <Typography variant="body2" mb={1}>
                        Duration: <strong>{formatDuration(test.duration)}</strong>
                    </Typography>
                </Box>

                <Box>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        {test.topics.map((topic, idx) => (
                            <Chip
                                key={idx}
                                label={topic}
                                size="small"
                                variant="outlined"
                                sx={{
                                    fontSize: '0.75rem',
                                    borderRadius: '4px',
                                    borderColor: '#90A4AE',
                                    color: '#455A64',
                                    background: 'transparent',
                                }}
                            />
                        ))}
                    </Stack>
                </Box>
            </Box>

            {/* Type and Questions */}
            <Typography variant="body2" mb={1}>
                Type:{" "}
                <Box component="span" sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {test.testType.toUpperCase()}
                </Box>
                {" "} | Questions:{" "}
                <Box component="span" sx={{ fontWeight: 'bold' }}>
                    {test.numberOfQuestions}
                </Box>
            </Typography>

            {/* Description with tooltip */}
            <Tooltip
                title={isLong ? test.description : ""}
                arrow
                placement="bottom-end"
                slotProps={{
                    popper: {
                        sx: {
                            "& .MuiTooltip-tooltip": {
                                background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
                                color: "#fff",
                                fontSize: "0.9rem",
                                padding: "10px 14px",
                                borderRadius: "10px",
                                maxWidth: 320,
                                boxShadow: "0px 6px 18px rgba(0,0,0,0.2)",
                                lineHeight: 1.5,
                                letterSpacing: "0.3px",
                                fontWeight: 400,
                            },
                            "& .MuiTooltip-arrow": {
                                color: "#1976d2",
                            },
                        },
                    },
                }}
            >
                <Typography
                    variant="body2"
                    sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        mb: 2,
                        cursor: isLong ? 'pointer' : 'default',
                    }}
                >
                    {shortDescription}
                </Typography>
            </Tooltip>


            {/* Buttons */}
            {role === 'employee' && (
                <Button
                    variant={test.attempted ? 'outlined' : 'contained'}
                    fullWidth
                    disableElevation
                    onClick={handleOnClick}
                    sx={{
                        borderRadius: '4px',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        ...(test.attempted
                            ? {
                                // Review Test → outlined green + soft background
                                border: '1.5px solid #2ecc71',
                                color: '#2ecc71',
                                backgroundColor: 'rgba(46, 204, 113, 0.08)', // soft green background
                                '&:hover': {
                                    backgroundColor: 'rgba(46, 204, 113, 0.15)',
                                    border: '1.5px solid #2ecc71',
                                },
                                '&:active': {
                                    backgroundColor: 'rgba(46, 204, 113, 0.25)',
                                    border: '1.5px solid #2ecc71',
                                },
                                '&:disabled': {
                                    border: '1.5px solid #a5d6a7',
                                    color: '#a5d6a7',
                                    backgroundColor: 'rgba(165, 214, 167, 0.2)',
                                },
                            }
                            : {
                                // Start Test → filled blue
                                backgroundColor: '#1976d2',
                                color: '#fff',
                                '&:hover': {
                                    backgroundColor: '#1565c0',
                                },
                                '&:active': {
                                    backgroundColor: '#0d47a1',
                                },
                                '&:disabled': {
                                    backgroundColor: '#90CAF9',
                                    color: '#E3F2FD',
                                },
                                '&:focus': {
                                    outline: '2px solid #64B5F6',
                                    outlineOffset: '2px',
                                },
                            }),
                    }}
                >
                    {test.attempted ? 'Review Test' : 'Start Test'}
                </Button>

            )}

            {role === 'instructor' && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        disableElevation
                        onClick={handleOnAdminClick}
                        sx={{
                            flex: 1, // makes both buttons equal width
                            borderRadius: '4px',
                            textTransform: 'none',
                            fontWeight: 'bold',
                            backgroundColor: '#1976d2',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#1565c0',
                            },
                            '&:active': {
                                backgroundColor: '#0d47a1',
                            },
                            '&:disabled': {
                                backgroundColor: '#90CAF9',
                                color: '#E3F2FD',
                            },
                            '&:focus': {
                                outline: '2px solid #64B5F6',
                                outlineOffset: '2px',
                            },
                        }}
                    >
                        View Questions
                    </Button>

                    <Button
                        variant="contained"
                        disableElevation
                        onClick={handleOnResultsClick} // create this function
                        sx={{
                            flex: 1,
                            borderRadius: '4px',
                            textTransform: 'none',
                            fontWeight: 'bold',
                            backgroundColor: '#388e3c',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#2e7d32',
                            },
                            '&:active': {
                                backgroundColor: '#1b5e20',
                            },
                            '&:disabled': {
                                backgroundColor: '#A5D6A7',
                                color: '#E8F5E9',
                            },
                            '&:focus': {
                                outline: '2px solid #81C784',
                                outlineOffset: '2px',
                            },
                        }}
                    >
                        View Results
                    </Button>
                </Box>
            )}

        </Box>
    );
}

export default TestCard;
