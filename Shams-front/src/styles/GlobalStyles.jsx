import { createGlobalStyle } from 'styled-components'
import { useTheme } from '../contexts/ThemeContext'

export const GlobalStyles = () => {
  const { theme } = useTheme()
  
  const GlobalStylesComponent = createGlobalStyle`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Poppins', sans-serif;
      background: ${theme.colors.background};
      color: ${theme.colors.text};
      transition: all ${theme.transition};
      min-height: 100vh;
      overflow-x: hidden;
    }

    h1, h2, h3, h4, h5, h6 {
      font-weight: 600;
      line-height: 1.2;
      margin-bottom: 0.5em;
      background: ${theme.name === 'dark' 
        ? 'linear-gradient(135deg, #fff 0%, #cce0ff 100%)' 
        : 'linear-gradient(135deg, #1a1a1a 0%, #404040 100%)'};
      -webkit-background-clip: text;
      -webkit-text-fill-color: ${theme.name === 'dark' ? 'transparent' : 'initial'};
    }

    h1 {
      font-size: 2.5rem;
    }

    h2 {
      font-size: 2rem;
    }

    h3 {
      font-size: 1.75rem;
    }

    h4 {
      font-size: 1.5rem;
    }

    h5 {
      font-size: 1.25rem;
    }

    h6 {
      font-size: 1rem;
    }

    p {
      line-height: 1.6;
      margin-bottom: 1rem;
      color: ${theme.colors.text};
    }

    a {
      color: ${theme.colors.primary[400]};
      text-decoration: none;
      transition: all ${theme.transition};
      position: relative;
      
      &:hover {
        color: ${theme.colors.primary[600]};
        
        &::after {
          width: 100%;
        }
      }
      
      &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 0;
        height: 2px;
        background: ${theme.name === 'dark'
          ? `linear-gradient(90deg, ${theme.colors.primary[400]}, ${theme.colors.secondary[400]})`
          : theme.colors.primary[400]};
        transition: width ${theme.transition};
      }
    }

    button {
      cursor: pointer;
      font-family: 'Poppins', sans-serif;
    }

    img {
      max-width: 100%;
      height: auto;
    }

    ul, ol {
      padding-left: 1.5rem;
      margin-bottom: 1rem;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .section {
      padding: 40px 0;
    }

    @keyframes aurora {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }

    @keyframes glow {
      0% {
        box-shadow: 0 0 5px ${theme.colors.primary[400]};
      }
      50% {
        box-shadow: 0 0 20px ${theme.colors.primary[400]}, 0 0 30px ${theme.colors.secondary[400]};
      }
      100% {
        box-shadow: 0 0 5px ${theme.colors.primary[400]};
      }
    }

    @keyframes neonPulse {
      0% {
        text-shadow: 0 0 7px ${theme.colors.primary[400]},
                     0 0 10px ${theme.colors.primary[400]},
                     0 0 21px ${theme.colors.primary[400]};
      }
      50% {
        text-shadow: 0 0 10px ${theme.colors.primary[400]},
                     0 0 20px ${theme.colors.primary[400]},
                     0 0 30px ${theme.colors.primary[400]};
      }
      100% {
        text-shadow: 0 0 7px ${theme.colors.primary[400]},
                     0 0 10px ${theme.colors.primary[400]},
                     0 0 21px ${theme.colors.primary[400]};
      }
    }

    @keyframes borderGlow {
      0% {
        border-color: ${theme.colors.primary[400]};
        box-shadow: 0 0 5px ${theme.colors.primary[400]};
      }
      50% {
        border-color: ${theme.colors.secondary[400]};
        box-shadow: 0 0 20px ${theme.colors.secondary[400]};
      }
      100% {
        border-color: ${theme.colors.primary[400]};
        box-shadow: 0 0 5px ${theme.colors.primary[400]};
      }
    }

    /* Custom Scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    ::-webkit-scrollbar-track {
      background: ${theme.name === 'dark' 
        ? 'rgba(255, 255, 255, 0.1)' 
        : 'rgba(0, 0, 0, 0.1)'};
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb {
      background: ${theme.colors.primary[400]};
      border-radius: 4px;
      
      &:hover {
        background: ${theme.colors.primary[600]};
      }
    }

    /* Selection */
    ::selection {
      background: ${theme.colors.primary[400]};
      color: white;
    }

    /* Glass Morphism */
    .glass {
      background: ${theme.glassMorphism.background};
      backdrop-filter: blur(10px);
      border: ${theme.glassMorphism.border};
      box-shadow: ${theme.glassMorphism.shadow};
    }

    /* Animations */
    .fade-in {
      animation: fadeIn 0.5s ease-in;
    }

    .slide-up {
      animation: slideUp 0.5s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `

  return <GlobalStylesComponent />
}