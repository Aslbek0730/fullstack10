import { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { useTheme } from '../contexts/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../components/ui/Button'
import { FaMicrophone, FaPaperPlane, FaVolumeUp, FaCopy } from 'react-icons/fa'

const AssistantContainer = styled.div`
  padding: 24px 0;
  height: calc(100vh - 48px);
  display: flex;
  flex-direction: column;
`

const PageTitle = styled.h1`
  margin-bottom: 24px;
  color: ${({ theme }) => theme.colors.text};
  
  span {
    color: ${({ theme }) => theme.colors.primary[400]};
  }
`

const ChatContainer = styled.div`
  flex: 1;
  background: ${({ theme }) => 
    theme.name === 'dark' 
      ? 'linear-gradient(135deg, rgba(30, 30, 30, 0.7) 0%, rgba(20, 20, 20, 0.7) 100%)' 
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(240, 240, 240, 0.7) 100%)'
  };
  backdrop-filter: blur(10px);
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.boxShadow};
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 8px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary[400]};
    border-radius: 3px;
  }
`

const MessageItem = styled(motion.div)`
  display: flex;
  margin-bottom: 16px;
  flex-direction: ${({ isUser }) => isUser ? 'row-reverse' : 'row'};
`

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ isUser, theme }) => 
    isUser 
      ? theme.colors.secondary[400] 
      : theme.colors.primary[400]
  };
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  margin: ${({ isUser }) => isUser ? '0 0 0 12px' : '0 12px 0 0'};
  flex-shrink: 0;
  
  ${({ isAI, theme }) => 
    isAI && `
      background: linear-gradient(135deg, ${theme.colors.primary[400]} 0%, ${theme.colors.secondary[400]} 100%);
      box-shadow: 0 0 10px ${theme.colors.primary[400]};
    `
  }
`

const MessageBubble = styled.div`
  background: ${({ isUser, theme }) => 
    isUser 
      ? theme.colors.secondary[400] 
      : theme.name === 'dark' 
        ? 'rgba(45, 45, 45, 0.9)' 
        : 'rgba(255, 255, 255, 0.9)'
  };
  color: ${({ isUser, theme }) => 
    isUser 
      ? 'white' 
      : theme.colors.text
  };
  padding: 12px 16px;
  border-radius: ${({ theme }) => theme.borderRadius};
  max-width: 70%;
  position: relative;
  box-shadow: ${({ theme }) => theme.boxShadow};
  
  p {
    margin: 0;
    line-height: 1.5;
    white-space: pre-wrap;
  }
`

const MessageControls = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
  justify-content: ${({ isUser }) => isUser ? 'flex-end' : 'flex-start'};
`

const InputContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 8px;
`

const TextInput = styled.textarea`
  flex: 1;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 12px 16px;
  background: ${({ theme }) => 
    theme.name === 'dark' 
      ? 'rgba(30, 30, 30, 0.7)' 
      : 'rgba(255, 255, 255, 0.7)'
  };
  color: ${({ theme }) => theme.colors.text};
  backdrop-filter: blur(5px);
  resize: none;
  transition: border-color ${({ theme }) => theme.transition};
  font-family: 'Poppins', sans-serif;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[400]};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.primary[400]}33`};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.neutral[500]};
  }
`

// Dummy responses for the AI
const aiResponses = [
  "Hello! I'm your AI learning assistant. How can I help you today?",
  "That's an interesting question! The planets in our solar system are: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Each planet is unique in its own way!",
  "Robots are machines that can be programmed to do tasks automatically. They have sensors to understand their environment, processors to 'think', and actuators to move and interact with things around them. Would you like to know how to build a simple robot?",
  "Artificial Intelligence (AI) is like teaching computers to think and learn, similar to how humans do. AI helps computers recognize patterns, solve problems, and make decisions. It's used in many things like virtual assistants, games, and even in helping doctors diagnose illnesses!",
  "Gravity is like an invisible force that pulls objects toward each other. The bigger an object is, the stronger its gravity. That's why we stick to Earth instead of floating away, and why the Moon orbits around Earth. It's also why things fall down when you drop them!"
]

// Simulate typing effect
const typeMessage = (message, setTypedMessage) => {
  let currentIndex = 0
  setTypedMessage('')
  
  const typingInterval = setInterval(() => {
    if (currentIndex < message.length) {
      setTypedMessage(prev => prev + message[currentIndex])
      currentIndex++
    } else {
      clearInterval(typingInterval)
    }
  }, 20)
  
  return () => clearInterval(typingInterval)
}

const Assistant = () => {
  const { theme } = useTheme()
  const [messages, setMessages] = useState([
    { id: 1, text: aiResponses[0], isUser: false, time: new Date().toISOString() }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [typedMessage, setTypedMessage] = useState('')
  const [currentAiMessage, setCurrentAiMessage] = useState('')
  const messagesEndRef = useRef(null)
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typedMessage])
  
  const handleInputChange = (e) => {
    setInputValue(e.target.value)
  }
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }
  
  const handleSendMessage = () => {
    if (inputValue.trim() === '' || isTyping) return
    
    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputValue.trim(),
      isUser: true,
      time: new Date().toISOString()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    
    // Simulate AI thinking
    setTimeout(() => {
      setIsTyping(true)
      
      // Get a random response
      const randomResponse = aiResponses[Math.floor(Math.random() * (aiResponses.length - 1)) + 1]
      setCurrentAiMessage(randomResponse)
      
      // Start typing effect
      const clearTyping = typeMessage(randomResponse, setTypedMessage)
      
      // Add AI message after typing is complete
      setTimeout(() => {
        const aiMessage = {
          id: messages.length + 2,
          text: randomResponse,
          isUser: false,
          time: new Date().toISOString()
        }
        
        setMessages(prev => [...prev, aiMessage])
        setIsTyping(false)
        setTypedMessage('')
        clearTyping()
      }, randomResponse.length * 20 + 500)
    }, 1000)
  }
  
  const handleTextToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text)
      window.speechSynthesis.speak(speech)
    }
  }
  
  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text)
  }
  
  const renderMessages = () => {
    return messages.map(message => (
      <MessageItem 
        key={message.id} 
        isUser={message.isUser}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Avatar isUser={message.isUser} isAI={!message.isUser} theme={theme}>
          {message.isUser ? 'U' : 'AI'}
        </Avatar>
        <div>
          <MessageBubble isUser={message.isUser} theme={theme}>
            <p>{message.text}</p>
          </MessageBubble>
          <MessageControls isUser={message.isUser}>
            {!message.isUser && (
              <>
                <Button 
                  variant="outline" 
                  size="small" 
                  icon={<FaVolumeUp />} 
                  iconOnly="small"
                  onClick={() => handleTextToSpeech(message.text)}
                />
                <Button 
                  variant="outline" 
                  size="small" 
                  icon={<FaCopy />} 
                  iconOnly="small"
                  onClick={() => handleCopyText(message.text)}
                />
              </>
            )}
          </MessageControls>
        </div>
      </MessageItem>
    ))
  }
  
  return (
    <AssistantContainer>
      <PageTitle theme={theme}>AI <span>Assistant</span></PageTitle>
      
      <ChatContainer theme={theme}>
        <MessagesContainer theme={theme}>
          {renderMessages()}
          
          {isTyping && (
            <MessageItem 
              isUser={false}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Avatar isUser={false} isAI theme={theme}>
                AI
              </Avatar>
              <MessageBubble isUser={false} theme={theme}>
                <p>{typedMessage}</p>
                <span style={{ display: 'inline-block', width: '4px', height: '16px', background: theme.colors.primary[400], marginLeft: '2px', animation: 'blink 1s infinite' }}></span>
              </MessageBubble>
            </MessageItem>
          )}
          
          <div ref={messagesEndRef} />
        </MessagesContainer>
      </ChatContainer>
      
      <InputContainer>
        <Button 
          variant="primary" 
          icon={<FaMicrophone />} 
          iconOnly
          glowEffect
        >
          Record
        </Button>
        <TextInput 
          placeholder="Ask me anything..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          rows={2}
          theme={theme}
        />
        <Button 
          variant="gradient" 
          icon={<FaPaperPlane />} 
          iconOnly
          onClick={handleSendMessage}
          disabled={inputValue.trim() === '' || isTyping}
          glowEffect
        >
          Send
        </Button>
      </InputContainer>
    </AssistantContainer>
  )
}

export default Assistant