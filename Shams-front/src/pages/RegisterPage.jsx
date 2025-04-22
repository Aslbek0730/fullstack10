import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/Button'

const StyledRegisterPage = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: white;
`

const RegisterForm = styled.form`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const InputGroup = styled.div`
  position: relative;
`

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #667eea;
`

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0;
`

const SocialLogin = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`

const SocialButton = styled(Button)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Implement registration logic
    navigate('/app/dashboard')
  }

  return (
    <StyledRegisterPage>
      <LeftSection>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            Ta&apos;lim — bu sarguzasht!
          </h1>
          <p style={{ fontSize: '1.2rem' }}>
            Keling, ixtirochi bo&apos;ling!
          </p>
        </motion.div>
      </LeftSection>

      <RightSection>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/" style={{ marginBottom: '2rem', display: 'block' }}>
            <Button variant="outline">← Asosiy sahifaga qaytish</Button>
          </Link>

          <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Ro&apos;yxatdan o&apos;tish</h2>

          <RegisterForm onSubmit={handleSubmit}>
            <InputGroup>
              <Input
                type="text"
                placeholder="Ism"
                required
              />
            </InputGroup>

            <InputGroup>
              <Input
                type="text"
                placeholder="Familiya"
                required
              />
            </InputGroup>

            <InputGroup>
              <Input
                type="email"
                placeholder="Email"
                required
              />
            </InputGroup>

            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Parol"
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </PasswordToggle>
            </InputGroup>

            <InputGroup>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Parolni tasdiqlang"
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </PasswordToggle>
            </InputGroup>

            <CheckboxGroup>
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                Men shartlar va qoidalarga roziman
              </label>
            </CheckboxGroup>

            <Button type="submit" variant="gradient">
              Ro&apos;yxatdan o&apos;tish
            </Button>

            <div style={{ textAlign: 'center', margin: '1rem 0' }}>
              Yoki hisob bilan kiring
            </div>

            <SocialLogin>
              <SocialButton variant="outline">
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  style={{ width: '20px', height: '20px' }}
                />
                Google
              </SocialButton>
              <SocialButton variant="outline">
                <img
                  src="https://www.facebook.com/favicon.ico"
                  alt="Facebook"
                  style={{ width: '20px', height: '20px' }}
                />
                Facebook
              </SocialButton>
            </SocialLogin>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              Allaqachon hisobingiz bormi?{' '}
              <Link to="/login">Kirish</Link>
            </div>
          </RegisterForm>
        </motion.div>
      </RightSection>
    </StyledRegisterPage>
  )
}

export default RegisterPage 