import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Divider,
  List,
  ListItem,
  Modal,
  Stack,
  TablePagination,
  Checkbox,
  Menu,
  MenuItem,
  ListItemText,
} from "@mui/material";

import {
  User,
  FileText,
  BarChart3,
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
} from "lucide-react";

import { useAssignmentContext } from "../../context/contextFiles/assignmentContext";
import MuiLoading from "../common/Loading";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import { reviewAssignmentAdmin } from "../../context/Actions/AssignmentActions";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

// Markdown renderer component
const MarkdownRenderer = ({ children }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        code({node, inline, className, children, ...props}) {
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
      {children}
    </ReactMarkdown>
  );
};

// Modal style
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxHeight: "80vh",
  bgcolor: "background.paper",
  p: 4,
  overflowY: "auto",
  borderRadius: 2,
};

function ViewAllResultsAdmin() {
  const { state: { AllEmployeeResult, AssessmentOverviewDetails }, dispatch } = useAssignmentContext();

  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [loading, setLoading] = useState(false)
  const [isQuestionPaperOpen, setIsQuestionPaperOpen] = useState(false);
  const [loadingRow, setLoadingRow] = useState(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Column toggle state
  const [visibleColumns, setVisibleColumns] = useState({
    employee: true,
    id: true,
    email: true,
    status: true,
    score: true,
    percentage: true,
    completedAt: true,
    actions: true,
  });

  // Dropdown state
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const themeColor = "#1976d2";

  const navigate = useNavigate();

  if (!AllEmployeeResult || !AssessmentOverviewDetails) {
    return <MuiLoading />;
  }

  const results = AllEmployeeResult;
  const assessment = AssessmentOverviewDetails;

  const handleRowClick = async (userId) => {
    setLoadingRow(userId);
    const assessmentId = assessment._id;
    await reviewAssignmentAdmin(dispatch, assessmentId, userId);
    setLoadingRow(null);
    navigate(`/assessments/view-result/${userId}`);
  };

  // Chip styles
  const chipStyles = (border, color, bg) => ({
    borderColor: border,
    color,
    borderRadius: "4px",
    backgroundColor: bg,
    fontWeight: 500,
  });

  const getStatusChip = (status) => {
    if (status === "passed") {
      return (
        <Chip
          label="Passed"
          icon={<CheckCircle2 size={16} color="#2e7d32" />}
          variant="outlined"
          sx={chipStyles("#a5d6a7", "#2e7d32", "#e8f5e9")}
        />
      );
    }
    if (status === "failed") {
      return (
        <Chip
          label="Failed"
          icon={<XCircle size={16} color="#c62828" />}
          variant="outlined"
          sx={chipStyles("#ef9a9a", "#c62828", "#ffebee")}
        />
      );
    }
    return (
      <Chip
        label="In-Progress"
        variant="outlined"
        sx={chipStyles("#90a4ae", "#546e7a", "#eceff1")}
      />
    );
  };

  const getPercentageChip = (percentage) => {
    if (percentage >= 70) {
      return (
        <Chip
          label={`${percentage}%`}
          variant="outlined"
          sx={chipStyles("#a5d6a7", "#2e7d32", "#e8f5e9")}
        />
      );
    }
    if (percentage >= 50) {
      return (
        <Chip
          label={`${percentage}%`}
          variant="outlined"
          sx={chipStyles("#ffcc80", "#ef6c00", "#fff3e0")}
        />
      );
    }
    return (
      <Chip
        label={`${percentage}%`}
        variant="outlined"
        sx={chipStyles("#ef9a9a", "#c62828", "#ffebee")}
      />
    );
  };

  // Employee Results Table
  const EmployeeResultsTable = () => (
    <TableContainer
      component={Paper}
      sx={{
        mt: 3,
        borderRadius: "6px",
        boxShadow: "none",
        border: "1px solid #e0e0e0",
        maxHeight: 420,
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f0f4f8" }}>
            {visibleColumns.employee && (
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Employee
              </TableCell>
            )}
            {visibleColumns.id && (
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                ID
              </TableCell>
            )}
            {visibleColumns.email && (
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Email
              </TableCell>
            )}
            {visibleColumns.status && (
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Status
              </TableCell>
            )}
            {visibleColumns.score && (
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Score
              </TableCell>
            )}
            {visibleColumns.percentage && (
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Percentage
              </TableCell>
            )}
            {visibleColumns.completedAt && (
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Completed At
              </TableCell>
            )}
            {visibleColumns.actions && (
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Action(s)
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {results
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((result, index) => (
              <TableRow
                key={index}
                hover
                onClick={() => handleRowClick(result.user?._id)}
                sx={{
                  "&:hover": { backgroundColor: "#f5faff" },
                  backgroundColor: index % 2 === 0 ? "#ffffff" : "#fafafa",
                  transition: "background-color 0.2s ease",
                }}
              >
                {visibleColumns.employee && (
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                      }}
                    >
                      <User size={18} />
                      <Typography>{result.user?.name || "N/A"}</Typography>
                    </Box>
                  </TableCell>
                )}
                {visibleColumns.id && (
                  <TableCell align="center">
                    {result.user?.employeeId || "N/A"}
                  </TableCell>
                )}
                {visibleColumns.email && (
                  <TableCell align="center">
                    {result.user?.email || "N/A"}
                  </TableCell>
                )}
                {visibleColumns.status && (
                  <TableCell align="center">
                    {getStatusChip(result.status)}
                  </TableCell>
                )}
                {visibleColumns.score && (
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    {result.totalMarksScored || 0}/{result.maxMarks || 0}
                  </TableCell>
                )}
                {visibleColumns.percentage && (
                  <TableCell align="center">
                    {getPercentageChip(result.percentageMarksScore || 0)}
                  </TableCell>
                )}
                {visibleColumns.completedAt && (
                  <TableCell align="center">
                    {result.completedAt
                      ? new Date(result.completedAt).toLocaleString()
                      : "Incomplete"}
                  </TableCell>
                )}
                {visibleColumns.actions && (
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        borderColor: themeColor,
                        color: themeColor,
                        "&:hover": {
                          backgroundColor: "#e3f2fd",
                          borderColor: themeColor,
                        },
                        minWidth: 120, // keeps button width stable
                      }}
                      disabled={loadingRow === result.user?._id}
                    >
                      {loadingRow === result.user?._id ? (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <CircularProgress size={16} sx={{ color: themeColor }} />
                          <Typography variant="body2" sx={{ color: themeColor }}>
                            Loading
                          </Typography>
                        </Box>
                      ) : (
                        "View Result"
                      )}
                    </Button>

                  </TableCell>
                )}
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        rowsPerPageOptions={[5, 10, 25]}
        count={results.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
    </TableContainer>
  );

  return (
    <Box sx={{ p: 3, color: "text.primary" }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: "6px",
          border: "1px solid #e0e0e0",
          boxShadow: "none",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BarChart3 color="#1976d2" size={20} />
            <Typography variant="h5">Employee Results</Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            {/* Column toggle dropdown */}
            <Button
              variant="outlined"
              startIcon={<SlidersHorizontal size={16} />}
              onClick={handleMenuOpen}
            >
              Columns
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  borderRadius: "6px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  minWidth: 200,
                  p: 1,
                },
              }}
            >
              {Object.keys(visibleColumns).map((col) => (
                <MenuItem
                  key={col}
                  onClick={() =>
                    setVisibleColumns((prev) => ({
                      ...prev,
                      [col]: !prev[col],
                    }))
                  }
                >
                  <Checkbox checked={visibleColumns[col]} size="small" />
                  <ListItemText
                    primary={
                      col.charAt(0).toUpperCase() + col.slice(1)
                    }
                  />
                </MenuItem>
              ))}
            </Menu>

            {/* View Question Paper */}
            <Button
              variant="outlined"
              startIcon={<FileText />}
              onClick={() => setIsQuestionPaperOpen(true)}
            >
              View Question Paper
            </Button>
          </Box>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <EmployeeResultsTable />
      </Paper>

      {/* Modal placeholder */}
      <Modal
        open={isQuestionPaperOpen}
        onClose={() => setIsQuestionPaperOpen(false)}
      >
        <Box sx={modalStyle}>
          <Typography variant="h5">
            Assessment Question Paper: {assessment.title}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Button onClick={() => setIsQuestionPaperOpen(false)} variant="outlined">
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default ViewAllResultsAdmin;
