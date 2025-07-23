import React from 'react';
import { Box, Typography, Chip, Stack, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


function formatDuration(mins) {
    const hrs = String(Math.floor(mins / 60)).padStart(2, '0');
    const minutes = String(mins % 60).padStart(2, '0');
    return `${hrs}:${minutes}:00`;
}



function TestCard({ test, role }) {
    const navigate = useNavigate();
    // console.log('the role is: ', role)
    const handleOnClick = () => {

        toast.warning('This section is under development')
        // if (test.completed) {
        //     navigate(`/assessments/review/${test._id}`)
        // } else {
        //     navigate(`/assessments/start-test/${test._id}`)
        // }
    }

    const handleOnAdminClick = () => {

        navigate(`/assessments/test-submitted`)

    }


    return (
        <Box border={1} borderColor="grey.300" borderRadius={5} p={2} mb={0} sx={{ color: 'black', width: 550, background: 'white', height: 200 }}>
            {/* Top section */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight="bold">{test.name}</Typography>

                <Stack spacing={1} direction="row" alignItems="center">
                    {test.compulsory && <Chip label="Mandatory" color="error" size="small" />}
                    {role !== 'instructor' ? <Chip
                        label={test.completed ? "Completed" : "Not Attempted"}
                        color={test.completed ? "success" : "warning"}
                        size="small"
                    /> : ''}
                </Stack>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                    {/* Duration and Due Date */}
                    <Typography variant="body2" mt={1}>
                        Duration: <strong>{formatDuration(test.duration)}</strong>
                    </Typography>
                    <Typography variant="body2" mb={1}>
                        Complete test by: <strong>{test.dueDate}</strong>
                    </Typography>

                </Box>

                <Box mt={1}>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        {test.topics.map((topic, idx) => (
                            <Chip
                                key={idx}
                                label={topic}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: '0.75rem', color: 'gray' }}
                            />
                        ))}
                    </Stack>
                </Box>
            </Box>



            {/* Topics */}


            {/* Type and Questions */}
            <Typography variant="body2" mb={1}>
                Type:{" "}
                <Box component="span" sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {test.type.toUpperCase()}
                </Box>
                {" "} | Questions:{" "}
                <Box component="span" sx={{ fontWeight: 'bold' }}>
                    {test.totalQuestions}
                </Box>
            </Typography>


            {/* Description */}
            <Typography variant="body2" sx={{
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }}>
                {test.description}
            </Typography>



            {role === 'employee' && <Button
                variant="contained"
                sx={{
                    backgroundColor: test.completed ? '#6c757d' : '#007BFF',
                    '&:hover': {
                        backgroundColor: test.completed ? '#5a6268' : '#0056b3',
                    },
                    width: '100%',
                    color: '#ffffff',
                    mt: 1,
                    fontWeight: 'bold',
                    textTransform: 'none', // keeps text casing natural
                    borderRadius: 2
                }}
                onClick={handleOnClick}
            >
                {test.completed ? 'Review Test' : 'Start Test'}
            </Button>}

            {role === 'instructor' && <Button
                variant="contained"
                sx={{
                    backgroundColor: '#007BFF',
                    '&:hover': {
                        backgroundColor: '#0056b3',
                    },
                    width: '100%',
                    color: '#ffffff',
                    mt: 1,
                    fontWeight: 'bold',
                    textTransform: 'none', // keeps text casing natural
                    borderRadius: 2
                }}
                onClick={handleOnAdminClick}
            >
                View Questions
            </Button>}

        </Box>
    );
}

export default TestCard;
