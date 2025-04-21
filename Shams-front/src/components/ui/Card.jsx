import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'

const StyledCard = styled(motion.div)`
  background: ${({ theme, gradient }) => 
    gradient 
      ? theme.name === 'dark' 
        ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)' 
        : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)'
      : theme.colors.card
  };
  border-radius: ${({ theme }) => theme.borderRadius};
  box-shadow: ${({ theme }) => theme.boxShadow};
  padding: ${({ padding }) => padding || '16px'};
  margin-bottom: 16px;
  transition: all ${({ theme }) => theme.transition};
  border: 1px solid ${({ theme }) => theme.colors.border};
  position: relative;
  
  ${({ glowEffect, theme }) => 
    glowEffect && `
      &:hover {
        animation: glow 2s infinite alternate;
      }
    `
  }
  
  ${({ blurEffect, theme }) => 
    blurEffect && `
      backdrop-filter: blur(8px);
      background: ${
        theme.name === 'dark' 
          ? 'rgba(30, 30, 30, 0.7)' 
          : 'rgba(255, 255, 255, 0.7)'
      };
    `
  }
  
  &:hover {
    box-shadow: ${({ theme }) => theme.hoverShadow};
    transform: translateY(-5px);
  }
`

const CardHeader = styled.div`
  margin-bottom: 16px;
  
  h3 {
    margin-bottom: 8px;
  }
`

const CardBody = styled.div``

const CardFooter = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: ${({ align }) => align || 'flex-start'};
  align-items: center;
`

export const Card = ({ 
  children, 
  title, 
  subtitle, 
  footer, 
  footerAlign, 
  gradient = false, 
  glowEffect = false, 
  blurEffect = false,
  padding,
  ...props 
}) => {
  const { theme } = useTheme()
  
  return (
    <StyledCard 
      theme={theme} 
      gradient={gradient} 
      glowEffect={glowEffect} 
      blurEffect={blurEffect}
      padding={padding}
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      {...props}
    >
      {(title || subtitle) && (
        <CardHeader>
          {title && <h3>{title}</h3>}
          {subtitle && <p>{subtitle}</p>}
        </CardHeader>
      )}
      <CardBody>{children}</CardBody>
      {footer && <CardFooter align={footerAlign}>{footer}</CardFooter>}
    </StyledCard>
  )
}

export default Card