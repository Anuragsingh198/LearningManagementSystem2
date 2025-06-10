import React, { createContext, useContext, useReducer } from 'react';
import { courseReducer } from '../reducers/courseReducer';

const initialState = {
  courses: [],
  modules: [],
  videos: [],
};

const CourseContext = createContext(undefined);

export const CourseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(courseReducer, initialState);

  // const addCourse = (courseData) => {
  //   dispatch({ type: 'ADD_COURSE', payload: courseData });
  // };

  // const addModule = (moduleData) => {
  //   dispatch({ type: 'ADD_MODULE', payload: moduleData });
  // };

  // const addVideo = (videoData) => {
  //   dispatch({ type: 'ADD_VIDEO', payload: videoData });
  // };

  // const getCourseById = (id) => {
  //   console.log('all courses   from  coursecontext : ', state.courses , typeof(id))
  //   return state.courses.find((course) => course._id === id);
  // };

  // const getModulesByCourseId = (courseId) => {
  //   console.log('this is the   getmodule by id : ' , courseId)
  //   console.log('all the  modules  getmodule by id : ' , courseId)
  //   return state.modules.filter((module) => module.courseId === courseId);
  // };

  // const getVideosByModuleId = (moduleId) => {
  //   return state.videos.filter((video) => video.moduleId === moduleId);
  // };

  return (
    <CourseContext.Provider
      value={{
        state,
        dispatch
        // addCourse,
        // addModule,
        // addVideo,
        // getCourseById,
        // getModulesByCourseId,
        // getVideosByModuleId,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourseContext = () => {
  const context = useContext(CourseContext);
  if (context === undefined) {
    throw new Error('useCourseContext must be used within a CourseProvider');
  }
  return context;
};