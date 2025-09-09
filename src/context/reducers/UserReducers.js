export const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state, loading: action.payload
      }
    case 'LOGIN':
      return {
        ...state,
        isPasswordCorrect: true,
        // user: action.payload,
      };
      case 'OTP_LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        isPasswordCorrect: false,
        user: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        isPasswordCorrect: false,
        user: null,
        loading: false,
      };

    case 'REGISTER':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading:false
      };
      case "ENROLLED_EMPLOYEES":
        return {
          ...state , 
          enrolledEmployees : action.payload
        }
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case "SET_ERROR":
      return{
        ...state , 
        error: action.payload
      }
    default:
      return state;
  }
}