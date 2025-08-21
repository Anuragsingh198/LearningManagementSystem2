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
    Select,
    MenuItem,
    InputLabel,
    CircularProgress,
    Box,
    Tabs,
    Tab,
    Typography,
    Avatar,
    Paper,
    Snackbar,
    Alert
} from '@mui/material';
import {
    Trash2,
    PlusCircle,
    Send,
    Plus,
    Video,
    ChevronDown,
    UploadCloud
} from 'lucide-react';
import axios from 'axios';

import { useCourseContext } from '../../../context/contextFiles/CourseContext';
import { createModuleAction, createVideoAction, getCourseById, getModulesByCourseId } from '../../../context/Actions/courseActions';
import { useAuth } from '../../../context/contextFiles/AuthContext';
import BlurLoading from '../../common/BlurLoading';


function QuizCreationForm({ courseId }) {
    const { state: { modules, courses, moduleNames }, dispatch } = useCourseContext();

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
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const { state: { user } } = useAuth();
    const role = user?.role;
    const token = user?.token;
    const [questions, setQuestions] = useState([
        {
            id: Date.now(),
            questionText: '',
            options: ['', '', '', ''],
            correctAnswer: ''
        }
    ]);

    useEffect(() => {
        const foundCourse = courses.find(c => c._id === courseId)
        setCourse(foundCourse)
    }, courses, courseId)

    useEffect(() => {
        setExistingModules(moduleNames);
    }, [moduleNames])


    const handleAddQuestion = () => {
        setQuestions([
            ...questions,
            {
                id: Date.now(),
                questionText: '',
                options: ['', '', '', ''],
                correctAnswer: ''
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
            setSnackbarOpen(true);
        }
    };

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

        if (!selectedModule || !selectedModule || !testTitle) {
            alert("Please add Module, test title and description");
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

            try {
                setIsLoading(true);
                const response = await axios.post(
                    `${serverurl}/api/courses/addtest`,
                    { testData: submissionData },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                if (response.data.success) {
                    setIsLoading(false)
                    alert("Quiz submitted successfully!");
                    setTestDescription('')
                    setTestTitle('')
                    setSelectedModule('');
                    setActiveQuestion(0);
                    setQuestions([{
                        id: Date.now(),
                        questionText: '',
                        options: ['', '', '', ''],
                        correctAnswer: ''
                    }]);
                }
            } catch (error) {
                console.error('question upload failed:', error?.response?.data || error.message);
            }

        } else {
            alert("Please fill all fields and select correct answers for all questions!");
        }
    };

    const handleCreateModule = async (e) => {
        e.preventDefault();


        try {
            setIsSubmitting(true);
            const newModule = {
                courseId,
                title: moduleData.title,
                description: moduleData.description,
                order: existingModules.length + 1,
            };

            const createdModule = await createModuleAction(newModule, dispatch);
            setSelectedModule(createdModule._id);
            // console.log("this is   createed module id  from videoUploadform: ", createdModule._id)
            setModuleData({ title: '', description: '' });
            setShowModuleForm(false);
        } catch (error) {
            console.error("Failed to create module:", error);
            setErrors({ submit: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleModuleInputChange = (e) => {
        const { name, value } = e.target;
        setModuleData({
            ...moduleData,
            [name]: value,
        });

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: '',
            });
        }
    };

    const handleModuleChange = (e) => {
        const newValue = e.target.value;
        setSelectedModule(newValue);
        console.log('Handle module change clicked: ', selectedModule)
        if (errors.selectedModule) {
            setErrors({
                ...errors,
                selectedModule: '',
            });
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



    // console.log('the existing modules are: ', existingModules)

    if (!course) {
        return (
            <BlurLoading />
        );
    }


    return (
        <Box sx={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        }}>

            <Box sx={{
                width: '50%',
                display: 'flex',
                flexDirection: { xs: 'row', lg: 'row' },
                gap: 3,
                mb: 3,
                alignItems: 'flex-start',
                p: 2,
                backgroundColor: '#fff',
                borderRadius: '4px',
                boxShadow: 'none',
                border: '1px solid #e0e0e0',

            }}>
                {/* Module Section - Left Column */}
                <Box sx={{
                    width: { xs: '100%', lg: '100%' },
                    flexShrink: 0,
                    position: 'relative'
                }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            mb: 2,
                            flexWrap: 'wrap',
                            gap: 1,
                        }}
                    >
                        <Typography variant="h6" fontWeight="600">
                            {showModuleForm ? "Create New Module" : "Select Module"}
                        </Typography>

                        <Button
                            onClick={() => setShowModuleForm(!showModuleForm)}
                            startIcon={!showModuleForm ? <Plus strokeWidth={1.5} /> : null}
                            size="small"
                            variant="outlined"
                            sx={{
                                ml: 'auto',
                                borderRadius: '4px',
                                borderColor: showModuleForm ? '#d32f2f' : '#1976d2',
                                color: showModuleForm ? '#d32f2f' : '#1976d2',
                                fontWeight: 600,
                                textTransform: 'none',

                                // hover
                                '&:hover': {
                                    borderColor: showModuleForm ? '#b71c1c' : '#0d47a1',
                                    backgroundColor: showModuleForm ? '#fdecea' : '#e3f2fd',
                                },

                                // active (pressed)
                                '&:active': {
                                    borderColor: showModuleForm ? '#9a0007' : '#0b3c91',
                                    backgroundColor: showModuleForm ? '#f9d7d7' : '#bbdefb',
                                },

                                // focus ring
                                '&:focus': {
                                    outline: '2px solid',
                                    outlineColor: showModuleForm ? '#f28b82' : '#90caf9',
                                    outlineOffset: '2px',
                                },

                                // disabled
                                '&.Mui-disabled': {
                                    borderColor: '#cbd5e1',
                                    color: '#9ca3af',
                                },
                            }}
                        >
                            {showModuleForm ? "Cancel" : "New Module"}
                        </Button>
                    </Box>

                    {showModuleForm ? (
                        <Card
                            component="form"
                            onSubmit={handleCreateModule}
                            sx={{
                                p: 3,
                                backgroundColor: 'background.paper',
                                boxShadow: 'none',
                                borderRadius: 'none'
                            }}
                        >
                            <TextField
                                fullWidth
                                label="Module Title"
                                id="title"
                                name="title"
                                value={moduleData.title}
                                onChange={handleModuleInputChange}
                                error={Boolean(errors.moduleTitle)}
                                helperText={errors.moduleTitle}
                                margin="normal"
                                required
                                sx={{ mb: 2 }}
                            />

                            <TextField
                                fullWidth
                                label="Module Description"
                                id="description"
                                name="description"
                                value={moduleData.description}
                                onChange={handleModuleInputChange}
                                error={Boolean(errors.moduleDescription)}
                                helperText={errors.moduleDescription}
                                margin="normal"
                                required
                                multiline
                                rows={3}
                                sx={{ mb: 3 }}
                            />

                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 2,
                                mt: 2
                            }}>
                                {/* <Button
                                    onClick={() => setShowModuleForm(false)}
                                    variant="outlined"
                                    color="secondary"
                                >
                                    Cancel
                                </Button> */}
                                <Button
                                    type="submit"
                                    variant="outlined"
                                    disabled={isSubmitting}
                                    sx={{
                                        borderRadius: '4px',
                                        borderColor: '#1976d2',
                                        color: '#1976d2',
                                        fontWeight: 600,
                                        textTransform: 'none',

                                        // hover
                                        '&:hover': {
                                            borderColor: '#0d47a1',
                                            backgroundColor: '#e3f2fd',
                                        },

                                        // active (pressed)
                                        '&:active': {
                                            borderColor: '#0b3c91',
                                            backgroundColor: '#bbdefb',
                                        },

                                        // focus ring
                                        '&:focus': {
                                            outline: '2px solid',
                                            outlineColor: '#90caf9',
                                            outlineOffset: '2px',
                                        },

                                        // disabled
                                        '&.Mui-disabled': {
                                            borderColor: '#cbd5e1',
                                            color: '#9ca3af',
                                        },
                                    }}
                                >
                                    {isSubmitting ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : (
                                        "Create Module"
                                    )}
                                </Button>

                            </Box>
                        </Card>
                    ) : (
                        <Box sx={{ mb: 3 }}>
                            {existingModules.length > 0 ? (
                                <Box sx={{
                                    backgroundColor: 'background.paper',
                                    p: 2,
                                    borderRadius: 1,
                                    // boxShadow: 1
                                }}>
                                    <FormControl fullWidth error={Boolean(errors.selectedModule)}>
                                        <InputLabel id="module-select-label">Select a Module *</InputLabel>
                                        <Select
                                            labelId="module-select-label"
                                            id="moduleSelect"
                                            value={selectedModule}
                                            onChange={handleModuleChange}
                                            label="Select a Module *"
                                            IconComponent={ChevronDown}
                                            sx={{ mb: 1 }}
                                        >
                                            <MenuItem value="">
                                                <em>-- Select a module --</em>
                                            </MenuItem>
                                            {existingModules.map((module) => (
                                                <MenuItem key={module._id} value={module._id} onClick={() => console.log('Clicked module:', module._id)}>
                                                    {module.title}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.selectedModule && (
                                            <FormHelperText sx={{ ml: 0 }}>{errors.selectedModule}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Box>
                            ) : (
                                <Card sx={{
                                    textAlign: 'center',
                                    p: 4,
                                    backgroundColor: 'background.paper',
                                    boxShadow: 1,
                                    borderRadius: 2
                                }}>
                                    <Avatar sx={{
                                        bgcolor: 'primary.light',
                                        color: 'primary.main',
                                        mx: 'auto',
                                        mb: 2,
                                        width: 56,
                                        height: 56
                                    }}>
                                        <Video strokeWidth={1.5} size={32} />
                                    </Avatar>
                                    <Typography variant="h6" fontWeight="500" gutterBottom>
                                        No modules found
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{
                                        mb: 3,
                                        maxWidth: '80%',
                                        mx: 'auto'
                                    }}>
                                        Create your first module to organize your videos
                                    </Typography>
                                    <Button
                                        onClick={() => setShowModuleForm(true)}
                                        variant="contained"
                                        color="primary"
                                        startIcon={<Plus />}
                                        size="large"
                                    >
                                        Create Module
                                    </Button>
                                </Card>
                            )}
                        </Box>
                    )}
                </Box>
            </Box>

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
                        borderRadius: '4px',
                        // boxShadow: 1,
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
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        // boxShadow: 1,
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

            <Box sx={{ display: 'flex', borderColor: 'divider', mb: 2, width: '40%', alignItems: 'center', justifyContent: 'center' }}>
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
                {questions.length > 0 && (
                    <Card
                        key={questions[activeQuestion].id}
                        sx={{
                            borderRadius: '4px',
                            border: '1px solid #1976d2',
                            backgroundColor: '#fff',
                            boxShadow: 'none',
                        }}
                    >
                        <CardHeader
                            sx={{
                                backgroundColor: '#e3f2fd',
                                borderBottom: '1px solid #1976d2',
                                borderRadius: '4px 4px 0 0',
                                '& .MuiCardHeader-title': { fontWeight: 600, color: '#0d47a1' },
                            }}
                            title={`Question ${activeQuestion + 1}`}
                            action={
                                <IconButton
                                    aria-label="delete"
                                    onClick={() => handleDeleteQuestion(questions[activeQuestion].id)}
                                    sx={{
                                        color: '#d32f2f',
                                        '&:hover': { backgroundColor: '#fdecea' },
                                    }}
                                >
                                    <Trash2 strokeWidth={1.5} />
                                </IconButton>
                            }
                        />
                        <CardContent sx={{ backgroundColor: '#fff' }}>
                            <TextField
                                fullWidth
                                label="Question"
                                value={questions[activeQuestion].questionText}
                                onChange={(e) =>
                                    handleQuestionChange(questions[activeQuestion].id, e.target.value)
                                }
                                placeholder="Enter your question"
                                required
                                sx={{ mb: 3 }}
                            />

                            <FormControl component="fieldset" fullWidth>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <FormLabel component="legend" sx={{ fontWeight: 600, color: '#1976d2' }}>
                                        Options
                                    </FormLabel>
                                    <Typography sx={{ textAlign: 'end', color: '#6b7280' }}>
                                        Select
                                    </Typography>
                                </Box>

                                {questions[activeQuestion].options.map((option, optionIndex) => (
                                    <Box
                                        key={optionIndex}
                                        sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                    >
                                        <TextField
                                            fullWidth
                                            value={option}
                                            onChange={(e) =>
                                                handleOptionChange(
                                                    questions[activeQuestion].id,
                                                    optionIndex,
                                                    e.target.value
                                                )
                                            }
                                            placeholder={`Option ${optionIndex + 1}`}
                                            required
                                            sx={{ mr: 2 }}
                                        />
                                        <Radio
                                            checked={questions[activeQuestion].correctAnswer === option}
                                            onChange={() =>
                                                handleCorrectAnswerChange(questions[activeQuestion].id, option)
                                            }
                                            value={option}
                                            name={`correct-answer-${questions[activeQuestion].id}`}
                                            sx={{
                                                color: '#1976d2',
                                                '&.Mui-checked': { color: '#0d47a1' },
                                            }}
                                        />
                                    </Box>
                                ))}
                            </FormControl>
                        </CardContent>
                    </Card>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button
                        variant="outlined"
                        startIcon={<PlusCircle strokeWidth={1.5} />}
                        onClick={handleAddQuestion}
                        sx={{
                            borderRadius: '4px',
                            borderColor: '#1976d2',
                            color: '#1976d2',
                            '&:hover': { backgroundColor: '#e3f2fd', borderColor: '#0d47a1' },
                        }}
                    >
                        Add Question
                    </Button>

                    <Button
                        type="submit"
                        variant="outlined"
                        endIcon={
                            isLoading ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : (
                                <Send strokeWidth={1.5} />
                            )
                        }
                        disabled={isLoading}
                        sx={{
                            borderRadius: '4px',
                            borderColor: '#2e7d32',
                            color: '#2e7d32',
                            '&:hover': { backgroundColor: '#e8f5e9', borderColor: '#1b5e20' },
                        }}
                    >
                        {isLoading ? 'Uploading...' : 'Upload Assessment'}
                    </Button>
                </Box>
            </form>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="warning" onClose={() => setSnackbarOpen(false)} sx={{ width: '100%' }}>
                    You need at least one question!
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default QuizCreationForm;