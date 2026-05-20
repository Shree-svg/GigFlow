import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui';

// Floating particle background
const Particles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {Array.from({ length: 20 }).map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 rounded-full bg-primary-container/40"
        style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
        animate={{
          y: [0, -30, 0], x: [0, Math.random() * 20 - 10, 0], opacity: [0.2, 0.6, 0.2],
        }}
        transition={{ duration: 4 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 4 }}
      />
    ))}
  </div>
);

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Sales User' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) await login(form.email, form.password);
      else await register(form.name, form.email, form.password, form.role);
      navigate('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full bg-transparent border-none text-on-surface font-hanken text-sm focus:ring-0 pl-10 pr-10 py-2.5';
  const wrapCls = 'relative flex items-center border border-outline-variant/50 rounded-lg bg-surface-container-low group-focus-within:border-primary-container group-focus-within:shadow-[0_0_12px_rgba(0,245,255,0.15)] transition-all';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden bg-grid-pattern">
      <Particles />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Glass card */}
        <div className="glass-panel rounded-xl overflow-hidden shadow-[0_0_60px_rgba(0,245,255,0.06)]">

          {/* Header */}
          <div className="p-6 border-b border-primary-container/10 text-center">
            <motion.div
              className="flex items-center justify-center gap-3 mb-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-10 h-10 rounded-xl bg-primary-container/10 border border-primary-container/30 flex items-center justify-center animate-glow">
                <span className="material-symbols-outlined text-primary-fixed">hub</span>
              </div>
              <h1 className="font-sora font-bold text-2xl text-primary-container tracking-tight">LeadStream</h1>
            </motion.div>
            <p className="font-mono text-[10px] tracking-widest text-on-surface-variant">INTELLIGENCE HUB ACCESS</p>
          </div>

          {/* Form area */}
          <form onSubmit={handleSubmit} className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* Name (register only) */}
                {!isLogin && (
                  <div className="relative group">
                    <label className="font-mono text-[10px] tracking-widest text-on-surface-variant block mb-2 uppercase">Full Name</label>
                    <div className={wrapCls}>
                      <span className="material-symbols-outlined text-on-surface-variant ml-3 text-sm absolute left-0">person</span>
                      <input type="text" value={form.name} onChange={set('name')} placeholder="Agent Name" className={inputCls} required />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div className="relative group">
                  <label className="font-mono text-[10px] tracking-widest text-on-surface-variant block mb-2 uppercase">Email Address</label>
                  <div className={wrapCls}>
                    <span className="material-symbols-outlined text-on-surface-variant absolute left-3 text-sm">mail</span>
                    <input type="email" value={form.email} onChange={set('email')} placeholder="agent@leadstream.ai" className={inputCls} required />
                  </div>
                </div>

                {/* Password */}
                <div className="relative group">
                  <label className="font-mono text-[10px] tracking-widest text-on-surface-variant block mb-2 uppercase">Security Key</label>
                  <div className={wrapCls}>
                    <span className="material-symbols-outlined text-on-surface-variant absolute left-3 text-sm">lock</span>
                    <input type={showPass ? 'text' : 'password'} value={form.password} onChange={set('password')} placeholder="••••••••" className={inputCls} required minLength={6} />
                    <button type="button" onClick={() => setShowPass((p) => !p)} className="absolute right-3 text-on-surface-variant hover:text-primary-container transition-colors">
                      <span className="material-symbols-outlined text-sm">{showPass ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>

                {/* Role (register) */}
                {!isLogin && (
                  <div>
                    <label className="font-mono text-[10px] tracking-widest text-on-surface-variant block mb-2 uppercase">Role</label>
                    <div className={`${wrapCls} relative`}>
                      <span className="material-symbols-outlined text-on-surface-variant absolute left-3 text-sm">badge</span>
                      <select value={form.role} onChange={set('role')} className="w-full bg-transparent border-none text-on-surface font-hanken text-sm focus:ring-0 pl-10 py-2.5 appearance-none">
                        <option value="Sales User" className="bg-surface-container">Sales User</option>
                        <option value="Admin" className="bg-surface-container">Admin</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-error-container/20 border border-error/30 text-error font-hanken text-sm"
                  >
                    <span className="material-symbols-outlined text-sm">error</span>
                    {error}
                  </motion.div>
                )}

                {/* Submit */}
                <Button variant="primary" loading={loading} className="w-full justify-center mt-2">
                  <span>{isLogin ? 'Initialize Session' : 'Create Account'}</span>
                  <span className="material-symbols-outlined text-sm">{isLogin ? 'arrow_forward' : 'how_to_reg'}</span>
                </Button>
              </motion.div>
            </AnimatePresence>
          </form>
          
          {/* Quick Demo Login */}
          {isLogin && (
            <div className="px-6 pb-6 pt-2 border-t border-primary-container/10">
              <p className="font-mono text-[9px] tracking-widest text-on-surface-variant block mb-3 text-center uppercase">DEMO OPERATIVES</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setForm({ name: '', email: 'admin@smartleads.com', password: 'Password123', role: 'Admin' });
                  }}
                  className="flex flex-col items-center justify-center p-2 rounded-lg bg-surface-container-low border border-outline-variant/30 hover:border-primary-fixed/50 hover:bg-primary-container/5 transition-all text-center group cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base text-primary-fixed group-hover:scale-110 transition-transform">admin_panel_settings</span>
                  <span className="font-sora text-[10px] font-bold text-on-surface mt-1 truncate w-full">Elena</span>
                  <span className="font-mono text-[8px] text-on-surface-variant">Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setForm({ name: '', email: 'sales@smartleads.com', password: 'Password123', role: 'Sales User' });
                  }}
                  className="flex flex-col items-center justify-center p-2 rounded-lg bg-surface-container-low border border-outline-variant/30 hover:border-primary-fixed/50 hover:bg-primary-container/5 transition-all text-center group cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base text-secondary-fixed group-hover:scale-110 transition-transform">support_agent</span>
                  <span className="font-sora text-[10px] font-bold text-on-surface mt-1 truncate w-full">Sarah</span>
                  <span className="font-mono text-[8px] text-on-surface-variant">Sales</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setForm({ name: '', email: 'marcus@smartleads.com', password: 'Password123', role: 'Sales User' });
                  }}
                  className="flex flex-col items-center justify-center p-2 rounded-lg bg-surface-container-low border border-outline-variant/30 hover:border-primary-fixed/50 hover:bg-primary-container/5 transition-all text-center group cursor-pointer"
                >
                  <span className="material-symbols-outlined text-base text-tertiary-fixed group-hover:scale-110 transition-transform">person</span>
                  <span className="font-sora text-[10px] font-bold text-on-surface mt-1 truncate w-full">Marcus</span>
                  <span className="font-mono text-[8px] text-on-surface-variant">Sales</span>
                </button>
              </div>
            </div>
          )}

          {/* Footer toggle */}
          <div className="px-6 py-4 bg-surface-container-low border-t border-primary-container/10 text-center">
            <p className="font-hanken text-sm text-on-surface-variant">
              {isLogin ? 'New operative?' : 'Already an operative?'}{' '}
              <button
                type="button"
                onClick={() => { setIsLogin((p) => !p); setError(''); }}
                className="font-mono text-xs text-primary-fixed hover:text-primary-container transition-colors hover:underline ml-1"
              >
                {isLogin ? 'REQUEST ACCESS' : 'SIGN IN'}
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
