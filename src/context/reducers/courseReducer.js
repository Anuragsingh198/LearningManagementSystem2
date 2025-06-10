
export const courseReducer = (state, action) => {
  switch (action.type) {
    case 'SET_COURSES':
      return {
        ...state,
        courses: action.payload,
        loading: false,
        error: null
      };
      
    case 'ADD_COURSE':
      console.log('Adding course: course  reducer', action.payload);
      return {
        ...state,
        
        courses: [action.payload, ...state.courses],
        loading: false,
        error: null
      };

    case 'ADD_MODULE':
      return {
        ...state,
        modules: [action.payload, ...state.modules],
        loading: false,
        error: null
      };

    case 'ADD_VIDEO':
      return {
        ...state,
        videos: [action.payload, ...state.videos],
        loading: false,
        error: null
      };

    case 'COURSE_LOADING':
      return {
        ...state,
        loading: true,
        error: null
      };

    case 'COURSE_ERROR':
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};