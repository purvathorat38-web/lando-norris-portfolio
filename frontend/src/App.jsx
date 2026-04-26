import { useEffect, useState, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';
import axios from 'axios';

import Home from './pages/Home';
import Store from './pages/Store';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';

axios.defaults.baseURL = 'https://lando-norris-portfolio.onrender.com';

// ── Visitor Tracker ───────────────────────────────────────────────────────────
function TrackVisitor() {
  const location = useLocation();
  useEffect(() => {
    axios.post('/api/track', {
      page: location.pathname,
      action_type: 'page_view',
      user_agent: navigator.userAgent,
      referrer: document.referrer || null,
    }).catch(() => {});
  }, [location]);
  return null;
}

// ── Custom Cursor ─────────────────────────────────────────────────────────────
function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const pos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };
    window.addEventListener('mousemove', onMove);

    let raf;
    const lerp = (a, b, t) => a + (b - a) * t;
    const animate = () => {
      ringPos.current.x = lerp(ringPos.current.x, pos.current.x, 0.12);
      ringPos.current.y = lerp(ringPos.current.y, pos.current.y, 0.12);
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top = `${ringPos.current.y}px`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}

// ── Cart State ────────────────────────────────────────────────────────────────
function AppShell() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ln4_cart') || '[]'); } catch { return []; }
  });
  const [cartOpen, setCartOpen] = useState(false);

  // Persist cart
  useEffect(() => {
    localStorage.setItem('ln4_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) setCart(prev => prev.filter(i => i.id !== id));
    else setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const removeItem = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <CustomCursor />
      <TrackVisitor />

      {!isAdmin && (
        <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      )}

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cart}
        onUpdateQty={updateQty}
        onRemove={removeItem}
      />

      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} />} />
        <Route path="/store" element={<Store addToCart={addToCart} />} />
        <Route path="/checkout" element={<Checkout cart={cart} clearCart={clearCart} />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      {!isAdmin && <Footer />}
    </>
  );
}

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
