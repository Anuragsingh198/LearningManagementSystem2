import {
    Box,
    Typography,
    Button,
    Paper,
    Divider,
    LinearProgress,
    Grid,
    Chip,
    Avatar
} from '@mui/material';
import { Circle, CheckCircle } from '@mui/icons-material';

export const QuizContent = ({
    questions,
    currentQuestion,
    handleAnswerSelect,
    setCurrentQuestion
}) => {

    const currentQ = questions[currentQuestion];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, position: 'absolute', overflowY: 'auto', width: '100%', top:'10px', height:' 80%' }}>
            <Paper sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 3 }}>
                <Typography variant="h6" fontWeight="semibold" mb={2}>
                    Quiz Statistics
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={4}>
                        <Box textAlign="center">
                            <Typography variant="h4" fontWeight="bold" color="success.main">
                                {questions.filter(q => q.answered !== null).length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Answered
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <Box textAlign="center">
                            <Typography variant="h4" fontWeight="bold" color="warning.main">
                                {questions.filter(q => q.answered === null).length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Remaining
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={4}>
                        <Box textAlign="center">
                            <Typography variant="h4" fontWeight="bold" color="primary.main">
                                {questions.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Total
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            <Paper sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                    <Typography variant="h4" fontWeight="bold">Quiz Assessment</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Question {currentQuestion + 1} of {questions.length}
                    </Typography>
                </Box>

                <Box mb={4}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" fontWeight="medium" color="text.secondary">
                            Progress
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={((currentQuestion + 1) / questions.length) * 100}
                        sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'grey.200',
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                backgroundColor: 'primary.main'
                            }
                        }}
                    />
                </Box>

                <Paper sx={{ backgroundColor: 'grey.50', borderRadius: 3, p: 3, mb: 3 }}>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2}>
                        <Typography variant="h6" fontWeight="semibold">
                            Question {currentQuestion + 1}
                        </Typography>
                        <Chip label="5 marks" sx={{ backgroundColor: 'primary.light', color: 'primary.dark' }} />
                    </Box>
                    <Typography variant="body1" color="text.primary" mb={3}>
                        {currentQ.question}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {currentQ.options.map((option, index) => (
                            <Button
                                key={index}
                                onClick={() => handleAnswerSelect(currentQuestion, index)}
                                fullWidth
                                sx={{
                                    justifyContent: 'flex-start',
                                    textAlign: 'left',
                                    p: 2,
                                    border: '2px solid',
                                    borderColor: currentQ.answered === index ? 'primary.main' : 'grey.300',
                                    backgroundColor: currentQ.answered === index ? 'primary.light' : 'background.paper',
                                    '&:hover': {
                                        borderColor: currentQ.answered === index ? 'primary.main' : 'grey.400',
                                        backgroundColor: currentQ.answered === index ? 'primary.light' : 'grey.100'
                                    },
                                    transition: 'all 0.3s'
                                }}
                            >
                                <Box display="flex" alignItems="center" gap={2}>
                                    <Avatar sx={{
                                        width: 24,
                                        height: 24,
                                        border: '2px solid',
                                        borderColor: currentQ.answered === index ? 'primary.main' : 'grey.400',
                                        backgroundColor: currentQ.answered === index ? 'primary.main' : 'transparent'
                                    }}>
                                        {currentQ.answered === index && (
                                            <Box sx={{ width: 8, height: 8, backgroundColor: 'white', borderRadius: '50%' }} />
                                        )}
                                    </Avatar>
                                    <Typography color="text.primary">{option}</Typography>
                                </Box>
                            </Button>
                        ))}
                    </Box>
                </Paper>

                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Button
                        onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                        disabled={currentQuestion === 0}
                        variant="outlined"
                        sx={{
                            color: 'text.primary',
                            borderColor: 'grey.300',
                            '&:hover': {
                                backgroundColor: 'grey.50',
                                borderColor: 'grey.400'
                            }
                        }}
                    >
                        Previous
                    </Button>

                    <Box display="flex" gap={1}>
                        <Button
                            disabled={currentQ.answered === null}
                            variant="contained"
                            color="success"
                            sx={{
                                '&:hover': {
                                    backgroundColor: 'success.dark'
                                }
                            }}
                        >
                            Submit Response
                        </Button>

                        {currentQuestion < questions.length - 1 && (
                            <Button
                                onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                                variant="contained"
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'primary.dark'
                                    }
                                }}
                            >
                                Next
                            </Button>
                        )}
                    </Box>
                </Box>
            </Paper>


        </Box>
    );
};