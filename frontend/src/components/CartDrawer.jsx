import { useState, useEffect } from 'react';
import { X, Minus, Plus, ShoppingBag, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const FREE_SHIPPING_THRESHOLD = 100;
const CART_TIMEOUT_SECONDS = 5 * 60; // 5 minutes

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQty, onRemove }) {
  const [secondsLeft, setSecondsLeft] = useState(CART_TIMEOUT_SECONDS);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const toFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || cartItems.length === 0) return;
    setSecondsLeft(CART_TIMEOUT_SECONDS);
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, cartItems.length]);

  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const itemCount = cartItems.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="cart-overlay"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-[400px] z-[999] flex flex-col shadow-2xl"
            style={{ background: '#1C2210' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10"
              style={{ background: '#1C2210' }}>
              <span className="font-display text-2xl text-lime tracking-wide">
                {itemCount} ITEM{itemCount !== 1 ? 'S' : ''}
              </span>
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-body tracking-widest"
                id="cart-close-btn"
              >
                CLOSE <X size={16} />
              </button>
            </div>

            {/* Free Shipping Banner */}
            <div className="px-5 py-4 bg-white border-b border-gray-100">
              {toFreeShipping > 0 ? (
                <>
                  <p className="font-display text-xl text-dark mb-1">WANT FREE SHIPPING?</p>
                  <p className="text-sm text-dark/70 font-body mb-3">
                    Spend <strong>£{toFreeShipping.toFixed(2)} GBP</strong> more to get FREE shipping
                  </p>
                </>
              ) : (
                <p className="font-display text-xl text-dark mb-3">🎉 YOU GOT FREE SHIPPING!</p>
              )}
              <div className="shipping-progress">
                <div className="shipping-progress-fill" style={{ width: `${freeShippingProgress}%` }} />
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 bg-white space-y-4">
              {cartItems.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 text-dark/40">
                  <ShoppingBag size={40} className="mb-3 opacity-30" />
                  <p className="font-body text-sm">Your cart is empty</p>
                </div>
              )}
              {cartItems.map(item => (
                <div key={item.id} className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
                  <div className="w-24 h-24 bg-gray-50 flex-shrink-0 overflow-hidden rounded">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm text-dark leading-tight mb-1">{item.name}</p>
                    <p className="text-sm font-body text-dark font-semibold mb-1">£{item.price.toFixed(2)} GBP</p>
                    {item.scale && (
                      <p className="text-xs text-dark/50 font-body">{item.scale} Pre-order</p>
                    )}
                    {item.ship_date && (
                      <p className="text-xs text-dark/50 font-body">Est. ship: {item.ship_date}</p>
                    )}
                    {/* Quantity */}
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => onUpdateQty(item.id, item.qty - 1)}
                        className="w-7 h-7 border border-dark/30 flex items-center justify-center hover:bg-dark hover:text-white transition-colors text-dark rounded-sm"
                        id={`cart-minus-${item.id}`}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-body font-semibold text-dark w-6 text-center">{item.qty}</span>
                      <button
                        onClick={() => onUpdateQty(item.id, item.qty + 1)}
                        className="w-7 h-7 border border-dark/30 flex items-center justify-center hover:bg-dark hover:text-white transition-colors text-dark rounded-sm"
                        id={`cart-plus-${item.id}`}
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => onRemove(item.id)}
                        className="ml-auto text-xs text-dark/40 hover:text-red-500 transition-colors font-body"
                        id={`cart-remove-${item.id}`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="px-5 py-5 border-t border-white/10" style={{ background: '#1C2210' }}>
                {/* Timer */}
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={16} className="text-lime" />
                  <span className="font-display text-sm text-lime tracking-wider">
                    {formatTime(secondsLeft)} minutes remaining in cart
                  </span>
                </div>

                {/* Subtotal */}
                <div className="flex justify-between items-center mb-1">
                  <span className="font-display text-xl text-lime tracking-wider">SUBTOTAL</span>
                  <span className="font-display text-xl text-lime">£{subtotal.toFixed(2)} GBP</span>
                </div>
                <p className="text-xs text-white/40 font-body mb-4">Taxes and shipping calculated at checkout</p>

                {/* Checkout Button */}
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="block w-full btn-lime text-center py-4 rounded-full text-sm tracking-widest font-display"
                  id="cart-checkout-btn"
                >
                  CHECKOUT
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
