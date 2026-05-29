import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
  {
    quote: 'Professionals, puntuals i molt nets. La instal·lació elèctrica de casa nostra va quedar perfecta.',
    name: 'Maria G.',
    role: 'València',
  },
  {
    quote: 'Montoy va gestionar tota la instal·lació de plaques solars. Estalviem un 60% en la factura de la llum.',
    name: 'Carles R.',
    role: 'Empresa constructora',
  },
  {
    quote: 'Treballen amb un nivell de detall impressionant. Els recomano sense dubtar-ho.',
    name: 'Ana L.',
    role: 'Arquitecta',
  },
]

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const cards = section.querySelectorAll('.testimonial-card')
    gsap.fromTo(cards,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
        },
      }
    )
  }, [])

  return (
    <section ref={sectionRef} className="w-full bg-[#F5F3EF] py-24 md:py-40">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <p className="section-label text-center mb-6">Testimonis</p>
        <h2 className="font-display text-[32px] md:text-[56px] font-normal leading-[1.1] tracking-[-1.5px] text-[#1A1A1A] text-center mb-16 md:mb-20">
          Què diuen els nostres clients
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card relative opacity-0">
              <span
                className="font-display text-[100px] md:text-[120px] font-normal leading-none text-[#C41E3A] absolute -top-8 -left-2 select-none pointer-events-none"
                style={{ opacity: 0.15 }}
              >
                "
              </span>
              <div className="pt-12">
                <p className="font-body text-[16px] md:text-[18px] font-light italic text-[#1A1A1A] leading-[1.65] mb-6">
                  {t.quote}
                </p>
                <p className="font-body text-[14px] font-normal text-[#1A1A1A]">
                  {t.name}
                </p>
                <p className="section-label text-[11px] mt-1">
                  {t.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}