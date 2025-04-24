import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useTheme } from '../contexts/ThemeContext'
import { motion } from 'framer-motion'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Link } from 'react-router-dom'
import { FaClipboardCheck, FaClock, FaBook, FaQuestionCircle, FaChartLine, FaUsers, FaChartBar } from 'react-icons/fa'
import { testService } from '../services/api'

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

const FilterContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
`

const FilterButton = styled(Button)`
  ${({ isActive }) => 
    isActive && `
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: linear-gradient(90deg, ${({ theme }) => theme.colors.primary[400]}, ${({ theme }) => theme.colors.secondary[400]});
      }
    `
  }
`

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
`

const Tests = () => {
  const { theme } = useTheme()
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  
  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true)
        const response = await testService.getTests()
        // Check if response.data is an array
        if (Array.isArray(response.data)) {
          setTests(response.data)
        } else if (response.data && Array.isArray(response.data.results)) {
          // Handle paginated response
          setTests(response.data.results)
        } else {
          // Handle empty or invalid response
          setTests([])
        }
        setError(null)
      } catch (err) {
        setError('Testlarni yuklashda xatolik yuz berdi')
        console.error('Error fetching tests:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchTests()
  }, [])
  
  const filteredTests = tests.filter(test => {
    if (filter === 'all') return true
    if (filter === 'completed') return test.is_completed
    if (filter === 'pending') return !test.is_completed
    return true
  })
  
  if (loading) {
    return <div>Yuklanmoqda...</div>
  }
  
  if (error) {
    return <div>{error}</div>
  }
  
  if (!filteredTests || filteredTests.length === 0) {
    return <div>Testlar topilmadi</div>
  }
  
  return (
    <TestsContainer>
      <PageTitle theme={theme}>O`qish uchun <span>Testlar</span></PageTitle>
      
      <FilterContainer>
        <FilterButton 
          isActive={filter === 'all'} 
          onClick={() => setFilter('all')}
        >
          Barchasi
        </FilterButton>
        <FilterButton 
          isActive={filter === 'completed'} 
          onClick={() => setFilter('completed')}
        >
          Yechilgan
        </FilterButton>
        <FilterButton 
          isActive={filter === 'pending'} 
          onClick={() => setFilter('pending')}
        >
          Yechilmagan
        </FilterButton>
      </FilterContainer>
      
      <TestsGrid>
        {filteredTests.map(test => (
          <TestCard key={test.id} as={motion.div} whileHover={{ y: -5 }}>
            <TestInfo>
              <TestTitle>{test.title}</TestTitle>
              <TestDescription>{test.description}</TestDescription>
              
              <TestMeta>
                <div>
                  <FaClock />
                  {test.duration} daqiqa
                </div>
                <div>
                  <FaUsers />
                  {test.participants} ishtirokchi
                </div>
                <div>
                  <FaChartBar />
                  {test.passing_score}% o`tish
                </div>
              </TestMeta>
              
              <ButtonGroup>
                <Button as={Link} to={`/app/tests/${test.id}`} variant="primary">
                  {test.is_completed ? 'Natijalarni ko`rish' : 'Testni boshlash'}
                </Button>
              </ButtonGroup>
            </TestInfo>
          </TestCard>
        ))}
      </TestsGrid>
    </TestsContainer>
  )
}

export default Tests