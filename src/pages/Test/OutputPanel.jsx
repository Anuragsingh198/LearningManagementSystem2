import React, { useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Paper,
  Chip,
  Grid
} from "@mui/material";
import { Terminal, X, CheckCircle, XCircle } from "lucide-react";

const OutputPanel = ({
  isOpen,
  onClose,
  compilationSuccess,
  compilationError,
  testResults,
  executionOutput
}) => {
  if (!isOpen) return null;

  // Map backend results to UI format

  // console.log( " complietionSuccess , compiloerError , testresults, executionOutput, ",testResults )

  // console.log('compilationSuccess is:', compilationSuccess)
  // console.log('compilationError is:', compilationError)
  // console.log('compilationSuccess is:', executionOutput)

  useEffect(() => {
    
  console.log('compilationSuccess is:', compilationSuccess)
  console.log('compilationError is:', compilationError)
  console.log('compilationSuccess is:', executionOutput)

  }, [compilationSuccess, compilationError, executionOutput])

  const normalizedResults = (testResults || []).map(r => ({
    input: r.input || "",
    expectedOutput: r.expectedOutput || "",
    actualOutput: r.actualOutput || "",
    passed: r.passed
  }));
   
  const passedTests = normalizedResults.filter(result => result.passed).length;
  const totalTests = normalizedResults.length;
  // console.log("compiled  result is : ", normalizedResults);
  // console.log("passedTests  result is : ", passedTests);
  // console.log("totalTests  result is : ", totalTests);
  return (
    <Box
      sx={{
        height: "100%",
        bgcolor: "background.paper",
        borderRight: 1,
        borderColor: "divider",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "grey.50"
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Terminal size={20} color="text.secondary" />
          <Typography variant="h6" fontWeight="medium" color="text.primary">
            Output
          </Typography>
        </Stack>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: "text.secondary", "&:hover": { color: "text.primary" } }}
        >
          <X size={20} />
        </IconButton>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          "& > * + *": {
            mt: 3
          }
        }}
      >
        {/* Compilation Status */}
        <Box>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            Compilation Status
          </Typography>
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              p: 2,
              borderRadius: 1,
              border: 1,
              borderColor: compilationSuccess ? "success.light" : "error.light",
              bgcolor: compilationSuccess ? "success.50" : "error.50"
            }}
          >
            {compilationSuccess ? (
              <>
                <CheckCircle size={20} color="success.main" />
                <Typography color="success.dark" fontWeight="medium">
                  Compilation successful
                </Typography>
              </>
            ) : (
              <>
                <XCircle size={20} color="error.main" />
                <Typography color="error.dark" fontWeight="medium">
                  Compilation failed
                </Typography>
              </>
            )}
          </Paper>

          {compilationError && (
            <Paper
              elevation={0}
              sx={{
                mt: 1,
                p: 2,
                borderRadius: 1,
                border: 1,
                borderColor: "error.light",
                bgcolor: "error.50"
              }}
            >
              <Box
                component="pre"
                sx={{
                  color: 'error.dark',
                  fontSize: '0.75rem',
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'Fira Code, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                  m: 0
                }}
              >
                {compilationError}
              </Box>
            </Paper>
          )}
        </Box>

        {/* Test Results */}
        {compilationSuccess && (
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={2}
            >
              <Typography variant="subtitle1" fontWeight="medium">
                Test Results
              </Typography>
              <Chip
                label={`${passedTests}/${totalTests} passed`}
                size="small"
                sx={{
                  bgcolor:
                    passedTests === totalTests ? "success.100" : "error.100",
                  color:
                    passedTests === totalTests ? "success.800" : "error.800",
                  fontWeight: "medium"
                }}
              />
            </Stack>

            <Stack spacing={2}>
              {normalizedResults.map((result, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    border: 1,
                    borderColor: result.passed ? "success.light" : "error.light",
                    bgcolor: result.passed ? "success.50" : "error.50"
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    {result.passed ? (
                      <CheckCircle size={16} color="success.main" />
                    ) : (
                      <XCircle size={16} color="error.main" />
                    )}
                    <Typography
                      variant="body2"
                      fontWeight="medium"
                      color={result.passed ? "success.dark" : "error.dark"}
                    >
                      Test Case {index + 1}
                    </Typography>
                  </Stack>

                  <Stack spacing={2}>
                    <Box>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        color="text.secondary"
                        gutterBottom
                      >
                        Input:
                      </Typography>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 1,
                          bgcolor: 'background.paper',
                          fontFamily: 'Fira Code, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                          fontSize: '0.75rem'
                        }}
                      >
                        {result.input}
                      </Paper>
                    </Box>

                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          color="text.secondary"
                          gutterBottom
                        >
                          Expected:
                        </Typography>
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 1,
                            bgcolor: 'background.paper',
                           fontFamily: 'Fira Code, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                            fontSize: '0.75rem'
                          }}
                        >
                          {result.expectedOutput}
                        </Paper>
                      </Grid>

                      <Grid item xs={6}>
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          color="text.secondary"
                          gutterBottom
                        >
                          Your Output:
                        </Typography>
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 1,
                            fontFamily: 'Fira Code, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                            fontSize: '0.75rem',
                            bgcolor: result.passed ? 'background.paper' : 'error.50',
                            borderColor: result.passed ? undefined : 'error.light'
                          }}
                        >
                          {result.actualOutput}
                        </Paper>
                      </Grid>
                    </Grid>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>
        )}

        {/* Execution Output */}
        {executionOutput && (
          <Box>
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Console Output
            </Typography>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: 'grey.900',
                color: 'success.light',
                fontFamily: 'Fira Code, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                fontSize: '0.75rem'
              }}
            >
              <Box component="pre" sx={{ m: 0, whiteSpace: "pre-wrap" }}>
                {executionOutput}
              </Box>
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default OutputPanel;
