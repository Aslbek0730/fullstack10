import { useState } from 'react'
import styled from 'styled-components'
import { useTheme } from '../contexts/ThemeContext'
import { motion } from 'framer-motion'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Link } from 'react-router-dom'
import { FaGraduationCap, FaClock, FaStar } from 'react-icons/fa'

const CoursesContainer = styled.div`
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

const CoursesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
`

const CourseCard = styled(Card)`
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
`

const CourseImage = styled.div`
  height: 160px;
  background-image: url(${({ image }) => image});
  background-size: cover;
  background-position: center;
  margin: -16px -16px 16px -16px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60%;
    background: linear-gradient(transparent, ${({ theme }) => 
      theme.name === 'dark' ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.9)'
    });
  }
`

const CourseCategory = styled.span`
  position: absolute;
  top: 16px;
  left: 16px;
  background: ${({ category, theme }) => 
    category === 'Robotics' 
      ? theme.colors.primary[400] 
      : category === 'Programming' 
      ? theme.colors.secondary[400]
      : category === 'AI' 
      ? theme.colors.accent[400]
      : theme.colors.warning[400]
  };
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 500;
  z-index: 1;
`

const CourseTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 8px;
`

const CourseInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

const CourseMeta = styled.div`
  display: flex;
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

const CourseDescription = styled.p`
  margin-bottom: 16px;
  flex: 1;
`

const CourseRating = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  
  svg {
    color: ${({ theme }) => theme.colors.warning[400]};
    margin-right: 4px;
  }
  
  span {
    font-weight: 500;
    margin-right: 8px;
  }
  
  small {
    color: ${({ theme }) => theme.colors.neutral[500]};
  }
`

// Dummy course data
const courses = [
  {
    id: 1,
    title: 'Introduction to Robotics',
    description: 'Learn the basics of robotics and build your first simple robot in this beginner-friendly course.',
    category: 'Robotics',
    image: 'https://images.unsplash.com/photo-1561144257-e32e8506ad14',
    duration: '4 weeks',
    lessons: 12,
    rating: 4.7,
    reviews: 120
  },
  {
    id: 2,
    title: 'Coding for Kids',
    description: 'A fun introduction to programming concepts through games and interactive projects.',
    category: 'Programming',
    image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159',
    duration: '6 weeks',
    lessons: 18,
    rating: 4.9,
    reviews: 85
  },
  {
    id: 3,
    title: 'AI Basics for Children',
    description: 'Discover how artificial intelligence works through simple, engaging activities and examples.',
    category: 'AI',
    image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a',
    duration: '3 weeks',
    lessons: 9,
    rating: 4.5,
    reviews: 62
  },
  {
    id: 4,
    title: 'Fun with Physics',
    description: 'Explore physics concepts through hands-on experiments that bring science to life.',
    category: 'Physics',
    image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31',
    duration: '5 weeks',
    lessons: 15,
    rating: 4.6,
    reviews: 78
  },
  {
    id: 5,
    title: 'Advanced Robotics Projects',
    description: 'Take your robotics skills to the next level with more complex projects and challenges.',
    category: 'Robotics',
    image: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a',
    duration: '8 weeks',
    lessons: 24,
    rating: 4.8,
    reviews: 95
  },
  {
    id: 6,
    title: 'JavaScript for Beginners',
    description: 'Start your coding journey with JavaScript, the language of the web.',
    category: 'Programming',
    image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a',
    duration: '7 weeks',
    lessons: 21,
    rating: 4.6,
    reviews: 110
  }
]

const Courses = () => {
  const { theme } = useTheme()
  const [activeCategory, setActiveCategory] = useState('All')
  
  const categories = ['All', 'Robotics', 'Programming', 'AI', 'Physics']
  
  const filteredCourses = activeCategory === 'All' 
    ? courses 
    : courses.filter(course => course.category === activeCategory)
  
  return (
    <CoursesContainer>
      <PageTitle theme={theme}>Explore <span>Courses</span></PageTitle>
      
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
      
      <CoursesGrid>
        {filteredCourses.map(course => (
          <motion.div 
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CourseCard as={Link} to={`/courses/${course.id}`} blurEffect>
              <CourseImage image={course.image} theme={theme}>
                <CourseCategory category={course.category} theme={theme}>
                  {course.category}
                </CourseCategory>
              </CourseImage>
              
              <CourseInfo>
                <CourseTitle>{course.title}</CourseTitle>
                
                <CourseMeta theme={theme}>
                  <div>
                    <FaClock />
                    {course.duration}
                  </div>
                  <div>
                    <FaGraduationCap />
                    {course.lessons} lessons
                  </div>
                </CourseMeta>
                
                <CourseDescription>{course.description}</CourseDescription>
                
                <CourseRating theme={theme}>
                  <FaStar />
                  <span>{course.rating}</span>
                  <small>({course.reviews} reviews)</small>
                </CourseRating>
                
                <Button variant="gradient" glowEffect>
                  Start Course
                </Button>
              </CourseInfo>
            </CourseCard>
          </motion.div>
        ))}
      </CoursesGrid>
      
      {filteredCourses.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <h3>No courses found in this category</h3>
          <p>Please check back later or select another category.</p>
        </div>
      )}
    </CoursesContainer>
  )
}

export default Courses