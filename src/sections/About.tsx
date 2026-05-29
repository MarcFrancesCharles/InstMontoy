import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { num: '12+', label: 'Años de experiencia' },
  { num: '500+', label: 'Proyectos completados' },
  { num: '100%', label: 'Clientes satisfechos' },
]

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const image = section.querySelector('.about-image')
    const textItems = section.querySelectorAll('.about-text-item')

    if (image) {
      gsap.fromTo(image,
        { x: -40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
          },
        }
      )
    }

    gsap.fromTo(textItems,
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
      id="sobre-nosotros"
      className="w-full bg-[#F5F3EF] py-24 md:py-40"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Image - 60% */}
          <div className="lg:w-[55%]">
            <div className="about-image overflow-hidden opacity-0" style={{ aspectRatio: '3/4' }}>
              <img
                src="/images/about.jpg"
                alt="Jaume Montoy, fundador de Instal·lacions Montoy"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Text - 40% */}
          <div className="lg:w-[45%] flex flex-col justify-center">
            <p className="about-text-item section-label mb-6 opacity-0">Sobre Nosotros</p>
            <h2 className="about-text-item font-display text-[32px] md:text-[48px] font-normal leading-[1.1] tracking-[-1.5px] text-[#1A1A1A] mb-6 opacity-0">
              Más de una década de experiencia
            </h2>
            <p className="about-text-item font-body text-[16px] md:text-[18px] font-light text-[#8C8279] leading-[1.65] mb-10 opacity-0">
              Somos una empresa de instalaciones con sede en Valencia, especializada en electricidad, climatización, energía solar y fontanería. Trabajamos con particulares, empresas y comunidades de vecinos, ofreciendo soluciones integrales con garantía de calidad.
            </p>
            <p className="about-text-item font-body text-[16px] font-light text-[#8C8279] leading-[1.65] mb-12 opacity-0">
              Cada proyecto es una oportunidad para demostrar nuestro compromiso con la excelencia técnica y la satisfacción del cliente.
            </p>

            {/* Stats */}
            <div className="about-text-item flex flex-wrap gap-8 md:gap-12 opacity-0">
              {stats.map((stat, i) => (
                <div key={i}>
                  <p className="font-display text-[32px] md:text-[40px] font-normal text-[#1A1A1A] leading-none">
                    {stat.num}
                  </p>
                  <p className="section-label mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
