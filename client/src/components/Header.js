import React from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BarChart3, Settings } from 'lucide-react';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  cursor: pointer;
  
  &:hover {
    color: #5a67d8;
  }
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NavButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  color: ${props => props.active ? '#667eea' : '#666'};
  background: ${props => props.active ? 'rgba(102, 126, 234, 0.1)' : 'transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
  }
`;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <HeaderContainer>
      <Logo onClick={() => navigate('/')}>
        <LogoIcon>IP</LogoIcon>
        InterviewPrepPro
      </Logo>
      
      <Navigation>
        <NavButton 
          active={isActive('/')} 
          onClick={() => navigate('/')}
        >
          <Home size={18} />
          Setup
        </NavButton>
        
        <NavButton 
          active={isActive('/interview')} 
          onClick={() => navigate('/interview')}
        >
          <BarChart3 size={18} />
          Interview
        </NavButton>
        
        <NavButton 
          active={isActive('/results')} 
          onClick={() => navigate('/results')}
        >
          <Settings size={18} />
          Results
        </NavButton>
      </Navigation>
    </HeaderContainer>
  );
};

export default Header; 