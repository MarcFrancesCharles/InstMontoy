import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Logo from '../components/Logo'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { num: '8+', label: 'Anys d\'experiència' },
  { num: '200+', label: 'Projectes completats' },
  { num: '100%', label: 'Clients satisfets' },
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
          x: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 75%' },
        }
      )
    }

    gsap.fromTo(textItems,
      { y: 30, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 75%' },
      }
    )
  }, [])

  return (
    <section
      ref={sectionRef}
      id="sobre-nosaltres"
      className="w-full bg-[#F5F3EF] py-24 md:py-40"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          <div className="lg:w-[55%]">
            <div
              className="about-image flex items-center justify-center bg-[#0F0F0F] opacity-0"
              style={{ aspectRatio: '4/5' }}
            >
              <Logo className="w-[70%] max-w-[380px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />
            </div>
          </div>

          <div className="lg:w-[45%] flex flex-col justify-center">
            <p className="about-text-item section-label mb-6 opacity-0">Sobre Nosaltres</p>
            <h2 className="about-text-item font-display text-[32px] md:text-[48px] font-normal leading-[1.1] tracking-[-1.5px] text-[#1A1A1A] mb-6 opacity-0">
              Treballant ràpid i amb qualitat des de 2018
            </h2>
            <p className="about-text-item font-body text-[16px] md:text-[18px] font-light text-[#8C8279] leading-[1.65] mb-10 opacity-0">
              Som una empresa d'instal·lacions amb seu a Alcarràs, especialitzada en electricitat, climatització i fontaneria. Treballem amb particulars, empreses i comunitats de veïns, oferint solucions integrals amb garantia de qualitat.
            </p>
            <p className="about-text-item font-body text-[16px] font-light text-[#8C8279] leading-[1.65] mb-12 opacity-0">
              Cada projecte és una oportunitat per demostrar el nostre compromís amb l'excel·lència tècnica i la satisfacció del client.
            </p>

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