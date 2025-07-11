export const EployeeReducer = (state, action) => {
  switch (action.type) {
    case 'SET_EMPLOYEES':
      return {
        ...state,
        employees: action.payload,
        loading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'SET_TEST_STATUS':
      return {
        ...state,
        testStatus: action.payload,
      };
    case 'SET_ENROLLED_COURSES':
      return {
        ...state,
        enrolledCourses: action.payload,
      };
    case 'SET_VIDEO_STATUS':
      return {
        ...state,
        videoStatus: action.payload,
      };
    case 'SET_COURSE_PROGRESS':
      return {
        ...state,
        courseProgress: action.payload,
      };
    default:
      return state;
  }
};