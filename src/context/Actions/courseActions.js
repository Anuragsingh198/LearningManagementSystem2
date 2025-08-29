import axios from 'axios';
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


export const createCourseAction = async (formDataToSend, myCourses, dispatch) => {
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
      formDataToSend,  // this is a FormData instance now
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    const data = response.data;

    if (data.success) {
      dispatch({ type: 'ADD_COURSE', payload: data.course });
      dispatch({type:'SET_MY_COURSES', payload:[...myCourses , data.course]})
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
  // console.log('this is  the  module  action ', module);
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
    const response = await axios.post(`${serverurl}/api/courses/course-module`, module, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = response.data;
    if (data.success) {
      dispatch({ type: 'ADD_MODULE', payload: data.module });
      // console.log('Module created successfully:', data.module);
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

export const createArticleAction = async (formData, dispatch, onProgress) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.token) throw new Error('User not authenticated');
  const token = user.token;
  // console.log('article details are:', formData)
  try {
    dispatch({ type: 'COURSE_LOADING' });
    const response = await axios.post(
      `${serverurl}/api/courses/create-article`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          if (typeof onProgress === 'function') onProgress(progress);
        },
      }
    );
    const data = response.data;
    if (data.success) {
      // Optionally dispatch something like ADD_ARTICLE here in the future
      return data.article;
    } else {
      throw new Error(data.message || 'Failed to upload article');
    }
  } catch (error) {
    dispatch({ type: 'COURSE_ERROR', payload: error.message });
    throw error;
  }
};



export const getCoursesAction = async (dispatch) => {
  //  const user = JSON.parse(localStorage.getItem('user'));

  // if (!user || !user._id) {
  //   throw new Error('User not authenticated');
  // }

  // const token = user.token;

  // if (!token) {
  //   throw new Error('User token not found');
  // }

  try {
    dispatch({ type: 'COURSE_LOADING' });
    const response = await axios.get(`${serverurl}/api/courses`);
    const data = response.data;
    if (data.success) {
      if (!data.courses || data.courses.length === 0) {
        dispatch({ type: 'SET_COURSES', payload: [] });
        // console.log('No courses found');
        return [];
      }
      dispatch({ type: 'SET_COURSES', payload: data.courses });
      // console.log('Courses fetched successfully in get course action:', data.courses);
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

export const getMyCoursesAction = async (dispatch) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user._id) {
    throw new Error('User not authenticated');
  }

  const token = user.token;

  if (!token) {
    throw new Error('User token not found');
  }

  const userId = user._id
  // console.log("this is the  user Id : ", userId);
  try {
    dispatch({ type: 'COURSE_LOADING' });
    const response = await axios.get(`${serverurl}/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = response.data;
    if (data.success) {
      const myCourses = data.courses || data.adminCourses || [];

      if (myCourses.length === 0) {
        dispatch({ type: 'SET_MY_COURSES', payload: [] });
        // console.log('No courses found');
        return [];
      }

      dispatch({
        type: 'SET_MY_COURSES',
        payload: myCourses
      });

      // console.log('My Courses fetched:', myCourses);
      return myCourses;
    } else {
      throw new Error(data.message || 'Failed to fetch my courses');
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
        // console.log('No modules found');
        return [];
      }
      // console.log('Modules fetched successfully:', data.modules);
      dispatch({type: 'SET_MY_MODULES', payload: data.modules})
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
        // console.log('Course not found');
        return null;
      }
      // console.log('Course fetched successfully:', data.course);
      dispatch({ type: 'SET_ONECOURSE', payload: data.course });
      return data.course;
    } else {
      throw new Error(data.message || 'Failed to fetch course');
    }
  } catch (error) {
    dispatch({ type: 'COURSE_ERROR', payload: error.message });
    console.error('Get course error:', error);
    throw error;
  }
};

export const getCourseWithProgress = async (courseId, userId, dispatch) => {
  const token = getAuthToken();

  try {
    dispatch({ type: 'COURSE_LOADING' });

    const response = await axios.post(`${serverurl}/api/users/course-progress`, {
      courseId,
      userId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = response.data;

    if (data.success) {
      dispatch({ type: 'SET_ONECOURSE', payload: data.course });
      dispatch({
        type: 'SET_COURSE_PROGRESS_ALL',
        payload: {
          courseProgress: data.progress.courseProgress,
          moduleProgress: data.progress.moduleProgress,
          testProgress: data.progress.testProgress,
          videoProgress: data.progress.videoProgress
        }
      });

      return data;
    } else {
      throw new Error(data.message);
    }

  } catch (error) {
    console.error('Error fetching course with progress:', error);
    dispatch({ type: 'COURSE_ERROR', payload: error.message });
    return null;
  } finally {
    dispatch({ type: 'COURSE_LOADING', payload: false });
  }
};

export const getModulebyModuleId = async (moduleId, dispatch) => {
  const token = getAuthToken();

  try {
    dispatch({ type: 'COURSE_LOADING' });

    const response = await axios.get(`${serverurl}/api/courses/module/${moduleId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = response.data;
    if (data.success) {
      if (!data.module || data.module.length === 0) {
        // console.log('No videos found');
        return [];
      }
      // console.log('module fetched successfully:', data.module);
      return data.module;
    } else {
      throw new Error(data.message || 'Failed to fetch  module');
    }
  } catch (error) {
    dispatch({ type: 'COURSE_ERROR', payload: error.message });
    console.error('Get videos error:', error);
    throw error;
  }
};
export const SubmitTest = async ({ testId, userAnswers, courseId, moduleId, dispatch }) => {
  const token = getAuthToken();

  try {
    dispatch({ type: 'COURSE_LOADING', payload: true });

    const response = await axios.post(
      `${serverurl}/api/users/test-submit`,
      { testId, userAnswers, courseId, moduleId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;

    if (data.success) {
      dispatch({
        type: 'SET_COURSE_PROGRESS_ALL',
        payload: {
          courseProgress: data.courseProgress,
          moduleProgress: data.moduleProgressList || [],
          testProgress: data.testProgressList || [],
          videoProgress: data.videoProgressList||[],
        },
      });

      dispatch({ type: 'TEST_PROGRESS', payload: data.testProgress });
    }

    return data;
  } catch (error) {
    console.error("Error submitting test:", error);
    dispatch({ type: 'COURSE_ERROR', payload: error.message || 'Unknown error' });
  } finally {
    dispatch({ type: 'COURSE_LOADING', payload: false });
  }
};

export const getCourseProgress = async (courseId, userId, dispatch) => {
  const token = getAuthToken();
  try {
    dispatch({ type: 'SET_LOADING', payload: true });
    const response = await axios.post(`${serverurl}/api/users/course-progress`, {
      courseId,
      userId
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = response.data;
    if (data.success) {
      dispatch({ type: 'COURSE_PROGRESS', payload: data.progress });
      return data.progress;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error in fetch course progress', error);
    return null;
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
};


export const updateVideoCompletion = async (courseId, videoId, moduleId, dispatch) => {
  const token = getAuthToken();
  try {
    dispatch({ type: 'COURSE_LOADING', payload: true });

    const response = await axios.post(
      `${serverurl}/api/users/video-progress/complete`,
      { courseId, videoId, moduleId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;
    // console.log('the data after complition is: ', data)
    // console.log('the data video progress is: ', data.videoProgress)
    // console.log('the data after complition is: ', data.moduleProgress)


    if (data.success) {
      dispatch({
        type: 'SET_COURSE_PROGRESS_ALL',
        payload: {
          courseProgress: data.courseProgress,
          moduleProgress: data.moduleProgress || [],
          videoProgress: data.videoProgress || [],
          testProgress: data.testProgress || [],
        },
      });

      // Individual progress items
      dispatch({ type: 'VIDEO_PROGRESS', payload: data.videoProgressItem });
      dispatch({ type: 'MODULE_PROGRESS', payload: data.oneModuleProgress }); // If it's a single object in array
    }
  } catch (error) {
    console.error('Error updating video completion:', error);
    dispatch({ type: 'COURSE_ERROR', payload: error.message || 'Unknown error' });
  } finally {
    dispatch({ type: 'COURSE_LOADING', payload: false });
  }
};


export const checkProgress = async (courseId, chapterId, dispatch) => {
  const token = getAuthToken();

  try {
    dispatch({ type: 'SET_LOADING', payload: true });

    const response = await axios.post(`${serverurl}/api/users/check-progress`, {
      courseId, chapterId,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const data = response.data;

    if (data.success) {
      dispatch({ type: 'COURSE_PROGRESS', payload: data.progress });
      return data.progress;

    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('error in checking progress', error);
    return null;
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
}

export const checkVideoOrTestInUserProgressAction = async ({ videoId, testId, moduleId, courseId }, dispatch) => {
  const token = getAuthToken();

  try {
    dispatch({ type: 'SET_LOADING', payload: true });

    const payload = { moduleId, courseId };
    if (videoId) payload.videoId = videoId;
    if (testId) payload.testId = testId;

    const response = await axios.post(`${serverurl}/api/users/check-video-progress`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = response.data;

    if (data.success) {
      dispatch({ type: 'COURSE_PROGRESS', payload: data.progress });
      // console.log('Progress updated:', data.progress);
      return data.progress;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error in checking video/test progress:', error);
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
};

export const deleteCourse = async (courseToDelete, dispatch) => {
  const token = getAuthToken();

  try {
    dispatch({ type: 'SET_LOADING', payload: true });
    // console.log('the course id is: ', courseToDelete)
    const response = await axios.delete(`${serverurl}/api/courses/delete-course/${courseToDelete}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = response.data;

    if (data.success) {

      // console.log('course deleted, message from backend: ', data.message)

    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error in deleting course:', error);
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
};



export const courseProgress = async (courseId, userId, dispatch) => {
  const token = getAuthToken();

  try {
    dispatch({ type: 'COURSE_LOADING', payload: true });

    const response = await axios.post(
      `${serverurl}/api/users/course-progress`,
      { courseId, userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;

    if (data.success) {
      dispatch({ type: 'SET_COURSE_PROGRESS_ALL', payload: data.data });

      // console.log(" Course Progress Fetched:", data.data);

      return data.data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error fetching course progress:', error);
    dispatch({ type: 'COURSE_ERROR' });
    return null;
  } finally {
    dispatch({ type: 'COURSE_LOADING', payload: false });
  }
};

export const videoProgress = async (courseId, video, videoId, moduleId, dispatch) => {
  const token = getAuthToken();
  // console.log(" this is  the data from  video progress : ", courseId , videoId);

  try {
    dispatch({ type: 'COURSE_LOADING', payload: true });

    const response = await axios.post(
      `${serverurl}/api/users/video-progress`,
      { courseId, videoData: video, moduleId, videoId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;

    if (data.success) {
      dispatch({ type: 'VIDEO_PROGRESS', payload: data.videoProgress });
      dispatch({
        type: 'SET_COURSE_PROGRESS_ALL',
        payload: {
          courseProgress: data.courseProgress,
          moduleProgress: data.moduleProgress,
          testProgress: data.testProgress,
          videoProgress: data.videoProgressList,
        },
      });

      return data.videoProgress;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error in updating video progress:', error);
    dispatch({ type: 'COURSE_ERROR', payload: error.message });
    return null;
  } finally {
    dispatch({ type: 'COURSE_LOADING', payload: false });
  }
};


export const testProgress = async (courseId, currentTestProgress, moduleId, testId, dispatch) => {
  const token = getAuthToken();
  // console.log('the test from test progress action is: ', currentTestProgress)
  try {
    dispatch({ type: 'COURSE_LOADING', payload: true });

    const response = await axios.post(
      `${serverurl}/api/users/test-progress`,
      { courseId, testData: currentTestProgress, moduleId, testId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;

    if (data.success) {
      dispatch({
        type: 'SET_COURSE_PROGRESS_ALL',
        payload: {
          courseProgress: data.courseProgress,
          moduleProgress: data.moduleProgress || [],
          videoProgress: data.videoProgress || [],
          testProgress: data.testProgress ? [data.testProgress] : [],
        },
      });

      dispatch({ type: 'TEST_PROGRESS', payload: data.testProgress });

      return data.testProgress;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error in updating test progress:', error);
    dispatch({ type: 'COURSE_ERROR' });
    return null;
  } finally {
    dispatch({ type: 'COURSE_LOADING', payload: false });
  }
};



export const moduleProgress = async (courseId, chapterId, clickedModuleProgress, dispatch) => {
  const token = getAuthToken();

  try {
    dispatch({ type: 'COURSE_LOADING', payload: true });

    const response = await axios.post(
      `${serverurl}/api/users/module-progress`,
      {
        courseId,
        moduleId: chapterId,
        moduleData: clickedModuleProgress,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data;

    if (data.success) {
      dispatch({
        type: 'SET_COURSE_PROGRESS_ALL',
        payload: {
          courseProgress: data.courseProgress,
          moduleProgress: data.moduleProgressList || [],
          videoProgress: data.videoProgress || [],
          testProgress: data.testProgress || [],
        },
      });

      dispatch({ type: 'SET_MODULE_PROGRESS', payload: data.moduleProgress });

      return data.moduleProgress;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error in updating module progress:', error);
    dispatch({ type: 'COURSE_ERROR' });
    return null;
  } finally {
    dispatch({ type: 'COURSE_LOADING', payload: false });
  }
};

export const deleteModule = async (chapterId, dispatch) => {
  const token = getAuthToken();

  try {
    dispatch({ type: 'SET_LOADING', payload: true });
    // console.log('the course id is: ', chapterId)
    const response = await axios.delete(`${serverurl}/api/courses/delete-module/${chapterId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = response.data;

    if (data.success) {

      // console.log('Module deleted, message from backend: ', data.message)

    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error('Error in deleting course:', error);
  } finally {
    dispatch({ type: 'SET_LOADING', payload: false });
  }
};

export const addAssessmentAction = async (
  dispatch,
  isMandatory,
  testTitle,
  testDescription,
  topics,
  duration,
  questions,
  selectedCodingQuestions,
  testType
) => {
  try {

    const token = getAuthToken()

    dispatch({ type: "SET_LOADING", payload: true });

    const payload = {
      isMandatory,
      title: testTitle,
      description: testDescription,
      topics,
      duration,
      mcqQuestions: questions,            
      codingQuestions: selectedCodingQuestions.map(q => q._id), 
      testType,
    };

    const { data } = await axios.post(
      `${serverurl}/api/assessments/add-assessment`,
      payload,
            {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // dispatch({ type: "ADD_ASSESSMENT_SUCCESS", payload: data });
    dispatch({ type: "SET_LOADING", payload: false });

    return data;
  } catch (error) {
    dispatch({
      type: "SET_ERRORS",
      payload: error?.response?.data || error.message,
    });
    dispatch({ type: "SET_LOADING", payload: false });
    throw error; // rethrow so UI can catch
  }
};


export const updateVideoLastTimeWatched = async (payloadData, dispatch) => {
  const token = getAuthToken();
  // console.log('the data is: ', payloadData)
  try {
    dispatch({type: 'SET_LOADING', payload: true});

    // console.log('timer save req started');
    const response = await axios.post(`${serverurl}/api/courses/module/video-update`,
      payloadData
    ,  {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = response.data;

    dispatch({
      type: 'SET_VIDEO_PROGRESS',
      payload: {
        currentVideoProgress: data.videoProgress || [],
        oneModuleProgress: data.moduleProgress || [],
        allVideoProgress: data.videoProgressList || []

      }
    })

    if(data.success){
          dispatch({
      type: 'SET_VIDEO_PROGRESS',
      payload: {
        currentVideoProgress: data.videoProgress || [],
        oneModuleProgress: data.moduleProgress || [],
        allVideoProgress: data.videoProgressList || []

      }
    })
    }

  } catch (error){
    console.error('Error in updating video progress: ', error)
  }
}


export const fetchAllAssessment = async (dispatch) => {
  const token = getAuthToken()
  try {
  dispatch({type: 'SET_LOADING', payload: true});
  const { data } = await axios.get(`${serverurl}/api/assessments/get-all-assessments`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const assessments = data.data
    if(data.success){
      dispatch({type: 'ALL_ASSESSMENTS', payload: assessments })

    }

    // console.log('the data is:', data)

  } catch (error) {
    console.error('Error fetching the questions: ', error)
  } 
}

export const getModuleVideoProgress = async (moduleId, courseId, dispatch) => {
  const token = getAuthToken();

  try {
    dispatch({ type: 'COURSE_LOADING' });

    const response = await axios.post(`${serverurl}/api/users/module-video-progress`, {
      courseId,
      moduleId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

  } catch (error) {
    console.error('Error fetching course with progress:', error);
    dispatch({ type: 'COURSE_ERROR', payload: error.message });
    return null;
  } finally {
    dispatch({ type: 'COURSE_LOADING', payload: false });
  }
};
