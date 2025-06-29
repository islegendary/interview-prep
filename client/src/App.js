import React, { useState } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SetupForm from './components/SetupForm';
import InterviewSession from './components/InterviewSession';
import Results from './components/Results';
import { InterviewProvider } from './context/InterviewContext';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const MainContent = styled.main`
  padding-top: 80px;
  min-height: calc(100vh - 80px);
`;

function App() {
  return (
    <InterviewProvider>
      <Router future={{ v7_relativeSplatPath: true }}>
        <AppContainer>
          <Header />
          <MainContent>
            <Routes>
              <Route path="/" element={<SetupForm />} />
              <Route path="/interview" element={<InterviewSession />} />
              <Route path="/results" element={<Results />} />
            </Routes>
          </MainContent>
        </AppContainer>
      </Router>
    </InterviewProvider>
  );
}

export default App; 