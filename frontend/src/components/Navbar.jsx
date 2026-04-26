import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, X, Menu } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export default function Navbar({ cartCount = 0, onCartOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;

  const isLight = pathname === '/store' || pathname.startsWith('/checkout');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  const navLinks = [
    { label: 'STORE', href: '/store' },
    { label: 'HELMETS', href: '/store' },
    { label: 'ON TRACK', href: '/#on-track' },
    { label: 'GALLERY', href: '/#gallery' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[900] flex items-center justify-between px-6 md:px-10 py-4 transition-all duration-500 ${
        scrolled ? (isLight ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-olive/90 backdrop-blur-md shadow-lg shadow-black/40') : 'bg-transparent'
      }`}>
        {/* Logo */}
        <Link to="/" className="flex flex-col leading-none select-none">
          <span className={`font-display text-xl font-black tracking-wider ${isLight ? 'text-dark' : 'text-light'}`}>LANDO</span>
          <span className={`font-display text-xl font-black tracking-wider ${isLight ? 'text-dark' : 'text-light'}`}>NORRIS</span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Store Button */}
          <Link
            to="/store"
            className="btn-lime flex items-center gap-2 px-4 py-2 rounded-sm text-sm"
            id="nav-store-btn"
          >
            <ShoppingBag size={14} />
            STORE
          </Link>

          {/* Cart Button */}
          <button
            onClick={onCartOpen}
            className={`relative w-10 h-10 flex items-center justify-center border rounded-sm transition-all duration-200
              ${isLight ? 'border-dark/30 text-dark hover:bg-dark hover:text-white' : 'border-white/30 text-white hover:bg-white/10'}
            `}
            id="nav-cart-btn"
            aria-label="Open Cart"
          >
            <ShoppingBag size={16} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-lime text-dark text-[10px] font-black rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Menu Button */}
          <button
            onClick={() => setMenuOpen(true)}
            className={`w-10 h-10 flex items-center justify-center border rounded-sm transition-all duration-200
              ${isLight ? 'border-dark/30 text-dark hover:bg-dark hover:text-white' : 'border-white/30 text-white hover:bg-white/10'}
            `}
            id="nav-menu-btn"
            aria-label="Open Menu"
          >
            <Menu size={16} />
          </button>
        </div>
      </nav>

      {/* Full-screen Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[950] squiggle-bg-dark flex flex-col"
          >
            <div className="flex justify-between items-center px-6 md:px-10 py-4">
              <Link to="/" className="flex flex-col leading-none" onClick={handleLinkClick}>
                <span className="font-display text-xl text-light tracking-wider">LANDO</span>
                <span className="font-display text-xl text-light tracking-wider">NORRIS</span>
              </Link>
              <button onClick={() => setMenuOpen(false)} className="text-white/60 hover:text-lime transition-colors" id="menu-close-btn">
                <X size={28} />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center px-10 md:px-20 gap-6">
              {navLinks.map((link, i) => (
                <div
                  key={link.label}
                  style={{
                    opacity: 1,
                    transform: 'translateX(0)',
                    transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.08}s`
                  }}
                >
                  <Link
                    to={link.href}
                    className="font-display text-6xl md:text-8xl text-white hover:text-lime transition-colors duration-200 block"
                    onClick={handleLinkClick}
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>

            <div className="px-10 pb-10 text-white/30 text-xs font-body tracking-widest">
              © {new Date().getFullYear()} LANDO NORRIS
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
