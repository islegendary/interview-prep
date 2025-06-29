import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';
import axios from 'axios';

const Container = styled.div`
  max-width: 700px;
  margin: 0 auto;
  background: rgba(255,255,255,0.98);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(102,126,234,0.08);
  padding: 2.5rem 2rem 2rem 2rem;
  margin-top: 2rem;
`;

const Title = styled.h2`
  font-size: 1.7rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const QuestionCard = styled.div`
  background: #f7fafc;
  border-radius: 10px;
  padding: 1.5rem 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(102,126,234,0.04);
`;

const QuestionText = styled.div`
  font-size: 1.15rem;
  font-weight: 500;
  margin-bottom: 1rem;
`;

const Option = styled.label`
  display: block;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 0.7rem 1rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: border 0.2s;
  &:hover {
    border-color: #667eea;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 0.7rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-size: 1rem;
  margin-bottom: 1rem;
  resize: vertical;
`;

const NavButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-weight: 600;
  font-size: 1.05rem;
  padding: 0.7rem 2.2rem;
  border-radius: 8px;
  transition: background 0.2s;
  &:hover {
    background: linear-gradient(90deg, #5a67d8 0%, #6b21a8 100%);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
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

const InterviewSession = () => {
  const { questions, answers, currentQuestionIndex, actions, resume, companyWebsite, jobPostingUrl, jobDescription, setEvaluation } = useInterview();
  const [localAnswers, setLocalAnswers] = useState(answers || {});
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  if (!questions) {
    navigate('/');
    return null;
  }

  // Flatten all questions into a single array with type
  const allQuestions = [
    ...questions.multipleChoice.map((q, i) => ({ ...q, type: 'mcq', id: `mcq-${i}` })),
    ...questions.cultural.map((q, i) => ({ ...q, type: 'cultural', id: `cultural-${i}` })),
    ...questions.openEnded.map((q, i) => ({ ...q, type: 'openEnded', id: `openEnded-${i}` })),
  ];

  const current = allQuestions[currentQuestionIndex];
  const total = allQuestions.length;

  const handleAnswer = (value) => {
    setLocalAnswers({ ...localAnswers, [current.id]: value });
    actions.setAnswer(current.id, value);
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) actions.setCurrentQuestion(currentQuestionIndex - 1);
  };

  const handleNext = () => {
    if (currentQuestionIndex < total - 1) actions.setCurrentQuestion(currentQuestionIndex + 1);
  };

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      // Call backend to evaluate answers
      const response = await axios.post('/api/interview/evaluate-answers', {
        resume,
        questions,
        answers: localAnswers,
        companyInfo: companyWebsite,
        jobInfo: jobPostingUrl || jobDescription
      });
      actions.setEvaluation(response.data.evaluation);
      setIsSubmitting(false);
      navigate('/results');
    } catch (err) {
      setIsSubmitting(false);
      setError(err.response?.data?.error || 'Failed to evaluate answers. Please try again.');
    }
  };

  return (
    <Container className="fade-in">
      <Title>Interview Simulation</Title>
      {error && <ErrorMsg>{error}</ErrorMsg>}
      <QuestionCard>
        <QuestionText>
          <b>Question {currentQuestionIndex + 1} of {total}:</b> {current.question}
        </QuestionText>
        {current.type === 'mcq' && (
          <div>
            {current.options.map((opt, idx) => (
              <Option key={idx}>
                <input
                  type="radio"
                  name={current.id}
                  value={opt}
                  checked={localAnswers[current.id] === opt}
                  onChange={() => handleAnswer(opt)}
                  style={{ marginRight: 8 }}
                />
                {opt}
              </Option>
            ))}
          </div>
        )}
        {current.type !== 'mcq' && (
          <TextArea
            value={localAnswers[current.id] || ''}
            onChange={e => handleAnswer(e.target.value)}
            placeholder="Type your answer here..."
          />
        )}
      </QuestionCard>
      <NavButtons>
        <Button onClick={handlePrev} disabled={currentQuestionIndex === 0}>Previous</Button>
        {currentQuestionIndex < total - 1 ? (
          <Button onClick={handleNext} disabled={!localAnswers[current.id]}>Next</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!localAnswers[current.id] || isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Finish & Get Assessment'}
          </Button>
        )}
      </NavButtons>
    </Container>
  );
};

export default InterviewSession; 