import { useState } from 'react'
import styled from 'styled-components'
import { useTheme } from '../contexts/ThemeContext'
import { motion } from 'framer-motion'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Link } from 'react-router-dom'
import { FaBook, FaDownload, FaLock, FaTags } from 'react-icons/fa'

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
  background-image: url(${({ cover }) => cover});
  background-size: cover;
  background-position: center;
  margin: -16px -16px 16px -16px;
  position: relative;
  
  ${({ isPaid, theme }) => 
    isPaid && `
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 2rem;
      }
    `
  }
`

const BookPriceTag = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  background: ${({ isPaid, isDiscounted, theme }) => 
    isDiscounted 
      ? theme.colors.success[400] 
      : isPaid 
      ? theme.colors.secondary[400]
      : theme.colors.primary[400]
  };
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 500;
  z-index: 1;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 4px;
  }
`

const BookInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
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

// Dummy book data
const books = [
  {
    id: 1,
    title: 'Introduction to Robotics for Kids',
    author: 'Emily Chen',
    description: 'A colorful, engaging introduction to robotics concepts designed specifically for young inventors.',
    cover: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a',
    category: 'free',
    price: 'Free'
  },
  {
    id: 2,
    title: 'Coding Adventures',
    author: 'Mark Johnson',
    description: 'Learn programming concepts through fun, interactive stories and challenges.',
    cover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
    category: 'paid',
    price: '$12.99'
  },
  {
    id: 3,
    title: 'AI for Beginners',
    author: 'Sarah Williams',
    description: 'Discover the fascinating world of artificial intelligence with simple explanations and examples.',
    cover: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485',
    category: 'paid',
    price: '$14.99',
    discounted: true,
    discountPrice: '$8.99'
  },
  {
    id: 4,
    title: 'Physics Experiments at Home',
    author: 'Dr. Alex Cooper',
    description: 'Easy and safe physics experiments that can be done with household items.',
    cover: 'https://images.unsplash.com/photo-1576086213369-97a306d36557',
    category: 'free',
    price: 'Free'
  },
  {
    id: 5,
    title: 'Robotics Projects: Level 1',
    author: 'James Miller',
    description: 'Step-by-step instructions for building simple robots using accessible materials.',
    cover: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
    category: 'paid',
    price: '$19.99',
    discounted: true,
    discountPrice: '$9.99'
  },
  {
    id: 6,
    title: 'The Innovation Mindset',
    author: 'Dr. Lisa Brown',
    description: 'How to cultivate creativity and innovative thinking in children and adults alike.',
    cover: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8',
    category: 'free',
    price: 'Free'
  }
]

const Library = () => {
  const { theme } = useTheme()
  const [activeCategory, setActiveCategory] = useState('All')
  
  const categories = ['All', 'Free', 'Paid', 'Discounted']
  
  const filteredBooks = activeCategory === 'All' 
    ? books 
    : books.filter(book => 
        activeCategory === 'Free' 
          ? book.category === 'free' 
          : activeCategory === 'Paid' 
          ? book.category === 'paid' && !book.discounted
          : book.discounted
      )
  
  return (
    <LibraryContainer>
      <PageTitle theme={theme}>Digital <span>Library</span></PageTitle>
      
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
      
      <BooksGrid>
        {filteredBooks.map(book => (
          <motion.div 
            key={book.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -10 }}
          >
            <BookCard as={Link} to={`/library/${book.id}`} blurEffect>
              <BookCover 
                cover={book.cover} 
                isPaid={book.category === 'paid' && !book.discounted}
                theme={theme}
              >
                <BookPriceTag 
                  isPaid={book.category === 'paid'} 
                  isDiscounted={book.discounted}
                  theme={theme}
                >
                  {book.category === 'free' ? (
                    <>
                      <FaBook /> Free
                    </>
                  ) : book.discounted ? (
                    <>
                      <FaTags /> {book.discountPrice}
                    </>
                  ) : (
                    <>
                      <FaLock /> {book.price}
                    </>
                  )}
                </BookPriceTag>
              </BookCover>
              
              <BookInfo>
                <BookTitle>{book.title}</BookTitle>
                <BookAuthor theme={theme}>by {book.author}</BookAuthor>
                <BookDescription>{book.description}</BookDescription>
                
                <Button 
                  variant={book.category === 'free' ? 'primary' : 'gradient'} 
                  icon={book.category === 'free' ? <FaDownload /> : <FaBook />}
                  glowEffect
                >
                  {book.category === 'free' ? 'Download' : 'Read Preview'}
                </Button>
              </BookInfo>
            </BookCard>
          </motion.div>
        ))}
      </BooksGrid>
      
      {filteredBooks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <h3>No books found in this category</h3>
          <p>Please check back later or select another category.</p>
        </div>
      )}
    </LibraryContainer>
  )
}

export default Library