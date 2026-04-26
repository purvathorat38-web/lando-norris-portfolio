import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, ShoppingBag, Users, DollarSign, LogOut, Bell, Eye, Mail, MessageSquare, Package, ChevronRight, Check, X, TrendingUp } from 'lucide-react';

const ADMIN_AVATAR = 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=200';

const CHART_DATA = [
  { day: 'Mon', views: 420, revenue: 380 },
  { day: 'Tue', views: 310, revenue: 210 },
  { day: 'Wed', views: 590, revenue: 540 },
  { day: 'Thu', views: 470, revenue: 300 },
  { day: 'Fri', views: 740, revenue: 680 },
  { day: 'Sat', views: 920, revenue: 890 },
  { day: 'Sun', views: 860, revenue: 750 },
];

const STATUS_CYCLE = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS = {
  pending: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
  processing: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
  shipped: 'bg-lime/20 text-lime border border-lime/30',
  delivered: 'bg-green-500/20 text-green-400 border border-green-500/30',
  cancelled: 'bg-red-500/20 text-red-400 border border-red-500/30',
};

function StatCard({ title, value, icon, sub }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-lime/30 transition-all"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="w-10 h-10 rounded-lg bg-lime/10 flex items-center justify-center text-lime">{icon}</div>
        {sub && <span className="text-lime text-xs font-body flex items-center gap-1"><TrendingUp size={10} />{sub}</span>}
      </div>
      <p className="text-white/50 text-xs uppercase tracking-widest font-body mb-1">{title}</p>
      <p className="font-display text-3xl text-white">{value}</p>
    </motion.div>
  );
}

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: <Activity size={18} /> },
  { id: 'orders', label: 'Orders', icon: <ShoppingBag size={18} /> },
  { id: 'activity', label: 'Activity', icon: <Eye size={18} /> },
  { id: 'newsletter', label: 'Subscribers', icon: <Mail size={18} /> },
  { id: 'contacts', label: 'Messages', icon: <MessageSquare size={18} /> },
];

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [orders, setOrders] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [notifications, setNotifications] = useState(0);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const fd = new URLSearchParams();
      fd.append('username', email);
      fd.append('password', password);
      const res = await axios.post('/api/auth/login', fd, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
      localStorage.setItem('adminToken', res.data.access_token);
      setToken(res.data.access_token);
      setError('');
    } catch { setError('Invalid credentials. Check email and password.'); }
  };

  const handleLogout = () => { localStorage.removeItem('adminToken'); setToken(null); };

  const cfg = () => ({ headers: { Authorization: `Bearer ${token}` } });

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        const [s, a, o, n, c] = await Promise.all([
          axios.get('/api/admin/stats', cfg()),
          axios.get('/api/admin/activity', cfg()),
          axios.get('/api/orders', cfg()),
          axios.get('/api/newsletter', cfg()),
          axios.get('/api/contact', cfg()),
        ]);
        setStats(s.data);
        setActivities(a.data);
        setOrders(o.data);
        setSubscribers(n.data);
        setContacts(c.data);
        setNotifications(o.data.filter(ord => ord.status === 'pending').length);
      } catch (err) { if (err.response?.status === 401) handleLogout(); }
    };
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [token]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`/api/orders/${orderId}/status`, { status: newStatus }, cfg());
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      setNotifications(prev => newStatus === 'pending' ? prev + 1 : Math.max(0, prev - 1));
    } catch {}
  };

  // ── LOGIN SCREEN ──────────────────────────────────────────────────────────
  if (!token) {
    return (
      <div className="min-h-screen squiggle-bg-dark flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16,1,0.3,1] }}
          className="w-full max-w-md"
        >
          {/* Branding */}
          <div className="text-center mb-10">
            <div className="flex flex-col leading-none items-center mb-4">
              <span className="font-display text-3xl text-cream tracking-wider">LANDO</span>
              <span className="font-display text-3xl text-lime tracking-wider">NORRIS</span>
            </div>
            <p className="text-white/30 text-xs font-body tracking-[0.4em] uppercase">Admin Portal</p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            <h1 className="font-display text-2xl text-white uppercase tracking-wider text-center mb-8">
              Sign In
            </h1>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-body px-4 py-3 rounded-lg mb-5 text-center"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div>
                <label className="block text-white/50 text-xs uppercase tracking-widest mb-1.5 font-body">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="purvathorat38@gmail.com"
                  className="w-full bg-white/5 border border-white/15 text-white rounded-lg px-4 py-3 text-sm font-body focus:outline-none focus:border-lime focus:ring-2 focus:ring-lime/20 transition-all placeholder-white/20"
                  id="admin-email-input"
                  required
                />
              </div>
              <div>
                <label className="block text-white/50 text-xs uppercase tracking-widest mb-1.5 font-body">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••••"
                  className="w-full bg-white/5 border border-white/15 text-white rounded-lg px-4 py-3 text-sm font-body focus:outline-none focus:border-lime focus:ring-2 focus:ring-lime/20 transition-all placeholder-white/20"
                  id="admin-password-input"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn-lime py-4 rounded-lg font-display tracking-widest text-sm mt-2"
                id="admin-login-btn"
              >
                ACCESS DASHBOARD
              </button>
            </form>
          </div>

          <p className="text-center text-white/20 text-xs font-body mt-6">
            Restricted area — authorised personnel only
          </p>
        </motion.div>
      </div>
    );
  }

  // ── DASHBOARD ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0A0D06] text-white flex">

      {/* Sidebar */}
      <div className="admin-sidebar flex-shrink-0 flex flex-col py-6 px-4">
        {/* Logo */}
        <div className="px-2 mb-8">
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg text-cream tracking-wider">LANDO</span>
            <span className="font-display text-lg text-lime tracking-wider">NORRIS</span>
          </div>
          <p className="text-white/30 text-[10px] font-body tracking-[0.3em] uppercase mt-1">Admin Panel</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white/5 rounded-xl p-3 mb-6 border border-white/10">
          <div className="flex items-center gap-3">
            <img src={ADMIN_AVATAR} alt="Admin" className="w-10 h-10 rounded-full object-cover border-2 border-lime" />
            <div className="min-w-0">
              <p className="text-white text-sm font-body font-semibold truncate">Purva Thorat</p>
              <p className="text-lime text-[10px] font-body tracking-widest uppercase">● Logged in as Admin</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-all ${
                activeTab === item.id
                  ? 'bg-lime/10 text-lime border border-lime/20'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
              id={`admin-nav-${item.id}`}
            >
              {item.icon}
              {item.label}
              {item.id === 'orders' && notifications > 0 && (
                <span className="ml-auto bg-lime text-dark text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-white/40 hover:text-white text-sm font-body transition-colors mt-4"
          id="admin-logout-btn"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">

        {/* Top Bar */}
        <div className="sticky top-0 z-10 bg-[#0A0D06]/90 backdrop-blur-md border-b border-white/5 px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="font-display text-2xl text-white uppercase tracking-wide">
              {NAV_ITEMS.find(n => n.id === activeTab)?.label}
            </h1>
            <p className="text-white/30 text-xs font-body mt-0.5">
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative w-9 h-9 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center hover:border-lime/30 transition-colors">
              <Bell size={16} className="text-white/60" />
              {notifications > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-lime text-dark text-[9px] font-black rounded-full flex items-center justify-center">{notifications}</span>}
            </button>
            <img src={ADMIN_AVATAR} alt="Admin" className="w-9 h-9 rounded-full object-cover border-2 border-lime/50" />
          </div>
        </div>

        <div className="p-8 space-y-8">

          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              {/* Stats Grid */}
              {stats && (
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
                  <StatCard title="Total Views" value={stats.total_views.toLocaleString()} icon={<Eye size={20} />} sub="+12% this week" />
                  <StatCard title="Total Orders" value={stats.total_orders} icon={<ShoppingBag size={20} />} sub={`${notifications} pending`} />
                  <StatCard title="Revenue" value={`£${stats.revenue.toFixed(0)}`} icon={<DollarSign size={20} />} sub="+8% this week" />
                  <StatCard title="Subscribers" value={stats.subscribers} icon={<Users size={20} />} sub="newsletter" />
                </div>
              )}

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-xl p-6">
                  <h2 className="font-display text-lg uppercase text-white/70 mb-5">Traffic & Revenue (7 days)</h2>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={CHART_DATA}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                      <XAxis dataKey="day" stroke="#ffffff30" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                      <YAxis stroke="#ffffff30" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ background: '#111611', border: '1px solid #C8FF0040', borderRadius: '8px', fontSize: '12px' }} itemStyle={{ color: '#C8FF00' }} />
                      <Line type="monotone" dataKey="views" stroke="#C8FF00" strokeWidth={2.5} dot={false} activeDot={{ r: 6, fill: '#C8FF00' }} />
                      <Line type="monotone" dataKey="revenue" stroke="#ffffff40" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: '#fff' }} strokeDasharray="4 2" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* Recent Activity */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 overflow-hidden flex flex-col">
                  <h2 className="font-display text-lg uppercase text-white/70 mb-4">Live Feed</h2>
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1" style={{ maxHeight: 220 }}>
                    {activities.slice(0, 12).map(act => (
                      <div key={act.id} className="flex gap-3 items-start border-l-2 border-lime/40 pl-3">
                        <div className="min-w-0">
                          <p className="text-white text-xs font-body"><span className="text-lime">{act.action_type}</span> on <span className="font-mono text-white/70">{act.page}</span></p>
                          <p className="text-white/30 text-[10px] mt-0.5">{new Date(act.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                    {activities.length === 0 && <p className="text-white/20 text-xs">No activity yet.</p>}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── ORDERS ── */}
          {activeTab === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10">
                  <h2 className="font-display text-xl uppercase text-white/80">All Orders ({orders.length})</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-body">
                    <thead>
                      <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
                        <th className="px-6 py-3 text-left">Order</th>
                        <th className="px-6 py-3 text-left">Customer</th>
                        <th className="px-6 py-3 text-left">Product</th>
                        <th className="px-6 py-3 text-left">Address</th>
                        <th className="px-6 py-3 text-left">Total</th>
                        <th className="px-6 py-3 text-left">Date</th>
                        <th className="px-6 py-3 text-left">Status</th>
                        <th className="px-6 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, i) => (
                        <tr key={order.id} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}>
                          <td className="px-6 py-4 text-lime font-mono text-xs">#{String(order.id).padStart(4,'0')}</td>
                          <td className="px-6 py-4">
                            <p className="text-white font-medium">{order.customer_name}</p>
                            <p className="text-white/40 text-xs">{order.customer_email}</p>
                            {order.customer_phone && <p className="text-white/30 text-xs">{order.customer_phone}</p>}
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-white/80">{order.product_name}</p>
                            <p className="text-white/30 text-xs">Qty: {order.quantity}</p>
                          </td>
                          <td className="px-6 py-4 text-white/50 text-xs max-w-[160px]">
                            {[order.address_line1, order.city, order.postcode, order.country].filter(Boolean).join(', ') || '—'}
                          </td>
                          <td className="px-6 py-4 text-white font-semibold">£{order.total_price.toFixed(2)}</td>
                          <td className="px-6 py-4 text-white/40 text-xs whitespace-nowrap">
                            {new Date(order.timestamp).toLocaleDateString('en-GB')}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${STATUS_COLORS[order.status] || STATUS_COLORS.pending}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={order.status}
                              onChange={e => updateOrderStatus(order.id, e.target.value)}
                              className="bg-white/5 border border-white/10 text-white text-xs rounded px-2 py-1 focus:outline-none focus:border-lime cursor-pointer"
                              id={`order-status-${order.id}`}
                            >
                              {STATUS_CYCLE.map(s => <option key={s} value={s} className="bg-dark">{s}</option>)}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {orders.length === 0 && (
                    <div className="text-center py-12 text-white/20 font-body">
                      <Package size={40} className="mx-auto mb-3 opacity-30" />
                      No orders yet.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ── ACTIVITY ── */}
          {activeTab === 'activity' && (
            <motion.div key="activity" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10">
                  <h2 className="font-display text-xl uppercase text-white/80">Visitor Activity ({activities.length})</h2>
                </div>
                <table className="w-full text-sm font-body">
                  <thead>
                    <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
                      <th className="px-6 py-3 text-left">#</th>
                      <th className="px-6 py-3 text-left">Action</th>
                      <th className="px-6 py-3 text-left">Page</th>
                      <th className="px-6 py-3 text-left">IP</th>
                      <th className="px-6 py-3 text-left">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map((act, i) => (
                      <tr key={act.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-6 py-3 text-white/30 text-xs font-mono">{i + 1}</td>
                        <td className="px-6 py-3"><span className="text-lime text-xs font-body">{act.action_type}</span></td>
                        <td className="px-6 py-3 text-white/70 font-mono text-xs">{act.page}</td>
                        <td className="px-6 py-3 text-white/30 font-mono text-xs">{act.ip_address || '—'}</td>
                        <td className="px-6 py-3 text-white/40 text-xs whitespace-nowrap">{new Date(act.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {activities.length === 0 && <p className="text-center py-10 text-white/20 font-body text-sm">No activity tracked yet.</p>}
              </div>
            </motion.div>
          )}

          {/* ── NEWSLETTER ── */}
          {activeTab === 'newsletter' && (
            <motion.div key="newsletter" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/10">
                  <h2 className="font-display text-xl uppercase text-white/80">Newsletter Subscribers ({subscribers.length})</h2>
                </div>
                <table className="w-full text-sm font-body">
                  <thead>
                    <tr className="border-b border-white/5 text-white/40 text-xs uppercase tracking-wider">
                      <th className="px-6 py-3 text-left">#</th>
                      <th className="px-6 py-3 text-left">Email</th>
                      <th className="px-6 py-3 text-left">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((sub, i) => (
                      <tr key={sub.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-6 py-3 text-white/30 text-xs">{i + 1}</td>
                        <td className="px-6 py-3 text-white/80 font-mono text-xs">{sub.email}</td>
                        <td className="px-6 py-3 text-white/40 text-xs">{new Date(sub.timestamp).toLocaleDateString('en-GB')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {subscribers.length === 0 && <p className="text-center py-10 text-white/20 text-sm font-body">No subscribers yet.</p>}
              </div>
            </motion.div>
          )}

          {/* ── CONTACTS ── */}
          {activeTab === 'contacts' && (
            <motion.div key="contacts" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="grid gap-4">
                {contacts.map(c => (
                  <div key={c.id} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-lime/20 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-body font-semibold text-white">{c.name}</p>
                        <p className="text-lime/70 text-xs font-mono">{c.email}</p>
                      </div>
                      <p className="text-white/30 text-xs font-body">{new Date(c.timestamp).toLocaleDateString('en-GB')}</p>
                    </div>
                    <p className="text-white/60 text-sm font-body leading-relaxed mt-2 border-t border-white/5 pt-3">{c.message}</p>
                  </div>
                ))}
                {contacts.length === 0 && (
                  <div className="text-center py-16 text-white/20 font-body">
                    <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
                    No messages yet.
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
