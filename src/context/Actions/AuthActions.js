import axios from 'axios';
const serverurl = 'http://localhost:5000';

export const userLogin = async (user, dispatch) => {
  console.log('Logging in user:', user);
  try {
    dispatch({type:'SET_LOADING' , payload:true})
    const response = await axios.post(`${serverurl}/api/users/login`, user);
    const data = response.data;
    if (data.success) {
      dispatch({ type: 'LOGIN', payload: { user: data.user } });
      console.log('this is  the   Login  action  user ' , data.user)
      localStorage.setItem('user', JSON.stringify(data.user));
    } else {
      throw new Error(data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }finally{
    console.log("userLogin  finaly  executed!!")
    dispatch({type:'SET_LOADING' , payload: false})
  }
};

export const userLogout = () => async (dispatch) => {
  try {
    await axios.post('/api/users/logout');
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const userRegister = async (user, dispatch) => {
  console.log('Registering user:', user);
  try {
    dispatch({type:'SET_LOADING' , payload:true})
    const response = await axios.post(`${serverurl}/api/users/register`, user);
    const data = response.data;
    if (data.success) {
      dispatch({ type: 'REGISTER', payload: { user: data.user } });
      localStorage.setItem('user', JSON.stringify(data.user));
    } else {
      throw new Error(data.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }finally{
    dispatch({type:'SET_LOADING' , payload:false})
  }
};
