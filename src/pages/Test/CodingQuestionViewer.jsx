import React from "react";
import { Book, Code, CheckCircle, AlertTriangle } from "lucide-react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  Chip,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";

// Define fixed yellow colors
const YELLOW_MAIN = "#facc15"; // soft yellow
const YELLOW_BG = "rgba(250, 204, 21, 0.2)"; // pastel yellow bg

// Example Box (Problem Description)
const StyledExampleBox = styled(Paper)(({ theme }) => ({
  borderLeft: `4px solid ${theme.palette.primary.main}`,
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[50],
  marginBottom: theme.spacing(2),
  borderRadius: "4px",
  boxShadow: "none",
}));

// Constraint Box (soft yellow bg + yellow border)
const StyledConstraintBox = styled(Paper)(() => ({
  backgroundColor: YELLOW_BG,
  border: `1px solid ${YELLOW_MAIN}`,
  borderRadius: "4px",
  padding: "16px",
  boxShadow: "none",
}));

// Soft Chip (fixed pastel blue for Example label, small + inline)
const SoftChip = styled(Chip)(({ theme }) => ({
  borderRadius: "4px",
  border: `1px solid ${theme.palette.primary.main}`,
  backgroundColor: alpha(theme.palette.primary.light, 0.2),
  color: theme.palette.primary.main,
  fontWeight: 500,
  fontSize: "0.7rem",
  height: 20,
  alignSelf: "flex-start", // prevents stretching
}));

const CodingQuestionViewer = ({ title, description, examples, constraints }) => {
  return (
    <Box sx={{ height: "100%", overflowY: "auto", bgcolor: "background.paper" }}>
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
        
        {/* Title */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Code size={24} color="#2563eb" />
          <Typography variant="h4" component="h2" sx={{ fontWeight: "bold" }}>
            {title}
          </Typography>
        </Box>

        {/* Description */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Book size={20} color="#4b5563" />
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
              Problem Description
            </Typography>
          </Box>
          <StyledExampleBox>
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", lineHeight: 1.75 }}
            >
              {description}
            </Typography>
          </StyledExampleBox>
        </Box>

        {/* Examples */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckCircle size={20} color="#16a34a" />
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
              Examples
            </Typography>
          </Box>

          {examples.map((example, index) => (
            <Paper
              key={index}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: "4px",
                p: 2,
                boxShadow: "none",
                backgroundColor: "#fff",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {/* Inline Chip */}
                <SoftChip label={`Example ${index + 1}`} size="small" />

                <Typography variant="body2" sx={{ fontWeight: 500, color: "text.secondary" }}>
                  Input:{" "}
                  <Typography component="span" variant="body2" sx={{ color: "text.primary" }}>
                    {example.input}
                  </Typography>
                </Typography>

                <Typography variant="body2" sx={{ fontWeight: 500, color: "text.secondary" }}>
                  Output:{" "}
                  <Typography component="span" variant="body2" sx={{ color: "text.primary" }}>
                    {example.output}
                  </Typography>
                </Typography>

                {example.explanation && (
                  <Typography variant="body2" sx={{ fontWeight: 500, color: "text.secondary" }}>
                    Explanation:{" "}
                    <Typography component="span" variant="body2" sx={{ color: "text.primary" }}>
                      {example.explanation}
                    </Typography>
                  </Typography>
                )}
              </Box>
            </Paper>
          ))}
        </Box>

        {/* Constraints */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AlertTriangle size={20} color={YELLOW_MAIN} />
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
              Constraints
            </Typography>
          </Box>

          <StyledConstraintBox>
            <List dense sx={{ py: 0 }}>
              {(Array.isArray(constraints) ? constraints : [constraints])?.map(
                (constraint, index) => (
                  <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 24 }}>
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          bgcolor: YELLOW_MAIN,
                          borderRadius: "4px",
                          mt: "8px",
                        }}
                      />
                    </ListItemIcon>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {constraint}
                    </Typography>
                  </ListItem>
                )
              )}
            </List>
          </StyledConstraintBox>
        </Box>
      </Box>
    </Box>
  );
};

export default CodingQuestionViewer;
