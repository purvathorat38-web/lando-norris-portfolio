import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function Footer() {
  const [clickCount, setClickCount] = useState(0);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate();

  const handleSecretClick = () => {
    const n = clickCount + 1;
    setClickCount(n);
    if (n >= 10) { setClickCount(0); navigate('/admin'); }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await axios.post('/api/newsletter', { email });
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      if (err.response?.status === 400) setSubscribed(true); // already subscribed
    }
  };

  return (
    <footer className="bg-olive border-t border-lime/10 pt-20 pb-10 px-6 md:px-16 relative overflow-hidden">
      {/* Squiggle background */}
      <div className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Cg fill='none' stroke='%232A3318' stroke-width='1'%3E%3Cpath d='M50 100 Q100 50 180 120 Q260 190 220 280 Q180 370 260 430'/%3E%3Cpath d='M350 50 Q400 130 350 200 Q300 270 380 340 Q460 410 420 490'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '600px',
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">

          {/* Brand */}
          <div>
            <div className="flex flex-col leading-none mb-5">
              <span className="font-display text-4xl text-cream tracking-wider">LANDO</span>
              <span className="font-display text-4xl text-lime tracking-wider">NORRIS</span>
            </div>
            <p className="text-cream/40 font-body text-sm leading-relaxed max-w-xs">
              Pushing the limits. Every lap. Every race. McLaren F1 Team #4.
            </p>
          </div>

          {/* Socials */}
          <div>
            <h3 className="font-display text-sm text-cream/50 uppercase tracking-[0.3em] mb-5">Follow</h3>
            <div className="flex flex-col gap-3">
              {[
                { label: 'Instagram', href: 'https://instagram.com/landonorris' },
                { label: 'Twitter / X', href: 'https://twitter.com/LandoNorris' },
                { label: 'Twitch', href: 'https://twitch.tv/landonorris' },
                { label: 'YouTube', href: 'https://youtube.com/@LandoNorris' },
              ].map(s => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ x: 8 }}
                  className="text-cream/60 hover:text-lime transition-colors font-body text-sm flex items-center gap-2 group"
                >
                  <span className="w-0 h-[1px] bg-lime group-hover:w-4 transition-all duration-300" />
                  {s.label}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-display text-sm text-cream/50 uppercase tracking-[0.3em] mb-5">Join LN4</h3>
            <p className="text-cream/40 font-body text-sm mb-4">First access to drops, race-day news and exclusive content.</p>
            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lime font-body text-sm flex items-center gap-2"
              >
                ✓ You're in! Welcome to LN4.
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="YOUR EMAIL"
                  className="flex-1 bg-white/5 border border-white/10 text-cream px-4 py-2.5 font-body text-sm focus:outline-none focus:border-lime placeholder-white/20 transition-colors"
                />
                <button type="submit" className="btn-lime px-5 py-2.5 text-xs font-display tracking-widest">
                  JOIN
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-cream/30 text-xs font-body">
          <p>© {new Date().getFullYear()} Lando Norris / Quadrant. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/store" className="hover:text-lime transition-colors">Store</Link>
            <span className="hover:text-lime transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-lime transition-colors cursor-pointer">Terms</span>
          </div>

          {/* Hidden admin trigger — helmet icon, click 10x */}
          <div
            onClick={handleSecretClick}
            id="admin-secret-trigger"
            className="cursor-pointer select-none group relative"
            title={clickCount > 0 ? `${10 - clickCount} more...` : ''}
          >
            <svg
              width="32" height="32" viewBox="0 0 64 64"
              className="transition-all duration-300 opacity-20 group-hover:opacity-60"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Helmet dome */}
              <path
                d="M10 34 C10 16 22 8 32 8 C42 8 54 16 54 34 L54 44 C54 47 51 50 48 50 L16 50 C13 50 10 47 10 44 Z"
                fill={clickCount > 0 ? '#C8FF00' : '#a0a0a0'}
                className="transition-colors duration-200"
              />
              {/* Visor */}
              <path
                d="M16 34 C16 28 22 24 32 24 C42 24 48 28 48 34 L48 40 L16 40 Z"
                fill="#1a1a1a"
                opacity="0.85"
              />
              {/* Visor shine */}
              <path
                d="M19 30 Q24 27 30 28"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.3"
              />
              {/* Chin guard */}
              <rect x="18" y="48" width="28" height="6" rx="3"
                fill={clickCount > 0 ? '#C8FF00' : '#888'}
                className="transition-colors duration-200"
              />
              {/* Click progress dots */}
              {clickCount > 0 && (
                <g>
                  {[...Array(10)].map((_, i) => (
                    <circle
                      key={i}
                      cx={10 + i * 5}
                      cy={60}
                      r="1.5"
                      fill={i < clickCount ? '#C8FF00' : '#444'}
                    />
                  ))}
                </g>
              )}
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
}
