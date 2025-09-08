import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Grid,
  Tooltip,
  IconButton,
} from "@mui/material";
import { BookOpen, Award, ClipboardList, Edit } from "lucide-react";
import coverImg from "../../assets/cover-2.png";
import profileImg from "../../assets/profile.png";
import CourseListItem from "./CourseListItem";
import EditProfileDialog from "./EditProfileDialog";
import { useCourseContext } from "../../context/contextFiles/CourseContext";
import { useAuth } from "../../context/contextFiles/AuthContext";
import { getCourseWithProgress } from "../../context/Actions/courseActions";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const numericStyle = { fontFamily: "'Fira Code', monospace" };

const UserDetails = () => {
  const [activeTab, setActiveTab] = useState("courses");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const {
    state: { myCourses, loading, error, oneCourse, allTestProgress },
    dispatch: courseDispatch,
  } = useCourseContext();
  const {
    state: { user: authUser },
    dispatch: authDispatch,
  } = useAuth();
  const navigate = useNavigate();

  // Derive role-based pill label and colors
  const role = authUser?.role;
  const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : "Employee";
  const pillStyles =
    role === "instructor"
      ? { background: "rgba(255, 152, 0, 0.15)", color: "#E65100" }
      : role === "employee"
      ? { background: "rgba(76, 175, 80, 0.15)", color: "#2E7D32" }
      : { background: "rgba(33, 150, 243, 0.15)", color: "#1565C0" };

  const handleViewCourse = async (course) => {
    if (!oneCourse) {
      try {
        courseDispatch({ type: "COURSE_LOADING" });
        await getCourseWithProgress(course._id, authUser?._id, courseDispatch);
      } catch (err) {
        console.error("Failed to fetch course progress:", err);
        return;
      }
    }
    navigate(`/course/details/${course._id}`);
  };

  const handleEditOpen = () => setIsEditOpen(true);
  const handleEditClose = () => setIsEditOpen(false);
  const handleEditSave = (payload) => {
    authDispatch({ type: "UPDATE_PROFILE", payload });
    try {
      const stored = JSON.parse(localStorage.getItem("user")) || {};
      const updated = { ...stored, ...payload };
      localStorage.setItem("user", JSON.stringify(updated));
    } catch (_) {
      // ignore localStorage errors
    }
    setIsEditOpen(false);
  };

  const user = {
    // name: "Adi Jain",
    // status: "Student",
    // bio: "What Not , He is Everything",
    avatar: profileImg,
    cover: coverImg,
  };

  // Derived stats from existing context/state
  const registeredCoursesCount = useMemo(
    () => (Array.isArray(myCourses) ? myCourses.length : 0),
    [myCourses]
  );

  const certificatesCount = useMemo(() => {
    if (!Array.isArray(myCourses)) return 0;
    return myCourses.reduce((acc, course) => {
      const percentage = Math.round(course?.overallPercentage || 0);
      const completedByStatus = course?.status === "completed";
      return acc + (completedByStatus || percentage >= 100 ? 1 : 0);
    }, 0);
  }, [myCourses]);

  const assessmentsTakenCount = useMemo(
    () => (Array.isArray(allTestProgress) ? allTestProgress.length : 0),
    [allTestProgress]
  );

  const certificates = [
    // { title: "Full Stack Developer", provider: "Digividya", date: "Mar 2024" },
    // { title: "Cloud Fundamentals", provider: "Digividya", date: "Apr 2024" },
  ];

  const tests = [
    // { title: "JavaScript Test", score: "85%", date: "May 2024" },
    // { title: "React Test", score: "90%", date: "Jun 2024" },
  ];

  const menu = [
    { key: "courses", label: "Registered Courses", icon: <BookOpen size={18} /> },
    { key: "certificates", label: "Certificates", icon: <Award size={18} /> },
    { key: "tests", label: "Assessments Taken", icon: <ClipboardList size={18} /> },
  ];

  const renderContent = () => {
    if (activeTab === "courses") {
      return (
        <Box>
          {myCourses && myCourses.length > 0 ? (
            myCourses.map((course) => (
              <CourseListItem key={course._id || course.id} course={course} onViewCourse={handleViewCourse} />
            ))
          ) : (
            <Typography color="text.secondary">No registered courses found.</Typography>
          )}
        </Box>
      );
    }

    const data = activeTab === "certificates" ? certificates : tests;

    return (
      <Box display="flex" flexDirection="column" gap={2}>
        {data.map((item, index) => (
          <Box
            key={index}
            sx={{
              p: 1,
              borderBottom: "1px solid #f0f0f0",
              "&:hover": { backgroundColor: "#f5faff" },
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              {item.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.provider || (
                <>
                  Score: <span style={numericStyle}>{item.score}</span>
                </>
              )}{" "}
              • {item.date}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        bgcolor: "#fff",
        minHeight: "100vh",
      }}
    >
      {/* Cover */}
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            height: { xs: 280, sm: 340 },
            backgroundImage: `url(${user.cover})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          {/* Overlay */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.1))",
            }}
          />

          {/* Edit action moved next to the name */}
        </Box>

        {/* Avatar */}
        <Avatar
          src={authUser?.avatar || user.avatar}
          sx={{
            width: 120,
            height: 120,
            border: "2px solid white",
            borderRadius: "4px",
            position: "absolute",
            bottom: -55,
            left: 32,
          }}
        />
      </Box>

      {/* Info Row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, sm: 4 },
          mt: 0.9,
          ml: 4,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        {/* Left: Name, Pill, Bio */}
        <Box sx={{ ml: { xs: 0, sm: 15 } }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6" fontWeight={600}>
              {authUser?.name || authUser?.fullName || authUser?.username || user.name}
            </Typography>
            <Tooltip title="Edit profile" placement="right">
              <IconButton
                size="small"
                aria-label="Edit profile"
                onClick={handleEditOpen}
                sx={{ color: "#1976d2" }}
              >
                <Edit size={18} />
              </IconButton>
            </Tooltip>
            <Box
              sx={{
                paddingLeft: "12px",
                paddingRight: "12px",
                paddingTop: "2px",
                paddingBottom: "2px",
                borderRadius: "4px",
                fontSize: "0.75rem",
                fontWeight: 500,
                backgroundColor: pillStyles.background,
                color: pillStyles.color,
                border: `1px solid ${pillStyles.color}`,
              }}
            >
              {roleLabel}
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {authUser?.email || user.bio}
          </Typography>
        </Box>

        {/* Right: Stats */}
        <Box display="flex" gap={6} mt={0.5}>
          <Box>
            <Typography
              variant="body2"
              sx={{ fontSize: "0.9rem", color: "text.secondary" }}
            >
              Registered Courses
            </Typography>
            <Typography
              sx={{
                fontSize: "2rem",
                fontWeight: 700,
                textAlign: "left",
                mt: -1,
                ...numericStyle,
              }}
            >
              {registeredCoursesCount}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="body2"
              sx={{ fontSize: "0.9rem", color: "text.secondary" }}
            >
              Certificates
            </Typography>
            <Typography
              sx={{
                fontSize: "2rem",
                fontWeight: 700,
                textAlign: "left",
                mt: -1,
                ...numericStyle,
              }}
            >
              {certificatesCount}
            </Typography>
          </Box>

          <Box>
            <Typography
              variant="body2"
              sx={{ fontSize: "0.9rem", color: "text.secondary" }}
            >
              Assessments Taken
            </Typography>
            <Typography
              sx={{
                fontSize: "2rem",
                fontWeight: 700,
                textAlign: "left",
                mt: -1,
                ...numericStyle,
              }}
            >
              {assessmentsTakenCount}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Main Layout */}
      <Box sx={{ px: { xs: 2, sm: 4 }, mt: 4, display: "flex", gap: 3 }}>
        {/* Sidebar */}
        <Box sx={{ width: "18rem", flex: "0 0 18rem" }}>
          {menu.map((m) => (
            <Box
              key={m.key}
              onClick={() => {
                // setActiveTab(m.key)
                toast.warning("Feature under development")
              }}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                py: 1.2,
                px: 2,
                cursor: "pointer",
                position: "relative",
                background:
                  activeTab === m.key
                    ? "linear-gradient(to right, rgba(255,255,255,0.95) 0%, rgba(25,118,210,0.05) 40%, rgba(25,118,210,0.15) 100%)"
                    : "transparent",
                "&:hover": {
                  background:
                    "linear-gradient(to right, rgba(255,255,255,0.95) 0%, rgba(25,118,210,0.05) 40%, rgba(25,118,210,0.15) 100%)",
                },
                borderRadius: 0,
                "&::before": {
                  content: '""',
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "4px",
                  backgroundColor:
                    activeTab === m.key ? "#1976d2" : "transparent",
                },
              }}
            >
              <Box sx={{ color: activeTab === m.key ? "#1976d2" : "#555" }}>
                {m.icon}
              </Box>
              <Typography
                fontWeight={activeTab === m.key ? 600 : 400}
                sx={{
                  color: activeTab === m.key ? "#1976d2" : "#333",
                }}
              >
                {m.label}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1 }}>
          {renderContent()}
        </Box>
      </Box>

      <EditProfileDialog
        open={isEditOpen}
        onClose={handleEditClose}
        onSave={handleEditSave}
        onChangePassword={(payload) => {
          // placeholder for future API integration
          // console.log("Change password requested", payload);
        }}
        initialValues={{
          name: authUser?.name || authUser?.fullName || authUser?.username || "",
          email: authUser?.email || "",
          avatar: authUser?.avatar || user.avatar,
        }}
      />
    </Box>
  );
};

export default UserDetails;
