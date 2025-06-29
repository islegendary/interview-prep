import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import axios from 'axios';

const FormContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  background: rgba(255,255,255,0.98);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(102,126,234,0.08);
  padding: 2.5rem 2rem 2rem 2rem;
  margin-top: 2rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Label = styled.label`
  font-weight: 500;
  color: #444;
  margin-bottom: 0.5rem;
  display: block;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-bottom: 1.25rem;
  font-size: 1rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-bottom: 1.25rem;
  font-size: 1rem;
  resize: vertical;
`;

const Button = styled.button`
  width: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 0.9rem 0;
  border-radius: 8px;
  margin-top: 0.5rem;
  transition: background 0.2s;
  &:hover {
    background: linear-gradient(90deg, #5a67d8 0%, #6b21a8 100%);
  }
`;

const ErrorMsg = styled.div`
  color: #e53e3e;
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  text-align: center;
`;

const SetupForm = () => {
  const { resume, companyWebsite, jobPostingUrl, jobDescription, openEndedCount, actions, setError, loading, error, setLoading, setQuestions } = useInterview();
  const [localResume, setLocalResume] = useState(resume);
  const [localCompanyWebsite, setLocalCompanyWebsite] = useState(companyWebsite);
  const [localJobPostingUrl, setLocalJobPostingUrl] = useState(jobPostingUrl);
  const [localJobDescription, setLocalJobDescription] = useState(jobDescription);
  const [localOpenEndedCount, setLocalOpenEndedCount] = useState(openEndedCount);
  const [localError, setLocalError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    if (!localResume.trim()) return 'Resume is required.';
    if (!localCompanyWebsite.trim() && !localJobDescription.trim()) return 'Either company website or job description is required.';
    if (localOpenEndedCount < 1 || localOpenEndedCount > 20) return 'Open-ended questions must be between 1 and 20.';
    return null;
  };

  const handleStart = async (e) => {
    e.preventDefault();
    setLocalError(null);
    const validationError = validate();
    if (validationError) {
      setLocalError(validationError);
      return;
    }
    setIsLoading(true);
    try {
      actions.setResume(localResume);
      actions.setCompanyWebsite(localCompanyWebsite);
      actions.setJobPostingUrl(localJobPostingUrl);
      actions.setJobDescription(localJobDescription);
      actions.setOpenEndedCount(localOpenEndedCount);
      actions.setLoading(true);
      // Call backend to generate questions
      const response = await axios.post('/api/interview/generate-questions', {
        resume: localResume,
        companyWebsite: localCompanyWebsite,
        jobPostingUrl: localJobPostingUrl,
        jobDescription: localJobDescription,
        openEndedCount: localOpenEndedCount
      });
      actions.setQuestions(response.data.questions);
      actions.setLoading(false);
      setIsLoading(false);
      navigate('/interview');
    } catch (err) {
      setIsLoading(false);
      actions.setLoading(false);
      setLocalError(err.response?.data?.error || 'Failed to generate questions. Please try again.');
    }
  };

  return (
    <FormContainer className="fade-in">
      <Title>Interview Setup</Title>
      {localError && <ErrorMsg>{localError}</ErrorMsg>}
      <form onSubmit={handleStart}>
        <Label htmlFor="resume">Paste Your Resume *</Label>
        <TextArea
          id="resume"
          value={localResume}
          onChange={e => setLocalResume(e.target.value)}
          placeholder="Paste your full resume or CV here..."
          required
        />

        <Label htmlFor="companyWebsite">Company Website URL</Label>
        <Input
          id="companyWebsite"
          type="url"
          value={localCompanyWebsite}
          onChange={e => setLocalCompanyWebsite(e.target.value)}
          placeholder="https://company.com"
        />

        <Label htmlFor="jobPostingUrl">Job Posting URL</Label>
        <Input
          id="jobPostingUrl"
          type="url"
          value={localJobPostingUrl}
          onChange={e => setLocalJobPostingUrl(e.target.value)}
          placeholder="https://company.com/careers/job-id"
        />

        <Label htmlFor="jobDescription">Job Description (if no URL)</Label>
        <TextArea
          id="jobDescription"
          value={localJobDescription}
          onChange={e => setLocalJobDescription(e.target.value)}
          placeholder="Paste the full job description here if you don't have a URL..."
        />

        <Label htmlFor="openEndedCount">Number of Open-Ended Questions</Label>
        <Input
          id="openEndedCount"
          type="number"
          min={1}
          max={20}
          value={localOpenEndedCount}
          onChange={e => setLocalOpenEndedCount(Number(e.target.value))}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating Questions...' : 'Start Interview Simulation'}
        </Button>
      </form>
    </FormContainer>
  );
};

export default SetupForm; 