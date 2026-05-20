import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export const Settings = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  return (
    <>
      <main className="flex-1 overflow-y-auto p-5 max-w-4xl w-full mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h2 className="font-sora font-semibold text-2xl text-on-surface">Settings & Profile</h2>
          <p className="font-hanken text-on-surface-variant mt-1 mb-8">Manage your account and workspace preferences.</p>

          <div className="bg-surface-container/40 backdrop-blur-xl border border-outline-variant/20 rounded-2xl p-8 shadow-lg mb-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/20 rounded-bl-full pointer-events-none" />
            <h3 className="font-sora font-bold text-lg text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-fixed">person</span>
              Profile Information
            </h3>
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono tracking-wider text-on-surface-variant mb-2">NAME</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono tracking-wider text-on-surface-variant mb-2">EMAIL</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono tracking-wider text-on-surface-variant mb-2">ROLE</label>
                <input 
                  type="text" 
                  value={user?.role?.toUpperCase() || ''}
                  disabled
                  className="w-full bg-surface-container/30 border border-outline-variant/10 rounded-xl px-4 py-3 text-on-surface-variant cursor-not-allowed opacity-70"
                />
              </div>
              <div className="flex items-center justify-end gap-4 pt-4 border-t border-outline-variant/10">
                {isSaved && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-primary-fixed text-sm font-hanken">Preferences saved successfully</motion.span>}
                <button type="submit" className="bg-primary-container text-on-primary px-6 py-2.5 rounded-xl font-mono text-xs tracking-wider shadow-md hover:bg-primary-fixed transition-colors">
                  SAVE CHANGES
                </button>
              </div>
            </form>
          </div>

          <div className="bg-surface-container/40 backdrop-blur-xl border border-outline-variant/20 rounded-2xl p-8 shadow-lg relative overflow-hidden">
            <h3 className="font-sora font-bold text-lg text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary-fixed">palette</span>
              Preferences
            </h3>
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container/50 border border-outline-variant/10">
              <div>
                <p className="font-hanken font-bold text-on-surface">Theme Mode</p>
                <p className="text-sm text-on-surface-variant mt-0.5">Toggle between light and dark UI themes.</p>
              </div>
              <button 
                onClick={toggleTheme}
                className="bg-surface-variant text-on-surface-variant px-5 py-2.5 rounded-xl font-mono text-xs tracking-wider shadow-sm hover:bg-surface-variant/80 transition-colors"
              >
                TOGGLE THEME
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </>
  );
};
