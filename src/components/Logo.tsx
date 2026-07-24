type LogoProps = {
  className?: string
}

/**
 * Logo d'Instal·lacions Montoy: cercle blanc amb tipografia,
 * "MONTOY" en roig corporatiu. El fons fora del cercle és transparent.
 */
export default function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Instal·lacions Montoy"
      className={className}
    >
      <circle cx="200" cy="200" r="200" fill="#FFFFFF" />
      <text
        x="200"
        y="163"
        textAnchor="middle"
        fill="#1A1A1A"
        style={{
          fontFamily: "'Geist', system-ui, sans-serif",
          fontSize: '31px',
          fontWeight: 700,
          letterSpacing: '3px',
        }}
      >
        INSTAL·LACIONS
      </text>
      <text
        x="200"
        y="238"
        textAnchor="middle"
        fill="#C41E3A"
        style={{
          fontFamily: "'Geist', system-ui, sans-serif",
          fontSize: '66px',
          fontWeight: 800,
          letterSpacing: '2px',
        }}
      >
        MONTOY
      </text>
      <text
        x="200"
        y="300"
        textAnchor="middle"
        fill="#1A1A1A"
        style={{
          fontFamily: "'Geist', system-ui, sans-serif",
          fontSize: '24px',
          fontWeight: 500,
          letterSpacing: '10px',
        }}
      >
        J·M·M
      </text>
    </svg>
  )
}
