import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  CircularProgress, 
  Divider, 
  IconButton, 
  Paper, 
  Typography,
  useTheme,
  styled
} from '@mui/material';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import CodingQuestionViewer from './CodingQuestionViewer';
import CodeEditor from './CodeEditor';
import OutputPanel from './OutputPanel';
import { Send } from '@mui/icons-material';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

const ResizeHandle = styled(PanelResizeHandle)(({ theme }) => ({
  width: '4px',
  backgroundColor: theme.palette.divider,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  transition: theme.transitions.create('background-color'),
}));

const SubmissionResultBox = styled(Box)(({ theme, success }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${
    success ? theme.palette.success.light : theme.palette.warning.light
  }`,
  backgroundColor: success 
    ? theme.palette.success.lighter 
    : theme.palette.warning.lighter,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const CodingIDE = ({
  question,
  value,
  onChange,
  onSubmit
}) => {
  const theme = useTheme();
  
  if (!question || !question.codingDetails) {
    return (
      <Box p={3} color="error.main" fontWeight="fontWeightMedium">
        <ErrorIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
        Error: Coding question data not available.
      </Box>
    );
  }

  const [language, setLanguage] = useState('python');
  const [isCompiling, setIsCompiling] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [compilationSuccess, setCompilationSuccess] = useState(true);
  const [compilationError, setCompilationError] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [executionOutput, setExecutionOutput] = useState('');
  const [submissionResult, setSubmissionResult] = useState(null);

  const codingDetails = question.codingDetails;

  // Mock function to simulate code compilation and execution
  const mockCompileAndRun = async (code, lang) => {
    // Simulate compilation delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock compilation error (10% chance)
    if (Math.random() < 0.1) {
      return {
        success: false,
        error: `SyntaxError: invalid syntax on line ${Math.floor(Math.random() * 10) + 1}`,
        results: [],
        output: ''
      };
    }

    // Mock test results
    const results = codingDetails.testCases.map((testCase, index) => {
      // Simulate some tests passing and some failing
      const passed = Math.random() > 0.3; // 70% pass rate
      const actualOutput = passed ? testCase.expectedOutput : (Math.floor(Math.random() * 10)).toString();

      return {
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput,
        passed
      };
    });

    return {
      success: true,
      results,
      output: `Code executed successfully!\nLanguage: ${lang}\nExecution time: ${(Math.random() * 100).toFixed(2)}ms`
    };
  };

  // Mock function to simulate submission
  const mockSubmit = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));

    const total = codingDetails.testCases.length;
    const passed = Math.floor(Math.random() * total) + Math.floor(total * 0.6); // At least 60% pass

    return {
      passed: Math.min(passed, total),
      total,
      success: passed === total
    };
  };

  const handleCompileAndRun = async () => {
    setIsCompiling(true);
    setShowOutput(true);

    try {
      const result = await mockCompileAndRun(value, language);

      setCompilationSuccess(result.success);
      setCompilationError(result.error || '');
      setTestResults(result.results);
      setExecutionOutput(result.output);
    } catch (error) {
      setCompilationSuccess(false);
      setCompilationError('Unexpected error occurred during compilation');
      setTestResults([]);
      setExecutionOutput('');
    } finally {
      setIsCompiling(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const result = await mockSubmit();
      setSubmissionResult(result);
      onSubmit();
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setShowOutput(false);
    setSubmissionResult(null);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Submission Result */}
      {submissionResult && (
        <SubmissionResultBox success={submissionResult.success}>
          {submissionResult.success ? (
            <>
              <CheckCircleIcon color="success" />
              <Typography color="success.dark" fontWeight="medium">
                All test cases passed ({submissionResult.passed}/{submissionResult.total})
              </Typography>
            </>
          ) : (
            <>
              <WarningIcon color="warning" />
              <Typography color="warning.dark" fontWeight="medium">
                Some test cases failed ({submissionResult.passed}/{submissionResult.total})
              </Typography>
            </>
          )}
        </SubmissionResultBox>
      )}

      {/* Main Content */}
      <Box sx={{ flex: 1 }}>
        <PanelGroup direction="horizontal">
          {/* Left Panel - Question or Output */}
          <Panel defaultSize={40} minSize={25}>
            {showOutput ? (
              <PanelGroup direction="horizontal">
                <Panel defaultSize={50} minSize={30}>
                  <OutputPanel
                    isOpen={showOutput}
                    onClose={() => setShowOutput(false)}
                    compilationSuccess={compilationSuccess}
                    compilationError={compilationError}
                    testResults={testResults}
                    executionOutput={executionOutput}
                  />
                </Panel>
                <ResizeHandle />
                <Panel minSize={30}>
                  <CodingQuestionViewer
                    title={codingDetails.title}
                    description={codingDetails.description}
                    examples={codingDetails.examples}
                    constraints={codingDetails.constraints}
                  />
                </Panel>
              </PanelGroup>
            ) : (
              <CodingQuestionViewer
                title={codingDetails.title}
                description={codingDetails.description}
                examples={codingDetails.examples}
                constraints={codingDetails.constraints}
              />
            )}
          </Panel>

          <ResizeHandle />

          {/* Right Panel - Code Editor */}
          <Panel minSize={30}>
            <Box sx={{ flex: 1, height: { xs: '25rem', md: '25rem', lg: '38rem' }, width: '98%' }}>
              <CodeEditor
                language={language}
                value={value}
                onChange={onChange}
                onLanguageChange={handleLanguageChange}
                onCompileAndRun={handleCompileAndRun}
                isCompiling={isCompiling}
              />
            </Box>

            {/* Submit Button */}
            <Box sx={{ p: 2, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Solution'}
              </Button>
            </Box>
          </Panel>
        </PanelGroup>
      </Box>
    </Box>
  );
};

export default CodingIDE;