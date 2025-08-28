import axios from "axios";

const backendBaseUrl = import.meta.env.VITE_SERVER_URL; // e.g., http://localhost:5000/api
const serverurl = import.meta.env.VITE_SERVER_URL;

const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.token) throw new Error("User not authenticated");
  return user.token;
};

export const getAllLanguageAction = async (dispatch) => {
  try {
    dispatch({ type: "SET_LOADING", payload: true });

    const { data } = await axios.get(`${backendBaseUrl}/api/assessments/get-languages`);
    // console.log('fetched  languages  from action   are : ' , data) 
    dispatch({ type: "SET_LANGUAGES", payload: data });
    dispatch({ type: "SET_LOADING", payload: false });
  } catch (error) {
    dispatch({ type: "SET_ERRORS", payload: error?.response?.data || error.message });
    dispatch({ type: "SET_LOADING", payload: false });
  }
};

export const getAllCodingQuestions = async (dispatch) => {
  const token = getAuthToken();
  try{
    dispatch({ type: 'SET_LOADING', payload: true })

    const {data} = await axios.get(`${backendBaseUrl}/api/assessments/allQuestions`,
      { headers: { Authorization: `Bearer ${token}` },}
    )
    dispatch({ type: "SET_ALL_CODING_QUESTIONS", payload: data.allCodingQuestions})
    dispatch({ type: "SET_LOADING", payload: false });

  } catch (error) {
    dispatch({ type: "SET_ERRORS", payload: error?.response?.data || error.message });
    dispatch({ type: "SET_LOADING", payload: false });
  }
}

/**
 * Fetch coding question by ID
 */
export const getQuestionByIdAction = async (dispatch, currentQuestionId) => {
    console.log(" getQuestion action is called top: " );
  try {
    dispatch({ type: "SET_LOADING", payload: true });
    const questionId = currentQuestionId
    const token = getAuthToken();
      console.log(" getQuestion action is called before api call : " );
      const { data } = await axios.get(`${backendBaseUrl}/api/assessments/${questionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // console.log(" getQuestion action is called after api call : ", data.question );

    dispatch({ type: "SET_QUESTIONS", payload: data.question });
    dispatch({ type: "SET_LOADING", payload: false });
  } catch (error) {
    dispatch({ type: "SET_ERRORS", payload: error?.response?.data || error.message });
    dispatch({ type: "SET_LOADING", payload: false });
  }
};

export const runCodeAction = async (dispatch, { code, languageId, testCases }) => {
  try {
    dispatch({ type: "SET_LOADING", payload: true });

    const token = getAuthToken();

    const { data } = await axios.post(
      `${backendBaseUrl}/api/assessments/run-code`,
      { 
        source_code: code, 
        language_id: languageId, 
        test_cases: testCases 
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log( "  this is the  ouput  from the  runode : " , data.results)
    if( data) return data;
    dispatch({ type: "SET_CODING_RESULT", payload: data });
  } catch (error) {
    dispatch({ type: "SET_ERRORS", payload: error?.response?.data || error.message });
  } finally {
    dispatch({ type: "SET_LOADING", payload: false });
  }
};


export const submitCodeAction = async (dispatch, { sourceCode, languageId, questionId, assessmentId }) => {
  try {
    dispatch({ type: "SET_LOADING", payload: true });

    const token = getAuthToken();

    const { data } = await axios.post(
      `${backendBaseUrl}/api/assessments/submit-code`,
      { 
        code: sourceCode, 
        languageId: languageId, 
        questionId: questionId,
        assessmentId: assessmentId
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("This is the output from submit-code:", data.results);

    if (data) return data; 

    dispatch({ type: "SET_RESULTS", payload: data });
  } catch (error) {
    dispatch({ type: "SET_ERRORS", payload: error?.response?.data || error.message });
  } finally {
    dispatch({ type: "SET_LOADING", payload: false });
  }
};

export const submitAssessment = async (dispatch, { allAnswers, assessmentId }) => {
  try {

    console.log('the assessment id is: ', assessmentId)

    dispatch({ type: "SET_LOADING", payload: true });

    const token = getAuthToken();

    const { data } = await axios.post(
      `${serverurl}/api/assessments/submit-assessment`,
      { 
       allAnswers, assessmentId
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const questionsAndAnswers = data.data
    console.log("This is the output after test submission:", data);

    dispatch({type: "SET_QUES_AND_ANS", payload: questionsAndAnswers })
    if (data) return data; 
    
  } catch (error) {

    console.error('Could not submit the assessment')
    dispatch({ type: "SET_ERRORS", payload: error?.response?.data || error.message });

  } finally {

    dispatch({ type: "SET_LOADING", payload: false });

  }
};

export const reviewAssignment = async (dispatch, { assessmentId }) => {
  try {

    dispatch({ type: "SET_LOADING", payload: true });

    const token = getAuthToken();

    console.log('the token is: ', token)

    const { data } = await axios.post(
      `${serverurl}/api/assessments/review-assessment`,
      { 
        assessmentId
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const questionsAndAnswers = data.data
    console.log("This is the output to get the test review data:", questionsAndAnswers);

    dispatch({type: "SET_QUES_AND_ANS", payload: questionsAndAnswers })
    if (data) return data; 
    
  } catch (error) {

    console.error('Could not get the assessment review')
    dispatch({ type: "SET_ERRORS", payload: error?.response?.data || error.message });

  } finally {

    dispatch({ type: "SET_LOADING", payload: false });

  }
};


