import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useTheme } from '../contexts/ThemeContext'
import { motion } from 'framer-motion'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { FaGraduationCap, FaClipboardCheck, FaBook, FaClock } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const DashboardContainer = styled.div`
  padding: 24px 0;
`

const PageTitle = styled.h1`
  margin-bottom: 24px;
  color: ${({ theme }) => theme.colors.text};
  
  span {
    color: ${({ theme }) => theme.colors.primary[400]};
  }
`

const SliderContainer = styled.div`
  margin-bottom: 32px;
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.boxShadow};
  
  .slick-slide {
    padding: 0;
  }
  
  .slick-dots {
    bottom: 16px;
    
    li button:before {
      color: white;
    }
  }
`

const SliderItem = styled.div`
  height: 300px;
  background: ${({ bg, theme }) => 
    bg === 'courses' 
      ? `linear-gradient(135deg, ${theme.colors.primary[400]} 0%, ${theme.colors.primary[600]} 100%)`
      : bg === 'news' 
      ? `linear-gradient(135deg, ${theme.colors.secondary[400]} 0%, ${theme.colors.secondary[600]} 100%)`
      : `linear-gradient(135deg, ${theme.colors.accent[400]} 0%, ${theme.colors.accent[600]} 100%)`
  };
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 32px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
    z-index: 1;
    background-size: 200% 200%;
    animation: aurora 10s linear infinite;
  }
`

const SliderContent = styled.div`
  z-index: 2;
  text-align: center;
  max-width: 800px;
  
  h2 {
    font-size: 2rem;
    margin-bottom: 16px;
    font-weight: 700;
  }
  
  p {
    font-size: 1.1rem;
    margin-bottom: 24px;
    opacity: 0.9;
  }
`

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`

const ActionCard = styled(Card)`
  text-align: center;
  padding: 32px;
  cursor: pointer;
  height: 100%;
  
  svg {
    font-size: 2.5rem;
    margin-bottom: 16px;
    color: ${({ theme, iconColor }) => theme.colors[iconColor][400]};
  }
  
  h3 {
    margin-bottom: 8px;
  }
`

const RecentActivities = styled.div`
  margin-top: 40px;
`

const ActivityList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
`

const ActivityItem = styled(motion.div)`
  padding: 16px;
  border-radius: ${({ theme }) => theme.borderRadius};
  background: ${({ theme }) => theme.colors.card};
  box-shadow: ${({ theme }) => theme.boxShadow};
  display: flex;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[400]};
  }
`

const ActivityIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme, type }) => 
    type === 'course' 
      ? theme.colors.primary[400]
      : type === 'test' 
      ? theme.colors.secondary[400]
      : theme.colors.accent[400]
  };
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 16px;
  flex-shrink: 0;
`

const ActivityInfo = styled.div`
  flex: 1;
  
  h4 {
    font-size: 1rem;
    margin-bottom: 4px;
  }
  
  p {
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.neutral[500]};
    margin: 0;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 4px;
    }
  }
`

// Dummy data
const slideData = [
  {
    id: 1,
    type: 'courses',
    title: 'Welcome to Shams Academy',
    description: 'Discover innovative courses designed for young minds and creative adults.',
    buttonText: 'Explore Courses',
    buttonLink: '/courses'
  },
  {
    id: 2,
    type: 'news',
    title: 'New Robotics Course Available',
    description: 'Learn how to build and program your own robot with our newest interactive course.',
    buttonText: 'Join Now',
    buttonLink: '/courses'
  },
  {
    id: 3,
    type: 'motivation',
    title: '"Innovation distinguishes between a leader and a follower"',
    description: '- Steve Jobs',
    buttonText: 'Get Inspired',
    buttonLink: '/courses'
  }
]

const recentActivities = [
  {
    id: 1,
    type: 'course',
    title: 'Introduction to Robotics',
    time: '2 hours ago',
    icon: <FaGraduationCap />
  },
  {
    id: 2,
    type: 'test',
    title: 'Basic Programming Quiz',
    time: 'Yesterday',
    icon: <FaClipboardCheck />
  },
  {
    id: 3,
    type: 'book',
    title: 'The Innovation Mindset',
    time: '3 days ago',
    icon: <FaBook />
  },
  {
    id: 4,
    type: 'course',
    title: 'AI Basics for Children',
    time: 'Last week',
    icon: <FaGraduationCap />
  }
]

const Dashboard = () => {
  const { theme, isDarkMode } = useTheme()
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])
  
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true
  }
  
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          style={{ 
            width: 40, 
            height: 40, 
            borderRadius: '50%', 
            border: `3px solid ${theme.colors.neutral[200]}`,
            borderTop: `3px solid ${theme.colors.primary[400]}` 
          }}
        />
      </div>
    )
  }
  
  return (
    <DashboardContainer>
      <PageTitle theme={theme}>Welcome to <span>Shams Academy</span></PageTitle>
      
      <SliderContainer theme={theme}>
        <Slider {...sliderSettings}>
          {slideData.map((slide) => (
            <SliderItem key={slide.id} bg={slide.type} theme={theme}>
              <SliderContent>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {slide.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {slide.description}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Button
                    as={Link}
                    to={slide.buttonLink}
                    variant="gradient"
                    glowEffect
                  >
                    {slide.buttonText}
                  </Button>
                </motion.div>
              </SliderContent>
            </SliderItem>
          ))}
        </Slider>
      </SliderContainer>
      
      <CardsGrid>
        <ActionCard 
          as={Link} 
          to="/courses" 
          gradient 
          glowEffect
          theme={theme}
          iconColor="primary"
        >
          <FaGraduationCap />
          <h3>New Courses</h3>
          <p>Explore our latest innovative courses designed for all ages.</p>
        </ActionCard>
        
        <ActionCard 
          as={Link} 
          to="/tests" 
          gradient 
          glowEffect
          theme={theme}
          iconColor="secondary"
        >
          <FaClipboardCheck />
          <h3>Take a Test</h3>
          <p>Challenge yourself with our interactive knowledge tests.</p>
        </ActionCard>
        
        <ActionCard 
          as={Link} 
          to="/library" 
          gradient 
          glowEffect
          theme={theme}
          iconColor="accent"
        >
          <FaBook />
          <h3>Read a Book</h3>
          <p>Discover our collection of educational books and materials.</p>
        </ActionCard>
      </CardsGrid>
      
      <RecentActivities>
        <h2>Recent Activities</h2>
        <ActivityList>
          {recentActivities.map((activity) => (
            <ActivityItem 
              key={activity.id} 
              theme={theme}
              whileHover={{ scale: 1.02 }}
            >
              <ActivityIcon theme={theme} type={activity.type}>
                {activity.icon}
              </ActivityIcon>
              <ActivityInfo theme={theme}>
                <h4>{activity.title}</h4>
                <p>
                  <FaClock style={{ marginRight: '4px' }} />
                  {activity.time}
                </p>
              </ActivityInfo>
            </ActivityItem>
          ))}
        </ActivityList>
      </RecentActivities>
    </DashboardContainer>
  )
}

export default Dashboard