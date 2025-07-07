import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { issueAPI } from '../services/api';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true,
  error: null,
  issues: [],
  notices: []
};

// Action types
const actionTypes = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_ISSUES: 'SET_ISSUES',
  ADD_ISSUE: 'ADD_ISSUE',
  UPDATE_ISSUE: 'UPDATE_ISSUE',
  SET_NOTICES: 'SET_NOTICES',
  ADD_NOTICE: 'ADD_NOTICE',
  UPDATE_NOTICE: 'UPDATE_NOTICE',
  DELETE_NOTICE: 'DELETE_NOTICE'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        issues: [],
        notices: []
      };
    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case actionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case actionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    case actionTypes.SET_ISSUES:
      return {
        ...state,
        issues: action.payload
      };
    case actionTypes.ADD_ISSUE:
      return {
        ...state,
        issues: [action.payload, ...state.issues]
      };
    case actionTypes.UPDATE_ISSUE:
      return {
        ...state,
        issues: state.issues.map(issue =>
          issue._id === action.payload._id ? action.payload : issue
        )
      };
    case actionTypes.SET_NOTICES:
      return {
        ...state,
        notices: action.payload
      };
    case actionTypes.ADD_NOTICE:
      return {
        ...state,
        notices: [action.payload, ...state.notices]
      };
    case actionTypes.UPDATE_NOTICE:
      return {
        ...state,
        notices: state.notices.map(notice =>
          notice._id === action.payload._id ? action.payload : notice
        )
      };
    case actionTypes.DELETE_NOTICE:
      return {
        ...state,
        notices: state.notices.filter(notice => notice._id !== action.payload)
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Actions
  const login = async (email, password) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      dispatch({ type: actionTypes.CLEAR_ERROR });

      const response = await issueAPI.login(email, password);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        payload: { token, user }
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const signup = async (username, email, password) => {
    try {
      dispatch({ type: actionTypes.SET_LOADING, payload: true });
      dispatch({ type: actionTypes.CLEAR_ERROR });

      const response = await issueAPI.signup(username, email, password);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        payload: { token, user }
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Signup failed';
      dispatch({ type: actionTypes.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: actionTypes.LOGOUT });
  };

  const clearError = () => {
    dispatch({ type: actionTypes.CLEAR_ERROR });
  };

  // Issue actions
  const fetchIssues = async () => {
    try {
      const response = await issueAPI.getAllIssues();
      dispatch({ type: actionTypes.SET_ISSUES, payload: response.data });
    } catch (error) {
      console.error('Error fetching issues:', error);
    }
  };

  const createIssue = async (issueData) => {
    try {
      const response = await issueAPI.createIssue(issueData);
      dispatch({ type: actionTypes.ADD_ISSUE, payload: response.data });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to create issue';
      return { success: false, error: errorMessage };
    }
  };

  // Notice actions
  const fetchNotices = async () => {
    try {
      const response = await issueAPI.getNotices();
      dispatch({ type: actionTypes.SET_NOTICES, payload: response.data });
    } catch (error) {
      console.error('Error fetching notices:', error);
    }
  };

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        dispatch({
          type: actionTypes.LOGIN_SUCCESS,
          payload: { token, user }
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    dispatch({ type: actionTypes.SET_LOADING, payload: false });
  }, []);

  const value = {
    ...state,
    login,
    signup,
    logout,
    clearError,
    fetchIssues,
    createIssue,
    fetchNotices
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
