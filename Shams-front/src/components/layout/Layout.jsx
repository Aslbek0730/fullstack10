import { Outlet } from 'react-router-dom'
import styled from 'styled-components'
import Sidebar from './Sidebar'
import { useState, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`

const Main = styled.main`
  flex: 1;
  padding: 16px;
  margin-left: ${({ isSidebarOpen }) => (isSidebarOpen ? '240px' : '0')};
  transition: margin-left ${({ theme }) => theme.transition};
  
  @media (max-width: 768px) {
    margin-left: 0;
  }
`

const Layout = () => {
  const { theme } = useTheme()
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768)
  
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 768)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }
  
  return (
    <LayoutContainer>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Main isSidebarOpen={isSidebarOpen} theme={theme}>
        <Outlet />
      </Main>
    </LayoutContainer>
  )
}

export default Layout