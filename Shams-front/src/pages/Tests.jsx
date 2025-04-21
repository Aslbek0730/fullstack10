import { useState } from 'react'
import styled from 'styled-components'
import { useTheme } from '../contexts/ThemeContext'
import { motion } from 'framer-motion'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Link } from 'react-router-dom'
import { FaClipboardCheck, FaClock, FaBook } from 'react-icons/fa'

const TestsContainer = styled.div`
  padding: 24px 0;
`

const PageTitle = styled.h1`
  margin-bottom: 24px;
  color: ${({ theme }) => theme.colors.text};
  
  span {
    color: ${({ theme }) => theme.colors.primary[400]};
  }
`

const CategoriesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const CategoryButton = styled(Button)`
  position: relative;
  overflow: hidden;
  
  ${({ isActive, theme }) => 
    isActive && `
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: linear-gradient(90deg, ${theme.colors.primary[400]}, ${theme.colors.secondary[400]});
      }
    `
  }
`

const TestsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
`

const TestCard = styled(Card)`
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  ${({ completed, theme }) => 
    completed && `
      border-color: ${theme.colors.success[400]};
      
      &::after {
        content: 'Completed';
        position: absolute;
        top: 16px;
        right: 16px;
        background: ${theme.colors.success[400]};
        color: white;
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 0.75rem;
        font-weight: 500;
      }
    `
  }
`

const TestIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${({ category, theme }) => 
    category === 'Robotics' 
      ? theme.colors.primary[400] 
      : category === 'Programming' 
      ? theme.colors.secondary[400]
      : category === 'AI' 
      ? theme.colors.accent[400]
      : theme.colors.warning[400]
  };
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  margin: 0 auto 16px;
`

const TestTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 8px;
  text-align: center;
`

const TestInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

const TestMeta = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.neutral[500]};
  font-size: 0.85rem;
  
  div {
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 4px;
    }
  }
`

const TestDescription = styled.p`
  margin-bottom: 16px;
  text-align: center;
  flex: 1;
`

const TestResults = styled.div`
  margin-bottom: 16px;
  text-align: center;
  
  div {
    display: flex;
    justify-content: center;
    margin-top: 8px;
  }
  
  span {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 0.85rem;
    font-weight: 500;
    margin: 0 4px;
  }
  
  .correct {
    background: ${({ theme }) => theme.colors.success[400]};
    color: white;
  }
  
  .incorrect {
    background: ${({ theme }) => theme.colors.error[400]};
    color: white;
  }
  
  .score {
    background: ${({ theme }) => theme.colors.primary[400]};
    color: white;
  }
`

// Dummy test data
const tests = [
  {
    id: 1,
    title: 'Robotics Basics',
    description: 'Test your knowledge of fundamental robotics concepts and terminology.',
    category: 'Robotics',
    questions: 10,
    timeLimit: '15 min',
    completed: true,
    correct: 8,
    incorrect: 2,
    score: 80
  },
  {
    id: 2,
    title: 'Coding Fundamentals',
    description: 'Check your understanding of basic programming concepts and syntax.',
    category: 'Programming',
    questions: 15,
    timeLimit: '20 min',
    completed: false
  },
  {
    id: 3,
    title: 'AI Concepts',
    description: 'Test your knowledge about artificial intelligence and machine learning basics.',
    category: 'AI',
    questions: 12,
    timeLimit: '18 min',
    completed: false
  },
  {
    id: 4,
    title: 'Physics Laws',
    description: 'Evaluate your understanding of basic physics principles and laws.',
    category: 'Physics',
    questions: 10,
    timeLimit: '15 min',
    completed: true,
    correct: 9,
    incorrect: 1,
    score: 90
  },
  {
    id: 5,
    title: 'Robot Movement',
    description: 'Test your knowledge of how robots move and navigate their environment.',
    category: 'Robotics',
    questions: 8,
    timeLimit: '12 min',
    completed: false
  },
  {
    id: 6,
    title: 'JavaScript Basics',
    description: 'Evaluate your understanding of JavaScript fundamentals and syntax.',
    category: 'Programming',
    questions: 20,
    timeLimit: '25 min',
    completed: false
  }
]

const Tests = () => {
  const { theme } = useTheme()
  const [activeCategory, setActiveCategory] = useState('All')
  
  const categories = ['All', 'Robotics', 'Programming', 'AI', 'Physics']
  
  const filteredTests = activeCategory === 'All' 
    ? tests 
    : tests.filter(test => test.category === activeCategory)
  
  return (
    <TestsContainer>
      <PageTitle theme={theme}>Knowledge <span>Tests</span></PageTitle>
      
      <CategoriesContainer>
        {categories.map(category => (
          <CategoryButton 
            key={category}
            variant={activeCategory === category ? 'primary' : 'outline'}
            onClick={() => setActiveCategory(category)}
            isActive={activeCategory === category}
            theme={theme}
          >
            {category}
          </CategoryButton>
        ))}
      </CategoriesContainer>
      
      <TestsGrid>
        {filteredTests.map(test => (
          <motion.div 
            key={test.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TestCard 
              as={test.completed ? Link : Link} 
              to={test.completed ? `/tests/${test.id}/results` : `/tests/${test.id}`}
              completed={test.completed}
              theme={theme}
              blurEffect
            >
              <TestIcon category={test.category} theme={theme}>
                <FaClipboardCheck />
              </TestIcon>
              
              <TestInfo>
                <TestTitle>{test.title}</TestTitle>
                
                <TestMeta theme={theme}>
                  <div>
                    <FaClipboardCheck />
                    {test.questions} questions
                  </div>
                  <div>
                    <FaClock />
                    {test.timeLimit}
                  </div>
                </TestMeta>
                
                <TestDescription>{test.description}</TestDescription>
                
                {test.completed && (
                  <TestResults theme={theme}>
                    <strong>Your Results:</strong>
                    <div>
                      <span className="correct">Correct: {test.correct}</span>
                      <span className="incorrect">Incorrect: {test.incorrect}</span>
                      <span className="score">Score: {test.score}%</span>
                    </div>
                  </TestResults>
                )}
                
                <Button variant={test.completed ? 'secondary' : 'gradient'} glowEffect>
                  {test.completed ? 'View Results' : 'Start Test'}
                </Button>
              </TestInfo>
            </TestCard>
          </motion.div>
        ))}
      </TestsGrid>
      
      {filteredTests.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <h3>No tests found in this category</h3>
          <p>Please check back later or select another category.</p>
        </div>
      )}
    </TestsContainer>
  )
}

export default Tests