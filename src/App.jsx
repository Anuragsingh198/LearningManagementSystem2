import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Layout from './pages/Layouts/MainLayout';
import LoginPage from './pages/AuthPage/Login';
import RegisterPage from './pages/AuthPage/Signup';
import StudentDashboardPage from './pages/employee/Dashboard';
import TeacherDashboard from './pages/admin/dashboard';
import CreateCoursePage from './pages/admin/CreateCoursePage/CreateCoursePage';
import CoursesPage from './pages/admin/CreateCoursePage/CoursePage';
import VideoUploadPage from './pages/admin/CreateCoursePage/VideoUploadPage';
import HomePage from './pages/admin/CreateCoursePage/CourseMainPage';
import ProfilePage from './pages/Profile/ProfilePage';
import CourseDetailPage from './components/CourseCreationComponents.jsx/CourseDetailPage';

function App() {
  return (
      <Routes>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/signup" element={<RegisterPage />} />

        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/student/dashboard" element={<StudentDashboardPage />} />
                <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                {/* <Route path="/" element={<HomePage />} /> */}
                <Route path="/teacher/create-course" element={<CreateCoursePage />} />
                <Route path="/teacher/my-courses" element={<CoursesPage />} />
                <Route path="/teacher/upload-video/:courseId" element={<VideoUploadPage />} />
                <Route path="/Profile" element={<ProfilePage />} />
                <Route path="/course/details/:courseId" element={<CourseDetailPage />} />
                <Route path="*" element={<Navigate to="/\" replace />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    // <LoginPage />
  );
}

export default App;
