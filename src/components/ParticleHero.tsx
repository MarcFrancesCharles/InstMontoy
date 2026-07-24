import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const TEXTURE_WIDTH = 100
const TEXTURE_HEIGHT = 100
const AMOUNT = TEXTURE_WIDTH * TEXTURE_HEIGHT

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const posFragmentShader = `
  precision highp float;
  uniform sampler2D textureDefaultPosition;
  uniform sampler2D texturePosition;
  uniform vec4 uConfig;
  uniform float uTime;
  uniform vec3 uMouse;
  uniform vec2 uMouseDirection;
  uniform vec4 resolution;
  varying vec2 vUv;

  float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u * u * (3.0 - 2.0 * u);
    float res = mix(
      mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
      mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x),
      u.y
    );
    return res * res;
  }

  vec2 cubicPulse(vec2 c, vec2 w, vec2 x) {
    vec2 t = abs(x - c) / w;
    vec2 v = vec2(0.0);
    for (int i = 0; i < 2; i++) {
      if (t[i] >= 1.0) {
        v[i] = 0.0;
      } else {
        v[i] = 1.0 - t[i] * t[i] * (3.0 - 2.0 * t[i]);
      }
    }
    return v;
  }

  vec3 mixThree(vec3 v1, vec3 v2, vec3 v3, vec3 a1, vec3 a2, vec3 a3) {
    vec3 v = v1 * a1 + v2 * a2 + v3 * a3;
    float l = a1.x + a2.x + a3.x;
    return v / max(l, 0.0001);
  }

  mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    return mat4(
      oc * axis.x * axis.x + c, oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s, 0.0,
      oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c, oc * axis.y * axis.z - axis.x * s, 0.0,
      oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c, 0.0,
      0.0, 0.0, 0.0, 1.0
    );
  }

  void main() {
    vec4 positionInfo = texture2D(texturePosition, vUv);
    vec4 def = texture2D(textureDefaultPosition, vUv);
    vec3 position = positionInfo.xyz;
    vec3 acc = vec3(0.0);
    float speed = uConfig.x;
    float viscosity = uConfig.y;
    float mouseSize = uConfig.z;
    float dieSpeed = uConfig.w;

    vec2 mousePosition = uMouse.xy;
    vec2 mouseDirection = uMouseDirection;
    float mouseDistance = length(position.xy - mousePosition);
    float isMouseActive = step(0.5, uMouse.z);
    float mouseSpeed = 0.02;
    float mouseAffectionRadius = viscosity;
    float mouseStrength = (1.0 - mouseDistance);
    if (mouseStrength < 0.0) mouseStrength = 0.0;
    mouseStrength *= mouseStrength;
    vec2 mouseForce = mouseDirection * mouseSpeed * mouseStrength * isMouseActive;
    acc.xy += mouseForce;

    vec2 configA = vec2(0.1, 0.2);
    vec2 cursorPos = (mousePosition) * 1.0 - 0.1;
    vec3 offset = position - vec3(cursorPos, 0.0);
    vec4 rotatedOffset = rotationMatrix(vec3(0.0, 0.0, 1.0), (0.52 + noise(position.xy + uTime * 0.0013)) * 1.1) * vec4(offset, 1.0);
    offset = rotatedOffset.xyz;
    cursorPos = position.xy - offset.xy;
    vec4 rotateCursorPos = rotationMatrix(vec3(1.0, 1.0, 0.5), uTime * 0.015) * vec4(vec3(cursorPos, 0.0), 1.0);
    vec2 cursorPulse = cubicPulse(rotateCursorPos.xy, vec2(configA.y), position.xy);
    float forceCursor = (cursorPulse.x * cursorPulse.y);
    if (forceCursor > 0.001) forceCursor = 0.001;
    forceCursor *= 1.0;
    float noiseVal = noise((offset.xy + uTime * 0.001) * (3.0 + forceCursor * 150.0) + uTime * 0.02);
    float forceX = -0.025 * configA.x * (offset.x) * (1.0 + forceCursor * 80.0);
    float forceY = -0.025 * configA.x * (offset.y) * (1.0 + forceCursor * 80.0);
    vec3 swirlA = vec3(forceX, forceY, 0.0);
    vec3 swirlB = vec3(1.0, 0.0, 0.0) * (noiseVal - 0.5) * 0.001 * (1.0 + forceCursor * 400.0);
    vec3 swirl = mixThree(swirlA, swirlB, vec3(0.001, 0.001, 0.0) * forceCursor, vec3(0.6), vec3(1.2), vec3(0.3));
    if (isMouseActive > 0.5) {
      acc += swirl;
    }

    vec3 target = def.xyz;
    vec3 toTarget = (target - position) * speed;
    acc += toTarget;

    vec3 vel = positionInfo.xyz - positionInfo.xyz;
    vel += acc;
    position += vel;

    if (length(acc) > 0.0000001) {
      positionInfo.w *= dieSpeed;
    } else {
      positionInfo.w = 1.0;
    }

    gl_FragColor = vec4(position, positionInfo.w * dieSpeed);
  }
`

const particleVertexShader = `
  uniform sampler2D texturePosition;
  uniform float uSize;
  varying vec4 vColor;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec4 positionInfo = texture2D(texturePosition, uv);
    vec4 mvPosition = modelViewMatrix * vec4(positionInfo.xyz, 1.0);
    gl_PointSize = positionInfo.w * uSize * (800.0 / length(mvPosition.z));
    gl_Position = projectionMatrix * mvPosition;
    vColor = vec4(positionInfo.w);
  }
`

const particleFragmentShader = `
  precision highp float;
  uniform vec4 resolution;
  uniform float uSize;
  varying vec4 vColor;
  varying vec2 vUv;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;
    float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
    float center = 1.0 - smoothstep(0.0, 0.2, dist);
    vec3 color = mix(vec3(0.12, 0.10, 0.08), vec3(0.77, 0.12, 0.23), center);
    float val = vColor.x;
    if (val < 0.00001) discard;
    gl_FragColor = vec4(color, alpha * val * 2.0);
  }
`

export default function ParticleHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      preserveDrawingBuffer: true,
      alpha: true, // Necessari perquè es vegi el text de fons
    })
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.offsetWidth, container.offsetHeight)

    function getTextCoordinates(): THREE.DataTexture {
      const textCanvas = document.createElement('canvas')
      textCanvas.width = 256
      textCanvas.height = 256
      const ctx = textCanvas.getContext('2d')!
      ctx.fillStyle = 'black'
      ctx.fillRect(0, 0, 256, 256)
      ctx.fillStyle = 'white'
      ctx.font = '60px "Noto Serif Display", Georgia, serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('MONTOY', 128, 128)
      const imageData = ctx.getImageData(0, 0, 256, 256)
      const data = new Float32Array(256 * 256 * 4)
      for (let i = 0; i < 256 * 256; i++) {
        const brightness = imageData.data[i * 4] / 255
        data[i * 4] = (Math.random() * 0.5 + 0.25)
        data[i * 4 + 1] = (Math.random() * 0.5 + 0.25)
        data[i * 4 + 2] = brightness * 0.5
        data[i * 4 + 3] = brightness
      }
      const tex = new THREE.DataTexture(data, 256, 256, THREE.RGBAFormat, THREE.FloatType)
      tex.needsUpdate = true
      tex.minFilter = THREE.NearestFilter
      tex.magFilter = THREE.NearestFilter
      return tex
    }

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const geometry = new THREE.PlaneGeometry(2, 2)

    const positions = new Float32Array(AMOUNT * 4)
    for (let i = 0; i < AMOUNT; i++) {
      positions[i * 4] = (i % TEXTURE_WIDTH) / TEXTURE_WIDTH
      positions[i * 4 + 1] = Math.floor(i / TEXTURE_WIDTH) / TEXTURE_HEIGHT
      positions[i * 4 + 2] = 0
      positions[i * 4 + 3] = 1
    }
    const defaultPositionTexture = new THREE.DataTexture(positions, TEXTURE_WIDTH, TEXTURE_HEIGHT, THREE.RGBAFormat, THREE.FloatType)
    defaultPositionTexture.needsUpdate = true
    defaultPositionTexture.minFilter = THREE.NearestFilter
    defaultPositionTexture.magFilter = THREE.NearestFilter

    const textTexture = getTextCoordinates()

    const fbo = new THREE.WebGLRenderTarget(TEXTURE_WIDTH, TEXTURE_HEIGHT, {
      type: THREE.FloatType,
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
    })

    const positionMaterial = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: posFragmentShader,
      uniforms: {
        textureDefaultPosition: { value: textTexture },
        texturePosition: { value: defaultPositionTexture },
        uMouse: { value: new THREE.Vector3(0.5, 0.5, 0) },
        uMouseDirection: { value: new THREE.Vector2(0, 0) },
        uConfig: { value: new THREE.Vector4(0.2, 0.5, 0.01, 0.9) },
        uTime: { value: 0 },
        resolution: { value: new THREE.Vector4(TEXTURE_WIDTH, TEXTURE_HEIGHT, container.offsetWidth / container.offsetHeight, container.offsetHeight / container.offsetWidth) },
      },
    })

    const positionMesh = new THREE.Mesh(geometry, positionMaterial)
    scene.add(positionMesh)

    const camera2 = new THREE.PerspectiveCamera(50, container.offsetWidth / container.offsetHeight, 0.1, 20)
    camera2.position.z = 6

    const sceneParticles = new THREE.Scene()
    const particleGeometry = new THREE.BufferGeometry()
    const uvs = new Float32Array(AMOUNT * 2)
    for (let i = 0; i < AMOUNT; i++) {
      uvs[i * 2] = (i % TEXTURE_WIDTH) / TEXTURE_WIDTH
      uvs[i * 2 + 1] = Math.floor(i / TEXTURE_WIDTH) / TEXTURE_HEIGHT
    }
    particleGeometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))

    const pointsMaterial = new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms: {
        texturePosition: { value: null },
        resolution: { value: new THREE.Vector4(container.offsetWidth, container.offsetHeight) },
        uSize: { value: 1.4 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const particles = new THREE.Points(particleGeometry, pointsMaterial)
    sceneParticles.add(particles)

    let mouseX = 0
    let mouseY = 0

    function getMousePos(x: number, y: number, width: number, height: number): THREE.Vector3 {
      const vec3 = new THREE.Vector3()
      const ndcX = (x / width) * 2 - 1
      const ndcY = -(y / height) * 2 + 1
      vec3.set(ndcX, ndcY, 0.5)
      vec3.unproject(camera2)
      const dir = vec3.sub(camera2.position).normalize()
      const distance = -camera2.position.z / dir.z
      vec3.copy(camera2.position).add(dir.multiplyScalar(distance))
      vec3.x = (vec3.x + 1) / 2
      vec3.y = (vec3.y + 1) / 2
      return vec3
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const pos = getMousePos(x, y, rect.width, rect.height)
      positionMaterial.uniforms.uMouse.value.copy(pos)
      positionMaterial.uniforms.uMouse.value.z = 1
      positionMaterial.uniforms.uMouseDirection.value.set(
        (x - mouseX) / rect.width,
        (y - mouseY) / rect.height
      )
      mouseX = x
      mouseY = y
    }

    const handleMouseLeave = () => {
      positionMaterial.uniforms.uMouse.value.z = 0
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    let animationId: number
    const loop = () => {
      positionMaterial.uniforms.uTime.value += 0.01
      renderer.autoClear = false
      renderer.setRenderTarget(fbo)
      renderer.render(scene, camera)
      renderer.setRenderTarget(null)
      pointsMaterial.uniforms.texturePosition.value = fbo.texture
      renderer.clear()
      renderer.render(sceneParticles, camera2)
      animationId = requestAnimationFrame(loop)
    }

    loop()

    const handleResize = () => {
      const w = container.offsetWidth
      const h = container.offsetHeight
      renderer.setSize(w, h)
      camera2.aspect = w / h
      camera2.updateProjectionMatrix()
      positionMaterial.uniforms.resolution.value.set(TEXTURE_WIDTH, TEXTURE_HEIGHT, w / h, h / w)
      pointsMaterial.uniforms.resolution.value.set(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      fbo.dispose()
      geometry.dispose()
      particleGeometry.dispose()
      positionMaterial.dispose()
      pointsMaterial.dispose()
      defaultPositionTexture.dispose()
      textTexture.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ background: '#F5F3EF' }}
    >
      
      {/* CANVI 1: 'justify-center' per 'justify-start pt-[15vh]' per pujar-ho a dalt de tot */}
        <div className="absolute inset-0 z-0 flex flex-col justify-start pt-[15vh] overflow-hidden pointer-events-none select-none">
          
          {/* Línia superior */}
          <div className="animate-marquee flex whitespace-nowrap mb-4 md:mb-8">
            {/* CANVI 2: text-[80px] a text-[40px] i md:text-[140px] a md:text-[70px] */}
            <span className="text-[40px] md:text-[70px] font-black text-[#1A1A1A]/10 uppercase tracking-tight mx-8">
              • QUALITAT • CLIMATITZACIÓ • ELECTRICITAT • FONTANERIA
            </span>
            <span className="text-[40px] md:text-[70px] font-black text-[#1A1A1A]/10 uppercase tracking-tight mx-8">
              • QUALITAT • CLIMATITZACIÓ • ELECTRICITAT • FONTANERIA
            </span>
          </div>

          {/* Línia inferior amb efecte de contorn */}
          <div className="animate-marquee-reverse flex whitespace-nowrap">
            {/* CANVI 2 (continuació): mateixa reducció de mides */}
            <span className="text-[40px] md:text-[70px] font-black uppercase tracking-tight mx-8 text-stroke">
              GARANTIA • CONFIANÇA • INSTAL·LACIONS ELÈCTRIQUES
            </span>
            <span className="text-[40px] md:text-[70px] font-black uppercase tracking-tight mx-8 text-stroke">
              GARANTIA • CONFIANÇA • INSTAL·LACIONS ELÈCTRIQUES
            </span>
          </div>
        </div>

      {/* M flotant (rèplica del favicon: cercle blanc + M vermella) */}
      <div className="hero-m-wrap" aria-hidden="true">
        <div className="hero-m-circle">
          <span className="hero-m">M</span>
        </div>
        <div className="hero-m-shadow" />
      </div>

      {/* 2. CANVAS DE LES PARTÍCULES (A sobre dels textos, sota el text principal) */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10 }}
      />

      {/* 3. EL TEU TEXT ORIGINAL (Intacte, a la posició original) */}
      <div
        className="absolute z-20"
        style={{ bottom: '15vh', left: '48px', maxWidth: '600px' }}
      >
        <h1
          className="font-display text-[#1A1A1A] text-[48px] md:text-[80px] font-normal leading-[1.0] tracking-[-2px] mb-6 hero-text"
          style={{ opacity: 0, transform: 'translateY(40px)' }}
        >
          Solucions integrals<br />per al teu espai
        </h1>
        <p
          className="font-body text-[16px] font-light leading-[1.65] text-[#8C8279] max-w-[400px] mb-8 hero-subtitle"
          style={{ opacity: 0, transform: 'translateY(40px)' }}
        >
          Instal·lacions elèctriques, climatització i fontaneria a Lleida.
        </p>
        <a
          href="#serveis"
          onClick={(e) => {
            e.preventDefault()
            document.querySelector('#serveis')?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="inline-block bg-[#C41E3A] text-[#F5F3EF] px-8 py-[14px] text-[12px] font-normal uppercase tracking-[1.5px] hover:bg-[#A01830] transition-colors duration-300 hero-cta"
          style={{ opacity: 0, transform: 'translateY(40px)' }}
        >
          Veure serveis
        </a>
      </div>

      {/* ESTILS CSS PER LES ANIMACIONS DELS TEXTOS */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 50s linear infinite;
        }
        .text-stroke {
          /* Color adaptat al fons clar per fer només el contorn de la lletra */
          -webkit-text-stroke: 2px rgba(26, 26, 26, 0.05);
          color: transparent;
        }
        .hero-m-wrap {
          position: absolute;
          top: 64%;
          right: 24vw;
          z-index: 15;
          pointer-events: none;
          user-select: none;
          animation: hero-m-in 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both;
        }
        .hero-m-circle {
          width: clamp(200px, 26vw, 400px);
          aspect-ratio: 1;
          border-radius: 50%;
          background: #FBF7EE;
          box-shadow: 0 30px 70px rgba(26, 26, 26, 0.10);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: hero-m-float 7s ease-in-out 2s infinite;
        }
        .hero-m {
          display: block;
          font-family: 'Geist', system-ui, sans-serif;
          font-weight: 800;
          font-size: clamp(120px, 15.5vw, 240px);
          line-height: 1;
          color: #C41E3A;
          transform: translateY(3%);
        }
        .hero-m-shadow {
          position: absolute;
          left: 50%;
          bottom: clamp(-64px, -4vw, -36px);
          width: 68%;
          height: clamp(16px, 2vw, 30px);
          border-radius: 50%;
          background: radial-gradient(ellipse at center, rgba(26, 26, 26, 0.35), transparent 65%);
          filter: blur(6px);
          animation: hero-m-shadow 7s ease-in-out 2s infinite;
          transform: translateX(-50%);
        }
        @keyframes hero-m-in {
          from { opacity: 0; transform: translateY(-38%); }
          to { opacity: 1; transform: translateY(-50%); }
        }
        @keyframes hero-m-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-26px) rotate(2deg); }
        }
        @keyframes hero-m-shadow {
          0%, 100% { transform: translateX(-50%) scaleX(1); opacity: 0.5; }
          50% { transform: translateX(-50%) scaleX(0.78); opacity: 0.22; }
        }
        @media (max-width: 767px) {
          .hero-m-wrap { top: 37%; right: calc(50vw - 82px); }
          .hero-m-circle { width: 164px; }
          .hero-m { font-size: 98px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-m-wrap, .hero-m-circle, .hero-m-shadow { animation-duration: 0.01s; animation-iteration-count: 1; }
        }
      `}</style>
    </div>
  )
}