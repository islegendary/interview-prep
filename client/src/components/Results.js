import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useInterview } from '../context/InterviewContext';

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

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SubTitle = styled.h3`
  font-size: 1.15rem;
  color: #764ba2;
  margin-bottom: 0.5rem;
`;

const List = styled.ul`
  margin-left: 1.5rem;
  margin-bottom: 1rem;
`;

const ListItem = styled.li`
  margin-bottom: 0.5rem;
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
  margin-right: 1rem;
`;

const Results = () => {
  const { evaluation, actions } = useInterview();
  const navigate = useNavigate();

  if (!evaluation) {
    navigate('/');
    return null;
  }

  return (
    <Container className="fade-in">
      <Title>Interview Assessment</Title>
      <Section>
        <SubTitle>Overall Score</SubTitle>
        <div style={{ fontSize: '2.2rem', fontWeight: 700, color: '#667eea', marginBottom: '1rem' }}>{evaluation.overallScore} / 100</div>
        <div><b>Summary:</b> {evaluation.summary?.overallAssessment}</div>
      </Section>
      <Section>
        <SubTitle>Areas for Improvement</SubTitle>
        <List>
          {evaluation.areasForImprovement?.map((area, idx) => (
            <ListItem key={idx}>
              <b>{area.area}:</b> {area.description} <br/>
              <i>Suggestions:</i> {area.suggestions?.join(', ')}
            </ListItem>
          ))}
        </List>
      </Section>
      <Section>
        <SubTitle>Strengths</SubTitle>
        <List>
          {evaluation.strengths?.map((strength, idx) => (
            <ListItem key={idx}>
              <b>{strength.area}:</b> {strength.description} <br/>
              <i>Examples:</i> {strength.examples?.join(', ')}
            </ListItem>
          ))}
        </List>
      </Section>
      <Section>
        <SubTitle>Best Answers & Feedback</SubTitle>
        <List>
          {evaluation.questionEvaluations?.map((q, idx) => (
            <ListItem key={idx}>
              <b>Q{q.questionId + 1}:</b> {q.feedback} <br/>
              <i>Strengths:</i> {q.strengths?.join(', ')} <br/>
              <i>Improvements:</i> {q.improvements?.join(', ')}
            </ListItem>
          ))}
        </List>
      </Section>
      <Button onClick={() => { actions.resetInterview(); navigate('/'); }}>Restart</Button>
      <Button onClick={() => { actions.resetAll(); navigate('/'); }}>New Setup</Button>
    </Container>
  );
};

export default Results; 