import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks';

export const SettingsView = () => {
  const { user, isAdmin } = useAuth();
  const { isDark, toggle: toggleTheme } = useTheme();

  // Local settings states
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [apiKey, setApiKey] = useState('sl_live_f0391ab2d8c3620921fe7c390291e0a2');
  const [apiCopied, setApiCopied] = useState(false);

  // Preference switches
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [assignmentAlerts, setAssignmentAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  // Success banners
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [securitySuccess, setSecuritySuccess] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleSecuritySave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || newPassword !== confirmPassword) return;
    setSecuritySuccess(true);
    setPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setSecuritySuccess(false), 3000);
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setApiCopied(true);
    setTimeout(() => setApiCopied(false), 2000);
  };

  const regenerateApiKey = () => {
    const chars = 'abcdef0123456789';
    let newKey = 'sl_live_';
    for (let i = 0; i < 32; i++) {
      newKey += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setApiKey(newKey);
  };

  return (
    <div className="space-y-6 max-w-4xl font-hanken">
      {/* Grid containing Profile & Security settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-5 rounded-xl border border-outline-variant/10 space-y-4"
        >
          <div className="border-b border-outline-variant/10 pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-sora font-semibold text-base text-on-surface">User Profile</h3>
              <p className="font-hanken text-xs text-on-surface-variant">Update your identity and account contact details</p>
            </div>
            <span className="material-symbols-outlined text-primary-fixed opacity-70">account_circle</span>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-mono text-on-surface-variant">FULL NAME</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface-container-high/40 border border-outline-variant/20 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary-container"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-mono text-on-surface-variant">EMAIL ADDRESS</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-high/40 border border-outline-variant/20 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary-container"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-mono text-on-surface-variant">ROLE</label>
                <div className="w-full bg-surface-container/60 border border-outline-variant/10 rounded-lg px-3 py-2 text-sm text-on-surface-variant/80 font-mono select-none uppercase">
                  {user?.role}
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-mono text-on-surface-variant">TENANT ID</label>
                <div className="w-full bg-surface-container/60 border border-outline-variant/10 rounded-lg px-3 py-2 text-sm text-on-surface-variant/80 font-mono select-none">
                  t_009f48a12
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <p className={`font-mono text-[10px] text-primary-container transition-opacity duration-300 ${profileSuccess ? 'opacity-100' : 'opacity-0'}`}>
                ✓ PROFILE SAVED SECURELY
              </p>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-primary-container text-on-primary font-mono text-xs tracking-wider transition-all hover:scale-105 active:scale-95 animate-glow"
              >
                SAVE PROFILE
              </button>
            </div>
          </form>
        </motion.div>

        {/* Account Security */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel p-5 rounded-xl border border-outline-variant/10 space-y-4"
        >
          <div className="border-b border-outline-variant/10 pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-sora font-semibold text-base text-on-surface">Security & Credentials</h3>
              <p className="font-hanken text-xs text-on-surface-variant">Modify your login key and update password security</p>
            </div>
            <span className="material-symbols-outlined text-primary-fixed opacity-70">shield</span>
          </div>

          <form onSubmit={handleSecuritySave} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-mono text-on-surface-variant">CURRENT PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-surface-container-high/40 border border-outline-variant/20 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary-container"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-mono text-on-surface-variant">NEW PASSWORD</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full bg-surface-container-high/40 border border-outline-variant/20 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary-container"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-mono text-on-surface-variant">CONFIRM PASSWORD</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full bg-surface-container-high/40 border border-outline-variant/20 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary-container"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <p className={`font-mono text-[10px] text-primary-container transition-opacity duration-300 ${securitySuccess ? 'opacity-100' : 'opacity-0'}`}>
                ✓ PASSWORD UPDATED
              </p>
              <button
                type="submit"
                disabled={!password || newPassword !== confirmPassword}
                className="px-4 py-2 rounded-lg bg-primary-container text-on-primary font-mono text-xs tracking-wider transition-all disabled:opacity-50 disabled:scale-100 hover:scale-105 active:scale-95"
              >
                UPDATE KEY
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Preferences & Aesthetics */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel p-5 rounded-xl border border-outline-variant/10 space-y-5"
      >
        <div className="border-b border-outline-variant/10 pb-3 flex justify-between items-center">
          <div>
            <h3 className="font-sora font-semibold text-base text-on-surface">Application Settings</h3>
            <p className="font-hanken text-xs text-on-surface-variant">Adjust visual preferences and toggle system alert parameters</p>
          </div>
          <span className="material-symbols-outlined text-primary-fixed opacity-70">settings_suggest</span>
        </div>

        <div className="space-y-4">
          {/* Theme Settings Row */}
          <div className="flex items-center justify-between py-2 border-b border-outline-variant/5">
            <div>
              <p className="text-sm font-semibold text-on-surface">Visual Atmosphere Theme</p>
              <p className="text-xs text-on-surface-variant">Toggle between high-contrast Lumina Dark and Emerald Light modes</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 relative ${isDark ? 'bg-primary-container' : 'bg-surface-variant'}`}
            >
              <motion.div
                layout
                className="w-5 h-5 rounded-full bg-on-primary flex items-center justify-center shadow"
                animate={{ x: isDark ? 28 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <span className="material-symbols-outlined text-[12px] text-on-surface-variant font-bold">
                  {isDark ? 'dark_mode' : 'light_mode'}
                </span>
              </motion.div>
            </button>
          </div>

          {/* Email Alert Toggle */}
          <div className="flex items-center justify-between py-2 border-b border-outline-variant/5">
            <div>
              <p className="text-sm font-semibold text-on-surface">New Lead Notifications</p>
              <p className="text-xs text-on-surface-variant">Receive automated email updates when fresh leads enter the pipeline</p>
            </div>
            <button
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 relative ${emailNotifications ? 'bg-primary-container' : 'bg-surface-variant'}`}
            >
              <motion.div
                layout
                className="w-5 h-5 rounded-full bg-on-primary shadow"
                animate={{ x: emailNotifications ? 28 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          {/* Assignment Toggle */}
          <div className="flex items-center justify-between py-2 border-b border-outline-variant/5">
            <div>
              <p className="text-sm font-semibold text-on-surface">Ownership Assignments</p>
              <p className="text-xs text-on-surface-variant">Alert immediately if a lead is re-routed or assigned to your registry</p>
            </div>
            <button
              onClick={() => setAssignmentAlerts(!assignmentAlerts)}
              className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 relative ${assignmentAlerts ? 'bg-primary-container' : 'bg-surface-variant'}`}
            >
              <motion.div
                layout
                className="w-5 h-5 rounded-full bg-on-primary shadow"
                animate={{ x: assignmentAlerts ? 28 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          {/* Weekly digest */}
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-semibold text-on-surface">Weekly Analytics Digest</p>
              <p className="text-xs text-on-surface-variant">Receive a comprehensive PDF report summarizing campaign and lead conversion trends every Monday</p>
            </div>
            <button
              onClick={() => setWeeklyDigest(!weeklyDigest)}
              className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 relative ${weeklyDigest ? 'bg-primary-container' : 'bg-surface-variant'}`}
            >
              <motion.div
                layout
                className="w-5 h-5 rounded-full bg-on-primary shadow"
                animate={{ x: weeklyDigest ? 28 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
        </div>
      </motion.div>

      {/* API Integrations — Admin Only */}
      {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-5 rounded-xl border border-outline-variant/10 space-y-4"
        >
          <div className="border-b border-outline-variant/10 pb-3 flex justify-between items-center">
            <div>
              <h3 className="font-sora font-semibold text-base text-on-surface">Developer REST Integrations</h3>
              <p className="font-hanken text-xs text-on-surface-variant">Inject external leads into LeadStream automatically using Webhook API tokens</p>
            </div>
            <span className="material-symbols-outlined text-primary-fixed opacity-70">terminal</span>
          </div>

          <div className="space-y-3 font-mono">
            <div className="space-y-1">
              <label className="block text-[10px] text-on-surface-variant/80 uppercase">Webhook Endpoint</label>
              <div className="w-full bg-surface-container/60 border border-outline-variant/10 rounded-lg px-3 py-2.5 text-xs text-on-surface-variant select-all">
                https://api.smartleads.com/v1/leads/webhook
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] text-on-surface-variant/80 uppercase">API Secret Token (Bearer)</label>
              <div className="flex gap-2">
                <div className="flex-1 w-full bg-surface-container/60 border border-outline-variant/10 rounded-lg px-3 py-2.5 text-xs text-primary-fixed truncate tracking-wider">
                  {apiKey}
                </div>
                <button
                  onClick={copyApiKey}
                  className="px-3 rounded-lg bg-surface-container-high border border-outline-variant/20 hover:bg-surface-variant/40 text-on-surface text-xs tracking-wider transition-colors min-w-[70px]"
                >
                  {apiCopied ? 'COPIED!' : 'COPY'}
                </button>
                <button
                  onClick={regenerateApiKey}
                  title="Regenerate Token"
                  className="p-2.5 rounded-lg bg-surface-container-high border border-outline-variant/20 hover:bg-surface-variant/40 text-on-surface transition-colors flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
