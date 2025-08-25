import React, { useRef } from "react";
import {
  Box,
  Button,
  Divider,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const QuestionSidebar = ({
  questions,
  currentQuestionIndex,
  questionStatus,
  onQuestionSelect,
}) => {
  const scrollRef = useRef(null);
  const scrollAmount = 80;

  const scrollUp = () => {
    scrollRef.current?.scrollBy({ top: -scrollAmount, behavior: "smooth" });
  };

  const scrollDown = () => {
    scrollRef.current?.scrollBy({ top: scrollAmount, behavior: "smooth" });
  };

  const getButtonStyles = (questionId, isActive) => {
    const status = questionStatus[questionId];

    const baseStyles = {
      width: 44,
      height: 44,
      ml: 3,
      borderRadius: "4px",
      fontWeight: 600,
      fontSize: "0.875rem",
      minWidth: 0,
      boxShadow: "none",
      borderWidth: "2px",
      borderStyle: "solid",
      transition: "all 0.15s",
    };

    switch (status) {
      case "answered":
        return {
          ...baseStyles,
          bgcolor: "#a5d6a7",
          borderColor: "#1aaa21ff",
          color: "#2e7d32",
          ...(isActive && {
            bgcolor: "#2e7d32",
            borderColor: "#2e7d32",
            color: "#fff",
          }),
          "&:hover": {
            bgcolor: isActive ? "#2e7d32" : "#c8e6c9",
            borderColor: "#2e7d32",
          },
        };

      case "visited":
        return {
          ...baseStyles,
          bgcolor: "#e3f2fd",
          borderColor: "#90caf9",
          color: "#1976d2",
          ...(isActive && {
            bgcolor: "#1976d2",
            borderColor: "#1976d2",
            color: "#fff",
          }),
          "&:hover": {
            bgcolor: isActive ? "#1976d2" : "#bbdefb",
            borderColor: "#1976d2"
          },
        };

      default: // unvisited
        return {
          ...baseStyles,
          bgcolor: "#f5f5f5",
          borderColor: "#e0e0e0",
          color: "#616161",
          ...(isActive && {
            bgcolor: "#9e9e9e",
            borderColor: "#9e9e9e",
            color: "#fff",
          }),
          "&:hover": {
            bgcolor: isActive ? "#9e9e9e" : "#e0e0e0",
            borderColor: "#9e9e9e",
          },
        };
    }
  };

  const mcqQuestions = questions.filter((q) => q.type === "mcq");
  const codingQuestions = questions.filter((q) => q.type === "coding");

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderRight: 1,
        borderColor: "divider",
        width: 80,
        py: 2,
        px: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Scroll Up */}
      <IconButton onClick={scrollUp} size="small" sx={{ mb: 1 }}>
        <ArrowDropUpIcon />
      </IconButton>

      {/* Scrollable Area */}
      <Box
        ref={scrollRef}
        sx={{
          flexGrow: 1,
          pb: 1,
          overflowY: "auto",
          maxHeight: "calc(100vh - 200px)",
          "&::-webkit-scrollbar": { display: "none" },
          "-ms-overflow-style": "none",
          scrollbarWidth: "none",
        }}
      >
        <Stack spacing={2} marginLeft={1}>
          {/* MCQ Section */}
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            MCQ
          </Typography>

          <Stack spacing={1}>
            {mcqQuestions.map((question, index) => {
              const globalIndex = index;
              return (
                <Button
                  key={question._id}
                  onClick={() => onQuestionSelect(globalIndex)}
                  sx={getButtonStyles(
                    question._id,
                    currentQuestionIndex === globalIndex
                  )}
                  disableElevation
                >
                  {index + 1}
                </Button>
              );
            })}
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* Coding Section */}
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            Coding
          </Typography>

          <Stack spacing={1}>
            {codingQuestions.map((question, index) => {
              const globalIndex = mcqQuestions.length + index;
              return (
                <Button
                  key={question._id}
                  onClick={() => onQuestionSelect(globalIndex)}
                  sx={getButtonStyles(
                    question._id,
                    currentQuestionIndex === globalIndex
                  )}
                  disableElevation
                >
                  {index + 1}
                </Button>
              );
            })}
          </Stack>
        </Stack>
      </Box>

      {/* Scroll Down */}
      <IconButton onClick={scrollDown} size="small" sx={{ mt: 1 }}>
        <ArrowDropDownIcon />
      </IconButton>
    </Box>
  );
};

export default QuestionSidebar;
