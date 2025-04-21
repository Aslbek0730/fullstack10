import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useTheme } from '../contexts/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { FaClock, FaArrowLeft, FaArrowRight, FaCheck } from 'react-icons/fa'

const TestDetailContainer = styled.div`
  padding: 24px 0;
  max-width: 800px;
  margin: 0 auto;
`

const TestHeader = styled.div`
  margin-bottom: 24px;
  text-align: center;
`

const TestTitle = styled.h1`
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.text};
  
  span {
    color: ${({ theme }) => theme.colors.primary[400]};
  }
`

const TestInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-bottom: 16px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.neutral[500]};
  
  div {
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 8px;
    }
  }
`

const ProgressContainer = styled.div`
  margin-bottom: 32px;
`

const ProgressBar = styled.div`
  height: 8px;
  background: ${({ theme }) => theme.colors.neutral[200]};
  border-radius: 4px;
  margin-bottom: 8px;
  overflow: hidden;
  
  div {
    height: 100%;
    border-radius: 4px;
    background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary[400]}, ${({ theme }) => theme.colors.secondary[400]});
    width: ${({ progress }) => `${progress}%`};
    transition: width 0.3s ease;
  }
`

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.neutral[500]};
`

const TimeRemaining = styled.div`
  font-size: 1rem;
  text-align: center;
  margin-bottom: 24px;
  
  span {
    font-weight: 600;
    color: ${({ timeIsLow, theme }) => 
      timeIsLow ? theme.colors.error[400] : theme.colors.primary[400]
    };
  }
`

const QuestionCard = styled(Card)`
  margin-bottom: 32px;
`

const QuestionText = styled.h3`
  margin-bottom: 24px;
`

const OptionsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`

const OptionButton = styled(Button)`
  justify-content: flex-start;
  text-align: left;
  padding: 16px;
  transition: all ${({ theme }) => theme.transition};
  
  ${({ isSelected, theme }) => 
    isSelected && `
      background: ${theme.colors.primary[400]};
      color: white;
      border-color: ${theme.colors.primary[400]};
      
      &:hover {
        background: ${theme.colors.primary[500]};
      }
    `
  }
`

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 32px;
`

// Dummy test data
const testData = {
  id: 2,
  title: 'Coding Fundamentals',
  description: 'Check your understanding of basic programming concepts and syntax.',
  timeLimit: 1200, // 20 minutes in seconds
  questions: [
    {
      id: 1,
      text: 'What does HTML stand for?',
      options: [
        'Hyper Text Markup Language',
        'High Tech Machine Learning',
        'Hyperlink and Text Management Logic',
        'Home Tool Management Language'
      ],
      correctAnswer: 0
    },
    {
      id: 2,
      text: 'Which programming language is known for its use in web browsers?',
      options: [
        'Python',
        'JavaScript',
        'Java',
        'C++'
      ],
      correctAnswer: 1
    },
    {
      id: 3,
      text: 'What symbol is used to assign a value to a variable in most programming languages?',
      options: [
        '=',
        ':',
        '->',
        '<-'
      ],
      correctAnswer: 0
    },
    {
      id: 4,
      text: 'Which of the following is a loop structure?',
      options: [
        'if-else',
        'switch',
        'for',
        'print'
      ],
      correctAnswer: 2
    },
    {
      id: 5,
      text: 'What does CSS stand for?',
      options: [
        'Computer Style Sheets',
        'Creative Style System',
        'Cascading Style Sheets',
        'Colorful Style Sheets'
      ],
      correctAnswer: 2
    }
  ]
}

const TestDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { theme } = useTheme()
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState(Array(testData.questions.length).fill(null))
  const [timeRemaining, setTimeRemaining] = useState(testData.timeLimit)
  
  const currentQuestion = testData.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / testData.questions.length) * 100
  
  // Format time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`
  }
  
  // Handle timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleFinishTest()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [])
  
  // Handle option selection
  const handleSelectOption = (optionIndex) => {
    const newSelectedOptions = [...selectedOptions]
    newSelectedOptions[currentQuestionIndex] = optionIndex
    setSelectedOptions(newSelectedOptions)
  }
  
  // Navigation handlers
  const handleNextQuestion = () => {
    if (currentQuestionIndex < testData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }
  
  const handleFinishTest = () => {
    // Calculate results
    let correct = 0
    let incorrect = 0
    
    selectedOptions.forEach((selected, index) => {
      if (selected === testData.questions[index].correctAnswer) {
        correct++
      } else if (selected !== null) {
        incorrect++
      }
    })
    
    const score = Math.round((correct / testData.questions.length) * 100)
    
    // Save results (in a real app, this would be sent to a backend)
    const results = {
      testId: id,
      correct,
      incorrect,
      unanswered: testData.questions.length - correct - incorrect,
      score,
      selectedOptions,
      timeSpent: testData.timeLimit - timeRemaining
    }
    
    // Store results temporarily (would be in a database in a real app)
    localStorage.setItem('testResults', JSON.stringify(results))
    
    // Navigate to results page
    navigate(`/tests/${id}/results`)
  }
  
  return (
    <TestDetailContainer>
      <TestHeader>
        <TestTitle theme={theme}>
          <span>Test:</span> {testData.title}
        </TestTitle>
        <TestInfo theme={theme}>
          <div>
            <FaClock />
            {testData.questions.length} Questions
          </div>
        </TestInfo>
      </TestHeader>
      
      <ProgressContainer>
        <ProgressBar theme={theme} progress={progress}>
          <div />
        </ProgressBar>
        <ProgressText theme={theme}>
          <span>Question {currentQuestionIndex + 1} of {testData.questions.length}</span>
          <span>Progress: {Math.round(progress)}%</span>
        </ProgressText>
      </ProgressContainer>
      
      <TimeRemaining timeIsLow={timeRemaining < 60} theme={theme}>
        Time Remaining: <span>{formatTime(timeRemaining)}</span>
      </TimeRemaining>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <QuestionCard gradient blurEffect>
            <QuestionText>
              {currentQuestionIndex + 1}. {currentQuestion.text}
            </QuestionText>
            
            <OptionsContainer>
              {currentQuestion.options.map((option, index) => (
                <OptionButton
                  key={index}
                  variant="outline"
                  isSelected={selectedOptions[currentQuestionIndex] === index}
                  onClick={() => handleSelectOption(index)}
                  theme={theme}
                >
                  {String.fromCharCode(65 + index)}. {option}
                </OptionButton>
              ))}
            </OptionsContainer>
          </QuestionCard>
        </motion.div>
      </AnimatePresence>
      
      <NavigationButtons>
        <Button 
          variant="outline" 
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
          icon={<FaArrowLeft />}
        >
          Previous
        </Button>
        
        {currentQuestionIndex === testData.questions.length - 1 ? (
          <Button 
            variant="gradient" 
            onClick={handleFinishTest}
            icon={<FaCheck />}
            glowEffect
          >
            Finish Test
          </Button>
        ) : (
          <Button 
            variant="primary" 
            onClick={handleNextQuestion}
            icon={<FaArrowRight />}
            iconPosition="right"
          >
            Next
          </Button>
        )}
      </NavigationButtons>
    </TestDetailContainer>
  )
}

export default TestDetail