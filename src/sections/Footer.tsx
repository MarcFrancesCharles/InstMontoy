import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Logo from '../components/Logo'

gsap.registerPlugin(ScrollTrigger)

const navLinks = [
  { label: 'Serveis', href: '#serveis' },
  { label: 'Projectes', href: '#projectes' },
  { label: 'Sobre Nosaltres', href: '#sobre-nosaltres' },
  { label: 'Contacte', href: '#contacte' },
]

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const footer = footerRef.current
    if (!footer) return

    gsap.fromTo(footer,
      { opacity: 0 },
      {
        opacity: 1, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: footer, start: 'top 90%' },
      }
    )
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer
      ref={footerRef}
      className="w-full bg-[#0F0F0F] pt-16 md:pt-20 pb-8 opacity-0"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 mb-12">
          <div>
            <Logo className="w-[88px] h-[88px] mb-5" />
            <p className="nav-link text-[#F5F3EF] mb-4">
              INSTAL·LACIONS MONTOY
            </p>
            <p className="font-body text-[14px] font-light text-[#F5F3EF] opacity-60 leading-[1.7]">
              Alcarràs<br />
              Lleida
            </p>
          </div>

          <div>
            <p className="section-label mb-4" style={{ color: '#8C8279' }}>Navegació</p>
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="font-body text-[14px] font-light text-[#F5F3EF] opacity-60 hover:opacity-100 transition-opacity duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="section-label mb-4" style={{ color: '#8C8279' }}>Contacte</p>
            <div className="flex flex-col gap-2">
              <a
                href="mailto:info@montoy.es"
                className="font-body text-[14px] font-light text-[#F5F3EF] opacity-60 hover:opacity-100 transition-opacity duration-300"
              >
                info@montoy.es
              </a>
              <a
                href="tel:+34612345678"
                className="font-body text-[14px] font-light text-[#F5F3EF] opacity-60 hover:opacity-100 transition-opacity duration-300"
              >
                612 34 56 78
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[rgba(245,243,239,0.1)] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-[12px] font-light text-[#F5F3EF] opacity-40">
            {new Date().getFullYear()} Instal·lacions Montoy. Tots els drets reservats.
          </p>
          <div className="flex gap-4">
            <span className="font-body text-[12px] font-light text-[#F5F3EF] opacity-40 hover:opacity-70 cursor-pointer transition-opacity">
              Avís Legal
            </span>
            <span className="font-body text-[12px] font-light text-[#F5F3EF] opacity-40">·</span>
            <span className="font-body text-[12px] font-light text-[#F5F3EF] opacity-40 hover:opacity-70 cursor-pointer transition-opacity">
              Política de Privacitat
            </span>
            <span className="font-body text-[12px] font-light text-[#F5F3EF] opacity-40">·</span>
            <span className="font-body text-[12px] font-light text-[#F5F3EF] opacity-40 hover:opacity-70 cursor-pointer transition-opacity">
              Cookies
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}