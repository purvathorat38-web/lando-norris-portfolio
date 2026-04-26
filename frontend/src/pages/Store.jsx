import { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { ChevronRight, ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ProductCard({ product, idx, onAddToCart }) {
  const imgSrc = product.image_url || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col cursor-none"
    >
      {/* Image Box */}
      <div className="relative bg-[#F5F5F5] aspect-square mb-4 flex items-center justify-center p-4">
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4 z-10 bg-white text-dark/60 text-[10px] font-body font-bold px-3 py-1.5 tracking-widest uppercase border border-dark/5 shadow-sm">
            {product.badge}
          </div>
        )}
        <img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
        />
        {/* Quick add overlay */}
        <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center backdrop-blur-sm px-4 gap-3">
          {product.description && (
            <p className="text-dark/70 font-body text-xs text-center leading-relaxed line-clamp-3">
              {product.description}
            </p>
          )}
          {product.ship_date && (
            <p className="text-dark/50 font-body text-[10px] uppercase tracking-widest">
              Ships: {product.ship_date}
            </p>
          )}
          <button
            onClick={() => onAddToCart({ ...product, image_url: imgSrc })}
            className="bg-dark text-lime px-6 py-3 text-xs tracking-widest font-display flex items-center gap-2 hover:scale-105 transition-transform mt-1"
            id={`store-add-${product.id}`}
          >
            <ShoppingBag size={14} /> ADD TO CART
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1">
        <h3 className="font-display text-dark text-[13px] uppercase leading-tight font-black">
          {product.name}
        </h3>
        {product.scale && (
          <p className="font-body text-dark/40 text-[10px] uppercase tracking-widest">{product.scale}</p>
        )}
        <p className="font-body text-dark/60 font-medium text-xs tracking-wide">
          £{product.price.toFixed(0)} GBP
        </p>
      </div>
    </motion.div>
  );
}

export default function Store({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    axios.get('/api/products')
      .then(r => { setProducts(r.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const tabs = ['ALL', 'HELMETS', 'COLLECTIONS', 'ARCHIVE'];

  return (
    <div className="min-h-screen bg-white" style={{ cursor: 'none' }}>

      {/* ── Promo bar ── */}
      <div className="promo-bar pt-24 font-body uppercase bg-lime text-dark font-black tracking-widest text-[11px] py-3">
        ⚡ FREE UK SHIPPING ON ORDERS OVER £100
      </div>

      {/* ── Store Nav ── */}
      <div className="bg-[#111611] sticky top-[calc(4rem)] z-50 py-4 border-b border-lime">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-display text-xs md:text-sm uppercase tracking-widest transition-colors ${
                  activeTab === tab ? 'text-lime' : 'text-lime/60 hover:text-lime'
                }`}
                id={`store-tab-${tab.toLowerCase()}`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-8">
            <Link to="/" className="text-lime font-display text-4xl leading-none transform -skew-x-12">LN</Link>
          </div>

          <div className="flex items-center gap-6 text-lime text-xs font-display tracking-widest uppercase">
            <span>GBP ▾</span>
            <span>SUPPORT</span>
            <div className="flex items-center gap-4 ml-4">
              <span className="w-4 h-4 rounded-full border border-lime flex items-center justify-center">O</span>
              <ShoppingBag size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Hero Banner ── */}
      <div className="relative h-[320px] md:h-[480px] overflow-hidden squiggle-bg-dark flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16,1,0.3,1] }}
          className="text-center z-10 px-6"
        >
          <p className="font-body text-lime/70 text-xs tracking-[0.4em] uppercase mb-4">Lando Norris × Official Store</p>
          <h1 className="font-display text-[clamp(3rem,8vw,7rem)] text-cream uppercase leading-none">
            LN4 <span className="text-lime">COLLECTION</span>
          </h1>
          <p className="text-cream/50 font-body text-sm mt-4 max-w-md mx-auto">
            Official race-worn replica helmets. Made to order. Delivered to your door.
          </p>
        </motion.div>
        {/* Decorative circles */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full border border-lime/10" />
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full border border-lime/10" />
      </div>

      {/* ── MINI HELMETS Section ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16">
        <div className="flex items-end justify-between mb-8">
          <h2 className="font-display text-3xl md:text-5xl text-dark uppercase tracking-tighter">
            MINI HELMETS
          </h2>
          <button className="text-dark/50 font-body text-xs uppercase tracking-widest hover:text-dark flex items-center gap-1 transition-colors">
            VIEW ALL <ChevronRight size={14} />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-100 mb-4" />
                <div className="h-4 bg-gray-100 rounded mb-2 w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                idx={idx}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── FEATURED PRODUCT (large) ── */}
      {products.length > 0 && (
        <div className="bg-cream/50 py-16 border-t border-dark/10">
          <div className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="relative h-[500px] overflow-hidden bg-gray-50"
            >
              <img
                src={products[0].image_url}
                alt={products[0].name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 bg-lime text-dark text-xs font-body font-black px-3 py-1 uppercase tracking-widest">
                FEATURED
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
            >
              <p className="text-dark/40 text-xs font-body uppercase tracking-[0.3em] mb-3">Limited Edition</p>
              <h2 className="font-display text-4xl md:text-6xl text-dark uppercase leading-none mb-4">
                {products[0].name}
              </h2>
              <p className="text-dark/60 font-body mb-6 leading-relaxed">{products[0].description}</p>
              {products[0].scale && (
                <p className="text-dark/50 text-sm font-body mb-1">Scale: {products[0].scale}</p>
              )}
              {products[0].ship_date && (
                <p className="text-dark/50 text-sm font-body mb-6">Estimated ship: {products[0].ship_date}</p>
              )}
              <div className="flex items-center gap-4 mb-8">
                <p className="font-display text-4xl text-dark">£{products[0].price.toFixed(2)}</p>
                <span className="text-dark/40 font-body text-sm">GBP</span>
              </div>
              {/* Stars */}
              <div className="flex gap-1 mb-8">
                {[1,2,3,4,5].map(i => <Star key={i} size={16} className="text-lime fill-lime" />)}
                <span className="text-dark/40 text-sm font-body ml-2">5.0 (24 reviews)</span>
              </div>
              <button
                onClick={() => addToCart({ ...products[0] })}
                className="btn-lime w-full py-4 text-sm tracking-widest font-display flex items-center justify-center gap-3"
                id="store-featured-add"
              >
                <ShoppingBag size={18} />
                ADD TO CART — £{products[0].price.toFixed(2)} GBP
              </button>
            </motion.div>
          </div>
        </div>
      )}

      {/* ── JOIN LN4 Banner ── */}
      <div className="bg-olive py-16 text-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-body text-lime/60 text-xs tracking-[0.4em] uppercase mb-3">Exclusive access</p>
          <h2 className="font-display text-[clamp(3rem,7vw,6rem)] text-cream uppercase leading-none mb-6">
            JOIN <span className="text-lime">LN4</span>
          </h2>
          <p className="text-cream/50 font-body max-w-md mx-auto mb-8">
            Be first for drops, race day updates, and exclusive fan content.
          </p>
          <div className="flex max-w-md mx-auto gap-0 px-6">
            <input
              type="email"
              placeholder="YOUR EMAIL"
              className="flex-1 bg-white/10 border border-white/20 text-white px-4 py-3 font-body text-sm focus:outline-none focus:border-lime placeholder-white/30"
            />
            <button className="btn-lime px-6 py-3 text-sm font-display tracking-widest">JOIN</button>
          </div>
        </motion.div>
        <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full border border-lime/10" />
      </div>

    </div>
  );
}
