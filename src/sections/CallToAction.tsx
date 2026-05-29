import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function CallToAction() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const items = section.querySelectorAll('.cta-item')
    gsap.fromTo(items,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
        },
      }
    )
  }, [])

  return (
    <section
      ref={sectionRef}
      id="contacto"
      className="w-full bg-[#0F0F0F] py-24 md:py-40"
    >
      <div className="max-w-[800px] mx-auto px-6 md:px-12 text-center">
        <p className="cta-item section-label mb-6 opacity-0" style={{ color: '#8C8279' }}>
          Empecemos
        </p>
        <h2 className="cta-item font-display text-[32px] md:text-[56px] font-normal leading-[1.1] tracking-[-1.5px] text-[#F5F3EF] mb-6 opacity-0">
          ¿Tienes un proyecto en mente?
        </h2>
        <p className="cta-item font-body text-[16px] md:text-[18px] font-light text-[#8C8279] leading-[1.65] mb-10 opacity-0">
          Cuéntanos qué necesitas y te prepararemos un presupuesto sin compromiso.
        </p>
        <a
          href="https://wa.me/34612345678?text=Hola%2C%20me%20gustaría%20solicitar%20un%20presupuesto"
          target="_blank"
          rel="noopener noreferrer"
          className="cta-item inline-block bg-[#C41E3A] text-[#F5F3EF] px-10 py-4 text-[12px] font-normal uppercase tracking-[1.5px] hover:bg-[#D4304A] transition-colors duration-300 opacity-0"
        >
          Solicitar presupuesto
        </a>
      </div>
    </section>
  )
}
