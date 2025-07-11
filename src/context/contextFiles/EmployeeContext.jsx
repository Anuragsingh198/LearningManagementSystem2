import React, { createContext, useContext, useReducer } from 'react';

const initialState={
    employees: [],
    loading: false,
    error: null,
   testStatus:[],
   enrolledCourses:[],
   videoStatus:[],
    courseProgress: null,
    courseProgress:[]
}

const EmployeeContext = createContext(undefined);

export const  EmployeeProvider=({children}) =>{
    const [state, dispatch] =  useReducer(EmployeeReducer , initialState)

    return(
        <EmployeeContext.Provider value={{state, dispatch}}>
            {children}
        </EmployeeContext.Provider>
    )
}


export const useEmployeeContext =()=>{
    return useContext(EmployeeContext);
}