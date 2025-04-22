import { useState } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import { useTheme } from '../contexts/ThemeContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { FaDownload, FaShoppingCart, FaBookOpen, FaFont, FaMoon, FaSun, FaPlus, FaMinus } from 'react-icons/fa'

const BookDetailContainer = styled.div`
  padding: 24px 0;
  max-width: 1000px;
  margin: 0 auto;
`

const BookHeader = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 32px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const BookCoverContainer = styled.div`
  position: relative;
  box-shadow: ${({ theme }) => theme.boxShadow};
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
  transition: all ${({ theme }) => theme.transition};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.hoverShadow};
  }
  
  img {
    width: 100%;
    display: block;
    aspect-ratio: 2/3;
    object-fit: cover;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, transparent 70%, rgba(0, 0, 0, 0.7));
    pointer-events: none;
  }
`

const BookInfo = styled.div`
  display: flex;
  flex-direction: column;
`

const BookTitle = styled.h1`
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.text};
  
  span {
    color: ${({ theme }) => theme.colors.primary[400]};
  }
`

const BookAuthor = styled.h3`
  color: ${({ theme }) => theme.colors.neutral[500]};
  margin-bottom: 16px;
  font-weight: 500;
`

const BookDescription = styled.p`
  margin-bottom: 24px;
  line-height: 1.6;
`

const BookMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`

const MetaItem = styled.div`
  background: ${({ theme }) => 
    theme.name === 'dark' ? 'rgba(30, 30, 30, 0.7)' : 'rgba(240, 240, 240, 0.7)'
  };
  padding: 12px;
  border-radius: ${({ theme }) => theme.borderRadius};
  
  h4 {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.neutral[500]};
    margin-bottom: 4px;
  }
  
  p {
    font-weight: 600;
    margin-bottom: 0;
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  margin-top: auto;
  
  @media (max-width: 500px) {
    flex-direction: column;
  }
`

const BookPrice = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  
  span.original {
    font-size: 1.2rem;
    text-decoration: line-through;
    color: ${({ theme }) => theme.colors.neutral[500]};
  }
  
  span.discounted {
    font-size: 2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.success[400]};
  }
  
  span.free {
    font-size: 2rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary[400]};
  }
`

const ReaderContainer = styled(Card)`
  margin-top: 40px;
  padding: 0;
  overflow: hidden;
`

const ReaderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  h2 {
    margin: 0;
  }
`

const ReaderControls = styled.div`
  display: flex;
  gap: 8px;
`

const ReaderContent = styled.div`
  padding: 32px;
  max-height: 600px;
  overflow-y: auto;
  font-family: ${({ fontFamily }) => fontFamily};
  font-size: ${({ fontSize }) => fontSize};
  line-height: 1.8;
  color: ${({ theme, nightMode }) => 
    nightMode ? '#E1E1E1' : theme.colors.text
  };
  background: ${({ theme, nightMode }) => 
    nightMode ? '#121212' : theme.colors.card
  };
  transition: all ${({ theme }) => theme.transition};
  
  h3, h4 {
    margin-top: 24px;
    margin-bottom: 16px;
  }
  
  p {
    margin-bottom: 16px;
  }
`

const PageNumber = styled.div`
  text-align: center;
  padding: 16px;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.neutral[500]};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`

// Dummy book data
const bookData = {
  id: 3,
  title: 'AI for Beginners',
  author: 'Sarah Williams',
  description: 'Bu kitob AI haqida bo`lib, o`quvchilar va yetakchilar uchun oson tushunishga yordam beradi.',
  cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485',
  category: 'paid',
  price: '$14.99',
  discounted: true,
  discountPrice: '$8.99',
  pages: 120,
  published: 'January 2023',
  language: 'English',
  isbn: '978-1-23456-789-0',
  content: `
   Bu kitob AI haqida bo'lib, o'quvchilar va yetakchilar uchun oson tushunishga yordam beradi.
  `
}
const BookDetail = () => {
  const { id } = useParams()
  const { theme } = useTheme()
  const [readerOpen, setReaderOpen] = useState(false)
  const [nightMode, setNightMode] = useState(false)
  const [fontSize, setFontSize] = useState(16)
  const [fontFamily, setFontFamily] = useState('\'Poppins\', sans-serif')
  
  const toggleReader = () => {
    setReaderOpen(!readerOpen)
  }
  
  const toggleNightMode = () => {
    setNightMode(!nightMode)
  }
  
  const increaseFontSize = () => {
    if (fontSize < 24) {
      setFontSize(fontSize + 2)
    }
  }
  
  const decreaseFontSize = () => {
    if (fontSize > 12) {
      setFontSize(fontSize - 2)
    }
  }
  
  const toggleFontFamily = () => {
    setFontFamily(
      fontFamily === '\'Poppins\', sans-serif' 
        ? '\'Times New Roman\', serif' 
        : '\'Poppins\', sans-serif'
    )
  }
  
  return (
    <BookDetailContainer>
      <BookHeader>
        <BookCoverContainer theme={theme}>
          <img src={bookData.cover} alt={bookData.title} />
        </BookCoverContainer>
        
        <BookInfo>
          <BookTitle theme={theme}>
            <span>Kitob:</span> {bookData.title}
          </BookTitle>
          <BookAuthor theme={theme}>by {bookData.author}</BookAuthor>
          
          <BookPrice theme={theme}>
            {bookData.category === 'free' ? (
              <span className="free">Bepul</span>
            ) : bookData.discounted ? (
              <>
                <span className="original">{bookData.price}</span>
                <span className="discounted">{bookData.discountPrice}</span>
              </>
            ) : (
              <span className="original">{bookData.price}</span>
            )}
          </BookPrice>
          
          <BookDescription>{bookData.description}</BookDescription>
          
          <BookMeta>
            <MetaItem theme={theme}>
              <h4>Sahifalar</h4>
              <p>{bookData.pages}</p>
            </MetaItem>
            <MetaItem theme={theme}>
              <h4>Nashr qilingan</h4>
              <p>{bookData.published}</p>
            </MetaItem>
            <MetaItem theme={theme}>
              <h4>Til</h4>
              <p>{bookData.language}</p>
            </MetaItem>
            <MetaItem theme={theme}>
              <h4>ISBN</h4>
              <p>{bookData.isbn}</p>
            </MetaItem>
          </BookMeta>
          
          <ActionButtons>
            {bookData.category === 'free' ? (
              <Button 
                variant="primary" 
                size="large"
                icon={<FaDownload />}
                glowEffect
              >
                E-kitobni yuklash
              </Button>
            ) : (
              <Button 
                variant="gradient" 
                size="large"
                icon={<FaShoppingCart />}
                glowEffect
              >
                Sotib olish
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="large"
              icon={<FaBookOpen />}
              onClick={toggleReader}
            >
              Preview
            </Button>
          </ActionButtons>
        </BookInfo>
      </BookHeader>
      
      {readerOpen && (
        <ReaderContainer blurEffect>
          <ReaderHeader theme={theme}>
            <h2>Book Preview</h2>
            <ReaderControls>
              <Button 
                variant="outline" 
                size="small" 
                icon={<FaFont />}
                onClick={toggleFontFamily}
                title="Fontni o'zgartirish"
              />
              <Button 
                variant="outline" 
                size="small" 
                icon={<FaMinus />}
                onClick={decreaseFontSize}
                disabled={fontSize <= 12}
                title="Kichikroq font"
              />
              <Button 
                variant="outline" 
                size="small" 
                icon={<FaPlus />}
                onClick={increaseFontSize}
                disabled={fontSize >= 24}
                title="Kattaroq font"
              />
              <Button 
                variant="outline" 
                size="small" 
                icon={nightMode ? <FaSun /> : <FaMoon />}
                onClick={toggleNightMode}
                title={nightMode ? 'Light Mode' : 'Night Mode'}
              />
            </ReaderControls>
          </ReaderHeader>
          
          <ReaderContent 
            theme={theme}
            nightMode={nightMode}
            fontSize={`${fontSize}px`}
            fontFamily={fontFamily}
          >
            {bookData.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('# ')) {
                return <h2 key={index}>{paragraph.substring(2)}</h2>
              } else if (paragraph.startsWith('## ')) {
                return <h3 key={index}>{paragraph.substring(3)}</h3>
              } else if (paragraph.startsWith('### ')) {
                return <h4 key={index}>{paragraph.substring(4)}</h4>
              } else if (paragraph.startsWith('- ')) {
                return (
                  <ul key={index}>
                    {paragraph.split('\n').map((item, i) => (
                      <li key={i}>{item.substring(2)}</li>
                    ))}
                  </ul>
                )
              } else if (paragraph.match(/^\d+\. /)) {
                return (
                  <ol key={index}>
                    {paragraph.split('\n').map((item, i) => {
                      const content = item.replace(/^\d+\. /, '')
                      return <li key={i}>{content}</li>
                    })}
                  </ol>
                )
              } else {
                return <p key={index}>{paragraph}</p>
              }
            })}
          </ReaderContent>
          
          <PageNumber theme={theme}>
            Page 1 of 5 (Preview)
          </PageNumber>
        </ReaderContainer>
      )}
    </BookDetailContainer>
  )
}

export default BookDetail