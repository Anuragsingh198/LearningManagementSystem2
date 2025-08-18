import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
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
import { useAssignmentContext } from '../../context/contextFiles/assignmentContext';
import { getQuestionByIdAction, runCodeAction, submitCodeAction } from '../../context/Actions/AssignmentActions';

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
  borderBottom: `1px solid ${success ? theme.palette.success.light : theme.palette.warning.light
    }`,
  backgroundColor: success
    ? theme.palette.success.lighter
    : theme.palette.warning.lighter,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const CodingIDE = ({
  value,
  onChange,
  onSubmit
}) => {
  const theme = useTheme();
  const [question, setQuestion] = useState(null);

  const [language, setLanguage] = useState(71);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [compilationSuccess, setCompilationSuccess] = useState(true);
  const [compilationError, setCompilationError] = useState('');
  const [testResults, setTestResults] = useState([]);
  const [executionOutput, setExecutionOutput] = useState('');
  const [submissionResult, setSubmissionResult] = useState(null);

  // Load question from context
  const { state: { assignmentQuestions }, dispatch } = useAssignmentContext();
  const currentQuestionId = '689d670534b755cc788a7dc0';

  useEffect(() => {
    getQuestionByIdAction(dispatch, currentQuestionId);
  }, [])

  useEffect(() => {
    setQuestion(assignmentQuestions);
    console.log(" this is the  question data ; ", question)
  }, [assignmentQuestions])

  const handleCompileAndRun = async () => {
    setIsCompiling(true);
    setShowOutput(true);

    try {
      const payload = {
        code: value,
        languageId: language,
        testCases: question.runCodeTestCases
      };

      // Call your action to run the code
      const data = await runCodeAction(dispatch, payload);
      console.log("Response from Judge0:", data);

      if (!data) {
        throw new Error("Run code request failed: No data returned");
      }

      // Map Judge0 results to examples format for CodingQuestionViewer
      const mappedResults = (data.results || []).map((result, idx) => ({
        input: result.testcase_input || "",
        expectedOutput:result.expected_output || "",
        actualOutput: result.actual_output || "",
        status: result.status || "Unknown",
        passed: result.status === "Accepted"?true: false
      }));
      console.log(" this is  the testcase result : ", mappedResults);
      setCompilationSuccess(data.success || false);
      setCompilationError(data.error || "");
      setTestResults(mappedResults); 
      setExecutionOutput(data.results.output || "");

    } catch (error) {
      console.error("Run code failed:", error);
      setCompilationSuccess(false);
      setCompilationError("Unexpected error occurred during compilation");
      setTestResults([]);
      setExecutionOutput("");
    } finally {
      setIsCompiling(false);
    }
  };
const handleSubmit = async () => {
  setIsSubmitting(true);

  try {
    const payload = {
      sourceCode: value,
      languageId: language,
      questionId: question?.id,
    };

    const data = await submitCodeAction(dispatch, payload);

    if (!data) {
      throw new Error(`Submit request failed`);
    }

    // Safely get results
    const safeResults = Array.isArray(data.results) ? data.results : [];

    // Count passed vs total
    const total = safeResults.length;
    const passed = safeResults.filter(r => r.status?.id === 3).length; // 3 = Accepted

    setSubmissionResult({
      success: passed === total,
      passed,
      total,
      results: safeResults
    });

    if (typeof onSubmit === "function") {
      onSubmit();
    }
  } catch (error) {
    console.error("Submission failed:", error);
  } finally {
    setIsSubmitting(false);
  }
};


  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setShowOutput(false);
    setSubmissionResult(null);
  };

  if (!question) {
    return (
      <Box p={3} color="error.main" fontWeight="fontWeightMedium">
        <ErrorIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
        Error: Coding question data not available.
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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

      <Box sx={{ flex: 1 }}>
        <PanelGroup direction="horizontal">
          <Panel defaultSize={40} minSize={25}>
            {showOutput ? (
              <PanelGroup direction="horizontal">
                <Panel defaultSize={50} minSize={30}>
                  <OutputPanel
                    isOpen={showOutput}
                    onClose={() => setShowOutput(false)}
                    compilationSuccess={compilationSuccess}
                    compilationError={compilationError}
                    testResults={testResults || []}
                    executionOutput={executionOutput}
                  />
                </Panel>
                <ResizeHandle />
                <Panel minSize={30}>
                  <CodingQuestionViewer
                    title={question?.title || ""}
                    description={question?.description || ""}
                    examples={
                      Array.isArray(question?.runCodeTestCases)
                        ? question.runCodeTestCases.map(tc => ({
                            input: tc.input,
                            output: tc.expected_output
                          }))
                        : []
                    }
                  />
                </Panel>
              </PanelGroup>
            ) : (
              <CodingQuestionViewer
                title={question?.title || ''}
                description={question?.description || ''}
                examples={question?.runCodeTestCases?.map(tc => ({
                  input: tc.input,
                  output: tc.expected_output
                })) || []}
                constraints={question?.constraints || []}
              />
            )}
          </Panel>
          <ResizeHandle />

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