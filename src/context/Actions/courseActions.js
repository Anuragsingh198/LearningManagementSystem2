import axios from 'axios';
const serverurl = 'http://localhost:5000';

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


export const createCourseAction = async (course, dispatch) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || !user._id) {
    throw new Error('User not authenticated');
  }

  const token = user.token;

  if (!token) {
    throw new Error('User token not found');
  }


  try {
    dispatch({ type: 'COURSE_LOADING' });

    // const formData = new FormData();
    // formData.append('title', course.title);
    // formData.append('description', course.description);
    // formData.append('category', course.category);
    // formData.append('price', course.price);
    // formData.append('instructor', course.instructor);
    // formData.append('thumbnail', course.thumbnail); 

const response = await axios.post(
  `${serverurl}/api/courses/create-course`,
  course,  // this is a FormData instance now
  {
    headers: {
      Authorization: `Bearer ${token}`,
      // 'Content-Type': 'multipart/form-data',
    },
  }
)

    const data = response.data;

    if (data.success) {
      dispatch({ type: 'ADD_COURSE', payload: data.course });
      console.log('Course created successfully:', data.course);
      return data.course;
    } else {
      throw new Error(data.message || 'Failed to create course');
    }
  } catch (error) {
    dispatch({
      type: 'COURSE_ERROR',
      payload: error.response?.data?.message || error.message,
    });
    console.error('Create course error:', error);
    throw error;
  }
};

export const createModuleAction = async (module, dispatch) => {
  console.log( 'this is  the  module  action ' , module);
   const user = JSON.parse(localStorage.getItem('user'));

  if (!user || !user._id) {
    throw new Error('User not authenticated');
  }

  const token = user.token;

  if (!token) {
    throw new Error('User token not found');
  }

  try {
    dispatch({ type: 'COURSE_LOADING' });
    const response = await axios.post(`${serverurl}/api/courses/course-module`, module ,{
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = response.data;
    if (data.success) {
      dispatch({ type: 'ADD_MODULE', payload: data.module });
      console.log('Module created successfully:', data.module);
      return data.module;
    } else {
      throw new Error(data.message || 'Failed to create module');
    }
  } catch (error) {
    dispatch({ type: 'COURSE_ERROR', payload: error.message });
    console.error('Create module error:', error);
    throw error;
  }
}   

export const createVideoAction = async (formData, dispatch) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.token) throw new Error('User not authenticated');

  const token = user.token;

  try {
    dispatch({ type: 'COURSE_LOADING' });

    const response = await axios.post(
      `${serverurl}/api/courses/create-video`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload Progress: ${progress}%`);
        },
      }
    );

    const data = response.data;
    if (data.success) {
      dispatch({ type: 'ADD_VIDEO', payload: data.video });
      return data.video;
    } else {
      throw new Error(data.message || 'Failed to upload video');
    }
  } catch (error) {
    dispatch({ type: 'COURSE_ERROR', payload: error.message });
    throw error;
  }
};


export const getCoursesAction = async (dispatch) => {
     const user = JSON.parse(localStorage.getItem('user'));

  if (!user || !user._id) {
    throw new Error('User not authenticated');
  }

  const token = user.token;

  if (!token) {
    throw new Error('User token not found');
  }

  try {
    dispatch({ type: 'COURSE_LOADING' });
    const response = await axios.get(`${serverurl}/api/courses` , {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = response.data;
    if (data.success) {
      if(!data.courses || data.courses.length === 0) {
        dispatch({ type: 'SET_COURSES', payload: [] });
        console.log('No courses found');
        return [];
      }
      dispatch({ type: 'SET_COURSES', payload: data.courses });
      console.log('Courses fetched successfully:', data.courses);
      return data.courses;
    } else {
      throw new Error(data.message || 'Failed to fetch courses');
    }
  } catch (error) {
    dispatch({ type: 'COURSE_ERROR', payload: error.message });
    console.error('Get courses error:', error);
    throw error;
  }
}


export const getModulesByCourseId = async (courseId, dispatch) => {
  const token = getAuthToken();

  try {
    dispatch({ type: 'COURSE_LOADING' });

    const response = await axios.get(`${serverurl}/api/courses/modules/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = response.data;
    if (data.success) {
      if (!data.modules || data.modules.length === 0) {
        console.log('No modules found');
        return [];
      }
      console.log('Modules fetched successfully:', data.modules);
      return data.modules;
    } else {
      throw new Error(data.message || 'Failed to fetch modules for course');
    }
  } catch (error) {
    dispatch({ type: 'COURSE_ERROR', payload: error.message });
    console.error('Get modules error:', error);
    throw error;
  }
};

export const getCourseById = async (courseId, dispatch) => {
  const token = getAuthToken();

  try {
    dispatch({ type: 'COURSE_LOADING' });

    const response = await axios.get(`${serverurl}/api/courses/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = response.data;
    if (data.success) {
      if (!data.course) {
        console.log('Course not found');
        return null;
      }
      console.log('Course fetched successfully:', data.course);
      return data.course; // returning single course object
    } else {
      throw new Error(data.message || 'Failed to fetch course');
    }
  } catch (error) {
    dispatch({ type: 'COURSE_ERROR', payload: error.message });
    console.error('Get course error:', error);
    throw error;
  }
};

export const getVideosByModuleId = async (moduleId, dispatch) => {
  const token = getAuthToken();

  try {
    dispatch({ type: 'COURSE_LOADING' });

    const response = await axios.get(`${serverurl}/api/courses/videos/${moduleId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = response.data;
    if (data.success) {
      if (!data.videos || data.videos.length === 0) {
        console.log('No videos found');
        return [];
      }
      console.log('Videos fetched successfully:', data.videos);
      return data.videos;
    } else {
      throw new Error(data.message || 'Failed to fetch videos for module');
    }
  } catch (error) {
    dispatch({ type: 'COURSE_ERROR', payload: error.message });
    console.error('Get videos error:', error);
    throw error;
  }
};