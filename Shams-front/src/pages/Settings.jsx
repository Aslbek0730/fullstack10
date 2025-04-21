import { useState } from 'react'
import styled from 'styled-components'
import { useTheme } from '../contexts/ThemeContext'
import { motion } from 'framer-motion'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { FaSun, FaMoon, FaGlobe, FaBell, FaBellSlash, FaTrash, FaExclamationTriangle } from 'react-icons/fa'

const SettingsContainer = styled.div`
  padding: 24px 0;
  max-width: 800px;
  margin: 0 auto;
`

const PageTitle = styled.h1`
  margin-bottom: 24px;
  color: ${({ theme }) => theme.colors.text};
  
  span {
    color: ${({ theme }) => theme.colors.primary[400]};
  }
`

const SettingsSection = styled.div`
  margin-bottom: 32px;
`

const SectionTitle = styled.h2`
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
    color: ${({ theme }) => theme.colors.primary[400]};
  }
`

const SettingCard = styled(Card)`
  margin-bottom: 16px;
`

const SettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  &:first-child {
    padding-top: 0;
  }
`

const SettingLabel = styled.div`
  h3 {
    margin-bottom: 4px;
  }
  
  p {
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.neutral[500]};
    margin: 0;
  }
`

const ThemeToggle = styled.button`
  width: 64px;
  height: 32px;
  border-radius: 16px;
  background: ${({ isActive, theme }) => 
    isActive 
      ? `linear-gradient(90deg, ${theme.colors.primary[400]} 0%, ${theme.colors.secondary[400]} 100%)`
      : theme.colors.neutral[300]
  };
  position: relative;
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition};
  
  &::after {
    content: '';
    position: absolute;
    top: 4px;
    left: ${({ isActive }) => isActive ? 'calc(100% - 28px)' : '4px'};
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: white;
    transition: all ${({ theme }) => theme.transition};
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

const LanguageSelect = styled.select`
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => 
    theme.name === 'dark' ? 'rgba(30, 30, 30, 0.7)' : 'rgba(255, 255, 255, 0.7)'
  };
  color: ${({ theme }) => theme.colors.text};
  font-family: 'Poppins', sans-serif;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[400]};
  }
`

const DangerZone = styled(Card)`
  border-color: ${({ theme }) => theme.colors.error[400]};
  margin-bottom: 16px;
`

const DangerZoneHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  
  h3 {
    margin: 0;
    color: ${({ theme }) => theme.colors.error[400]};
  }
  
  svg {
    margin-right: 8px;
    color: ${({ theme }) => theme.colors.error[400]};
  }
`

const DeleteConfirm = styled.div`
  margin-top: 16px;
  padding: 16px;
  background: ${({ theme }) => 
    theme.name === 'dark' ? 'rgba(220, 38, 38, 0.1)' : 'rgba(220, 38, 38, 0.05)'
  };
  border-radius: ${({ theme }) => theme.borderRadius};
  
  p {
    margin-bottom: 16px;
  }
  
  input {
    width: 100%;
    padding: 8px 12px;
    border-radius: ${({ theme }) => theme.borderRadius};
    border: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => 
      theme.name === 'dark' ? 'rgba(30, 30, 30, 0.7)' : 'rgba(255, 255, 255, 0.7)'
    };
    color: ${({ theme }) => theme.colors.text};
    font-family: 'Poppins', sans-serif;
    margin-bottom: 16px;
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.error[400]};
    }
  }
`

const NotificationBanner = styled(motion.div)`
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 16px;
  background: ${({ theme, type }) => 
    type === 'success' 
      ? theme.colors.success[400]
      : theme.colors.error[400]
  };
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  max-width: 300px;
  
  p {
    margin: 0;
  }
`

const Settings = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme()
  const [language, setLanguage] = useState('en')
  const [notifications, setNotifications] = useState(true)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [notification, setNotification] = useState(null)
  
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value)
    showNotification('success', 'Language settings updated')
  }
  
  const handleNotificationsToggle = () => {
    setNotifications(!notifications)
    showNotification('success', `Notifications ${!notifications ? 'enabled' : 'disabled'}`)
  }
  
  const handleDeleteAccount = () => {
    if (deleteConfirmText !== 'DELETE') return
    
    showNotification('error', 'This is a demo. Your account cannot be deleted.')
    setShowDeleteConfirm(false)
    setDeleteConfirmText('')
  }
  
  const showNotification = (type, message) => {
    setNotification({ type, message })
    
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }
  
  return (
    <SettingsContainer>
      <PageTitle theme={theme}>
        <span>Settings</span>
      </PageTitle>
      
      <SettingsSection>
        <SectionTitle theme={theme}>
          <FaSun />
          Appearance
        </SectionTitle>
        
        <SettingCard blurEffect>
          <SettingRow theme={theme}>
            <SettingLabel theme={theme}>
              <h3>Dark Mode</h3>
              <p>Switch between light and dark themes</p>
            </SettingLabel>
            <ThemeToggle 
              isActive={isDarkMode} 
              onClick={toggleTheme}
              theme={theme}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            />
          </SettingRow>
        </SettingCard>
      </SettingsSection>
      
      <SettingsSection>
        <SectionTitle theme={theme}>
          <FaGlobe />
          Language
        </SectionTitle>
        
        <SettingCard blurEffect>
          <SettingRow theme={theme}>
            <SettingLabel theme={theme}>
              <h3>Interface Language</h3>
              <p>Choose your preferred language</p>
            </SettingLabel>
            <LanguageSelect 
              value={language}
              onChange={handleLanguageChange}
              theme={theme}
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ru">Русский</option>
              <option value="ar">العربية</option>
            </LanguageSelect>
          </SettingRow>
        </SettingCard>
      </SettingsSection>
      
      <SettingsSection>
        <SectionTitle theme={theme}>
          <FaBell />
          Notifications
        </SectionTitle>
        
        <SettingCard blurEffect>
          <SettingRow theme={theme}>
            <SettingLabel theme={theme}>
              <h3>Enable Notifications</h3>
              <p>Receive updates about new courses and activities</p>
            </SettingLabel>
            <ThemeToggle 
              isActive={notifications} 
              onClick={handleNotificationsToggle}
              theme={theme}
              aria-label={notifications ? 'Disable notifications' : 'Enable notifications'}
            />
          </SettingRow>
        </SettingCard>
      </SettingsSection>
      
      <SettingsSection>
        <SectionTitle theme={theme}>
          <FaExclamationTriangle />
          Danger Zone
        </SectionTitle>
        
        <DangerZone theme={theme}>
          <DangerZoneHeader theme={theme}>
            <FaTrash />
            <h3>Delete Account</h3>
          </DangerZoneHeader>
          
          <p>This will permanently delete your account and remove all your data from our systems.</p>
          
          {!showDeleteConfirm ? (
            <Button 
              variant="outline" 
              style={{ 
                color: theme.colors.error[400], 
                borderColor: theme.colors.error[400] 
              }}
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Account
            </Button>
          ) : (
            <DeleteConfirm theme={theme}>
              <p>To confirm, type "DELETE" in the field below:</p>
              <input 
                type="text" 
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
              />
              <div style={{ display: 'flex', gap: '16px' }}>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setDeleteConfirmText('')
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="outline"
                  style={{ 
                    color: 'white', 
                    background: theme.colors.error[400],
                    borderColor: theme.colors.error[400],
                    opacity: deleteConfirmText !== 'DELETE' ? 0.6 : 1
                  }}
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== 'DELETE'}
                >
                  Permanently Delete
                </Button>
              </div>
            </DeleteConfirm>
          )}
        </DangerZone>
      </SettingsSection>
      
      {/* Notification Banner */}
      <AnimatePresence>
        {notification && (
          <NotificationBanner
            theme={theme}
            type={notification.type}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <p>{notification.message}</p>
          </NotificationBanner>
        )}
      </AnimatePresence>
    </SettingsContainer>
  )
}

export default Settings