import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    num: '01',
    name: 'Instalaciones Eléctricas',
    desc: 'Diseño, instalación y mantenimiento de sistemas eléctricos para hogares y empresas.',
    image: '/images/service-1.jpg',
  },
  {
    num: '02',
    name: 'Climatización',
    desc: 'Instalación de aire acondicionado y sistemas de calefacción con eficiencia energética.',
    image: '/images/service-2.jpg',
  },
  {
    num: '03',
    name: 'Energía Solar',
    desc: 'Paneles fotovoltaicos y autoconsumo para reducir tu factura energética.',
    image: '/images/service-3.jpg',
  },
  {
    num: '04',
    name: 'Fontanería',
    desc: 'Instalación de agua, gas y saneamiento con materiales de primera calidad.',
    image: '/images/service-4.jpg',
  },
  {
    num: '05',
    name: 'Domótica',
    desc: 'Automatización inteligente del hogar para confort, seguridad y ahorro.',
    image: '/images/service-5.jpg',
  },
  {
    num: '06',
    name: 'Videovigilancia',
    desc: 'Sistemas de cámaras y control de accesos para proteger tu propiedad.',
    image: '/images/service-6.jpg',
  },
]

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const leftCol = section.querySelector('.left-col')
    const cards = section.querySelectorAll('.service-card')

    if (leftCol) {
      gsap.fromTo(leftCol,
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
          },
        }
      )
    }

    gsap.fromTo(cards,
      { y: 20, opacity: 0 },
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
      id="servicios"
      className="w-full bg-[#F5F3EF] py-24 md:py-40"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Left Column */}
          <div className="left-col lg:w-[40%] lg:sticky lg:top-40 lg:self-start opacity-0">
            <p className="section-label mb-6">Servicios</p>
            <h2 className="font-display text-[32px] md:text-[56px] font-normal leading-[1.1] tracking-[-1.5px] text-[#1A1A1A]">
              Cada proyecto, una solución a medida
            </h2>
          </div>

          {/* Right Column - Service Cards */}
          <div className="lg:w-[60%] flex flex-col">
            {services.map((service, i) => (
              <div
                key={i}
                className="service-card group flex items-center gap-6 py-6 border-t border-[rgba(26,26,26,0.08)] cursor-pointer hover:bg-[#EAE6DF] transition-colors duration-300 px-4 -mx-4 opacity-0"
              >
                <span className="text-[#C41E3A] text-[11px] font-normal tracking-[1px] w-8 shrink-0">
                  {service.num}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-body text-[18px] md:text-[20px] font-normal text-[#1A1A1A] mb-1">
                    {service.name}
                  </h3>
                  <p className="font-body text-[13px] md:text-[14px] font-light text-[#8C8279] leading-[1.5]">
                    {service.desc}
                  </p>
                </div>
                <span className="text-[#C41E3A] text-[18px] transition-transform duration-300 group-hover:translate-x-1 shrink-0">
                  →
                </span>
              </div>
            ))}
            {/* Bottom border */}
            <div className="border-t border-[rgba(26,26,26,0.08)]" />
          </div>
        </div>
      </div>
    </section>
  )
}
