import { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ChevronRight, ShoppingBag, MapPin, User, CreditCard, Lock } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const steps = ['Your Info', 'Shipping', 'Confirmation'];

function StepIndicator({ current }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className={`flex items-center gap-2 px-4 py-2 text-xs font-body font-semibold uppercase tracking-widest transition-colors ${
            i <= current ? 'text-dark' : 'text-dark/30'
          }`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-colors ${
              i < current ? 'bg-lime text-dark' :
              i === current ? 'bg-dark text-lime' :
              'bg-dark/10 text-dark/30'
            }`}>
              {i < current ? '✓' : i + 1}
            </div>
            {step}
          </div>
          {i < steps.length - 1 && (
            <ChevronRight size={14} className={i < current ? 'text-lime' : 'text-dark/20'} />
          )}
        </div>
      ))}
    </div>
  );
}

function Field({ label, id, type = 'text', placeholder, value, onChange, required, half }) {
  return (
    <div className={half ? 'flex-1' : 'w-full'}>
      <label htmlFor={id} className="block text-xs font-body font-semibold text-dark/60 uppercase tracking-widest mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        required={required}
        className="w-full border border-dark/20 bg-white px-4 py-3 font-body text-dark text-sm focus:outline-none focus:border-lime focus:ring-2 focus:ring-lime/20 transition-all rounded-sm placeholder-dark/30"
      />
    </div>
  );
}

export default function Checkout({ cart, clearCart }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderId, setOrderId] = useState(null);

  const [info, setInfo] = useState({
    customer_name: '', customer_email: '', customer_phone: '',
    address_line1: '', address_line2: '', city: '', state: '', postcode: '', country: 'United Kingdom', notes: '',
  });

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = subtotal >= 100 ? 0 : 9.99;
  const total = subtotal + shipping;

  const handleSet = (key) => (val) => setInfo(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      // Create one order per cart item
      const promises = cart.map(item =>
        axios.post('/api/orders', {
          ...info,
          product_id: item.id,
          product_name: item.name,
          quantity: item.qty,
        })
      );
      const results = await Promise.all(promises);
      setOrderId(results[0].data.id);
      setStep(2);
      clearCart();
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && step !== 2) {
    return (
      <div className="min-h-screen squiggle-bg-cream flex items-center justify-center pt-20 px-6">
        <div className="text-center">
          <ShoppingBag size={60} className="text-dark/20 mx-auto mb-4" />
          <h2 className="font-display text-4xl text-dark uppercase mb-4">Your cart is empty</h2>
          <Link to="/store" className="btn-lime inline-block px-8 py-3 font-display text-sm tracking-widest">
            SHOP NOW
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6 md:px-10">

        {/* Logo */}
        <div className="mb-10">
          <Link to="/" className="inline-flex flex-col leading-none">
            <span className="font-display text-2xl text-dark tracking-wider">LANDO</span>
            <span className="font-display text-2xl text-dark tracking-wider">NORRIS</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

          {/* ── Left: Form ── */}
          <div className="lg:col-span-3">
            <StepIndicator current={step} />

            <AnimatePresence mode="wait">

              {/* STEP 0: Personal Info */}
              {step === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="bg-white border border-dark/10 rounded-lg p-6 md:p-8 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-lime rounded-full flex items-center justify-center">
                        <User size={16} className="text-dark" />
                      </div>
                      <h2 className="font-display text-xl text-dark uppercase tracking-wide">Contact Information</h2>
                    </div>
                    <div className="flex flex-col gap-4">
                      <Field label="Full Name" id="name" placeholder="Lando Norris" value={info.customer_name} onChange={handleSet('customer_name')} required />
                      <div className="flex gap-4">
                        <Field label="Email" id="email" type="email" placeholder="you@example.com" value={info.customer_email} onChange={handleSet('customer_email')} required half />
                        <Field label="Phone" id="phone" type="tel" placeholder="+44 7700 900000" value={info.customer_phone} onChange={handleSet('customer_phone')} half />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-body px-4 py-3 rounded mb-4">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={() => {
                      if (!info.customer_name || !info.customer_email) {
                        setError('Please fill in your name and email.');
                        return;
                      }
                      setError('');
                      setStep(1);
                    }}
                    className="btn-lime w-full py-4 font-display text-sm tracking-widest flex items-center justify-center gap-2"
                    id="checkout-next-step1"
                  >
                    CONTINUE TO SHIPPING <ChevronRight size={16} />
                  </button>
                </motion.div>
              )}

              {/* STEP 1: Shipping Address */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="bg-white border border-dark/10 rounded-lg p-6 md:p-8 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-lime rounded-full flex items-center justify-center">
                        <MapPin size={16} className="text-dark" />
                      </div>
                      <h2 className="font-display text-xl text-dark uppercase tracking-wide">Shipping Address</h2>
                    </div>
                    <div className="flex flex-col gap-4">
                      <Field label="Address Line 1" id="addr1" placeholder="123 McLaren Way" value={info.address_line1} onChange={handleSet('address_line1')} required />
                      <Field label="Address Line 2" id="addr2" placeholder="Apartment, suite, etc. (optional)" value={info.address_line2} onChange={handleSet('address_line2')} />
                      <div className="flex gap-4">
                        <Field label="City" id="city" placeholder="Woking" value={info.city} onChange={handleSet('city')} required half />
                        <Field label="County / State" id="state" placeholder="Surrey" value={info.state} onChange={handleSet('state')} half />
                      </div>
                      <div className="flex gap-4">
                        <Field label="Postcode / ZIP" id="postcode" placeholder="GU21 5JY" value={info.postcode} onChange={handleSet('postcode')} required half />
                        <Field label="Country" id="country" placeholder="United Kingdom" value={info.country} onChange={handleSet('country')} required half />
                      </div>
                      <Field label="Order Notes (optional)" id="notes" placeholder="Any special delivery instructions?" value={info.notes} onChange={handleSet('notes')} />
                    </div>
                  </div>

                  {/* Payment note */}
                  <div className="bg-white border border-dark/10 rounded-lg p-5 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-lime rounded-full flex items-center justify-center">
                        <CreditCard size={16} className="text-dark" />
                      </div>
                      <h2 className="font-display text-xl text-dark uppercase tracking-wide">Payment: Cash on Delivery</h2>
                    </div>
                    <div className="flex items-center gap-2 text-dark/50 text-sm font-body">
                      <Lock size={13} />
                      <span>No payment required now. You will pay in cash upon delivery of your items.</span>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-body px-4 py-3 rounded mb-4">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <button
                      onClick={() => setStep(0)}
                      className="flex-1 py-4 font-display text-sm tracking-widest border-2 border-dark/20 text-dark hover:border-dark transition-colors"
                      id="checkout-back-step0"
                    >
                      BACK
                    </button>
                    <button
                      onClick={() => {
                        if (!info.address_line1 || !info.city || !info.postcode || !info.country) {
                          setError('Please fill in your full shipping address.');
                          return;
                        }
                        setError('');
                        handleSubmit();
                      }}
                      disabled={loading}
                      className="flex-[2] btn-lime py-4 font-display text-sm tracking-widest flex items-center justify-center gap-2 disabled:opacity-60"
                      id="checkout-place-order"
                    >
                      {loading ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-5 h-5 border-2 border-dark/40 border-t-dark rounded-full" />
                      ) : (
                        <><Lock size={15} /> PLACE ORDER</>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Confirmation */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, ease: [0.16,1,0.3,1] }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 bg-lime rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <CheckCircle size={40} className="text-dark" />
                  </motion.div>
                  <h2 className="font-display text-5xl text-dark uppercase mb-3">ORDER PLACED!</h2>
                  {orderId && (
                    <p className="text-dark/40 font-body text-sm mb-2">Order #{String(orderId).padStart(4, '0')}</p>
                  )}
                  <p className="text-dark/60 font-body max-w-sm mx-auto mb-8">
                    Thank you, <strong>{info.customer_name}</strong>! We've received your order and will be in touch at <strong>{info.customer_email}</strong>.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Link to="/" className="btn-lime px-8 py-3 font-display text-sm tracking-widest">
                      BACK TO HOME
                    </Link>
                    <Link to="/store" className="px-8 py-3 font-display text-sm tracking-widest border-2 border-dark/20 text-dark hover:border-lime transition-colors">
                      SHOP MORE
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Right: Order Summary ── */}
          {step < 2 && (
            <div className="lg:col-span-2">
              <div className="bg-white border border-dark/10 rounded-lg p-6 sticky top-28">
                <h3 className="font-display text-lg text-dark uppercase tracking-wide mb-5 pb-4 border-b border-dark/10">
                  Order Summary
                </h3>

                <div className="space-y-4 mb-5">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-50 flex-shrink-0 overflow-hidden rounded">
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-dark text-sm font-semibold leading-tight">{item.name}</p>
                        {item.scale && <p className="text-dark/40 text-xs">{item.scale}</p>}
                        <p className="text-dark/60 text-xs mt-1">Qty: {item.qty}</p>
                      </div>
                      <p className="font-body font-semibold text-dark text-sm">£{(item.price * item.qty).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dark/10 pt-4 space-y-2">
                  <div className="flex justify-between text-dark/60 font-body text-sm">
                    <span>Subtotal</span>
                    <span>£{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-dark/60 font-body text-sm">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'text-lime font-semibold' : ''}>{shipping === 0 ? 'FREE' : `£${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between font-display text-xl text-dark pt-3 border-t border-dark/10 mt-2">
                    <span>TOTAL</span>
                    <span>£{total.toFixed(2)} GBP</span>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-2 text-dark/40 text-xs font-body">
                  <Lock size={12} />
                  <span>Secure checkout · SSL encrypted</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
