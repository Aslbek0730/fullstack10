import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useTheme } from '../../contexts/ThemeContext'
import { motion } from 'framer-motion'
import { 
  FaHome, 
  FaBook, 
  FaBrain, 
  FaClipboardCheck, 
  FaBookOpen, 
  FaCreditCard, 
  FaUser, 
  FaCog, 
  FaBars,
  FaTimes
} from 'react-icons/fa'

const SidebarContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: ${({ isOpen }) => (isOpen ? '0' : '-240px')};
  width: 240px;
  height: 100vh;
  background: ${({ theme }) => 
    theme.name === 'dark' 
      ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' 
      : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
  };
  box-shadow: ${({ theme }) => theme.boxShadow};
  z-index: 1000;
  transition: left ${({ theme }) => theme.transition};
  overflow-y: auto;
  
  @media (max-width: 768px) {
    left: ${({ isOpen }) => (isOpen ? '0' : '-240px')};
  }
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  h2 {
    font-size: 1.2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary[400]};
    margin: 0;
    margin-left: 8px;
  }
  
  img {
    width: 32px;
    height: 32px;
  }
`

const Navigation = styled.nav`
  padding: 16px;
`

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: ${({ theme, isActive }) => 
    isActive ? theme.colors.primary[400] : theme.colors.text
  };
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: 8px;
  transition: all ${({ theme }) => theme.transition};
  font-weight: ${({ isActive }) => (isActive ? '500' : '400')};
  
  &:hover {
    background-color: ${({ theme }) => 
      theme.name === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
    };
    color: ${({ theme }) => theme.colors.primary[400]};
  }
  
  ${({ isActive, theme }) => 
    isActive && `
      background-color: ${
        theme.name === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
      };
      box-shadow: 0 0 8px ${theme.colors.primary[400]};
    `
  }
  
  svg {
    margin-right: 12px;
    font-size: 1.2rem;
  }
`

const ToggleButton = styled.button`
  position: fixed;
  top: 16px;
  left: ${({ isOpen }) => (isOpen ? '248px' : '16px')};
  z-index: 1001;
  background-color: ${({ theme }) => theme.colors.primary[400]};
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition};
  box-shadow: ${({ theme }) => theme.boxShadow};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[600]};
  }
  
  @media (min-width: 769px) {
    display: none;
  }
`

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { theme } = useTheme()
  const location = useLocation()
  
  const sidebarItems = [
    { path: '/', text: 'Home', icon: <FaHome /> },
    { path: '/courses', text: 'Courses', icon: <FaBook /> },
    { path: '/assistant', text: 'AI Assistant', icon: <FaBrain /> },
    { path: '/tests', text: 'Tests', icon: <FaClipboardCheck /> },
    { path: '/library', text: 'Library', icon: <FaBookOpen /> },
    { path: '/payments', text: 'Payments', icon: <FaCreditCard /> },
    { path: '/profile', text: 'Profile', icon: <FaUser /> },
    { path: '/settings', text: 'Settings', icon: <FaCog /> },
  ]
  
  return (
    <>
      <SidebarContainer isOpen={isOpen} theme={theme}>
        <Logo theme={theme}>
          <img src="/logo.svg" alt="Shams Academy Logo" />
          <h2>Shams Academy</h2>
        </Logo>
        <Navigation>
          {sidebarItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              isActive={location.pathname === item.path} 
              theme={theme}
              onClick={() => window.innerWidth <= 768 && toggleSidebar()}
            >
              {item.icon}
              {item.text}
            </NavLink>
          ))}
        </Navigation>
      </SidebarContainer>
      
      <ToggleButton 
        isOpen={isOpen} 
        onClick={toggleSidebar} 
        theme={theme} 
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </ToggleButton>
    </>
  )
}

export default Sidebar