export const assignmentReducer = (state, action) => {
    switch (action.type) {
        case "SET_LANGUAGES":
            return { 
                ...state, 
                codingLanguages: action.payload 
            };

        case "SET_LOADING":
            return { 
                ...state, 
                loading: action.payload 
            };

        case "SET_ERRORS":
            return { 
                ...state, 
                error: action.payload 
            };

        case "SET_QUESTIONS":
            return { 
                ...state, 
                assignmentQuestions: action.payload 
            };

        case "SET_SELECTED_LANGUAGE":
            return { 
                ...state, 
                selectedLanguage: action.payload 
            };

        case "SET_RESULTS":
            return { 
                ...state, 
                results: action.payload 
            };

        case "SET_CODING_RESULT": 
            return { 
                ...state, 
                codingResult: action.payload 
            };

        case "SET_COMPILATION_SUCCESS":
            return { 
                ...state, 
                compilationSuccess: action.payload 
            };

        case "SET_COMPILATION_ERROR":
            return { 
                ...state, 
                compilationError: action.payload 
            };

        case "SET_TEST_RESULTS":
            return { 
                ...state, 
                testResults: action.payload 
            };
        
        case "SET_ALL_CODING_QUESTIONS":
            return {
                ...state,
                allCodingQuestions: action.payload
            }

        case "SET_EXECUTION_OUTPUT":
            return { 
                ...state, 
                executionOutput: action.payload 
            };

        case "SET_TEST_DATA":
            return {
                ...state,
                testData: action.payload
            }

        default:
            return state;
    }
};
