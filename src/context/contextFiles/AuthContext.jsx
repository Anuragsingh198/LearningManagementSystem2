'use client';
import React, { createContext, use, useContext, useEffect, useReducer, useState } from "react";
import { authReducer } from "../reducers/UserReducers";

const  AuthContext =createContext();

const initialstate = {
  isAuthenticated: false,
  user: null,
  students: [],
  Teachers: [],
  courses: [],
  notifications: [],
  coursesProgress: [],
  assignments: [],
  loading :true

};


export const AuthProvider = ({ children }) => {
  const [state , dispatch] = useReducer(authReducer , initialstate)
  
  useEffect(() => {
    console.log('use effect from authcontext.jsx')
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      dispatch({ type: 'LOGIN', payload: user});
    }
     dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  return (
    <AuthContext.Provider value={{state, dispatch}}>
      {children}
    </AuthContext.Provider>
  );
}

 export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
