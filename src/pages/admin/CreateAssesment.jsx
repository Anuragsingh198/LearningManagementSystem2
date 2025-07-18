import React, { useState, useEffect } from 'react';
import {
    Button,
    Card,
    CardHeader,
    CardContent,
    TextField,
    IconButton,
    FormControl,
    FormLabel,
    Radio,
    CircularProgress,
    Box,
    Tabs,
    Tab,
    Typography,

} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SendIcon from '@mui/icons-material/Send';
import { createModuleAction, getCourseById, getModulesByCourseId } from '../../context/Actions/courseActions';
import { useAuth } from '../../context/contextFiles/AuthContext';
import { useCourseContext } from '../../context/contextFiles/CourseContext';
import AdminQuestionPaper from './AdminQuestionPaper';


function CreateAssessment() {
    const { state: { modules }, dispatch } = useCourseContext() ;

    const [showModuleForm, setShowModuleForm] = useState(false);
    const [moduleData, setModuleData] = useState({
        title: '',
        description: '',
    });
    const [existingModules, setExistingModules] = useState([]);
    const [errors, setErrors] = useState({});
    const [course, setCourse] = useState(null);
    const [selectedModule, setSelectedModule] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeQuestion, setActiveQuestion] = useState(0);
    const [testTitle, setTestTitle] = useState('');
    const serverurl = import.meta.env.VITE_SERVER_URL;
    const [testDescription, setTestDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [isModalOpen, setisModalOpen] = useState(false)

    const { state: { user } } = useAuth();
    const role = user?.role;
    const token = user?.token;

    const [questions, setQuestions] = useState([
        {
            id: Date.now(),
            questionText: '',
            options: ['', '', '', ''],
            correctAnswer: '',
            type: 'mcq'
        }
    ]);

    const handleAddQuestion = () => {
        setQuestions([
            ...questions,
            {
                id: Date.now(),
                questionText: '',
                options: ['', '', '', ''],
                correctAnswer: '',
                type: 'mcq'
            }
        ]);
    };

    const handleDeleteQuestion = (id) => {
        if (questions.length > 1) {
            const questionIndex = questions.findIndex(q => q.id === id);
            const newQuestions = questions.filter(q => q.id !== id);

            setQuestions(newQuestions);

            // Adjust active question index
            if (activeQuestion === questionIndex) {
                // If we're deleting the currently active question
                if (questionIndex === newQuestions.length) {
                    // If it was the last question, move to the new last question
                    setActiveQuestion(newQuestions.length - 1);
                }
                // Otherwise, stay on the same index (which will now point to the next question)
            } else if (activeQuestion > questionIndex) {
                // If the active question is after the deleted one, decrement its index
                setActiveQuestion(activeQuestion - 1);
            }
        } else {
            alert("You need at least one question!");
        }
    };

    const closeModal = () => {
        setisModalOpen(false)
    }

    const handleQuestionChange = (id, value) => {
        setQuestions(questions.map(q =>
            q.id === id ? { ...q, questionText: value } : q
        ));
    };

    const handleOptionChange = (questionId, optionIndex, value) => {
        setQuestions(questions.map(q =>
            q.id === questionId
                ? {
                    ...q,
                    options: q.options.map((opt, idx) =>
                        idx === optionIndex ? value : opt
                    ),
                    // Clear correct answer if the selected option was modified
                    correctAnswer: q.correctAnswer === q.options[optionIndex] ? '' : q.correctAnswer
                }
                : q
        ));
    };

    const handleTabChange = (event, newValue) => {
        setActiveQuestion(newValue);
    };

    const handleCorrectAnswerChange = (questionId, value) => {
        setQuestions(questions.map(q =>
            q.id === questionId ? { ...q, correctAnswer: value } : q
        ));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if ( !testDescription || !testTitle) {
            alert("Please add Test Title and Description");
            return;
        }
        // Validate all questions have content and correct answers
        const isValid = questions.every(q =>
            q.questionText.trim() !== '' &&
            q.options.every(opt => opt.trim() !== '') &&
            q.correctAnswer !== '' &&
            q.options.includes(q.correctAnswer) // Ensure correct answer exists in options
        );

        if (isValid) {
            const submissionData = {
                title: testTitle,
                description: testDescription,
                module: selectedModule,
                questions: questions,
                

            };

            console.log('submission data is: ', submissionData)

            setisModalOpen(true);

            // try {
            //     setIsLoading(true);
            //     const response = await axios.post(
            //         `${serverurl}/api/courses/addtest`,
            //         { testData: submissionData },
            //         {
            //             headers: {
            //                 Authorization: `Bearer ${token}`
            //             }
            //         }
            //     )

            //     if (response.data.success) {
            //         setIsLoading(false)
            //         alert("Quiz submitted successfully!");
            //         setTestDescription('')
            //         setTestTitle('')
            //         setSelectedModule('');
            //         setActiveQuestion(0);
            //         setQuestions([{
            //             id: Date.now(),
            //             questionText: '',
            //             options: ['', '', '', ''],
            //             correctAnswer: ''
            //         }]);
            //     }
            // } catch (error) {
            //     console.error('question upload failed:', error?.response?.data || error.message);
            // }

        } else {
            alert("Please fill all fields and select correct answers for all questions!");
        }
    };

    const handleTitleAndDescriptionChange = (e) => {
        const { name, value } = e.target;

        if (name === 'testTitle') {
            setTestTitle(value);
        } else if (name === 'testDescription') {
            setTestDescription(value);
        }
    };

    const handleUploadAssessment = () => {
    console.log('Uploading assessment...');
    // your logic here
    closeModal(); // close after upload
  };


    return (
        <Box sx={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'background.default', p: 3, mt: 2, width: '96%', borderRadius: 10, border: '1px solid',
            borderColor: 'grey.300',
        }}>

            <Box sx={{ display: 'flex', width: '50%', flexDirection: 'column', justifyContent: 'space-evenly' }}>
                <TextField
                    fullWidth
                    label="Assessment Title"
                    id="testTitle"
                    name="testTitle"
                    value={testTitle}
                    onChange={handleTitleAndDescriptionChange}
                    margin="normal"
                    required
                    sx={{
                        mb: 2,
                        backgroundColor: 'white',
                        borderRadius: 1,
                        boxShadow: 1,
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#ccc',
                            },
                            '&:hover fieldset': {
                                borderColor: '#888',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#1976d2',
                            },
                        },
                    }}
                />
                <TextField
                    fullWidth
                    label="Assessment Description"
                    id="testDescription"
                    name="testDescription"
                    value={testDescription}
                    onChange={handleTitleAndDescriptionChange}
                    margin="normal"
                    required
                    sx={{
                        mb: 2,
                        backgroundColor: 'white',
                        borderRadius: 1,
                        boxShadow: 1,
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#ccc',
                            },
                            '&:hover fieldset': {
                                borderColor: '#888',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#1976d2',
                            },
                        },
                    }}
                />



            </Box>

            <Box sx={{ display: 'flex', borderColor: 'divider', mb: 2, width: '40%', alignItems: 'center', justifyContent: 'center', color: 'black' }}>
                <Tabs
                    value={activeQuestion}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    {questions.map((q, index) => (
                        <Tab
                            key={q.id}
                            label={`Question ${index + 1}`}
                            sx={{ minWidth: 'unset' }}
                        />
                    ))}
                </Tabs>
            </Box>

            <form onSubmit={handleSubmit} style={{ width: '50%' }}>
                {/* Only show the active question */}
                {questions.length > 0 && (
                    <Card key={questions[activeQuestion].id} sx={{ mb: 3, borderRadius: 4 }}>
                        <CardHeader
                            sx={{ backgroundColor: 'lightgray' }}
                            title={`Question ${activeQuestion + 1}`}
                            action={
                                <IconButton
                                    aria-label="delete"
                                    onClick={() => handleDeleteQuestion(questions[activeQuestion].id)}
                                    color="error"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            }
                        />
                        <CardContent>
                            <Typography sx={{mb: 2, color: 'gray'}}>
                                Type: {questions[activeQuestion].type.toUpperCase()}
                            </Typography>
                            <TextField
                                fullWidth
                                label="Question"
                                value={questions[activeQuestion].questionText}
                                onChange={(e) => handleQuestionChange(questions[activeQuestion].id, e.target.value)}
                                placeholder="Enter your question"
                                required
                                sx={{ mb: 3 }}
                            />

                            <FormControl component="fieldset" fullWidth>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <FormLabel component="legend">Options</FormLabel>
                                    <Typography sx={{ textAlign: 'end' }}>
                                        Select
                                    </Typography>
                                </Box>
                                {questions[activeQuestion].options.map((option, optionIndex) => (
                                    <Box key={optionIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <TextField
                                            fullWidth
                                            value={option}
                                            onChange={(e) => handleOptionChange(questions[activeQuestion].id, optionIndex, e.target.value)}
                                            placeholder={`Option ${optionIndex + 1}`}
                                            required
                                            sx={{ mr: 2 }}
                                        />
                                        <Radio
                                            checked={questions[activeQuestion].correctAnswer === option}
                                            onChange={() => handleCorrectAnswerChange(questions[activeQuestion].id, option)}
                                            value={option}
                                            name={`correct-answer-${questions[activeQuestion].id}`}
                                        />
                                    </Box>
                                ))}
                            </FormControl>
                        </CardContent>
                    </Card>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddCircleIcon />}
                        onClick={handleAddQuestion}
                    >
                        Add Question
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        color="success"
                        endIcon={
                            isLoading ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : (
                                <SendIcon />
                            )
                        }
                        disabled={isLoading}
                    >
                        {isLoading ? 'Uploading...' : 'Upload Assessment'}
                    </Button>
                </Box>
            </form>

            {isModalOpen && (<AdminQuestionPaper
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          questions={questions}
          handleUploadAssessment={handleUploadAssessment}
        />)}

        </Box>
    );
}

export default CreateAssessment;