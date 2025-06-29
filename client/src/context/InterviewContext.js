import React, { createContext, useContext, useReducer } from 'react';

const InterviewContext = createContext();

const initialState = {
  // Setup data
  resume: '',
  companyWebsite: '',
  jobPostingUrl: '',
  jobDescription: '',
  openEndedCount: 9,
  
  // Generated questions
  questions: null,
  
  // Interview progress
  currentQuestionIndex: 0,
  answers: {},
  
  // Results
  evaluation: null,
  
  // UI state
  loading: false,
  error: null,
  currentStep: 'setup' // setup, interview, results
};

const interviewReducer = (state, action) => {
  switch (action.type) {
    case 'SET_RESUME':
      return { ...state, resume: action.payload };
    
    case 'SET_COMPANY_WEBSITE':
      return { ...state, companyWebsite: action.payload };
    
    case 'SET_JOB_POSTING_URL':
      return { ...state, jobPostingUrl: action.payload };
    
    case 'SET_JOB_DESCRIPTION':
      return { ...state, jobDescription: action.payload };
    
    case 'SET_OPEN_ENDED_COUNT':
      return { ...state, openEndedCount: action.payload };
    
    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload };
    
    case 'SET_ANSWER':
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.questionId]: action.payload.answer
        }
      };
    
    case 'SET_CURRENT_QUESTION':
      return { ...state, currentQuestionIndex: action.payload };
    
    case 'SET_EVALUATION':
      return { ...state, evaluation: action.payload };
    
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    
    case 'RESET_INTERVIEW':
      return {
        ...initialState,
        resume: state.resume,
        companyWebsite: state.companyWebsite,
        jobPostingUrl: state.jobPostingUrl,
        jobDescription: state.jobDescription,
        openEndedCount: state.openEndedCount
      };
    
    case 'RESET_ALL':
      return initialState;
    
    default:
      return state;
  }
};

export const InterviewProvider = ({ children }) => {
  const [state, dispatch] = useReducer(interviewReducer, initialState);

  const value = {
    ...state,
    dispatch,
    actions: {
      setResume: (resume) => dispatch({ type: 'SET_RESUME', payload: resume }),
      setCompanyWebsite: (url) => dispatch({ type: 'SET_COMPANY_WEBSITE', payload: url }),
      setJobPostingUrl: (url) => dispatch({ type: 'SET_JOB_POSTING_URL', payload: url }),
      setJobDescription: (description) => dispatch({ type: 'SET_JOB_DESCRIPTION', payload: description }),
      setOpenEndedCount: (count) => dispatch({ type: 'SET_OPEN_ENDED_COUNT', payload: count }),
      setQuestions: (questions) => dispatch({ type: 'SET_QUESTIONS', payload: questions }),
      setAnswer: (questionId, answer) => dispatch({ type: 'SET_ANSWER', payload: { questionId, answer } }),
      setCurrentQuestion: (index) => dispatch({ type: 'SET_CURRENT_QUESTION', payload: index }),
      setEvaluation: (evaluation) => dispatch({ type: 'SET_EVALUATION', payload: evaluation }),
      setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
      setError: (error) => dispatch({ type: 'SET_ERROR', payload: error }),
      setStep: (step) => dispatch({ type: 'SET_STEP', payload: step }),
      resetInterview: () => dispatch({ type: 'RESET_INTERVIEW' }),
      resetAll: () => dispatch({ type: 'RESET_ALL' })
    }
  };

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
}; 