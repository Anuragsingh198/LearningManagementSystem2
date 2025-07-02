import { useEffect, useMemo } from 'react';
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

function QuizHistory({ questions, moduleId, currentTest }) {
    const { state: { loading, courseProgress }, dispatch } = useCourseContext();
    const { state: { user } } = useAuth();
    const { courseId } = useParams();

    const totalQuestions = questions?.length || 2; // Avoid division by 0

    // useEffect(() => {
    //     const fetchdata = async () => {
    //         await getCourseProgress(courseId, user._id, dispatch);
    //     };
    //     if (user?._id && courseId) fetchdata();
    // }, [user?._id, courseId]);

    // console.log('questions are', questions)
    // console.log('moduleId is', moduleId)
    // console.log('currentTest is', currentTest)


    const currentTestStatus = useMemo(() => {
        if (!courseProgress?.moduleProgress) return null;

        const currentModule = courseProgress.moduleProgress.find(
            (mod) => mod.module === moduleId
        );

        if (!currentModule || !currentModule.testStatus?.length) return null;

        return currentModule.testStatus[currentTest] || null;
    }, [courseProgress, moduleId, currentTest]);

    const percentage = useMemo(() => {
        if (
            currentTestStatus &&
            currentTestStatus.retakeCount > 0 &&
            typeof currentTestStatus.marksScored === 'number'
        ) {
            return Math.round((currentTestStatus.marksScored / totalQuestions) * 100);
        }
        return null;
    }, [currentTestStatus, totalQuestions]);

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
                Assessment History
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography gutterBottom>
                The Assessment only needs to be passed once, though multiple attempts are permitted.
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {!currentTestStatus ? (
                <Typography>No test history available for this module/test index.</Typography>
            ) : (
                <Box sx={{ mb: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <Typography>Status:</Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <Typography color={currentTestStatus.isCompleted ? "green" : "red"}>
                                {currentTestStatus.isCompleted
                                    ? "Passed"
                                    : currentTestStatus.retakeCount === 0
                                        ? "-"
                                        : "Failed"}
                            </Typography>

                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Typography>No. of Attempts:</Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <Typography>{currentTestStatus.retakeCount}</Typography>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Typography>Score:</Typography>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <Typography>
                                {percentage !== null ? `${percentage}%` : "Nil"}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            )}
        </Box>
    );
}

export default QuizHistory;
