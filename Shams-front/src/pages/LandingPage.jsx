import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { useTheme } from '../contexts/ThemeContext'

const slides = [
  {
    id: 1,
    title: "Kelajak ixtirochilari shu yerda boshlanadi!",
    subtitle: "AI, Robototexnika, Dasturlash — 4 yoshdan boshlab",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  {
    id: 2,
    title: "Sun`iy intellekt yordamida o`rganing",
    subtitle: "Zamonaviy texnologiyalar bilan tanishing",
    gradient: "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)"
  },
  {
    id: 3,
    title: "Innovatsion testlar va tajribalar",
    subtitle: "Amaliy bilimlar orqali o`rganing",
    gradient: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)"
  }
]

const features = [
  {
    id: 1,
    title: "Sun`iy intellekt yordamchi bilan ta`lim",
    description: "Zamonaviy AI texnologiyalari yordamida shaxsiy o`rganish tajribasi",
    icon: "🤖"
  },
  {
    id: 2,
    title: "Interaktiv testlar va topshiriqlar",
    description: "Amaliy bilimlar orqali o`rganish va qo`llash imkoniyati",
    icon: "🧪"
  },
  {
    id: 3,
    title: "Kutubxona: bepul va pullik kitoblar",
    description: "Keng kutubxona, videolar va loyiha topshiriqlari",
    icon: "📚"
  }
]

const StyledLandingPage = styled.div`
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};
`

const StyledNavbar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`

const HamburgerMenu = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`

const StyledSlider = styled(Slider)`
  .slick-dots {
    bottom: 2rem;
    
    li button:before {
      color: white;
      font-size: 10px;
    }
    
    li.slick-active button:before {
      color: white;
    }
  }
`

const Slide = styled.div`
  height: 100vh;
  display: flex !important;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
  background: ${({ gradient }) => gradient};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(5px);
  }
`

const SlideContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 800px;
  color: white;
  
  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
    font-family: 'Playfair Display', serif;
    
    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }
  
  p {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    font-family: 'Inter', sans-serif;
    
    @media (max-width: 768px) {
      font-size: 1.2rem;
    }
  }
`

const FeaturesSection = styled.div`
  padding: 4rem 2rem;
  background: ${({ theme }) => theme.colors.background};
`

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`

const LandingPage = () => {
  const { theme } = useTheme()
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000
  }

  return (
    <StyledLandingPage theme={theme}>
      <StyledNavbar>
        <Logo theme={theme}>Shams Academy</Logo>
        <NavLinks>
          <Link to="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link to="/register">
            <Button variant="secondary">Register</Button>
          </Link>
          <Link to="/register">
            <Button variant="gradient">Get Started</Button>
          </Link>
        </NavLinks>
        <HamburgerMenu>
          <Button variant="outline" iconOnly="small">☰</Button>
        </HamburgerMenu>
      </StyledNavbar>

      <StyledSlider {...settings}>
        {slides.map((slide) => (
          <Slide key={slide.id} gradient={slide.gradient}>
            <SlideContent>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {slide.title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {slide.subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link to="/register">
                  <Button variant="gradient" size="large">
                    Get Started
                  </Button>
                </Link>
              </motion.div>
            </SlideContent>
          </Slide>
        ))}
      </StyledSlider>

      <FeaturesSection theme={theme}>
        <FeaturesGrid>
          {features.map((feature) => (
            <Card key={feature.id}>
              <h3>{feature.icon} {feature.title}</h3>
              <p>{feature.description}</p>
            </Card>
          ))}
        </FeaturesGrid>
      </FeaturesSection>
    </StyledLandingPage>
  )
}

export default LandingPage 