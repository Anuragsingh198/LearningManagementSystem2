import axios from 'axios';
// const serverurl = 'http://localhost:5000';
const serverurl = import.meta.env.VITE_SERVER_URL;

const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user._id) {
    throw new Error('User not authenticated');
  }
  if (!user.token) {
    throw new Error('User token not found');
  }
  return user.token;
};


export const userLogin = async (user, dispatch) => {
  // console.log('Logging in user:', user);
  try {
    dispatch({type:'SET_LOADING' , payload:true})
    const response = await axios.post(`${serverurl}/api/users/login`, user);
    const data = response.data;
    if (data.success) {
      // dispatch({ type: 'LOGIN', payload: { user: data.user } });
      dispatch({ type: 'LOGIN', payload: data.user });
      // console.log('this is  the   Login  action  user ' , data.user)
      localStorage.setItem('user', JSON.stringify(data.user));
    } else {
      throw new Error(data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    dispatch({type:'SET_ERROR' , payload:error.message})
    throw error;
  }finally{
    // console.log("userLogin  finaly  executed!!")
    dispatch({type:'SET_LOADING' , payload: false})
  }
};

export const userLogout = async (dispatch) => {
  try {
    // console.log('logout in action: ', serverurl);
    await axios.post(`${serverurl}/api/users/logout`);
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Logout error:', error);
    dispatch({type:'SET_ERROR' , payload:error.message})
    throw error;
  }
};


export const userRegister = async (user, dispatch) => {
  // console.log('Registering user:', user);
  try {
    dispatch({type:'SET_LOADING' , payload:true})
    const response = await axios.post(`${serverurl}/api/users/register`, user);
    const data = response.data;
    if (data.success) {
      dispatch({ type: 'REGISTER', payload:  data.user });
      localStorage.setItem('user', JSON.stringify(data.user));
    } else {
      throw new Error(data.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Registration error:', error);
    dispatch({type:'SET_ERROR' , payload:error.message})
    throw error;
  }finally{
    dispatch({type:'SET_LOADING' , payload:false})
  }
};


export const enrolledStudentsAction = async (courseId, dispatch) => {
  // console.log("the course id from enrolledStudentsAction :  ", courseId);
  const token = getAuthToken();
  
  try {
    // dispatch({ type: 'SET_LOADING', payload: true });
    const response = await axios.get(`${serverurl}/api/users/${courseId}/enrolled-employees`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    const data = response.data;
    if (data.success) {
      // dispatch({ type: 'ENROLLED_EMPLOYEES', payload: data.enrollStudents });
      return data.enrollStudents;
    } else {
      throw new Error(data.message || 'Enrolled employees fetch failed');
    }
  } catch (error) {
    console.error('Enrolled employees fetch error:', error);
    return []
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
};




