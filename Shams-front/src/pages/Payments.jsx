import { useState } from 'react'
import styled from 'styled-components'
import { useTheme } from '../contexts/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { FaCreditCard, FaMobile, FaUniversity, FaCheck, FaTimes } from 'react-icons/fa'

const PaymentsContainer = styled.div`
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

const PaymentOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
`

const PaymentMethodCard = styled(Card)`
  cursor: pointer;
  text-align: center;
  padding: 24px;
  background: ${({ isSelected, provider, theme }) => 
    isSelected 
      ? provider === 'payme' 
        ? '#33AAFF20'
        : provider === 'click' 
        ? '#FF333320'
        : '#33FF6620'
      : theme.colors.card
  };
  border: 2px solid ${({ isSelected, provider }) => 
    isSelected 
      ? provider === 'payme' 
        ? '#33AAFF'
        : provider === 'click' 
        ? '#FF3333'
        : '#33FF66'
      : 'transparent'
  };
  
  svg {
    font-size: 2rem;
    margin-bottom: 16px;
    color: ${({ provider }) => 
      provider === 'payme' 
        ? '#33AAFF'
        : provider === 'click' 
        ? '#FF3333'
        : '#33FF66'
    };
  }
`

const PaymentForm = styled(Card)`
  margin-bottom: 32px;
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
      border-color: ${({ theme, provider }) => 
        provider === 'payme' 
          ? '#33AAFF'
          : provider === 'click' 
          ? '#FF3333'
          : '#33FF66'
      };
      box-shadow: 0 0 0 2px ${({ theme, provider }) => 
        provider === 'payme' 
          ? '#33AAFF33'
          : provider === 'click' 
          ? '#FF333333'
          : '#33FF6633'
      };
    }
    
    &::placeholder {
      color: ${({ theme }) => theme.colors.neutral[500]};
    }
  }
`

const PayButton = styled(Button)`
  background: ${({ provider }) => 
    provider === 'payme' 
      ? '#33AAFF'
      : provider === 'click' 
      ? '#FF3333'
      : '#33FF66'
  };
  
  &:hover {
    background: ${({ provider }) => 
      provider === 'payme' 
        ? '#2299EE'
        : provider === 'click' 
        ? '#EE2222'
        : '#22EE55'
    };
  }
`

const SuccessOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const SuccessCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 32px;
  text-align: center;
  max-width: 400px;
  box-shadow: ${({ theme }) => theme.hoverShadow};
  
  svg {
    font-size: 3rem;
    color: ${({ isSuccess, theme }) => 
      isSuccess ? theme.colors.success[400] : theme.colors.error[400]
    };
    margin-bottom: 16px;
  }
  
  h2 {
    margin-bottom: 16px;
  }
  
  p {
    margin-bottom: 24px;
  }
`

const PaymentMethods = [
  {
    id: 'payme',
    name: 'Payme',
    icon: <FaMobile />,
    color: '#33AAFF'
  },
  {
    id: 'click',
    name: 'Click',
    icon: <FaCreditCard />,
    color: '#FF3333'
  },
  {
    id: 'grape',
    name: 'Grape',
    icon: <FaUniversity />,
    color: '#33FF66'
  }
]

const Payments = () => {
  const { theme } = useTheme()
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [amount, setAmount] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId)
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!amount || !cardNumber) return
    
    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      
      // 90% chance of success
      const success = Math.random() < 0.9
      setIsSuccess(success)
      setShowResult(true)
    }, 2000)
  }
  
  const handleCloseResult = () => {
    setShowResult(false)
    if (isSuccess) {
      setAmount('')
      setCardNumber('')
      setSelectedMethod(null)
    }
  }
  
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    
    if (parts.length) {
      return parts.join(' ')
    } else {
      return value
    }
  }
  
  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value)
    setCardNumber(formattedValue)
  }
  
  return (
    <PaymentsContainer>
      <PageTitle theme={theme}>
        <span>Payment</span> Methods
      </PageTitle>
      
      <PaymentOptions>
        {PaymentMethods.map(method => (
          <PaymentMethodCard 
            key={method.id}
            onClick={() => handleMethodSelect(method.id)}
            isSelected={selectedMethod === method.id}
            provider={method.id}
            theme={theme}
            as={motion.div}
            whileHover={{ y: -5 }}
          >
            {method.icon}
            <h3>{method.name}</h3>
          </PaymentMethodCard>
        ))}
      </PaymentOptions>
      
      {selectedMethod && (
        <PaymentForm as="form" onSubmit={handleSubmit} blurEffect>
          <h2 style={{ marginBottom: '24px' }}>
            Payment with {PaymentMethods.find(m => m.id === selectedMethod).name}
          </h2>
          
          <FormGroup theme={theme} provider={selectedMethod}>
            <label htmlFor="card-number">Card Number</label>
            <input 
              type="text" 
              id="card-number"
              placeholder="XXXX XXXX XXXX XXXX"
              value={cardNumber}
              onChange={handleCardNumberChange}
              maxLength={19}
            />
          </FormGroup>
          
          <FormGroup theme={theme} provider={selectedMethod}>
            <label htmlFor="amount">Amount (USD)</label>
            <input 
              type="number" 
              id="amount"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="0.01"
            />
          </FormGroup>
          
          <PayButton 
            type="submit"
            size="large"
            provider={selectedMethod}
            disabled={!amount || !cardNumber || cardNumber.length < 19 || isProcessing}
          >
            {isProcessing ? 'Processing...' : `Pay with ${PaymentMethods.find(m => m.id === selectedMethod).name}`}
          </PayButton>
        </PaymentForm>
      )}
      
      <AnimatePresence>
        {showResult && (
          <SuccessOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseResult}
          >
            <SuccessCard 
              theme={theme} 
              isSuccess={isSuccess}
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              {isSuccess ? <FaCheck /> : <FaTimes />}
              <h2>{isSuccess ? 'Payment Successful!' : 'Payment Failed'}</h2>
              <p>
                {isSuccess 
                  ? `Your payment of $${amount} has been processed successfully.` 
                  : 'There was an issue processing your payment. Please try again.'
                }
              </p>
              <Button onClick={handleCloseResult}>
                {isSuccess ? 'Continue' : 'Try Again'}
              </Button>
            </SuccessCard>
          </SuccessOverlay>
        )}
      </AnimatePresence>
    </PaymentsContainer>
  )
}

export default Payments