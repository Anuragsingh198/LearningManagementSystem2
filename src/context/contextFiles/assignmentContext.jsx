import React, { createContext, useContext, useReducer } from 'react';
import { assignmentReducer } from '../reducers/assignmentReducer';

const initialState = {
  codingLanguages: [],
  selectedLanguage: '',
  assignmentQuestions: null,
  currentQuestion:null,
  allCodingQuestions: [],
  loading: false,
  error: null,
  results: [],
  codingResult: [],
  testData: null,
  overAllResult: null,
};


export const AssignmentContext = createContext();

export const AssignmentContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(assignmentReducer, initialState);

  return (
    <AssignmentContext.Provider value={{ state, dispatch }}>
      {children}
    </AssignmentContext.Provider>
  );
};

export const useAssignmentContext = () => useContext(AssignmentContext);
