import { Link, useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useTheme } from '../../contexts/ThemeContext'
import { motion } from 'framer-motion'
import PropTypes from 'prop-types'
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
  FaTimes,
  FaSignOutAlt
} from 'react-icons/fa'
import { useState } from 'react'

const SidebarContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  left: ${({ $isOpen }) => ($isOpen ? '0' : '-240px')};
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
    left: ${({ $isOpen }) => ($isOpen ? '0' : '-240px')};
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
  color: ${({ theme, $isActive }) => 
    $isActive ? theme.colors.primary[400] : theme.colors.text
  };
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: 8px;
  transition: all ${({ theme }) => theme.transition};
  font-weight: ${({ $isActive }) => ($isActive ? '500' : '400')};
  
  &:hover {
    background-color: ${({ theme }) => 
      theme.name === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
    };
    color: ${({ theme }) => theme.colors.primary[400]};
  }
  
  ${({ $isActive, theme }) => 
    $isActive && `
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
  left: ${({ $isOpen }) => ($isOpen ? '248px' : '16px')};
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

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-top: auto;
  margin-bottom: 16px;
  transition: all ${({ theme }) => theme.transition};
  background: none;
  border: none;
  width: 100%;
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => 
      theme.name === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'
    };
    color: ${({ theme }) => theme.colors.error};
  }
  
  svg {
    margin-right: 12px;
    font-size: 1.2rem;
  }
`

const DialogOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`

const DialogContent = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background};
  padding: 24px;
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  max-width: 400px;
  width: 90%;
  text-align: center;
`

const DialogTitle = styled.h3`
  margin: 0 0 16px 0;
  color: ${({ theme }) => theme.colors.text};
`

const DialogButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 24px;
`

const DialogButton = styled.button`
  padding: 8px 24px;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all ${({ theme }) => theme.transition};
  
  &:first-child {
    background-color: ${({ theme }) => theme.colors.error};
    color: white;
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.error}dd;
    }
  }
  
  &:last-child {
    background-color: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.border}dd;
    }
  }
`

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { theme } = useTheme()
  const location = useLocation()
  const navigate = useNavigate()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  
  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/')
  }
  
  const sidebarItems = [
    { path: '/app', text: 'Asosiy', icon: <FaHome /> },
    { path: '/app/courses', text: 'Kurslar', icon: <FaBook /> },
    { path: '/app/assistant', text: 'Aqilli intellekt', icon: <FaBrain /> },
    { path: '/app/tests', text: 'Testlar', icon: <FaClipboardCheck /> },
    { path: '/app/library', text: 'Kutubxona', icon: <FaBookOpen /> },
    { path: '/app/payments', text: 'To`lovlar', icon: <FaCreditCard /> },
    { path: '/app/profile', text: 'Profil', icon: <FaUser /> },
    { path: '/app/settings', text: 'Sozlamalar', icon: <FaCog /> },
  ]
  
  return (
    <>
      <SidebarContainer $isOpen={isOpen} theme={theme}>
        <Logo theme={theme}>
          <img src="/logo.svg" alt="Shams Academy Logo" />
          <h2>Shams Academy</h2>
        </Logo>
        <Navigation>
          {sidebarItems.map((item) => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              $isActive={location.pathname === item.path} 
              theme={theme}
              onClick={() => window.innerWidth <= 768 && toggleSidebar()}
            >
              {item.icon}
              {item.text}
            </NavLink>
          ))}
          <LogoutButton 
            theme={theme}
            onClick={() => setShowLogoutDialog(true)}
          >
            <FaSignOutAlt />
            Chiqish
          </LogoutButton>
        </Navigation>
      </SidebarContainer>
      
      <ToggleButton 
        $isOpen={isOpen} 
        onClick={toggleSidebar} 
        theme={theme} 
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </ToggleButton>

      {showLogoutDialog && (
        <DialogOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowLogoutDialog(false)}
        >
          <DialogContent
            theme={theme}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <DialogTitle theme={theme}>
              Chiqish uchun ishonchingiz komilmi?
            </DialogTitle>
            <DialogButtons>
              <DialogButton theme={theme} onClick={handleLogout}>
                Ha
              </DialogButton>
              <DialogButton theme={theme} onClick={() => setShowLogoutDialog(false)}>
                Yo`q
              </DialogButton>
            </DialogButtons>
          </DialogContent>
        </DialogOverlay>
      )}
    </>
  )
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired
}

export default Sidebar