// eslint-disable-next-line no-unused-vars
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef, useEffect, useState, lazy, Suspense } from 'react';
import { ArrowRight } from 'lucide-react';

const WebGLBackground = lazy(() => import('../components/WebGLBackground'));

// ─── Animated Counter ────────────────────────────────────────────────────────
function Counter({ end, suffix = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1800;
    const step = 16;
    const increment = end / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [isInView, end]);

  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Marquee Row ─────────────────────────────────────────────────────────────
function MarqueeRow({ text, reverse = false, className = '' }) {
  const repeated = Array(8).fill(text).join('  ·  ');
  return (
    <div className={`marquee-container overflow-hidden ${className}`}>
      <div className={reverse ? 'marquee-track-reverse' : 'marquee-track'}>
        <span className="inline-block pr-8">{repeated}</span>
        <span className="inline-block pr-8">{repeated}</span>
      </div>
    </div>
  );
}

// ─── Magnetic Image (tilt on mouse) ──────────────────────────────────────────
function MagneticImg({ src, alt, className }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 14;
    ref.current.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.03)`;
  };
  const onLeave = () => { ref.current.style.transform = 'perspective(600px) rotateY(0deg) rotateX(0deg) scale(1)'; };

  return (
    <div
      ref={ref}
      className={`transition-transform duration-300 ease-out will-change-transform ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <img src={src} alt={alt} className="w-full h-full object-cover" />
    </div>
  );
}

// ─── Word-by-word stagger variant ────────────────────────────────────────────
const wordVariant = {
  hidden: { opacity: 0, y: 80, skewY: 4 },
  visible: (i) => ({
    opacity: 1, y: 0, skewY: 0,
    transition: { delay: i * 0.07, duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  })
};

function AnimatedHeadline({ lines }) {
  return (
    <div>
      {lines.map((line, li) => (
        <div key={li} className="overflow-hidden flex flex-wrap">
          {line.words.map((word, wi) => (
            <motion.span
              key={wi}
              custom={li * 4 + wi}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              variants={wordVariant}
              className={`inline-block mr-[0.18em] ${word.lime ? 'text-lime' : 'text-cream'}`}
            >
              {word.text}
            </motion.span>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Notched Gallery Card ───────────────────────────────────────────────────────
function NotchedCard({ src, title, year, highlight, delay = 0, className = '' }) {
  const [hovered, setHovered] = useState(false);
  const isHighlighted = highlight || hovered;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay, duration: 0.7, ease: [0.16,1,0.3,1] }}
      className={`notched-card-container ${isHighlighted ? 'highlight' : ''} ${className} cursor-none`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="notched-card-inner">
        <img
          src={src}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      <div className="notched-tab-content">
        <span>{title}</span>
        <span className="notched-tab-year">{year}</span>
      </div>
    </motion.div>
  );
}




export default function Home() {
  const containerRef = useRef(null);
  const introRef = useRef(null);
  const { scrollY } = useScroll();

  // Intro section: fade + scale out as user scrolls
  const introOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const introScale  = useTransform(scrollY, [0, 400], [1, 0.92]);
  const introY      = useTransform(scrollY, [0, 400], [0, -60]);

  // Hero section: slides up from below as user scrolls past intro
  const heroY       = useTransform(scrollY, [200, 700], [120, 0]);
  const heroOpacity = useTransform(scrollY, [200, 600], [0, 1]);

  const heroLines = [
    { words: [{ text: 'REDEFINING', lime: true }, { text: 'LIMITS,' }] },
    { words: [{ text: 'FIGHTING' }, { text: 'FOR' }, { text: 'WINS,' , lime: true }] },
    { words: [{ text: 'BRINGING' }, { text: 'IT' }, { text: 'ALL' }, { text: 'IN' }] },
    { words: [{ text: 'ALL' }, { text: 'WAYS.' }, { text: 'DEFINING' }, { text: 'A' }] },
    { words: [{ text: 'LEGACY', lime: true }, { text: 'IN' }, { text: 'FORMULA' }, { text: '1' }] },
    { words: [{ text: 'ON' }, { text: 'AND' }, { text: 'OFF' }, { text: 'THE' }] },
    { words: [{ text: 'TRACK' }] },
  ];

  const stats = [
    { label: 'F1 Wins', end: 7, suffix: '' },
    { label: 'Podiums', end: 28, suffix: '+' },
    { label: 'Years in F1', end: 7, suffix: '' },
    { label: 'Pole Positions', end: 14, suffix: '+' },
  ];

  const galleryItems = [
    { src: '/helmet4.jpg', title: 'Season', year: '2025', className: 'h-[300px]', highlight: false },
    { src: '/helmet4.jpg', title: 'Dark Glitter', year: '2025', className: 'h-[380px]', highlight: true },
    { src: '/helmet1.jpg', title: 'Season', year: '2024', className: 'h-[300px]', highlight: false },
    { src: '/helmet3.jpg', title: 'Porcelain', year: '2024', className: 'h-[340px]', highlight: false },
    { src: '/helmet5.jpg', title: 'Discoball', year: '2025', className: 'h-[460px]', highlight: false },
    { src: '/helmet1.jpg', title: 'Japan', year: '2024', className: 'h-[300px]', highlight: false },
    { src: '/helmet2.jpg', title: 'GIF', year: '2024', className: 'h-[340px]', highlight: false },
    { src: '/helmet4.jpg', title: 'Dark Mode', year: '2024', className: 'h-[340px]', highlight: false }
  ];

  return (
    <div ref={containerRef} className="overflow-x-hidden">

      {/* ── SECTION 0: INTRO LANDING (first page) ── */}
      <motion.section
        ref={introRef}
        style={{ opacity: introOpacity, scale: introScale, y: introY }}
        className="fixed top-0 left-0 w-full h-screen squiggle-bg-dark overflow-hidden z-0 flex items-center"
      >
        <Suspense fallback={null}>
          <WebGLBackground />
        </Suspense>

        {/* Center – Name + tagline */}
        <div className="relative z-20 w-full flex flex-col items-center justify-center h-full text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* ON / OFF labels */}
            <div className="flex items-end justify-center gap-6 mb-1">
              <span className="font-serif italic text-lime text-[clamp(1.8rem,3.5vw,3rem)] leading-none" style={{ fontStyle: 'italic' }}>On</span>
              <span className="font-display text-white/40 text-[clamp(1.8rem,3.5vw,3rem)] leading-none uppercase">Off</span>
            </div>

            <h1 className="font-display text-[clamp(4.5rem,10vw,9rem)] leading-[0.9] tracking-[-0.03em] uppercase text-white">
              LANDO
            </h1>
            <h1
              className="font-display text-[clamp(4.5rem,10vw,9rem)] leading-[0.9] tracking-[-0.03em] uppercase"
              style={{ WebkitTextStroke: '2px #C8FF00', color: 'transparent' }}
            >
              NORRIS
            </h1>

            <p className="font-body text-white/40 text-xs md:text-sm tracking-[0.4em] uppercase mt-5">
              Formula 1  ·  McLaren  ·  #4
            </p>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-30"
        >
          <span className="text-white/30 text-xs tracking-[0.3em] font-body uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-[1px] h-10 bg-gradient-to-b from-lime to-transparent"
          />
        </motion.div>
      </motion.section>

      {/* Spacer so content below starts after the intro */}
      <div className="h-screen" />

      {/* All scrollable content sits above the fixed intro */}
      <div className="relative z-10 bg-[#1A1F10]">

      {/* ── SECTION 1: HERO (surfaces on scroll) ── */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-screen squiggle-bg-dark flex flex-col justify-center pt-24 pb-16 overflow-hidden noise"
      >
        <div className="px-6 md:px-16 max-w-7xl mx-auto w-full relative z-10">
          <div className="font-display text-[clamp(3rem,9vw,8rem)] leading-[0.88] tracking-[-0.02em] uppercase">
            <AnimatedHeadline lines={heroLines} />
          </div>
        </div>
      </motion.section>

      {/* ── SECTION 2: MARQUEE + PORTRAIT ── */}
      <section className="relative squiggle-bg-dark py-0 overflow-hidden">
        {/* Top marquee */}
        <MarqueeRow
          text="WE DID IT AT HOME  ·  WEEKEND I WILL NEVER FORGET  ·  ALWAYS A BRIT  ·  LN4"
          className="text-[clamp(1.8rem,4vw,3rem)] font-display text-white/15 py-4 border-y border-white/5"
        />

        {/* Portrait block */}
        <div className="relative flex items-center justify-center py-16 min-h-[60vh]">
          {/* Behind marquee text */}
          <div className="absolute inset-0 flex flex-col justify-center overflow-hidden pointer-events-none">
            <MarqueeRow
              text="WE DID IT AT HOME  ·  A WEEKEND I WILL NEVER"
              className="text-[clamp(2.5rem,6vw,5rem)] font-display text-white/10 py-2"
            />
            <MarqueeRow
              text="FORGET  ·  KEND I WILL  ·  EVER A BRIT  ·  LN4"
              reverse
              className="text-[clamp(2.5rem,6vw,5rem)] font-display text-white/10 py-2"
            />
          </div>

          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16,1,0.3,1] }}
            className="relative z-10 w-[280px] md:w-[380px] aspect-[3/4] overflow-hidden"
          >
            <img
              src="/Landon.jpg.png"
              alt="Lando Norris Portrait"
              className="w-full h-full object-cover grayscale"
            />
            {/* Lime signature brushstroke overlay */}
            <svg
              viewBox="0 0 200 350"
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ filter: 'drop-shadow(0 0 12px #C8FF00)' }}
            >
              <path
                d="M 60 20 Q 80 80 50 140 Q 20 200 70 260 Q 120 320 100 350"
                fill="none"
                stroke="#C8FF00"
                strokeWidth="6"
                strokeLinecap="round"
              />
              <path
                d="M 40 80 Q 100 100 130 60 Q 160 20 180 80"
                fill="none"
                stroke="#C8FF00"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        </div>

        <MarqueeRow
          text="FORMULA 1  ·  MCLAREN  ·  #4  ·  WORLD CHAMPION  ·  LN4  ·"
          reverse
          className="text-[clamp(1.8rem,4vw,3rem)] font-display text-white/15 py-4 border-y border-white/5"
        />
      </section>

      {/* ── ACHIEVEMENTS SECTION ── */}
      <section className="relative overflow-hidden" style={{ backgroundColor: '#B5B89A' }}>
        <div className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'%3E%3Cg fill='none' stroke='%23888' stroke-width='1'%3E%3Cpath d='M100 200 Q150 100 250 180 Q350 260 300 350 Q250 440 350 500 Q450 560 400 650'/%3E%3Cpath d='M500 100 Q550 200 480 280 Q410 360 480 440 Q550 520 500 620'/%3E%3Cpath d='M50 400 Q100 300 200 380 Q300 460 250 550 Q200 640 300 700'/%3E%3Cpath d='M600 200 Q650 300 580 380 Q510 460 600 540 Q690 620 640 720'/%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '800px 800px'
          }}
        />

        {/* ── ROW 1 ── */}
        <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 pt-16 pb-8">
          <div className="grid grid-cols-12 gap-4 items-start">

            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="col-span-3 col-start-1 mt-8">
              <p className="text-[10px] tracking-[0.2em] uppercase text-dark/50 font-body mb-2">BRITAIN, 2025</p>
              <div className="w-full aspect-[3/4] overflow-hidden">
                <img src="/lando5.png.png" alt="Lando Britain 2025" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
              </div>
            </motion.div>

            <div className="col-span-6 col-start-4 flex flex-col items-center gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }} className="text-center max-w-[420px] pt-4">
                <p className="font-serif text-[clamp(1.1rem,2vw,1.5rem)] text-dark leading-snug">
                  It doesn't matter <em>where</em> you start, it's <em>how</em> you progress from there.
                </p>
                <svg viewBox="0 0 120 40" className="w-24 mx-auto mt-3 opacity-60">
                  <path d="M10 30 Q30 5 50 20 Q70 35 90 15 Q100 8 110 20" fill="none" stroke="#1A1F10" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.15 }} className="w-full">
                <p className="text-[10px] tracking-[0.2em] uppercase text-dark/50 font-body mb-2">MIAMI GP, 2024</p>
                <div className="w-full aspect-[4/3] overflow-hidden">
                  <img src="/lando6.png.png" alt="Miami GP 2024 - First F1 Win" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
                <p className="font-body text-xs text-dark/60 mt-2 max-w-[380px]">
                  May 5, 2024 — Lando claims his first ever Formula 1 victory at the Miami Grand Prix, ending years of near-misses and heartbreak.
                </p>
              </motion.div>
            </div>

            <div className="col-span-3 col-start-10 flex flex-col gap-6 mt-4">
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}>
                <p className="text-[10px] tracking-[0.2em] uppercase text-dark/50 font-body mb-2">MONACO, 2023</p>
                <div className="w-full aspect-square overflow-hidden">
                  <img src="/lando7.png.png" alt="Monaco 2023" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 }}>
                <p className="text-[10px] tracking-[0.2em] uppercase text-dark/50 font-body mb-2">FIA PRIZE GIVING, 2024</p>
                <div className="w-full aspect-[3/4] overflow-hidden">
                  <img src="/Landon.jpg.png" alt="FIA Prize Giving 2024" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
                <p className="font-body text-xs text-dark/60 mt-2">
                  Recognised at the FIA Prize Giving Ceremony — 4 wins, 14 podiums, and the World Championship title.
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ── ROW 2 ── */}
        <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 py-8">
          <div className="grid grid-cols-12 gap-4 items-start">

            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="col-span-3">
              <p className="text-[10px] tracking-[0.2em] uppercase text-dark/50 font-body mb-2">BRITAIN, 2025</p>
              <div className="w-full aspect-square overflow-hidden">
                <img src="/lando8.png.png" alt="Britain 2025" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="w-7 h-7 border border-dark/40 flex items-center justify-center text-xs font-body text-dark">1</span>
                <span className="text-xs font-body text-dark/40 tracking-widest">01/06</span>
              </div>
            </motion.div>

            <div className="col-span-6 col-start-4 flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-dark/50 font-body mb-2">HIGH PERFORMANCE GALA, 2024</p>
                  <div className="w-full aspect-[3/4] overflow-hidden">
                    <img src="/landon4.jpg.png" alt="High Performance Gala 2024" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15 }}>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-dark/50 font-body mb-2">BATTERSEA, 2024</p>
                  <div className="w-full aspect-[3/4] overflow-hidden">
                    <img src="/lando9.png.png" alt="Battersea 2024" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  </div>
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
                <p className="font-serif text-[clamp(1rem,1.8vw,1.3rem)] text-dark leading-snug max-w-[420px]">
                  Since I was 7 years old and had my first experience with kart racing, I've worked tirelessly to make that dream come true.
                </p>
                <svg viewBox="0 0 120 40" className="w-20 mt-2 opacity-60">
                  <path d="M10 30 Q30 5 50 20 Q70 35 90 15 Q100 8 110 20" fill="none" stroke="#1A1F10" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </motion.div>
            </div>

            <div className="col-span-3 col-start-10 flex flex-col gap-6">
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}>
                <p className="text-[10px] tracking-[0.2em] uppercase text-dark/50 font-body mb-2">AUSTRIA, 2020</p>
                <div className="w-full aspect-square overflow-hidden">
                  <img src="/lando5.png.png" alt="Austria 2020 - First Podium" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
                <p className="font-body text-xs text-dark/60 mt-2">First F1 podium — P3 at the Austrian GP. The moment that proved Lando belonged at the very top.</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 }}>
                <p className="text-[10px] tracking-[0.2em] uppercase text-dark/50 font-body mb-2">US, 2024</p>
                <div className="w-full aspect-[3/4] overflow-hidden">
                  <img src="/lando6.png.png" alt="US GP 2024" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
                <p className="font-body text-xs text-dark/60 mt-2">Back-to-back wins in the US — cementing his status as the fastest driver on the grid in 2024.</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: STATS ── */}
      <section className="squiggle-bg-cream py-24 px-6 md:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-display text-[clamp(3rem,7vw,6rem)] text-dark uppercase leading-none mb-16"
          >
            BY THE <span className="text-stroke-white" style={{ WebkitTextStroke: '3px #1A1F10' }}>NUMBERS</span>
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t-2 border-dark/10 pt-12">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7 }}
              >
                <p className="font-display text-[clamp(3.5rem,7vw,6rem)] leading-none text-dark">
                  <Counter end={s.end} suffix={s.suffix} />
                </p>
                <p className="font-body text-sm text-dark/60 uppercase tracking-widest mt-2">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* ── SECTION 5: GALLERY (HELMET GRID) ── */}
      <section id="gallery" className="py-24 px-6 md:px-16 squiggle-bg-dark">
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex justify-between items-end mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="font-display text-[clamp(3rem,6vw,5rem)] text-white uppercase leading-none"
            >
              HELMET <span className="text-stroke" style={{ WebkitTextStroke: '2px #C8FF00' }}>GALLERY</span>
            </motion.h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="hidden md:flex items-center gap-2 text-lime font-body uppercase tracking-widest text-sm hover:text-white transition-colors"
            >
              View Full Gallery <ArrowRight size={16} />
            </motion.button>
          </div>

          {/* Masonry Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {/* Column 1 */}
            <div className="flex flex-col gap-6">
              <NotchedCard {...galleryItems[0]} delay={0.1} />
              <NotchedCard {...galleryItems[3]} delay={0.2} />
            </div>
            {/* Column 2 */}
            <div className="flex flex-col gap-6">
              <NotchedCard {...galleryItems[4]} delay={0.15} />
              <NotchedCard {...galleryItems[5]} delay={0.25} />
            </div>
            {/* Column 3 */}
            <div className="flex flex-col gap-6">
              <NotchedCard {...galleryItems[1]} delay={0.2} />
              <NotchedCard {...galleryItems[6]} delay={0.3} />
            </div>
            {/* Column 4 */}
            <div className="flex flex-col gap-6">
              <NotchedCard {...galleryItems[2]} delay={0.25} />
              <NotchedCard {...galleryItems[7]} delay={0.35} />
            </div>
          </div>
        </div>
      </section>

    </div>{/* end z-10 wrapper */}
    </div>
  );
}
