import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
  Paper,
} from "@mui/material";
import {
  MoreVertical,
  Trash2,
  Share2,
  MessageSquare,
  ThumbsUp,
  BookOpen,
} from "lucide-react";
import { useAuth } from "../../context/contextFiles/AuthContext";
import { useCourseContext } from "../../context/contextFiles/CourseContext";
import {
  deleteCourse,
  getMyCoursesAction,
} from "../../context/Actions/courseActions";

const timeAgo = (isoDate) => {
  if (!isoDate) return "";
  const seconds = Math.floor(
    (Date.now() - new Date(isoDate).getTime()) / 1000
  );
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  const units = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [30, "day"],
    [12, "month"],
  ];
  let unitIndex = 0;
  let value = seconds;
  while (
    unitIndex < units.length - 1 &&
    Math.abs(value) >= units[unitIndex][0]
  ) {
    value = Math.floor(value / units[unitIndex][0]);
    unitIndex += 1;
  }
  const unit = units[unitIndex][1];
  return rtf.format(-value, unit);
};

const CourseListItem = ({ course, onViewCourse }) => {
  const {
    state: { user },
  } = useAuth();
  const role = user?.role;
  const { dispatch } = useCourseContext();

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    if (typeof course.overallPercentage === "number") {
      const timeout = setTimeout(
        () => setProgressValue(course.overallPercentage),
        200
      );
      return () => clearTimeout(timeout);
    }
  }, [course.overallPercentage]);

  const handleMenuOpen = (e) => setMenuAnchor(e.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  const handleDelete = () => {
    handleMenuClose();
    setOpenDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCourse(course._id, dispatch);
      await getMyCoursesAction(dispatch);
    } catch {
      // handled upstream
    } finally {
      setOpenDelete(false);
    }
  };

  const enrolledAgo = useMemo(
    () => timeAgo(course.enrolledDate),
    [course.enrolledDate]
  );
  const hasProgress = typeof course.overallPercentage === "number";

  const statusStyles = {
    completed: { backgroundColor: "#e6f4ea", color: "#1e4620" },
    pending: { backgroundColor: "#fff4e5", color: "#663c00" },
    default: { backgroundColor: "#f0f0f0", color: "#333" },
  };

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 2,
        p: 2.5,
        borderRadius: 2,
        backgroundColor: "#fff",
        border: "1px solid #eee",
        boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
        transition: "all 0.25s ease",
        "&:hover": {
          borderColor: "#ddd",
          transform: "translateY(-1px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        },
      }}
    >
      {/* Thumbnail */}
      <Avatar
        variant="rounded"
        src={course.thumbnail}
        alt={course.title}
        sx={{
          width: 60,
          height: 60,
          borderRadius: 1,
          boxShadow: 1,
          flexShrink: 0,
        }}
      />

      {/* Details */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Title + Chips */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight={600}
            noWrap
            sx={{ fontSize: "1rem" }}
          >
            {course.title}
          </Typography>

          {course.category && (
            <Chip
              size="small"
              label={course.category}
              variant="outlined"
              sx={{
                height: 22,
                fontWeight: 500,
                borderRadius: '4px',
                color: '#1976d2',
                borderColor: '#1976d2',
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
              }}
            />
          )}

          {course.status && (
            <Chip
              size="small"
              label={
                course.status === "completed"
                  ? "Completed"
                  : course.status === "pending"
                  ? "Ongoing"
                  : "Pending"
              }
              sx={{
                height: 22,
                fontWeight: 500,
                ...(
                  course.status === "completed"
                    ? statusStyles.completed
                    : course.status === "pending"
                    ? statusStyles.pending
                    : statusStyles.default
                ),
              }}
            />
          )}

          {course.overallPercentage !== undefined && (
            <Chip
              size="small"
              label={`${Math.round(course.overallPercentage || 0)}%`}
              sx={{
                height: 22,
                fontWeight: 500,
                backgroundColor: "#e9f2ff",
                color: "#084298",
              }}
            />
          )}
        </Box>

        {/* Instructor + Time */}
        <Typography
          variant="body2"
          color="text.secondary"
          noWrap
          sx={{ mt: 0.3 }}
        >
          {course.instructorName ||
            course.instructor?.name ||
            "Instructor"}
          {course.enrolledDate ? ` • ${enrolledAgo}` : ""}
        </Typography>

        {/* Progress Bar */}
        {hasProgress && (
          <Box sx={{ mt: 1.5 }}>
            <LinearProgress
              variant="determinate"
              value={progressValue}
              sx={{
                height: 6,
                borderRadius: 4,
                backgroundColor: "#f0f0f0",
                "& .MuiLinearProgress-bar": {
                  transition: "width 0.6s ease",
                  backgroundColor: "#1976d2",
                },
              }}
            />
          </Box>
        )}

        {/* Actions */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            mt: 1.8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Tooltip title="View Course" arrow>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.7,
                cursor: "pointer",
                color: "text.secondary",
                "&:hover": { color: "primary.main" },
              }}
              onClick={() => onViewCourse?.(course)}
            >
              <BookOpen size={16} />
              <Typography variant="body2">View</Typography>
            </Box>
          </Tooltip>

          {/* <Tooltip title="Mark as Helpful" arrow>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.7,
                color: "text.secondary",
                cursor: "pointer",
                "&:hover": { color: "primary.main" },
              }}
            >
              <ThumbsUp size={16} />
              <Typography variant="body2">Helpful</Typography>
            </Box>
          </Tooltip>

          <Tooltip title="Leave a Comment" arrow>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.7,
                color: "text.secondary",
                cursor: "pointer",
                "&:hover": { color: "primary.main" },
              }}
            >
              <MessageSquare size={16} />
              <Typography variant="body2">Comment</Typography>
            </Box>
          </Tooltip>

          <Tooltip title="Share Course" arrow>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.7,
                color: "text.secondary",
                cursor: "pointer",
                "&:hover": { color: "primary.main" },
              }}
            >
              <Share2 size={16} />
              <Typography variant="body2">Share</Typography>
            </Box>
          </Tooltip> */}
        </Box>
      </Box>

      {/* Instructor menu */}
      {!hasProgress && role === "instructor" && (
        <>
          <IconButton onClick={handleMenuOpen}>
            <MoreVertical size={18} />
          </IconButton>
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
              <Trash2 size={16} style={{ marginRight: 8 }} /> Delete
            </MenuItem>
          </Menu>
        </>
      )}

      {/* Delete Confirmation */}
      <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the course "{course.title}"? This
          action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={confirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default CourseListItem;
