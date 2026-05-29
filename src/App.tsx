import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navigation from './components/Navigation'
import ParticleHero from './components/ParticleHero'
import WhatsAppButton from './components/WhatsAppButton'
import TrustedBy from './sections/TrustedBy'
import Services from './sections/Services'
import Process from './sections/Process'
import Projects from './sections/Projects'
import Testimonials from './sections/Testimonials'
import About from './sections/About'
import CallToAction from './sections/CallToAction'
import Footer from './sections/Footer'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  useEffect(() => {
    // Hero text entrance animations
    const heroTl = gsap.timeline({ delay: 0.5 })

    heroTl.to('.hero-text', {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power3.out',
    })
    .to('.hero-subtitle', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
    }, '-=0.7')
    .to('.hero-cta', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
    }, '-=0.7')

    // Initialize smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth'

    return () => {
      heroTl.kill()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <div className="relative">
      <Navigation />
      <ParticleHero />
      <TrustedBy />
      <Services />
      <Process />
      <Projects />
      <Testimonials />
      <About />
      <CallToAction />
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
