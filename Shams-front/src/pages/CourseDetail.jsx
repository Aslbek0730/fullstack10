import { useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useTheme } from '../contexts/ThemeContext'
import { motion } from 'framer-motion'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { FaPlay, FaCheck, FaLock, FaEdit, FaSave } from 'react-icons/fa'

const CourseDetailContainer = styled.div`
  padding: 24px 0;
`

const CourseHeader = styled.div`
  background-image: url(${({ image }) => image});
  background-size: cover;
  background-position: center;
  height: 240px;
  border-radius: ${({ theme }) => theme.borderRadius};
  position: relative;
  margin-bottom: 24px;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  }
`

const CourseHeaderContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px;
  color: white;
  
  h1 {
    margin-bottom: 8px;
    font-size: 2rem;
  }
  
  p {
    max-width: 600px;
    opacity: 0.9;
  }
`

const CourseCategory = styled.span`
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
  display: inline-block;
  margin-bottom: 8px;
`

const LessonsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`

const LessonCard = styled(Card)`
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition};
  
  ${({ isActive, theme }) => 
    isActive && `
      border-color: ${theme.colors.primary[400]};
      box-shadow: 0 0 0 2px ${theme.colors.primary[400]}33;
    `
  }
  
  ${({ isCompleted, theme }) => 
    isCompleted && `
      border-color: ${theme.colors.success[400]};
    `
  }
  
  ${({ isLocked, theme }) => 
    isLocked && `
      opacity: 0.7;
      cursor: not-allowed;
    `
  }
`

const LessonHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ isOpen }) => (isOpen ? '16px' : '0')};
`

const LessonTitle = styled.h3`
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 8px;
    color: ${({ isCompleted, theme }) => 
      isCompleted ? theme.colors.success[400] : theme.colors.primary[400]
    };
  }
`

const VideoContainer = styled.div`
  position: relative;
  aspect-ratio: 16 / 9;
  margin-bottom: 16px;
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.boxShadow};
  
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(123, 104, 238, 0.2) 0%, rgba(255, 105, 180, 0.2) 100%);
    z-index: 1;
    pointer-events: none;
  }
`

const LessonContent = styled.div`
  margin-top: 16px;
`

const NoteContainer = styled.div`
  margin-top: 16px;
`

const NoteEditor = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => 
    theme.name === 'dark' ? 'rgba(30, 30, 30, 0.7)' : 'rgba(255, 255, 255, 0.7)'
  };
  color: ${({ theme }) => theme.colors.text};
  font-family: 'Poppins', sans-serif;
  margin-bottom: 8px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[400]};
  }
`

// Dummy course data
const courseData = {
  id: 1,
  title: 'Introduction to Robotics',
  description: 'Learn the basics of robotics and build your first simple robot in this beginner-friendly course.',
  category: 'Robotics',
  image: 'https://images.unsplash.com/photo-1561144257-e32e8506ad14',
  lessons: [
    {
      id: 1,
      title: 'What is Robotics?',
      description: 'An introduction to the field of robotics and its applications in the modern world.',
      videoId: 'xNTJIvMNjzI',
      duration: '15:30',
      isCompleted: true,
      isLocked: false
    },
    {
      id: 2,
      title: 'Basic Components of a Robot',
      description: 'Learn about the essential components that make up a robot, including sensors, actuators, and controllers.',
      videoId: 'AOWvOHj_G3s',
      duration: '22:45',
      isCompleted: false,
      isLocked: false
    },
    {
      id: 3,
      title: 'Programming Your First Robot',
      description: 'Step-by-step instructions for programming a simple robotic movement sequence.',
      videoId: 'V_peL8l2eXE',
      duration: '18:20',
      isCompleted: false,
      isLocked: false
    },
    {
      id: 4,
      title: 'Sensors and Inputs',
      description: 'Discover how robots perceive the world through different types of sensors.',
      videoId: 'AOWvOHj_G3s',
      duration: '25:10',
      isCompleted: false,
      isLocked: true
    },
    {
      id: 5,
      title: 'Building Your First Robot',
      description: 'Hands-on project to assemble and program a simple robot that can move and respond to its environment.',
      videoId: 'V_peL8l2eXE',
      duration: '30:00',
      isCompleted: false,
      isLocked: true
    }
  ]
}

const CourseDetail = () => {
  const { id } = useParams()
  const { theme } = useTheme()
  const [activeLessonId, setActiveLessonId] = useState(1)
  const [lessonStates, setLessonStates] = useState(
    courseData.lessons.map(lesson => ({
      id: lesson.id,
      isCompleted: lesson.isCompleted,
      notes: '',
      isEditingNotes: false
    }))
  )
  
  const activeLesson = courseData.lessons.find(lesson => lesson.id === activeLessonId)
  
  const handleLessonClick = (lessonId, isLocked) => {
    if (!isLocked) {
      setActiveLessonId(lessonId)
    }
  }
  
  const handleCompleteLesson = (lessonId) => {
    setLessonStates(prev => 
      prev.map(state => 
        state.id === lessonId ? { ...state, isCompleted: true } : state
      )
    )
  }
  
  const toggleEditNotes = (lessonId) => {
    setLessonStates(prev => 
      prev.map(state => 
        state.id === lessonId ? { ...state, isEditingNotes: !state.isEditingNotes } : state
      )
    )
  }
  
  const updateNotes = (lessonId, notes) => {
    setLessonStates(prev => 
      prev.map(state => 
        state.id === lessonId ? { ...state, notes } : state
      )
    )
  }
  
  const getLessonState = (lessonId) => {
    return lessonStates.find(state => state.id === lessonId)
  }
  
  return (
    <CourseDetailContainer>
      <CourseHeader image={courseData.image}>
        <CourseHeaderContent>
          <CourseCategory category={courseData.category} theme={theme}>
            {courseData.category}
          </CourseCategory>
          <h1>{courseData.title}</h1>
          <p>{courseData.description}</p>
        </CourseHeaderContent>
      </CourseHeader>
      
      <LessonsContainer>
        {activeLesson && (
          <Card gradient blurEffect>
            <h2>Lesson {activeLesson.id}: {activeLesson.title}</h2>
            
            <VideoContainer theme={theme}>
              <iframe 
                src={`https://www.youtube.com/embed/${activeLesson.videoId}?rel=0`}
                title={activeLesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </VideoContainer>
            
            <div>
              <h3>Description</h3>
              <p>{activeLesson.description}</p>
            </div>
            
            <NoteContainer>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>My Notes</h3>
                <Button 
                  size="small" 
                  variant="outline" 
                  icon={getLessonState(activeLesson.id).isEditingNotes ? <FaSave /> : <FaEdit />}
                  onClick={() => toggleEditNotes(activeLesson.id)}
                >
                  {getLessonState(activeLesson.id).isEditingNotes ? 'Save' : 'Edit Notes'}
                </Button>
              </div>
              
              {getLessonState(activeLesson.id).isEditingNotes ? (
                <NoteEditor 
                  value={getLessonState(activeLesson.id).notes}
                  onChange={(e) => updateNotes(activeLesson.id, e.target.value)}
                  placeholder="Write your notes here..."
                  theme={theme}
                />
              ) : (
                <p style={{ minHeight: '100px', padding: '12px', backgroundColor: theme.name === 'dark' ? 'rgba(30, 30, 30, 0.7)' : 'rgba(240, 240, 240, 0.7)', borderRadius: theme.borderRadius }}>
                  {getLessonState(activeLesson.id).notes || 'No notes yet. Click "Edit Notes" to add some.'}
                </p>
              )}
            </NoteContainer>
            
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              {!getLessonState(activeLesson.id).isCompleted ? (
                <Button 
                  variant="gradient" 
                  size="large"
                  icon={<FaCheck />}
                  onClick={() => handleCompleteLesson(activeLesson.id)}
                  glowEffect
                >
                  Mark as Completed
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="large"
                  icon={<FaCheck />}
                  disabled
                >
                  Completed
                </Button>
              )}
            </div>
          </Card>
        )}
        
        <h2 style={{ marginTop: '32px', marginBottom: '16px' }}>Course Lessons</h2>
        
        {courseData.lessons.map(lesson => (
          <LessonCard 
            key={lesson.id}
            isActive={activeLessonId === lesson.id}
            isCompleted={getLessonState(lesson.id).isCompleted}
            isLocked={lesson.isLocked}
            onClick={() => handleLessonClick(lesson.id, lesson.isLocked)}
            theme={theme}
          >
            <LessonHeader isOpen={activeLessonId === lesson.id}>
              <LessonTitle 
                isCompleted={getLessonState(lesson.id).isCompleted}
                theme={theme}
              >
                {lesson.isLocked ? (
                  <FaLock />
                ) : getLessonState(lesson.id).isCompleted ? (
                  <FaCheck />
                ) : (
                  <FaPlay />
                )}
                Lesson {lesson.id}: {lesson.title}
              </LessonTitle>
              <span>{lesson.duration}</span>
            </LessonHeader>
            
            {activeLessonId === lesson.id && (
              <LessonContent>
                <p>{lesson.description}</p>
              </LessonContent>
            )}
          </LessonCard>
        ))}
      </LessonsContainer>
    </CourseDetailContainer>
  )
}

export default CourseDetail