import { all } from "axios";
import { courseProgress } from "../Actions/courseActions";

export const courseReducer = (state, action) => {
  switch (action.type) {
    case "SET_COURSES":
      return {
        ...state,
        courses: action.payload,
        loading: false,
        error: null,
      };

    case "SET_MY_COURSES":
      return {
        ...state,
        myCourses: action.payload,
        loading: false,
        error: null,
      };

    case "ADD_COURSE":
      console.log("Adding course: course  reducer", action.payload);
      return {
        ...state,
        
        courses: [action.payload, ...state.courses],
        loading: false,
        error: null,
      };
   case "SET_ONECOURSE":
  return {
    ...state,
    oneCourse: action.payload,
    loading: false,
    error: null,
  };
    case "ADD_MODULE":
      return {
        ...state,
        modules: [action.payload, ...state.modules],
        loading: false,
        error: null,
      };
    case "MODULE_PROGRESS":
  return {
    ...state,
    oneModuleProgress: action.payload,
  };

case "SET_MODULE_PROGRESS":
  return {
    ...state,
    oneModuleProgress: action.payload,
    allModuleProgress: [
      ...state.allModuleProgress.filter((m) => m._id !== action.payload._id),
      action.payload,
    ],
    loading: false,
    error: null,
  };
    
    case "ADD_VIDEO":
      return {
        ...state,
        videos: [action.payload, ...state.videos],
        loading: false,
        error: null,
      };

    case "COURSE_LOADING":
      return {
        ...state,
        loading: true,
        error: null,
      };
   case "COURSE_PROGRESS":
  return {
    ...state,
    oneCourseProgress:action.payload,
    allCourseProgress: [
      ...state.allCourseProgress.filter((x) => x._id !== action.payload._id),
      action.payload,
    ],
  };
  case "VIDEO_PROGRESS":
  return {
    ...state,
    currentVideoProgress: action.payload,
  };
case 'SET_COURSE_PROGRESS_ALL':
  return {
    ...state,
    oneCourseProgress: action.payload.courseProgress || null,
    allModuleProgress: action.payload.moduleProgress || [],
    allTestProgress: action.payload.testProgress || [],
    allVideoProgress: action.payload.videoProgress || []
  };

case 'TEST_PROGRESS':
  return {
    ...state,
    currentTestProgress: action.payload,
  };
    case "COURSE_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
