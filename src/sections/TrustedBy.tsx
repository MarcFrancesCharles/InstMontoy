import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const clientNames = [
  'Constructora Mediterráneo',
  'Hotel Boutique Plaza',
  'Industrias Valencianas',
  'Promociones Litoral',
  'Comunidad de Vecinos Marina',
  'Restaurante El Racó',
]

export default function TrustedBy() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const logos = section.querySelectorAll('.client-logo')
    gsap.fromTo(logos,
      { opacity: 0 },
      {
        opacity: 0.4,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
        },
      }
    )
  }, [])

  return (
    <section ref={sectionRef} className="w-full bg-[#F5F3EF] py-20 md:py-24">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <p className="section-label text-center mb-12">Confían en nosotros</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {clientNames.map((name, i) => (
            <div
              key={i}
              className="client-logo opacity-0 text-[#1A1A1A] text-[14px] md:text-[16px] font-light tracking-[1px] uppercase select-none"
              style={{ opacity: 0, filter: 'grayscale(100%)' }}
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
