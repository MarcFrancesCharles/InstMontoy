import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    title: 'Instalación Eléctrica Completa',
    category: 'Vivienda unifamiliar, Valencia',
    image: '/images/project-1.jpg',
  },
  {
    title: 'Climatización Hotel Boutique',
    category: 'Sistema VRF, Alicante',
    image: '/images/project-2.jpg',
  },
  {
    title: 'Placa Solar 10kW',
    category: 'Autoconsumo industrial, Castellón',
    image: '/images/project-3.jpg',
  },
  {
    title: 'Reforma Integral Oficinas',
    category: 'Electricidad + climatización + domótica',
    image: '/images/project-4.jpg',
  },
]

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const cards = section.querySelectorAll('.project-card')
    gsap.fromTo(cards,
      { scale: 0.95, opacity: 0 },
      {
        scale: 1,
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
      id="proyectos"
      className="w-full bg-[#0F0F0F] py-24 md:py-40"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <p className="section-label text-center mb-6" style={{ color: '#8C8279' }}>
          Proyectos Destacados
        </p>
        <h2 className="font-display text-[32px] md:text-[56px] font-normal leading-[1.1] tracking-[-1.5px] text-[#F5F3EF] text-center mb-16 md:mb-20">
          Trabajos recientes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <div
              key={i}
              className="project-card group relative overflow-hidden cursor-pointer opacity-0"
              style={{ aspectRatio: '4/3' }}
            >
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-[rgba(15,15,15,0.7)] opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-6 md:p-8">
                <h3 className="font-body text-[18px] md:text-[20px] font-normal text-[#F5F3EF] translate-y-[10px] group-hover:translate-y-0 transition-transform duration-400">
                  {project.title}
                </h3>
                <p className="section-label mt-2 text-[#8C8279] translate-y-[10px] group-hover:translate-y-0 transition-transform duration-400 delay-75">
                  {project.category}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
