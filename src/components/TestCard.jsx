import React from 'react';
import { Box, Typography, Chip, Stack, Button } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCourseContext } from '../context/contextFiles/CourseContext';
import { useAssignmentContext } from '../context/contextFiles/assignmentContext';
import { reviewAssignment } from '../context/Actions/AssignmentActions';


function formatDuration(mins) {
    const hrs = String(Math.floor(mins / 60)).padStart(2, '0');
    const minutes = String(mins % 60).padStart(2, '0');
    return `${hrs}:${minutes}:00`;
}



function TestCard({ test, role }) {
    const navigate = useNavigate();
    const { id } = useParams()
    const assessmentId = id

    const {state: {}, dispatch} = useAssignmentContext(); 
    // console.log('the test is: ', test)
    // console.log('the partial test data from context is in testcard: ', currentAssessment)

    const handleOnClick = async () => {        
        if (test.attempted) {
            // fetch attempted test details
            await reviewAssignment(dispatch, {assessmentId: test._id});
            navigate(`/assessments/review/${test._id}`)
        } else {
             dispatch({
        type: "SET_CURRENT_ASSESSMENT",
        payload: test
      });
            navigate(`/assessments/start-test/${test._id}`) // it will go to <TestStartPage/>
        }

    }

    const handleOnAdminClick = () => {

        navigate(`/assessments/review-admin`)

    }


    return (
        <Box border={1} borderColor="grey.300" borderRadius={5} p={2} mb={0} sx={{ color: 'black', width: 550, background: 'white', height: 200 }}>
            {/* Top section */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight="bold">{test.title}</Typography>

                <Stack spacing={1} direction="row" alignItems="center">
                    {test.isMandatory && <Chip label="Mandatory" color="error" size="small" />}
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
                    {/* <Typography variant="body2" mb={1}>
                        Complete test by: <strong>{test.dueDate}</strong>
                    </Typography> */}

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
                    {test.testType.toUpperCase()}
                </Box>
                {" "} | Questions:{" "}
                <Box component="span" sx={{ fontWeight: 'bold' }}>
                    {test.numberOfQuestions}
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
                    backgroundColor: test.attempted ? '#6c757d' : '#007BFF',
                    '&:hover': {
                        backgroundColor: test.attempted ? '#5a6268' : '#0056b3',
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
                {test.attempted ? 'Review Test' : 'Start Test'}
            </Button>}

             {/* {role === 'employee' && <Button
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
                onClick={handleOnClick}
            >
                { test.attempted ? 'Review Test' : 'Start Test'}
            </Button>} */}


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
