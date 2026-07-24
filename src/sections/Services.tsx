import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type Service = {
  num: string
  name: string
  desc: string
  image: string
  detall: string
  punts: string[]
}

const services: Service[] = [
  {
    num: '01',
    name: 'Instal·lacions Elèctriques',
    desc: 'Disseny, instal·lació i manteniment de sistemes elèctrics per a llars i empreses.',
    image: '/images/service-1.jpg',
    detall: 'Oferim solucions elèctriques completes per a tota mena de projectes, des de petites reformes domèstiques fins a grans instal·lacions industrials. Treballem amb materials homologats i seguim tota la normativa vigent per garantir la màxima seguretat.',
    punts: [
      'Instal·lació elèctrica de nova construcció i reforma',
      'Quadres elèctrics i automatismes',
      'Il·luminació interior i exterior eficient',
      'Xarxes de dades, telefonia i TV',
      'Certificats d\'instal·lador autoritzat',
    ],
  },
  {
    num: '02',
    name: 'Climatització',
    desc: 'Instal·lació d\'aire condicionat i sistemes de calefacció amb eficiència energètica.',
    image: '/images/service-2.jpg',
    detall: 'Instal·lem i mantenim sistemes de climatització per a habitatges, locals comercials i naus industrials. Treballem amb les principals marques del sector i assessorem sobre la solució més eficient per a cada espai i pressupost.',
    punts: [
      'Sistemes de split i multisplit',
      'Conductes i VRF per a grans superfícies',
      'Aerotèrmia i bomba de calor',
      'Manteniment preventiu i correctiu',
      'Certificació energètica dels equips',
    ],
  },
  {
    num: '03',
    name: 'Fontaneria',
    desc: 'Instal·lació d\'aigua, gas i sanejament amb materials de primera qualitat.',
    image: '/images/service-4.jpg',
    detall: 'Realitzem tota mena d\'instal·lacions de fontaneria, des de la connexió a la xarxa d\'aigues fins a la instal·lació de banys i cuines completes. Treballem amb materials de llarga durada i garantim tots els treballs.',
    punts: [
      'Instal·lació de xarxes d\'aigua freda i calenta',
      'Sanejament i clavegueram',
      'Instal·lació de gas natural i propà',
      'Reparació de fuites i avaries urgents',
      'Rehabilitació de banys i cuines',
    ],
  },
]

type ServiceModalProps = {
  service: Service | null
  onClose: () => void
}

function ServiceModal({ service, onClose }: ServiceModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!service) return
    const overlay = overlayRef.current
    const panel = panelRef.current
    if (!overlay || !panel) return

    document.body.style.overflow = 'hidden'

    gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' })
    gsap.fromTo(panel,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', delay: 0.05 }
    )

    return () => {
      document.body.style.overflow = ''
    }
  }, [service])

  const handleClose = () => {
    const overlay = overlayRef.current
    const panel = panelRef.current
    if (!overlay || !panel) { onClose(); return }

    gsap.to(panel, { y: 30, opacity: 0, duration: 0.25, ease: 'power2.in' })
    gsap.to(overlay, {
      opacity: 0, duration: 0.3, ease: 'power2.in', delay: 0.05,
      onComplete: onClose,
    })
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) handleClose()
  }

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  if (!service) return null

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[200] flex items-center justify-center px-4 md:px-6"
      style={{ background: 'rgba(15,15,15,0.75)', backdropFilter: 'blur(4px)' }}
    >
      <div
        ref={panelRef}
        className="relative w-full max-w-[640px] max-h-[90vh] overflow-y-auto"
        style={{ background: '#F5F3EF' }}
      >
        {/* Capçalera */}
        <div className="flex items-start justify-between p-8 pb-0">
          <div>
            <span className="text-[#C41E3A] text-[11px] font-normal tracking-[2px] uppercase">
              {service.num}
            </span>
            <h2 className="font-display text-[28px] md:text-[36px] font-normal text-[#1A1A1A] mt-1 leading-[1.1] tracking-[-1px]">
              {service.name}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="ml-4 mt-1 shrink-0 w-10 h-10 flex items-center justify-center text-[#8C8279] hover:text-[#1A1A1A] hover:bg-[rgba(26,26,26,0.06)] transition-all duration-200"
            aria-label="Tancar"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Contingut */}
        <div className="p-8">
          <p className="font-body text-[15px] md:text-[16px] font-light text-[#8C8279] leading-[1.7] mb-8">
            {service.detall}
          </p>

          {/* Llista de punts */}
          <div className="border-t border-[rgba(26,26,26,0.08)] pt-6">
            <p className="section-label mb-4">Inclou</p>
            <ul className="flex flex-col gap-3">
              {service.punts.map((punt, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-[#C41E3A] mt-[3px] shrink-0">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <span className="font-body text-[14px] md:text-[15px] font-light text-[#1A1A1A] leading-[1.5]">
                    {punt}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA */}
          <div className="mt-8 pt-6 border-t border-[rgba(26,26,26,0.08)]">
            <a
              href="https://wa.me/34612345678?text=Hola%2C%20m%27agradaria%20sol%C2%B7licitar%20un%20pressupost"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-[#C41E3A] text-[#F5F3EF] px-8 py-[14px] text-[12px] font-normal uppercase tracking-[1.5px] hover:bg-[#A01830] transition-colors duration-300"
            >
              Sol·licitar pressupost
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Services() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeService, setActiveService] = useState<Service | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const leftCol = section.querySelector('.left-col')
    const cards = section.querySelectorAll('.service-card')

    if (leftCol) {
      gsap.fromTo(leftCol,
        { x: -30, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 75%' },
        }
      )
    }

    gsap.fromTo(cards,
      { y: 20, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 75%' },
      }
    )
  }, [])

  return (
    <>
      <section
        ref={sectionRef}
        id="serveis"
        className="w-full bg-[#F5F3EF] py-24 md:py-40"
      >
        <div className="max-w-[1200px] mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            {/* Columna esquerra */}
            <div className="left-col lg:w-[40%] lg:sticky lg:top-40 lg:self-start opacity-0">
              <p className="section-label mb-6">Serveis</p>
              <h2 className="font-display text-[32px] md:text-[56px] font-normal leading-[1.1] tracking-[-1.5px] text-[#1A1A1A]">
                Cada projecte, una solució a mida
              </h2>
            </div>

            {/* Columna dreta - Llista de serveis */}
            <div className="lg:w-[60%] flex flex-col">
              {services.map((service, i) => (
                <button
                  key={i}
                  onClick={() => setActiveService(service)}
                  className="service-card group flex items-center gap-6 py-6 border-t border-[rgba(26,26,26,0.08)] cursor-pointer hover:bg-[#EAE6DF] transition-colors duration-300 px-4 -mx-4 opacity-0 text-left w-full"
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
                </button>
              ))}
              <div className="border-t border-[rgba(26,26,26,0.08)]" />
            </div>
          </div>
        </div>
      </section>

      <ServiceModal service={activeService} onClose={() => setActiveService(null)} />
    </>
  )
}