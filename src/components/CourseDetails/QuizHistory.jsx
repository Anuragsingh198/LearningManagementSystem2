import { useEffect } from 'react';
import {
    Box,
    Typography,
    Divider,
    Grid
} from '@mui/material';
import { useCourseContext } from '../../context/contextFiles/CourseContext';
import { useParams } from "react-router-dom";
import { useAuth } from '../../context/contextFiles/AuthContext';
import { getCourseProgress } from '../../context/Actions/courseActions';

function QuizHistory({ questions }) {
    const { state: { loading, courseProgress }, dispatch } = useCourseContext();
    const { state: { user } } = useAuth();
    const { courseId } = useParams();

    const totalQuestions = questions?.length || 2; // Avoid division by 0

    // console.log('the total number of questions are: ', questions)

    useEffect(() => {
        const fetchdata = async () => {
            await getCourseProgress(courseId, user._id, dispatch);
        };
        if (user?._id && courseId) fetchdata();
    }, [user?._id, courseId]);

    const testStatuses =
        courseProgress?.moduleProgress?.flatMap((mod) => mod.testStatus || []) || [];

    return (
        <Box
            sx={{
                width: '100%',
                bgcolor: 'background.paper',
                color: 'black',
                p: 2,
                mt: 2,
                border: '1px solid #ccc',
                borderRadius: 4,
                boxShadow: 1,
                height: 'fit-content'
            }}
        >
            <Typography variant="h6" gutterBottom>
                Quiz History
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography  gutterBottom>
                The quiz only needs to be passed once, though multiple attempts are permitted.
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {testStatuses.length === 0 ? (
                <Typography>No test history available.</Typography>
            ) : (
                testStatuses.map((test, index) => {
                    const percentage = test.retakeCount > 0
                        ? Math.round((test.marksScored / totalQuestions) * 100)
                        : null;

                    return (
                        <Box key={test._id || index} sx={{ mb: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <Typography>Status:</Typography>
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                    <Typography color={test.isCompleted ? "green" : "red"}>
                                        {test.isCompleted ? "Quiz Cleared" : "Not Cleared"}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Typography>Retake Count:</Typography>
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                    <Typography>{test.retakeCount}</Typography>
                                </Grid>

                                <Grid item xs={12} sm={4}>
                                    <Typography>Prior Test Percentage:</Typography>
                                </Grid>
                                <Grid item xs={12} sm={8}>
                                    <Typography>
                                        {percentage !== null ? `${percentage}%` : "Nil"}
                                    </Typography>
                                </Grid>
                            </Grid>
                            {index !== testStatuses.length - 1 && <Divider sx={{ my: 2 }} />}
                        </Box>
                    );
                })
            )}
        </Box>
    );
}

export default QuizHistory;
