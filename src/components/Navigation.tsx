import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const navLinks = [
  { label: 'Servicios', href: '#servicios' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Sobre Nosotros', href: '#sobre-nosotros' },
  { label: 'Contacto', href: '#contacto' },
]

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return

    gsap.fromTo(nav,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' }
    )

    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMenuOpen(false)
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-[100] h-[72px] flex items-center transition-all duration-500 ${
        scrolled
          ? 'bg-[rgba(245,243,239,0.92)] backdrop-blur-[12px] border-b border-[rgba(26,26,26,0.06)]'
          : 'bg-transparent'
      }`}
      style={{ opacity: 0 }}
    >
      <div className="w-full max-w-[1200px] mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="nav-link text-[#1A1A1A] hover:text-[#C41E3A] transition-colors"
        >
          INSTAL·LACIONS MONTOY
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className="nav-link text-[#1A1A1A] hover:text-[#C41E3A] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className={`block w-6 h-px bg-[#1A1A1A] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
          <span className={`block w-6 h-px bg-[#1A1A1A] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-px bg-[#1A1A1A] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute top-[72px] left-0 right-0 bg-[rgba(245,243,239,0.98)] backdrop-blur-[12px] border-b border-[rgba(26,26,26,0.06)] md:hidden transition-all duration-500 overflow-hidden ${
          menuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleClick(e, link.href)}
              className="nav-link text-[#1A1A1A] hover:text-[#C41E3A] transition-colors py-2"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
