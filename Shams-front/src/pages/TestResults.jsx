import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import styled from 'styled-components'
import { useTheme } from '../contexts/ThemeContext'
import { motion } from 'framer-motion'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { FaCheck, FaTimes, FaClock, FaBook, FaMedal } from 'react-icons/fa'

const ResultsContainer = styled.div`
  padding: 24px 0;
  max-width: 800px;
  margin: 0 auto;
`

const ResultsHeader = styled.div`
  margin-bottom: 32px;
  text-align: center;
`

const ResultsTitle = styled.h1`
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.text};
  
  span {
    color: ${({ theme }) => theme.colors.primary[400]};
  }
`

const ResultsSummary = styled(Card)`
  margin-bottom: 32px;
  text-align: center;
`

const ScoreCircle = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  background: ${({ score, theme }) => {
    if (score >= 80) return theme.colors.success[400];
    if (score >= 60) return theme.colors.warning[400];
    return theme.colors.error[400];
  }};
  color: white;
  box-shadow: 0 0 20px ${({ score, theme }) => {
    if (score >= 80) return theme.colors.success[400] + '80';
    if (score >= 60) return theme.colors.warning[400] + '80';
    return theme.colors.error[400] + '80';
  }};
`

const ResultsStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 16px;
  
  @media (max-width: 500px) {
    flex-direction: column;
    align-items: center;
  }
`

const StatItem = styled.div`
  padding: 12px 16px;
  border-radius: ${({ theme }) => theme.borderRadius};
  background: ${({ type, theme }) => {
    switch (type) {
      case 'correct':
        return theme.colors.success[400];
      case 'incorrect':
        return theme.colors.error[400];
      case 'unanswered':
        return theme.colors.neutral[400];
      default:
        return theme.colors.primary[400];
    }
  }};
  color: white;
  display: flex;
  align-items: center;
  min-width: 120px;
  
  svg {
    margin-right: 8px;
  }
  
  span {
    font-weight: 600;
    margin-left: 4px;
  }
`

const TimeSpent = styled.div`
  font-size: 1rem;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    margin-right: 8px;
    color: ${({ theme }) => theme.colors.primary[400]};
  }
  
  span {
    font-weight: 600;
  }
`

const RecommendationCard = styled(Card)`
  margin-bottom: 32px;
  text-align: center;
`

const RecommendationIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary[400]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  margin: 0 auto 16px;
`

const ActionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 32px;
  
  @media (max-width: 500px) {
    flex-direction: column;
  }
`

// Dummy results data
const getResultsData = () => {
  const storedResults = localStorage.getItem('testResults')
  
  if (storedResults) {
    return JSON.parse(storedResults)
  }
  
  // Default data if nothing stored
  return {
    testId: '2',
    correct: 4,
    incorrect: 1,
    unanswered: 0,
    score: 80,
    timeSpent: 450 // 7:30 minutes
  }
}

const TestResults = () => {
  const { id } = useParams()
  const { theme } = useTheme()
  const [results, setResults] = useState(null)
  
  useEffect(() => {
    setResults(getResultsData())
  }, [])
  
  // Format time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }
  
  if (!results) {
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
    <ResultsContainer>
      <ResultsHeader>
        <ResultsTitle theme={theme}>
          <span>Test Results:</span> Coding Fundamentals
        </ResultsTitle>
        <p>Great job completing the test! Here's how you performed:</p>
      </ResultsHeader>
      
      <ResultsSummary gradient blurEffect>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <ScoreCircle score={results.score} theme={theme}>
            {results.score}%
          </ScoreCircle>
        </motion.div>
        
        <h2 style={{ marginBottom: '16px' }}>
          {results.score >= 80 ? 'Excellent!' : results.score >= 60 ? 'Good Job!' : 'Keep Learning!'}
        </h2>
        
        <ResultsStats>
          <StatItem type="correct" theme={theme}>
            <FaCheck /> Correct <span>{results.correct}</span>
          </StatItem>
          <StatItem type="incorrect" theme={theme}>
            <FaTimes /> Incorrect <span>{results.incorrect}</span>
          </StatItem>
          {results.unanswered > 0 && (
            <StatItem type="unanswered" theme={theme}>
              Unanswered <span>{results.unanswered}</span>
            </StatItem>
          )}
        </ResultsStats>
        
        <TimeSpent theme={theme}>
          <FaClock /> Time spent: <span>{formatTime(results.timeSpent)}</span>
        </TimeSpent>
        
        <p>
          You answered {results.correct} out of {results.correct + results.incorrect + results.unanswered} questions correctly.
        </p>
      </ResultsSummary>
      
      <RecommendationCard blurEffect>
        <RecommendationIcon theme={theme}>
          <FaBook />
        </RecommendationIcon>
        
        <h2 style={{ marginBottom: '16px' }}>Recommended Next Steps</h2>
        
        {results.score >= 80 ? (
          <div>
            <p>You're doing great! Ready to advance your skills?</p>
            <p>We recommend taking the Advanced JavaScript course to build on your strong foundation.</p>
          </div>
        ) : results.score >= 60 ? (
          <div>
            <p>You're on the right track! To improve your skills:</p>
            <p>Review the Basic Programming module and try the practice exercises.</p>
          </div>
        ) : (
          <div>
            <p>Let's strengthen your understanding:</p>
            <p>We recommend revisiting the Introduction to Coding course and focusing on core concepts.</p>
          </div>
        )}
        
        <Button 
          as={Link} 
          to="/courses"
          variant="gradient"
          style={{ marginTop: '16px' }}
          glowEffect
        >
          Explore Recommended Courses
        </Button>
      </RecommendationCard>
      
      <ActionButtons>
        <Button 
          as={Link} 
          to="/tests"
          variant="outline"
          icon={<FaMedal />}
        >
          Back to Tests
        </Button>
        
        <Button 
          as={Link} 
          to={`/tests/${id}`}
          variant="primary"
          icon={<FaSync />}
        >
          Retake Test
        </Button>
      </ActionButtons>
    </ResultsContainer>
  )
}

export default TestResults