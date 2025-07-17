import React, { createContext, useContext, useReducer } from 'react';
import { courseReducer } from '../reducers/courseReducer';
import { all } from 'axios';

const initialState = {
  courses: [],
  myCourses: [],
  modules: [],
  videos: [],
  oneCourse:null,
  oneCourseProgress:null,
  oneModuleProgress: null,
  allModuleProgress: [],
  allCourseProgress:[],
  allVideoProgress:[], 
  currentVideoProgress:null,
  allTestProgress:[],
  currentTestProgress:null,
};

const CourseContext = createContext(undefined);

export const CourseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(courseReducer, initialState);
  return (
    <CourseContext.Provider
      value={{
        state,
        dispatch
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