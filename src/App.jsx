import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import PrivateRoute from './components/PrivateRoute/PrivateRoute'
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
import CourseDetails from './components/CourseDetails/CourseDetailsMainPage';
import OverviewPage from './pages/employee/CourseOverviewPage';
import { ModuleDetails } from './pages/employee/ModuleDetails';
import { useAuth } from './context/contextFiles/AuthContext';

function App() {
    const { state: { user, loading }, dispatch } = useAuth();

    useEffect(() => {
      console.log('use effect from app.jsx')
    })

    if(loading){
      return <div>Loading... from app.jsx</div>
    }
    
  return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />

        <Route
          path="/*"
          element={
            <PrivateRoute>

            <Layout>
              <Routes>
                <Route path="/student/dashboard" element={<TeacherDashboard />} />
                <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
                {/* <Route path="/" element={<HomePage />} /> */}
                <Route path="/teacher/create-course" element={<CreateCoursePage />} />
                <Route path="/teacher/my-courses" element={<CoursesPage />} />
                <Route path="/teacher/upload-video/:courseId" element={<VideoUploadPage />} />
                <Route path="/Profile" element={<ProfilePage />} />
                <Route path="/course/details/:courseId" element={<OverviewPage />} />
                <Route path="/course/module/:moduleId" element={<ModuleDetails />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
            </PrivateRoute>

          }
        />
      </Routes>
    // <LoginPage />
  );
}

export default App;
