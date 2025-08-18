import React, { useState } from 'react';
import {
  Box,
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
  Tabs,
  Tab,
  Typography,
  Switch,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import AdminQuestionPaper from './AdminQuestionPaper';

function CreateAssessment() {
  const [testTitle, setTestTitle] = useState('');
  const [testDescription, setTestDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [topics, setTopics] = useState([]);
  const [topicInput, setTopicInput] = useState('');
  const [mandatory, setMandatory] = useState(true);
  const [questions, setQuestions] = useState([
    {
      id: Date.now(),
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      type: 'mcq'
    }
  ]);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setisModalOpen] = useState(false);

  const handleTabChange = (e, val) => setActiveQuestion(val);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { id: Date.now(), questionText: '', options: ['', '', '', ''], correctAnswer: '', type: 'mcq' }
    ]);
  };

  const handleDeleteQuestion = (id) => {
    if (questions.length > 1) {
      const idx = questions.findIndex(q => q.id === id);
      const newQuestions = questions.filter(q => q.id !== id);
      setQuestions(newQuestions);
      if (activeQuestion >= newQuestions.length) setActiveQuestion(newQuestions.length - 1);
    }
  };

  const handleQuestionChange = (id, value) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, questionText: value } : q));
  };

  const handleOptionChange = (questionId, optionIndex, value) => {
    setQuestions(questions.map(q =>
      q.id === questionId
        ? {
            ...q,
            options: q.options.map((opt, idx) => idx === optionIndex ? value : opt),
            correctAnswer: q.correctAnswer === q.options[optionIndex] ? '' : q.correctAnswer
          }
        : q
    ));
  };

  const handleCorrectAnswerChange = (questionId, value) => {
    setQuestions(questions.map(q => q.id === questionId ? { ...q, correctAnswer: value } : q));
  };

  const handleTopicKeyDown = (e) => {
    if (e.key === 'Enter' && topicInput.trim()) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!testTitle || !testDescription) {
      alert("Please fill title and description");
      return;
    }
    setisModalOpen(true);
  };

  const closeModal = () => setisModalOpen(false);

  const handleUploadAssessment = () => {
    console.log('Uploading...');
    closeModal();
  };

  return (
    <Box sx={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      p: 2, mt: 1, width: '95%', borderRadius: 3, border: '1px solid', borderColor: 'grey.300'
    }}>
      
      {/* Mandatory Toggle */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Typography variant="body2" sx={{ mr: 1 }}>Mandatory:</Typography>
        <Switch checked={mandatory} onChange={(e) => setMandatory(e.target.checked)} />
        <Typography variant="body2" sx={{ ml: 0.5 }}>
          {mandatory ? 'Yes' : 'No'}
        </Typography>
      </Box>

      {/* Title, Description, Duration */}
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '40%', gap: 1 }}>
        <TextField size="small" label="Title" value={testTitle} onChange={(e) => setTestTitle(e.target.value)} />
        <TextField size="small" label="Description" value={testDescription} onChange={(e) => setTestDescription(e.target.value)} multiline rows={2} />
        <TextField size="small" label="Duration (minutes)" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
      </Box>

      {/* Topics Input */}
      <Box sx={{ mt: 1, width: '40%' }}>
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

      {/* Question Tabs */}
      <Box sx={{ mt: 1, width: '40%' }}>
        <Tabs value={activeQuestion} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
          {questions.map((_, i) => (
            <Tab key={i} label={`Q${i + 1}`} sx={{ minWidth: 'unset' }} />
          ))}
        </Tabs>
      </Box>

      {/* Active Question */}
      <form onSubmit={handleSubmit} style={{ width: '40%' }}>
        {questions.length > 0 && (
          <Card sx={{ mb: 2, borderRadius: 2 }}>
            <CardHeader
              sx={{ py: 0.5, backgroundColor: '#f5f5f5' }}
              titleTypographyProps={{ variant: 'subtitle2' }}
              title={`Question ${activeQuestion + 1}`}
              action={
                <IconButton size="small" color="error" onClick={() => handleDeleteQuestion(questions[activeQuestion].id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              }
            />
            <CardContent sx={{ p: 1.5 }}>
              <TextField
                size="small"
                fullWidth
                label="Question"
                value={questions[activeQuestion].questionText}
                onChange={(e) => handleQuestionChange(questions[activeQuestion].id, e.target.value)}
                sx={{ mb: 1 }}
              />
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend" sx={{ fontSize: 12 }}>Options</FormLabel>
                {questions[activeQuestion].options.map((opt, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder={`Option ${idx + 1}`}
                      value={opt}
                      onChange={(e) => handleOptionChange(questions[activeQuestion].id, idx, e.target.value)}
                      sx={{ mr: 1 }}
                    />
                    <Radio
                      size="small"
                      checked={questions[activeQuestion].correctAnswer === opt}
                      onChange={() => handleCorrectAnswerChange(questions[activeQuestion].id, opt)}
                    />
                  </Box>
                ))}
              </FormControl>
            </CardContent>
          </Card>
        )}

        {/* Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="outlined" size="small" startIcon={<AddCircleIcon />} onClick={handleAddQuestion}>
            Add
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="small"
            color="success"
            endIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
          >
            {isLoading ? 'Uploading...' : 'Upload'}
          </Button>
        </Box>
      </form>

      {isModalOpen && (
        <AdminQuestionPaper
          isModalOpen={isModalOpen}
          closeModal={closeModal}
          questions={questions}
          handleUploadAssessment={handleUploadAssessment}
        />
      )}
    </Box>
  );
}

export default CreateAssessment;
