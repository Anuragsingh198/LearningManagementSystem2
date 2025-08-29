import React, { useState, useEffect } from 'react';
import {
    Button,
    Card,
    CardHeader,
    CardContent,
    Select,
    MenuItem,
    Autocomplete,
    TextField,
    IconButton,
    FormControl,
    FormLabel,
    Radio,
    CircularProgress,
    Box,
    Tabs,
    Tab,
    Chip,
    Paper,
    Switch,
    FormControlLabel,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SendIcon from '@mui/icons-material/Send';
import { useCourseContext } from '../../context/contextFiles/CourseContext';
import AdminQuestionPaper from './AdminQuestionPaper';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';
import CloseIcon from '@mui/icons-material/Close';
import { getAllCodingQuestions } from '../../context/Actions/AssignmentActions';
import { useAssignmentContext } from '../../context/contextFiles/assignmentContext';
import { addAssessmentAction } from '../../context/Actions/courseActions';

function CreateAssessment() {
    const [topics, setTopics] = useState([]);
    const [duration, setDuration] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMandatory, setIsMandatory] = useState(false)
    const [activeQuestion, setActiveQuestion] = useState(0);
    const [topicInput, setTopicInput] = useState('');
    const [testTitle, setTestTitle] = useState('');
    const [testDescription, setTestDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [isModalOpen, setisModalOpen] = useState(false)
    const [previewMode, setPreviewMode] = useState(false); // New state for preview toggle
    const [testType, setTestType] = useState('mcq')
    const { state: { allCodingQuestions }, dispatch } = useAssignmentContext();
    const [selectedQuestionId, setSelectedQuestionId] = useState(null);
    const [selectedCodingQuestions, setSelectedCodingQuestions] = useState([]);

    const [questions, setQuestions] = useState([
        {
            id: Date.now(),
            questionText: '',
            options: ['', '', '', ''],
            correctAnswer: '',
            type: 'mcq'
        }
    ]);

    const handleTopicKeyDown = (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && topicInput.trim()) {
            e.preventDefault();
            if (!topics.includes(topicInput.trim())) {
                setTopics([...topics, topicInput.trim()]);
            }
            setTopicInput('');
        }
    };


    const removeTopic = (topic) => {
        setTopics(topics.filter(t => t !== topic));
    };



    useEffect(() => {

        const fetchData = async () => {
            await getAllCodingQuestions(dispatch);
        };
        fetchData();
    }, []);

    // console.log('all coding questions are: ', allCodingQuestions)

    // console.log('the coding question details ', selectedCodingQuestions)


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

            if (activeQuestion === questionIndex) {
                if (questionIndex === newQuestions.length) {
                    setActiveQuestion(newQuestions.length - 1);
                }
            } else if (activeQuestion > questionIndex) {
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
        // check this for bugs 
        if (!testDescription || !testTitle || topics.length === 0) {
            alert("Please add Test Title, Topics and Description");
            return;
        }

        if (testType === "mcq") {
            if (!questions) {
                alert("Please select at least one MCQ question");
                return;
            }

            const isValid = questions.every(q =>
                q.questionText.trim() !== '' &&
                q.options.every(opt => opt.trim() !== '') &&
                q.correctAnswer !== '' &&
                q.options.includes(q.correctAnswer)
            );

            if (isValid) {
                const submissionData = {
                    title: testTitle,
                    description: testDescription,
                    questions: questions,

                };

                // console.log('submission data is: ', submissionData)
                setisModalOpen(true);
            } else {
                alert("Please fill all fields and select correct answers for all questions!");
            }

        } else if (testType === "coding") {
            if (!selectedCodingQuestions) {
                alert("Please select a coding question");
                return;
            } else {
                setisModalOpen(true)
            }
        } else if (testType === "both") {
            if (!questions || !selectedCodingQuestions) {
                alert("Please select both MCQ and coding questions");
                return;
            }

            const isValid = questions.every(q =>
                q.questionText.trim() !== '' &&
                q.options.every(opt => opt.trim() !== '') &&
                q.correctAnswer !== '' &&
                q.options.includes(q.correctAnswer)
            );

            if (isValid) {
                const submissionData = {
                    title: testTitle,
                    description: testDescription,
                    questions: questions,

                };

                // console.log('submission data is: ', submissionData)
                setisModalOpen(true);
            } else {
                alert("Please fill all fields and select correct answers for all questions!");
            }
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

    const handleUploadAssessment = async () => {
        // console.log('is Mandatory ', isMandatory)
        // console.log('Title ', testTitle)
        // console.log('Description ', testDescription)
        // console.log('Topics', topics)
        // console.log('Duratrion ', duration)
        // console.log('Questions ', questions)
        // console.log('Coding questions: ', selectedCodingQuestions)

        // console.log('Uploading assessment...');

        try{
            await addAssessmentAction(
               dispatch,
      isMandatory,
      testTitle,
      testDescription,
      topics,
      duration,
      questions,
      selectedCodingQuestions,
      testType 
            )

            closeModal();
        } catch (error) {
            console.error(
                'Error uploading assessment: ', err
            )
        }

    };

    const togglePreviewMode = () => {
        setPreviewMode(!previewMode);
    };

    const renderMarkdownPreview = (text) => {
        return (
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                    code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <div style={{
                                backgroundColor: '#f6f8fa',
                                padding: '0.5em',
                                borderRadius: '3px',
                                margin: '0.5em 0',
                                overflowX: 'auto'
                            }}>
                                <pre style={{ margin: 0 }}>
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                </pre>
                            </div>
                        ) : (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    }
                }}
            >
                {text}
            </ReactMarkdown>
        );
    };

    return (
        <Box sx={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            backgroundColor: 'background.default', p: 2, mt: 2, width: '96%', borderRadius: 10,
            border: '1px solid', borderColor: 'grey.300',
        }}>
            <Box sx={{ mb: 2, color: 'black', display: 'flex', flexDirection: 'column' }}>

                {/* Mandatory Toggle Row */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.85rem' }}>
                    <Box>Mandatory Test?</Box>
                    <Box sx={{ display: 'flex', ml: 2.5, justifyContent: 'center', alignItems: 'center' }}>
                        <Box>No</Box>
                        <Switch
                            checked={isMandatory}
                            onChange={() => setIsMandatory(!isMandatory)}
                            color="primary"
                        />
                        <Box>Yes</Box>
                    </Box>

                </Box>

                {/* Dynamic Description */}
                <Box sx={{ color: 'gray', fontSize: '0.8rem' }}>
                    {isMandatory
                        ? '*This test will be mandatory for all.'
                        : '*This test will not be mandatory for all.'}
                </Box>
            </Box>



            {/* Title and Description Section */}
            <Box sx={{ display: 'flex', width: '60%', flexDirection: 'row', gap: 1 }}>

                {/* First column (title + duration) */}
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}> {/* Slightly bigger */}
                    <TextField
                        size="small"
                        label="Assessment Title"
                        id="testTitle"
                        name="testTitle"
                        value={testTitle}
                        onChange={handleTitleAndDescriptionChange}
                        required
                        sx={{
                            backgroundColor: 'white',
                            borderRadius: 1,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#ccc' },
                                '&:hover fieldset': { borderColor: '#888' },
                                '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                            },
                        }}
                    />
                    <TextField
                        size="small"
                        label="Duration (in Min)"
                        id="duration"
                        name="duration"
                        value={duration}
                        type="number"
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === '' || Number(value) >= 1) {
                                setDuration(value);
                            }
                        }}
                        required
                        inputProps={{ min: 1 }}
                        sx={{
                            backgroundColor: 'white',
                            borderRadius: 1,
                            mt: 1.5,
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#ccc' },
                                '&:hover fieldset': { borderColor: '#888' },
                                '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                            },
                        }}
                    />
                </Box>

                {/* Second column (description) */}
                <Box sx={{ flex: 2 }}> {/* Slightly smaller */}
                    <TextField
                        size="small"
                        multiline
                        minRows={3}
                        label="Assessment Description"
                        id="testDescription"
                        name="testDescription"
                        value={testDescription}
                        onChange={handleTitleAndDescriptionChange}
                        required
                        fullWidth
                        sx={{
                            backgroundColor: 'white',
                            borderRadius: 1,
                            '& .MuiOutlinedInput-root': {
                                alignItems: 'flex-start',
                                '& fieldset': { borderColor: '#ccc' },
                                '&:hover fieldset': { borderColor: '#888' },
                                '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                            },
                            '& textarea': {
                                paddingTop: '8px',
                            },
                        }}
                    />
                </Box>
            </Box>


            {/* Topics Input */}
            <Box sx={{ mt: 1, width: '60%', mb: 1 }}>
                <TextField
                    size="small"
                    label="Add Topic"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    onKeyDown={handleTopicKeyDown}
                    fullWidth
                />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                    {topics.map((topic, idx) => (
                        <Chip
                            key={idx}
                            label={topic}
                            size="small"
                            onDelete={() => removeTopic(topic)}
                            deleteIcon={<CloseIcon />}
                        />
                    ))}
                </Box>
            </Box>

            {/* Type, select */}
            <Box sx={{ mt: 1, width: '60%', mb: 1, color: 'black' }}>
                <Select
                    size="small"
                    label="Test Type"
                    value={testType}
                    onChange={(e) => setTestType(e.target.value)}
                    fullWidth
                    placeholder='Select Assessment Type'
                >
                    <MenuItem value="mcq">MCQ</MenuItem>
                    <MenuItem value="coding">Coding</MenuItem>
                    <MenuItem value="both">Both (MCQ + Coding)</MenuItem>
                </Select>
            </Box>

            {(testType === 'mcq' || testType === 'both') && <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '60%', ml: 1 }}>

                <Typography sx={{ color: 'black', mb: 1 }}>
                    Add MCQ Questions
                </Typography>

            </Box>}
            {/* Question Form */}
            {(testType === 'mcq' || testType === 'both') && <form onSubmit={handleSubmit} style={{ width: '60%', mt: 4 }}>
                {questions.length > 0 && (
                    <Card
                        key={questions[activeQuestion].id}
                        sx={{
                            mb: 2,
                            borderRadius: 2,
                            boxShadow: 2,
                        }}
                    >
                        <CardHeader
                            sx={{
                                backgroundColor: 'lightgray',
                                py: 1,
                                '& .MuiCardHeader-title': { fontSize: '0.9rem' },
                            }}
                            title={`Q${activeQuestion + 1}`}
                            action={
                                <IconButton
                                    size="small"
                                    aria-label="delete"
                                    onClick={() => handleDeleteQuestion(questions[activeQuestion].id)}
                                    color="error"
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            }
                        />
                        <CardContent sx={{ py: 1.5 }}>
                            <Typography sx={{ mb: 1, color: 'gray', fontSize: '0.75rem' }}>
                                Type: {questions[activeQuestion].type.toUpperCase()}
                            </Typography>

                            <Box sx={{ mb: 2 }}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={togglePreviewMode}
                                    sx={{ mb: 1 }}
                                >
                                    {previewMode ? 'Edit Mode' : 'Preview Mode'}
                                </Button>

                                {previewMode ? (
                                    <Box sx={{
                                        border: '1px solid #eee',
                                        borderRadius: 1,
                                        p: 1,
                                        minHeight: '80px'
                                    }}>
                                        {renderMarkdownPreview(questions[activeQuestion].questionText)}
                                    </Box>
                                ) : (
                                    <TextField
                                        size="small"
                                        fullWidth
                                        label="Question"
                                        multiline
                                        minRows={2}
                                        maxRows={4}
                                        value={questions[activeQuestion].questionText}
                                        onChange={(e) =>
                                            handleQuestionChange(questions[activeQuestion].id, e.target.value)
                                        }
                                        placeholder="Enter your question (use ``` for code blocks)"
                                        helperText="Use Markdown for formatting. For code: ```language\ncode\n```"
                                        required
                                    />
                                )}
                            </Box>

                            <FormControl component="fieldset" fullWidth>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <FormLabel sx={{ fontSize: '0.8rem' }}>Options</FormLabel>
                                    <Typography sx={{ fontSize: '0.8rem' }}>Select</Typography>
                                </Box>

                                {questions[activeQuestion].options.map((option, optionIndex) => (
                                    <Box key={optionIndex} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                        {previewMode ? (
                                            <Box sx={{
                                                flexGrow: 1,
                                                border: '1px solid #eee',
                                                borderRadius: 1,
                                                p: 1,
                                                backgroundColor: '#fafafa'
                                            }}>
                                                {renderMarkdownPreview(option)}
                                            </Box>
                                        ) : (
                                            <TextField
                                                size="small"
                                                fullWidth
                                                value={option}
                                                multiline
                                                onChange={(e) =>
                                                    handleOptionChange(
                                                        questions[activeQuestion].id,
                                                        optionIndex,
                                                        e.target.value
                                                    )
                                                }
                                                placeholder={`Option ${optionIndex + 1}`}
                                                required
                                                sx={{ mr: 1 }}
                                            />
                                        )}
                                        <Radio
                                            size="small"
                                            checked={questions[activeQuestion].correctAnswer === option}
                                            onChange={() =>
                                                handleCorrectAnswerChange(
                                                    questions[activeQuestion].id,
                                                    option
                                                )
                                            }
                                            value={option}
                                            name={`correct-answer-${questions[activeQuestion].id}`}
                                        />
                                    </Box>
                                ))}
                            </FormControl>
                        </CardContent>
                    </Card>
                )}

                {/* Questions Tabs */}
                <Box sx={{
                    display: 'flex',
                    borderColor: 'divider',
                    mb: 1,
                    mt: 1,
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'black',
                }}>
                    <Tabs
                        value={activeQuestion}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            minHeight: 32,
                            '& .MuiTab-root': {
                                minWidth: 'auto',
                                px: 1.5,
                                py: 0.5,
                                fontSize: '0.75rem',
                                minHeight: 32,
                            },
                        }}
                    >
                        {questions.map((q, index) => (
                            <Tab key={q.id} label={`Question ${index + 1}`} />
                        ))}
                    </Tabs>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        startIcon={<AddCircleIcon fontSize="small" />}
                        onClick={handleAddQuestion}
                    >
                        Add
                    </Button>


                </Box>
            </form>}

            {(testType === 'both' || testType === 'coding') && <Box sx={{ width: '60%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', ml: 1, mt: 1, mb: 1 }}>

                    <Typography sx={{ color: 'black', mb: 1 }}>
                        Add Coding Questions
                    </Typography>

                </Box>
                <Autocomplete
                    options={allCodingQuestions.slice(0, 5)} // show max 5
                    getOptionLabel={(option) => option.title}
                    onChange={(event, newValue) => {
                        if (newValue && !selectedCodingQuestions.find(q => q._id === newValue._id)) {
                            setSelectedCodingQuestions(prev => [...prev, newValue]);
                        }
                    }}
                    renderOption={(props, option) => (
                        <li {...props} key={option._id}>
                            <div>
                                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                                    {option.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "gray" }}>
                                    {option.description}
                                </Typography>
                            </div>
                        </li>
                    )}
                    renderInput={(params) => (
                        <TextField {...params} label="Search Coding Questions" size="small" />
                    )}
                    fullWidth
                />
                <Box sx={{ mt: 2 }}>
                    {selectedCodingQuestions.map((q, index) => (
                        <Paper key={q._id} sx={{ p: 2, mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {index + 1}. {q.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "gray" }}>
                                    {q.description}
                                </Typography>
                            </Box>
                            <Button
                                color="error"
                                onClick={() => setSelectedCodingQuestions(prev => prev.filter(item => item._id !== q._id))}
                            >
                                Delete
                            </Button>
                        </Paper>
                    ))}
                </Box>


            </Box>}

            <Button
                size="small"
                type="button"
                onClick={handleSubmit}
                variant="contained"
                color="success"
                endIcon={
                    isLoading ? (
                        <CircularProgress size={16} color="inherit" />
                    ) : (
                        <SendIcon fontSize="small" />
                    )
                }
                disabled={isLoading}
                sx={{ mt: 2 }}
            >
                {isLoading ? 'Uploading...' : 'Upload'}
            </Button>

            {isModalOpen && (
                <AdminQuestionPaper
                    isModalOpen={isModalOpen}
                    closeModal={closeModal}
                    testType = {testType}
                    questions={questions}  // MCQs
                    selectedCodingQuestions={selectedCodingQuestions} // Coding
                    handleUploadAssessment={handleUploadAssessment}
                />

            )}
        </Box>
    );
}

export default CreateAssessment;