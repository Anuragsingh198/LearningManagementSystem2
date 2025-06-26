import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap as Graduation, Video, PlusCircle } from 'lucide-react';
import Layout from '../../../components/CourseCreationComponents.jsx/CourseLayout';
import { useCourseContext } from '../../../context/contextFiles/CourseContext';


const HomePage = () => {
  const { courses } = useCourseContext();

  return (<>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to EduPlatform</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Create and manage your online courses with our easy-to-use platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Graduation className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Create Courses</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Build comprehensive courses with detailed information, custom thumbnails, and organized modules.
          </p>
          <Link
            to="/teacher/create-course"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <PlusCircle className="h-4 w-4 mr-1" />
            Create a course
          </Link>
        </div>

        <div className="bg-orange-50 border border-orange-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center mb-4">
            <div className="bg-orange-100 p-3 rounded-full mr-4">
              <Video className="h-8 w-8 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Upload Videos</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Organize your course content with modules and upload videos with detailed descriptions.
          </p>
          {courses.length > 0 ? (
            <Link
              to="/teacher/my-courses"
              className="inline-flex items-center text-orange-600 hover:text-orange-700 font-medium"
            >
              View your courses
            </Link>
          ) : (
            <span className="text-gray-400">Create a course first</span>
          )}
        </div>
      </div>

      <div className="text-center">
        <Link
          to={courses.length > 0 ? "/teacher/my-courses" : "/teacher/create-course"}
          className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 transition-colors"
        >
          {courses.length > 0 ? "View Your Courses" : "Get Started"}
        </Link>
      </div>
        </>
  );
};

export default HomePage;
