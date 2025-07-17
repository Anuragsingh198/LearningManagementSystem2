import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import Layout from './pages/Layouts/MainLayout';
import LoginPage from './pages/AuthPage/Login';
import RegisterPage from './pages/AuthPage/Signup';
import StudentDashboardPage from './pages/employee/Dashboard';
import TeacherDashboard from './pages/admin/dashboard';
import CreateCoursePage from './pages/admin/CreateCoursePage/CreateCoursePage';
import CoursesPage from './pages/admin/CreateCoursePage/CoursePage';
import VideoUploadPage from './pages/admin/CreateCoursePage/VideoUploadPage';
import ProfilePage from './pages/Profile/ProfilePage';
import OverviewPage from './pages/employee/CourseOverviewPage';
import { ModuleDetails } from './pages/employee/ModuleDetails';
import EnrolledEmployees from './pages/admin/EnrolledEmployees';
import ForgotPasswordPage from './pages/AuthPage/ForgotPassword';
import MuiLoading from './pages/common/Loading';

import { useAuth } from './context/contextFiles/AuthContext';

import {ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './pages/common/HomePage';
import MainAssessment from './pages/common/MainAssessment';
import TestStartPage from './pages/common/TestStartPage';
import TestReviewPage from './pages/common/TestReviewPage';
import TestPage from './pages/Test/TestPage';
import TestExitPage from './pages/Test/TestExitPage';

function App() {

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ForgotPasswordPage />} />
        {/* <Route 
          path="/"
          element={
            <Layout>
              <Routes>

            <Route path="/" element={<HomePage />} />
              </Routes>
            </Layout>

          }
        /> */}
          <Route
    path="/assessments/start-test/test"
    element={
      <PrivateRoute>
        <TestPage />
      </PrivateRoute>
    }
  />
        


        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<TeacherDashboard />} />
                  <Route path="/teacher/create-course" element={<CreateCoursePage />} />
                  <Route path="/teacher/my-courses" element={<CoursesPage />} />
                  <Route path="/student/my-courses" element={<CoursesPage />} />
                  <Route path="/teacher/upload-video/:courseId" element={<VideoUploadPage />} />
                  <Route path="/teacher/employees/:courseId" element={<EnrolledEmployees />} />
                  <Route path="/Profile" element={<ProfilePage />} />
                  <Route path="/course/details/:courseId" element={<OverviewPage />} />
                  <Route path="/course/module/:courseId/:moduleId" element={<ModuleDetails />} />
                  <Route path="/assessments" element={<MainAssessment/>} />
                  <Route path="/assessments/start-test/:id" element={<TestStartPage/>} />
                  <Route path="/assessments/start-test/test" element={<TestPage/>} />
                  <Route path="/assessments/review/:id" element={<TestReviewPage/>} />
                  <Route path="/assessments/test-submitted" element={<TestExitPage />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  
                </Routes>
              </Layout>
                  


            </PrivateRoute>
          }
        />
      </Routes>

      <ToastContainer
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

    </>
  );
}

export default App;
