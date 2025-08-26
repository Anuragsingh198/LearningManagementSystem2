import React from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Paper,
  Chip
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

  const normalizedResults = (testResults || []).map(r => ({
    input: r.input || "",
    expectedOutput: r.expectedOutput || "",
    actualOutput: r.actualOutput || "",
    passed: r.passed
  }));

  const passedTests = normalizedResults.filter(r => r.passed).length;
  const totalTests = normalizedResults.length;

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRight: 1,
        borderColor: "divider",
        bgcolor: "background.paper"
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 1.5,
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "grey.50"
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Terminal size={18} />
          <Typography variant="subtitle1" fontWeight="medium">
            Output
          </Typography>
        </Stack>
        <IconButton size="small" onClick={onClose}>
          <X size={18} />
        </IconButton>
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
        {/* Compilation Status */}
        <Paper
          variant="outlined"
          sx={{
            p: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
            borderColor: compilationSuccess ? "success.light" : "error.light",
            bgcolor: compilationSuccess ? "success.50" : "error.50"
          }}
        >
          {compilationSuccess ? (
            <CheckCircle size={18} color="green" />
          ) : (
            <XCircle size={18} color="red" />
          )}
          <Typography
            fontWeight="medium"
            color={compilationSuccess ? "success.dark" : "error.dark"}
          >
            {compilationSuccess ? "Compilation successful" : "Compilation failed"}
          </Typography>
        </Paper>

        {compilationError && (
          <Paper
            variant="outlined"
            sx={{
              mt: 1,
              p: 1.5,
              borderColor: "error.light",
              bgcolor: "error.50",
              fontSize: "0.75rem",
              fontFamily: "Fira Code, monospace",
              whiteSpace: "pre-wrap"
            }}
          >
            {compilationError}
          </Paper>
        )}

        {/* Test Results */}
        {compilationSuccess && totalTests > 0 && (
          <Box mt={2}>
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Typography variant="subtitle2" fontWeight="medium">
                Test Results
              </Typography>
              <Chip
                size="small"
                label={`${passedTests}/${totalTests} passed`}
                sx={{
                  bgcolor:
                    passedTests === totalTests ? "success.100" : "error.100",
                  color:
                    passedTests === totalTests ? "success.800" : "error.800"
                }}
              />
            </Stack>

            <Stack spacing={1}>
              {normalizedResults.map((res, i) => (
                <Paper
                  key={i}
                  variant="outlined"
                  sx={{
                    p: 1.5,
                    borderColor: res.passed ? "success.light" : "error.light",
                    bgcolor: res.passed ? "success.50" : "error.50"
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    {res.passed ? (
                      <CheckCircle size={14} color="green" />
                    ) : (
                      <XCircle size={14} color="red" />
                    )}
                    <Typography
                      variant="body2"
                      fontWeight="medium"
                      color={res.passed ? "success.dark" : "error.dark"}
                    >
                      Test {i + 1}
                    </Typography>
                  </Stack>

                  <Typography
                    variant="caption"
                    sx={{ fontFamily: "Fira Code, monospace", display: "block" }}
                  >
                    Input: {res.input}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ fontFamily: "Fira Code, monospace", display: "block" }}
                  >
                    Expected: {res.expectedOutput}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontFamily: "Fira Code, monospace",
                      display: "block",
                      color: res.passed ? "inherit" : "error.main"
                    }}
                  >
                    Your Output: {res.actualOutput}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Box>
        )}

        {/* Console Output */}
        {executionOutput && (
          <Box mt={2}>
            <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
              Console Output
            </Typography>
            <Paper
              sx={{
                p: 1.5,
                bgcolor: "grey.900",
                color: "success.light",
                fontFamily: "Fira Code, monospace",
                fontSize: "0.75rem",
                whiteSpace: "pre-wrap"
              }}
            >
              {executionOutput}
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default OutputPanel;
