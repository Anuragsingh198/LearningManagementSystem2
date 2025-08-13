import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Grid,
} from "@mui/material";
import {
  BookOpen,
  Award,
  ClipboardList,
  Edit,
} from "lucide-react";

const UserDetails = () => {
  const [activeTab, setActiveTab] = useState("courses");

  const user = {
    name: "John Doe",
    avatar:
      "https://static.vecteezy.com/system/resources/previews/051/270/245/non_2x/cartoon-people-avatar-minimalist-human-avatar-versatile-icon-for-online-projects-an-avatar-for-the-profile-picture-of-someone-vector.jpg",
    cover:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop", // Blue ocean theme
    stats: {
      courses: 5,
      certificates: 3,
      tests: 8,
    },
  };

  const courses = [
    { title: "React Basics", provider: "Digividya", date: "Jan 2024" },
    { title: "Advanced JavaScript", provider: "Digividya", date: "Feb 2024" },
  ];

  const certificates = [
    { title: "Full Stack Developer", provider: "Digividya", date: "Mar 2024" },
    { title: "Cloud Fundamentals", provider: "Digividya", date: "Apr 2024" },
  ];

  const tests = [
    { title: "JavaScript Test", score: "85%", date: "May 2024" },
    { title: "React Test", score: "90%", date: "Jun 2024" },
  ];

  const menu = [
    { key: "courses", label: "Registered Courses", icon: <BookOpen size={18} /> },
    { key: "certificates", label: "Certificates", icon: <Award size={18} /> },
    { key: "tests", label: "Tests Taken", icon: <ClipboardList size={18} /> },
  ];

  const renderContent = () => {
    const data =
      activeTab === "courses"
        ? courses
        : activeTab === "certificates"
        ? certificates
        : tests;

    return (
      <Box display="flex" flexDirection="column" gap={2}>
        {data.map((item, index) => (
          <Box
            key={index}
            sx={{
              p: 1,
              borderBottom: "1px solid #f0f0f0",
              transition: "background-color 0.2s ease",
              "&:hover": { backgroundColor: "#f5faff" },
            }}
          >
            <Typography variant="subtitle1" fontWeight={600}>
              {item.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.provider || `Score: ${item.score}`} • {item.date}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        fontFamily: "Okra, Helvetica, sans-serif",
        bgcolor: "#fff",
        minHeight: "100vh",
      }}
    >
      {/* Cover + Profile */}
      <Box sx={{ position: "relative", mb: { xs: 10, sm: 8 } }}>
        <Box
          sx={{
            height: { xs: 180, sm: 220 },
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
              bgcolor: "rgba(25, 118, 210, 0.4)", // Blue overlay
            }}
          />
        </Box>

        {/* Profile Info */}
        <Box
          sx={{
            position: "absolute",
            bottom: -50,
            left: { xs: "50%", sm: 40 },
            transform: { xs: "translateX(-50%)", sm: "none" },
            display: "flex",
            alignItems: "center",
            gap: 3,
            flexDirection: { xs: "column", sm: "row" },
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          <Avatar
            src={user.avatar}
            sx={{
              width: 100,
              height: 100,
              border: "4px solid white",
            }}
          />
          <Box>
            <Typography variant="h6" fontWeight={600} color="#fff">
              {user.name}
            </Typography>
            <Box
              display="flex"
              gap={3}
              mt={0.5}
              justifyContent={{ xs: "center", sm: "flex-start" }}
              sx={{ color: "#fff" }}
            >
              <Typography variant="body2">
                {user.stats.courses} Courses
              </Typography>
              <Typography variant="body2">
                {user.stats.certificates} Certificates
              </Typography>
              <Typography variant="body2">
                {user.stats.tests} Tests
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Edit Profile Button */}
        <Button
          variant="contained"
          startIcon={<Edit size={16} />}
          sx={{
            position: "absolute",
            top: 20,
            right: 20,
            bgcolor: "#1976d2",
            "&:hover": { bgcolor: "#145ea8" },
            textTransform: "none",
            borderRadius: "20px",
            px: 2.5,
            py: 0.5,
            fontWeight: 500,
            fontSize: "0.875rem",
          }}
        >
          Edit Profile
        </Button>
      </Box>

      {/* Main Layout */}
      <Grid container spacing={3} sx={{ px: { xs: 2, sm: 4 } }}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Box>
            {menu.map((m) => (
              <Box
                key={m.key}
                onClick={() => setActiveTab(m.key)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  py: 1,
                  px: 1,
                  cursor: "pointer",
                  bgcolor:
                    activeTab === m.key ? "rgba(25,118,210,0.08)" : "transparent",
                  "&:hover": {
                    bgcolor: "rgba(25,118,210,0.08)",
                  },
                  borderRadius: 1,
                  transition: "background-color 0.2s ease",
                }}
              >
                <Box sx={{ color: "#1976d2" }}>{m.icon}</Box>
                <Typography
                  fontWeight={activeTab === m.key ? 600 : 400}
                  sx={{ color: activeTab === m.key ? "#1976d2" : "inherit" }}
                >
                  {m.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Grid>

        {/* Content */}
        <Grid item xs={12} md={9}>
          {renderContent()}
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDetails;
