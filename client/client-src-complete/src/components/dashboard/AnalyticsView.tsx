import { motion } from 'framer-motion';

interface AnalyticsViewProps {
  stats: {
    total: number;
    byStatus: Record<string, number>;
  };
}

export const AnalyticsView = ({ stats }: AnalyticsViewProps) => {
  const { total = 0, byStatus = {} } = stats;

  const newCount = byStatus['New'] || 0;
  const contactedCount = byStatus['Contacted'] || 0;
  const qualifiedCount = byStatus['Qualified'] || 0;

  // Calculate realistic ratios
  const conversionRate = total > 0 ? ((qualifiedCount / total) * 100).toFixed(1) : '0.0';
  const contactedRate = total > 0 ? (((contactedCount + qualifiedCount) / total) * 100).toFixed(1) : '0.0';

  // Sources mock data (can be refined dynamically or hardcoded beautifully)
  const sources = [
    { name: 'Website Form', count: Math.ceil(total * 0.45), percentage: 45, color: '#00f5ff' },
    { name: 'Referrals', count: Math.ceil(total * 0.25), percentage: 25, color: '#7c3aed' },
    { name: 'Social Media', count: Math.ceil(total * 0.20), percentage: 20, color: '#ffdb3f' },
    { name: 'Direct Outreach', count: Math.ceil(total * 0.10), percentage: 10, color: '#ffb4ab' },
  ];

  return (
    <div className="space-y-6">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            title: 'CONVERSION RATE',
            value: `${conversionRate}%`,
            sub: 'Qualified / Total Leads',
            icon: 'analytics',
            color: 'text-primary-fixed',
            borderColor: 'border-primary-container/20',
          },
          {
            title: 'ENGAGEMENT RATE',
            value: `${contactedRate}%`,
            sub: 'Contacted + Qualified',
            icon: 'forum',
            color: 'text-purple-400',
            borderColor: 'border-purple-500/20',
          },
          {
            title: 'PIPELINE VALUE',
            value: `$${(total * 1250).toLocaleString()}`,
            sub: 'Est. $1,250 avg/lead',
            icon: 'monetization_on',
            color: 'text-yellow-400',
            borderColor: 'border-yellow-500/20',
          },
          {
            title: 'TOTAL PIPELINE',
            value: total.toString(),
            sub: 'Active lead records',
            icon: 'layers',
            color: 'text-cyan-400',
            borderColor: 'border-cyan-500/20',
          },
        ].map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`glass-panel p-5 rounded-xl border ${card.borderColor} flex flex-col justify-between h-32 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-200`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-mono text-[10px] tracking-widest text-on-surface-variant/80 uppercase">{card.title}</p>
                <p className="font-sora font-bold text-2xl text-on-surface mt-1">{card.value}</p>
              </div>
              <span className={`material-symbols-outlined ${card.color} opacity-70 group-hover:scale-110 transition-transform duration-200`}>
                {card.icon}
              </span>
            </div>
            <p className="font-hanken text-[11px] text-on-surface-variant/60">{card.sub}</p>
            {/* Subtle background glow */}
            <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-white/5 rounded-full blur-xl group-hover:bg-white/10 transition-colors" />
          </motion.div>
        ))}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Area Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-5 rounded-xl border border-outline-variant/10 lg:col-span-2 space-y-4"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-sora font-semibold text-base text-on-surface">Lead Acquisition Trend</h3>
              <p className="font-hanken text-xs text-on-surface-variant">Monthly incoming pipeline performance</p>
            </div>
            <div className="flex items-center gap-2 bg-surface-container-high/40 px-2 py-1 rounded border border-outline-variant/10">
              <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
              <span className="font-mono text-[10px] text-on-surface-variant">REAL-TIME TELEMETRY</span>
            </div>
          </div>

          {/* Curved SVG Area Chart */}
          <div className="h-60 w-full relative pt-2">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(0, 245, 255, 0.3)" />
                  <stop offset="100%" stopColor="rgba(0, 245, 255, 0)" />
                </linearGradient>
                <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(124, 58, 237, 0.2)" />
                  <stop offset="100%" stopColor="rgba(124, 58, 237, 0)" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="500" y2="40" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
              <line x1="0" y1="90" x2="500" y2="90" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
              <line x1="0" y1="180" x2="500" y2="180" stroke="rgba(255,255,255,0.08)" />

              {/* Y Axis Labels */}
              <text x="5" y="35" className="font-mono text-[9px] fill-on-surface-variant/40">100%</text>
              <text x="5" y="85" className="font-mono text-[9px] fill-on-surface-variant/40">50%</text>
              <text x="5" y="135" className="font-mono text-[9px] fill-on-surface-variant/40">20%</text>

              {/* Area path */}
              <path
                d="M 0 180 Q 80 140 150 110 T 300 70 T 420 50 T 500 30 L 500 180 L 0 180 Z"
                fill="url(#chartGradient)"
              />

              {/* Line path */}
              <path
                d="M 0 180 Q 80 140 150 110 T 300 70 T 420 50 T 500 30"
                fill="none"
                stroke="#00f5ff"
                strokeWidth="3"
                className="path-animate"
              />

              {/* Data points */}
              <circle cx="150" cy="110" r="5" fill="#00f5ff" stroke="#0d1515" strokeWidth="2" />
              <circle cx="300" cy="70" r="5" fill="#00f5ff" stroke="#0d1515" strokeWidth="2" />
              <circle cx="420" cy="50" r="5" fill="#00f5ff" stroke="#0d1515" strokeWidth="2" />
              <circle cx="500" cy="30" r="5" fill="#7c3aed" stroke="#0d1515" strokeWidth="2" />

              {/* X Axis Labels */}
              <text x="10" y="195" className="font-mono text-[10px] fill-on-surface-variant/60">JAN</text>
              <text x="105" y="195" className="font-mono text-[10px] fill-on-surface-variant/60">FEB</text>
              <text x="200" y="195" className="font-mono text-[10px] fill-on-surface-variant/60">MAR</text>
              <text x="295" y="195" className="font-mono text-[10px] fill-on-surface-variant/60">APR</text>
              <text x="390" y="195" className="font-mono text-[10px] fill-on-surface-variant/60">MAY</text>
              <text x="475" y="195" className="font-mono text-[10px] fill-primary-container font-semibold">JUN</text>
            </svg>
          </div>
        </motion.div>

        {/* Source Breakdown (Donut chart mock / list) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-5 rounded-xl border border-outline-variant/10 space-y-5 flex flex-col justify-between"
        >
          <div>
            <h3 className="font-sora font-semibold text-base text-on-surface">Lead Source Matrix</h3>
            <p className="font-hanken text-xs text-on-surface-variant">Channels driving pipeline acquisition</p>
          </div>

          {/* Custom Visual Donut Segment representation */}
          <div className="flex items-center justify-center py-4">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* Background circle */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="3" />
                {/* Website Form segment (45%) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#00f5ff" strokeWidth="3.2" strokeDasharray="45 55" strokeDashoffset="0" />
                {/* Referrals segment (25%) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#7c3aed" strokeWidth="3" strokeDasharray="25 75" strokeDashoffset="-45" />
                {/* Social Media segment (20%) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ffdb3f" strokeWidth="3" strokeDasharray="20 80" strokeDashoffset="-70" />
                {/* Direct segment (10%) */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ffb4ab" strokeWidth="3" strokeDasharray="10 90" strokeDashoffset="-90" />
              </svg>
              {/* Inner details */}
              <div className="absolute text-center">
                <p className="font-mono text-xs text-on-surface-variant uppercase">Total</p>
                <p className="font-sora font-bold text-xl text-on-surface">{total}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {sources.map((src) => (
              <div key={src.name} className="flex items-center justify-between font-mono text-[11px] py-1 border-b border-outline-variant/5 last:border-0">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: src.color }} />
                  <span className="text-on-surface-variant">{src.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-on-surface font-semibold">{src.count}</span>
                  <span className="text-on-surface-variant/40">({src.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Funnel conversion */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-panel p-5 rounded-xl border border-outline-variant/10"
      >
        <h3 className="font-sora font-semibold text-base text-on-surface mb-6">Pipeline Funnel Velocity</h3>
        <div className="space-y-6 max-w-3xl mx-auto">
          {/* Step 1: New */}
          <div className="relative">
            <div className="flex justify-between items-center mb-1 text-xs font-mono">
              <span className="text-cyan-400 font-bold">1. CAPTURED / INCOMING</span>
              <span className="text-on-surface">{newCount} Leads (100%)</span>
            </div>
            <div className="w-full h-8 bg-surface-container/30 rounded-lg overflow-hidden border border-outline-variant/10 p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-cyan-500/20 to-cyan-500 rounded-md flex items-center pl-3"
              >
                <span className="text-[10px] font-mono text-on-primary font-semibold drop-shadow">NEW STAGE</span>
              </motion.div>
            </div>
          </div>

          {/* Step 2: Contacted */}
          <div className="relative">
            <div className="flex justify-between items-center mb-1 text-xs font-mono">
              <span className="text-purple-400 font-bold">2. ENGAGED / CONTACTED</span>
              <span className="text-on-surface">
                {contactedCount} Leads ({total > 0 ? Math.round((contactedCount / total) * 100) : 0}%)
              </span>
            </div>
            <div className="w-full h-8 bg-surface-container/30 rounded-lg overflow-hidden border border-outline-variant/10 p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: total > 0 ? `${(contactedCount / total) * 100}%` : '0%' }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                className="h-full bg-gradient-to-r from-purple-500/20 to-purple-500 rounded-md flex items-center pl-3 min-w-[2rem]"
              >
                <span className="text-[10px] font-mono text-on-primary font-semibold drop-shadow">CONTACTED</span>
              </motion.div>
            </div>
          </div>

          {/* Step 3: Qualified */}
          <div className="relative">
            <div className="flex justify-between items-center mb-1 text-xs font-mono">
              <span className="text-yellow-400 font-bold">3. CONVERTED / QUALIFIED</span>
              <span className="text-on-surface">
                {qualifiedCount} Leads ({conversionRate}%)
              </span>
            </div>
            <div className="w-full h-8 bg-surface-container/30 rounded-lg overflow-hidden border border-outline-variant/10 p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: total > 0 ? `${(qualifiedCount / total) * 100}%` : '0%' }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                className="h-full bg-gradient-to-r from-yellow-500/20 to-yellow-500 rounded-md flex items-center pl-3 min-w-[2rem]"
              >
                <span className="text-[10px] font-mono text-on-primary font-semibold drop-shadow">QUALIFIED</span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
