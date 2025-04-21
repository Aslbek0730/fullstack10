import { useState } from 'react'
import styled from 'styled-components'
import { useTheme } from '../contexts/ThemeContext'
import { motion } from 'framer-motion'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { FaUser, FaEnvelope, FaEdit, FaSave, FaTimes, FaGraduationCap, FaClipboardCheck, FaBook } from 'react-icons/fa'

const ProfileContainer = styled.div`
  padding: 24px 0;
  max-width: 800px;
  margin: 0 auto;
`

const PageTitle = styled.h1`
  margin-bottom: 24px;
  color: ${({ theme }) => theme.colors.text};
  
  span {
    color: ${({ theme }) => theme.colors.primary[400]};
  }
`

const ProfileHeader = styled.div`
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  
  @media (max-width: 576px) {
    flex-direction: column;
    text-align: center;
  }
`

const AvatarContainer = styled.div`
  position: relative;
  margin-right: 24px;
  
  @media (max-width: 576px) {
    margin-right: 0;
    margin-bottom: 16px;
  }
`

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: ${({ theme }) => 
    `linear-gradient(135deg, ${theme.colors.primary[400]} 0%, ${theme.colors.secondary[400]} 100%)`
  };
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  box-shadow: ${({ theme }) => theme.boxShadow};
  transition: all ${({ theme }) => theme.transition};
  overflow: hidden;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: ${({ theme }) => theme.hoverShadow};
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const ProfileInfo = styled.div`
  flex: 1;
  
  h2 {
    margin-bottom: 8px;
  }
  
  p {
    color: ${({ theme }) => theme.colors.neutral[500]};
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 8px;
    }
  }
`

const ProfileActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`

const ProfileTabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-bottom: 24px;
  overflow-x: auto;
  padding-bottom: 1px;
  
  &::-webkit-scrollbar {
    height: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary[400]};
    border-radius: 2px;
  }
`

const TabButton = styled.button`
  padding: 12px 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: 'Poppins', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: ${({ isActive, theme }) => 
    isActive ? theme.colors.primary[400] : theme.colors.text
  };
  border-bottom: 3px solid ${({ isActive, theme }) => 
    isActive ? theme.colors.primary[400] : 'transparent'
  };
  transition: all ${({ theme }) => theme.transition};
  white-space: nowrap;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary[400]};
  }
  
  svg {
    margin-right: 8px;
  }
`

const ProfileSection = styled.div`
  margin-bottom: 32px;
`

const CoursesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
`

const TestsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const ProfileFormCard = styled(Card)`
  margin-bottom: 16px;
`

const FormGroup = styled.div`
  margin-bottom: 24px;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
  }
  
  input {
    width: 100%;
    padding: 12px 16px;
    border-radius: ${({ theme }) => theme.borderRadius};
    border: 1px solid ${({ theme }) => theme.colors.border};
    background: ${({ theme }) => 
      theme.name === 'dark' ? 'rgba(30, 30, 30, 0.7)' : 'rgba(255, 255, 255, 0.7)'
    };
    color: ${({ theme }) => theme.colors.text};
    font-family: 'Poppins', sans-serif;
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary[400]};
      box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.primary[400]}33`};
    }
  }
`

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
`

// Dummy user data
const userData = {
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  avatar: null,
  courses: [
    {
      id: 1,
      title: 'Introduction to Robotics',
      progress: 80,
      lastAccessed: '2 days ago'
    },
    {
      id: 2,
      title: 'Coding for Kids',
      progress: 45,
      lastAccessed: 'Yesterday'
    },
    {
      id: 3,
      title: 'AI Basics for Children',
      progress: 10,
      lastAccessed: 'Today'
    }
  ],
  tests: [
    {
      id: 1,
      title: 'Robotics Basics',
      score: 80,
      date: '3 days ago'
    },
    {
      id: 4,
      title: 'Physics Laws',
      score: 90,
      date: 'Last week'
    }
  ],
  books: [
    {
      id: 1,
      title: 'Introduction to Robotics for Kids',
      lastRead: '1 day ago'
    },
    {
      id: 6,
      title: 'The Innovation Mindset',
      lastRead: 'Today'
    }
  ]
}

const Profile = () => {
  const { theme } = useTheme()
  const [activeTab, setActiveTab] = useState('courses')
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: userData.name,
    email: userData.email
  })
  
  const handleTabChange = (tab) => {
    setActiveTab(tab)
  }
  
  const handleEditProfile = () => {
    setIsEditing(true)
  }
  
  const handleCancelEdit = () => {
    setIsEditing(false)
    setFormData({
      name: userData.name,
      email: userData.email
    })
  }
  
  const handleSaveProfile = () => {
    // In a real app, this would save to a backend
    setIsEditing(false)
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  return (
    <ProfileContainer>
      <PageTitle theme={theme}>My <span>Profile</span></PageTitle>
      
      {isEditing ? (
        <ProfileFormCard blurEffect>
          <h2 style={{ marginBottom: '24px' }}>Edit Profile</h2>
          
          <FormGroup theme={theme}>
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" 
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </FormGroup>
          
          <FormGroup theme={theme}>
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </FormGroup>
          
          <FormGroup theme={theme}>
            <label htmlFor="avatar">Profile Picture</label>
            <input 
              type="file" 
              id="avatar"
              accept="image/*"
            />
          </FormGroup>
          
          <FormActions>
            <Button 
              variant="outline" 
              onClick={handleCancelEdit}
              icon={<FaTimes />}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleSaveProfile}
              icon={<FaSave />}
            >
              Save Changes
            </Button>
          </FormActions>
        </ProfileFormCard>
      ) : (
        <>
          <ProfileHeader>
            <AvatarContainer>
              <Avatar theme={theme}>
                {userData.avatar ? (
                  <img src={userData.avatar} alt={userData.name} />
                ) : (
                  <FaUser />
                )}
              </Avatar>
            </AvatarContainer>
            
            <ProfileInfo theme={theme}>
              <h2>{userData.name}</h2>
              <p>
                <FaEnvelope />
                {userData.email}
              </p>
              
              <ProfileActions>
                <Button 
                  variant="outline" 
                  size="small"
                  icon={<FaEdit />}
                  onClick={handleEditProfile}
                >
                  Edit Profile
                </Button>
              </ProfileActions>
            </ProfileInfo>
          </ProfileHeader>
          
          <ProfileTabs theme={theme}>
            <TabButton 
              isActive={activeTab === 'courses'} 
              onClick={() => handleTabChange('courses')}
              theme={theme}
            >
              <FaGraduationCap />
              My Courses
            </TabButton>
            <TabButton 
              isActive={activeTab === 'tests'} 
              onClick={() => handleTabChange('tests')}
              theme={theme}
            >
              <FaClipboardCheck />
              My Tests
            </TabButton>
            <TabButton 
              isActive={activeTab === 'books'} 
              onClick={() => handleTabChange('books')}
              theme={theme}
            >
              <FaBook />
              My Books
            </TabButton>
          </ProfileTabs>
          
          <ProfileSection>
            {activeTab === 'courses' && (
              <>
                <h3 style={{ marginBottom: '16px' }}>My Courses</h3>
                <CoursesList>
                  {userData.courses.map(course => (
                    <motion.div 
                      key={course.id}
                      whileHover={{ y: -5 }}
                    >
                      <Card gradient blurEffect>
                        <h4>{course.title}</h4>
                        <div style={{ margin: '12px 0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div style={{ height: '8px', background: theme.colors.neutral[200], borderRadius: '4px', overflow: 'hidden' }}>
                            <div 
                              style={{ 
                                height: '100%', 
                                width: `${course.progress}%`, 
                                background: `linear-gradient(90deg, ${theme.colors.primary[400]}, ${theme.colors.secondary[400]})`,
                                borderRadius: '4px'
                              }} 
                            />
                          </div>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: theme.colors.neutral[500] }}>
                          Last accessed: {course.lastAccessed}
                        </p>
                        <Button variant="primary" size="small" style={{ marginTop: '8px' }}>
                          Continue
                        </Button>
                      </Card>
                    </motion.div>
                  ))}
                </CoursesList>
              </>
            )}
            
            {activeTab === 'tests' && (
              <>
                <h3 style={{ marginBottom: '16px' }}>My Tests</h3>
                <TestsList>
                  {userData.tests.map(test => (
                    <motion.div 
                      key={test.id}
                      whileHover={{ x: 5 }}
                    >
                      <Card blurEffect>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <h4>{test.title}</h4>
                            <p style={{ fontSize: '0.85rem', color: theme.colors.neutral[500] }}>
                              Completed: {test.date}
                            </p>
                          </div>
                          <div style={{ 
                            padding: '8px 16px', 
                            background: test.score >= 80 ? theme.colors.success[400] : theme.colors.warning[400],
                            color: 'white',
                            borderRadius: theme.borderRadius,
                            fontWeight: '600'
                          }}>
                            {test.score}%
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                          <Button variant="outline" size="small">
                            View Results
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </TestsList>
              </>
            )}
            
            {activeTab === 'books' && (
              <>
                <h3 style={{ marginBottom: '16px' }}>My Books</h3>
                <CoursesList>
                  {userData.books.map(book => (
                    <motion.div 
                      key={book.id}
                      whileHover={{ y: -5 }}
                    >
                      <Card gradient blurEffect>
                        <h4>{book.title}</h4>
                        <p style={{ fontSize: '0.85rem', color: theme.colors.neutral[500], margin: '12px 0' }}>
                          Last read: {book.lastRead}
                        </p>
                        <Button variant="primary" size="small">
                          Continue Reading
                        </Button>
                      </Card>
                    </motion.div>
                  ))}
                </CoursesList>
              </>
            )}
          </ProfileSection>
        </>
      )}
    </ProfileContainer>
  )
}

export default Profile