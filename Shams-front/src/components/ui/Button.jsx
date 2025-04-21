import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'

const StyledButton = styled(motion.button)`
  padding: ${({ size }) => 
    size === 'small' ? '8px 16px' : 
    size === 'large' ? '16px 24px' : 
    '12px 20px'
  };
  font-size: ${({ size }) => 
    size === 'small' ? '0.875rem' : 
    size === 'large' ? '1.125rem' : 
    '1rem'
  };
  font-weight: 500;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all ${({ theme }) => theme.transition};
  position: relative;
  overflow: hidden;
  
  ${({ variant, theme }) => {
    switch(variant) {
      case 'outline':
        return `
          background: transparent;
          border: 2px solid ${theme.colors.primary[400]};
          color: ${theme.colors.primary[400]};
          
          &:hover, &:focus {
            background: ${theme.colors.primary[400]};
            color: white;
          }
        `
      case 'secondary':
        return `
          background: ${theme.colors.secondary[400]};
          color: white;
          
          &:hover, &:focus {
            background: ${theme.colors.secondary[500]};
          }
        `
      case 'gradient':
        return `
          background: linear-gradient(90deg, ${theme.colors.primary[400]} 0%, ${theme.colors.secondary[400]} 100%);
          color: white;
          background-size: 200% auto;
          
          &:hover, &:focus {
            background-position: right center;
          }
        `
      default:
        return `
          background: ${theme.colors.primary[400]};
          color: white;
          
          &:hover, &:focus {
            background: ${theme.colors.primary[600]};
          }
        `
    }
  }}
  
  ${({ disabled, theme }) => 
    disabled && `
      opacity: 0.6;
      cursor: not-allowed;
      
      &:hover {
        background: ${theme.colors.primary[400]};
      }
    `
  }
  
  svg {
    margin-right: ${({ iconOnly }) => iconOnly ? '0' : '8px'};
  }
  
  ${({ glowEffect, theme }) => 
    glowEffect && `
      &:hover {
        box-shadow: 0 0 15px ${theme.colors.primary[400]};
      }
    `
  }
  
  ${({ iconOnly }) => 
    iconOnly && `
      width: ${iconOnly === 'small' ? '36px' : '48px'};
      height: ${iconOnly === 'small' ? '36px' : '48px'};
      padding: 0;
      border-radius: 50%;
    `
  }
`

export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  icon, 
  glowEffect = false,
  iconOnly = false,
  ...props 
}) => {
  const { theme } = useTheme()
  
  return (
    <StyledButton 
      onClick={disabled ? undefined : onClick} 
      variant={variant} 
      size={size} 
      disabled={disabled} 
      theme={theme}
      glowEffect={glowEffect}
      iconOnly={iconOnly}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      {...props}
    >
      {icon && icon}
      {!iconOnly && children}
    </StyledButton>
  )
}

export default Button