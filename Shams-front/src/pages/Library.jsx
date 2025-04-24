import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useTheme } from '../contexts/ThemeContext'
import { motion } from 'framer-motion'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Link } from 'react-router-dom'
import { FaBook, FaDownload, FaShoppingCart } from 'react-icons/fa'
import { bookService } from '../services/api'

const LibraryContainer = styled.div`
  padding: 24px 0;
`

const PageTitle = styled.h1`
  margin-bottom: 24px;
  color: ${({ theme }) => theme.colors.text};
  
  span {
    color: ${({ theme }) => theme.colors.primary[400]};
  }
`

const BooksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
`

const BookCard = styled(Card)`
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all ${({ theme }) => theme.transition};
`

const BookCover = styled.div`
  height: 320px;
  background-image: url(${({ $cover }) => $cover});
  background-size: cover;
  background-position: center;
  margin: -16px -16px 16px -16px;
  position: relative;
`

const BookCategory = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background: ${({ $category, theme }) => 
    $category === 'free' ? theme.colors.success[400] : 
    $category === 'paid' ? theme.colors.secondary[400] : 
    theme.colors.primary[400]
  };
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 500;
`

const BookInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 16px;
`

const BookTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 4px;
`

const BookAuthor = styled.p`
  color: ${({ theme }) => theme.colors.neutral[500]};
  font-size: 0.9rem;
  margin-bottom: 16px;
`

const BookDescription = styled.p`
  margin-bottom: 16px;
  flex: 1;
  font-size: 0.9rem;
`

const BookMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.neutral[500]};
  font-size: 0.9rem;
  
  svg {
    margin-right: 4px;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`

const Library = () => {
  const { theme } = useTheme()
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true)
        const response = await bookService.getBooks()
        // Check if response.data is an array
        if (Array.isArray(response.data)) {
          setBooks(response.data)
        } else if (response.data && Array.isArray(response.data.results)) {
          // Handle paginated response
          setBooks(response.data.results)
        } else {
          // Handle empty or invalid response
          setBooks([])
        }
        setError(null)
      } catch (err) {
        setError('Kitoblarni yuklashda xatolik yuz berdi')
        console.error('Error fetching books:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchBooks()
  }, [])
  
  const handlePurchase = async (bookId) => {
    try {
      await bookService.purchaseBook(bookId)
      // Handle successful purchase
    } catch (err) {
      console.error('Error purchasing book:', err)
    }
  }
  
  if (loading) {
    return <div>Yuklanmoqda...</div>
  }
  
  if (error) {
    return <div>{error}</div>
  }
  
  if (!books || books.length === 0) {
    return <div>Kitoblar topilmadi</div>
  }
  
  return (
    <LibraryContainer>
      <PageTitle theme={theme}>O`qish uchun <span>Kitoblar</span></PageTitle>
      
      <BooksGrid>
        {books.map(book => (
          <BookCard key={book.id} as={motion.div} whileHover={{ y: -5 }}>
            <BookCover $cover={book.cover_image}>
              <BookCategory $category={book.category}>
                {book.category}
              </BookCategory>
            </BookCover>
            
            <BookInfo>
              <BookTitle>{book.title}</BookTitle>
              <BookAuthor>{book.author}</BookAuthor>
              <BookDescription>{book.description}</BookDescription>
              
              <BookMeta>
                <div>
                  <FaBook />
                  {book.pages} sahifa
                </div>
                <div>
                  <FaDownload />
                  {book.downloads} yuklama
                </div>
              </BookMeta>
              
              <ButtonGroup>
                <Button as={Link} to={`/app/library/${book.id}`} variant="primary">
                  Batafsil
                </Button>
                <Button variant="secondary" onClick={() => handlePurchase(book.id)}>
                  <FaShoppingCart />
                  Sotib olish
                </Button>
              </ButtonGroup>
            </BookInfo>
          </BookCard>
        ))}
      </BooksGrid>
    </LibraryContainer>
  )
}

export default Library