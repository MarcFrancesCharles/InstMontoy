import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    num: '01',
    title: 'Diagnòstic',
    desc: 'Analitzem les teves necessitats i avaluem l\'espai per proposar la millor solució tècnica.',
  },
  {
    num: '02',
    title: 'Pressupost',
    desc: 'Elaborem un pressupost detallat i transparent, sense sorpreses ni costos ocults.',
  },
  {
    num: '03',
    title: 'Execució',
    desc: 'Realitzem la instal·lació amb professionals qualificats, complint terminis i normativa vigent.',
  },
]

export default function Process() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const items = section.querySelectorAll('.process-step')
    gsap.fromTo(items,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
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
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          <div className="lg:w-[45%]">
            <p className="section-label mb-6">El Nostre Procés</p>
            <h2 className="font-display text-[32px] md:text-[56px] font-normal leading-[1.1] tracking-[-1.5px] text-[#1A1A1A]">
              Així treballem
            </h2>
          </div>

          <div className="lg:w-[55%] flex flex-col gap-12 md:gap-16">
            {steps.map((step, i) => (
              <div key={i} className="process-step flex gap-6 md:gap-8 opacity-0">
                <span
                  className="font-display text-[60px] md:text-[80px] font-normal leading-none text-[#C41E3A] shrink-0"
                  style={{ opacity: 0.2 }}
                >
                  {step.num}
                </span>
                <div className="pt-2 md:pt-4">
                  <h3 className="font-body text-[18px] md:text-[20px] font-normal text-[#1A1A1A] mb-3">
                    {step.title}
                  </h3>
                  <p className="font-body text-[15px] md:text-[16px] font-light text-[#8C8279] leading-[1.65]">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}