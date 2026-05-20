import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStats } from '../hooks';
import { leadsService } from '../services/leads.service';

export const Analytics = () => {
  const { stats, isLoading } = useStats();

  // State for chart interactivities
  const [activeTrendIndex, setActiveTrendIndex] = useState<number | null>(null);
  const [activeSourceIndex, setActiveSourceIndex] = useState<number | null>(null);
  const [hoveredFunnelIndex, setHoveredFunnelIndex] = useState<number | null>(null);

  // Export CSV handler
  const handleExport = async () => {
    try {
      await leadsService.exportCSV({});
    } catch (err) {
      console.error('Failed to export leads data:', err);
    }
  };

  // ─── 1. Fallback & Formatting Data ─────────────────────────────────────────
  const leadData = useMemo(() => {
    if (!stats) return null;

    const total = stats.total || 0;
    const byStatus = stats.byStatus || { New: 0, Contacted: 0, Qualified: 0, Lost: 0 };
    const bySource = stats.bySource || { Website: 0, Instagram: 0, Referral: 0 };
    const monthlyTrend = stats.monthlyTrend || [];

    // Map source keys
    const sources = [
      { name: 'Website', count: bySource.Website || 0, color: '#63f7ff', lightColor: '#0284c7', icon: 'language' },
      { name: 'Instagram', count: bySource.Instagram || 0, color: '#d2bbff', lightColor: '#7c3aed', icon: 'photo_camera' },
      { name: 'Referral', count: bySource.Referral || 0, color: '#ffe16c', lightColor: '#d97706', icon: 'handshake' },
    ];
    const totalSourceCount = sources.reduce((acc, s) => acc + s.count, 0) || 1;

    // Map status keys
    const funnelStages = [
      { name: 'New Leads', count: byStatus.New || 0, color: 'from-[#63f7ff] to-[#00dce5]', lightColor: 'from-sky-500 to-sky-600', badgeClass: 'badge-new', description: 'Fresh, untouched leads generated' },
      { name: 'Contacted', count: byStatus.Contacted || 0, color: 'from-[#d2bbff] to-[#c9aeff]', lightColor: 'from-violet-500 to-violet-600', badgeClass: 'badge-contacted', description: 'Initial outreach established' },
      { name: 'Qualified', count: byStatus.Qualified || 0, color: 'from-[#ffe16c] to-[#e7c427]', lightColor: 'from-amber-500 to-amber-600', badgeClass: 'badge-qualified', description: 'Identified as highly potential deals' },
      { name: 'Lost Leads', count: byStatus.Lost || 0, color: 'from-[#ffb4ab] to-[#93000a]', lightColor: 'from-rose-500 to-rose-600', badgeClass: 'badge-lost', description: 'Disengaged or archived leads' },
    ];

    // Compute monthly trend MoM growths
    const trendWithMoM = monthlyTrend.map((t, idx) => {
      const prevCount = idx > 0 ? monthlyTrend[idx - 1].count : 0;
      let growth = '';
      if (idx > 0) {
        if (prevCount === 0) {
          growth = t.count > 0 ? '▲ 100%' : '0%';
        } else {
          const diff = ((t.count - prevCount) / prevCount) * 100;
          growth = diff >= 0 ? `▲ ${Math.round(diff)}%` : `▼ ${Math.round(Math.abs(diff))}%`;
        }
      }
      return { ...t, growth };
    });

    // Compute Insights
    const maxSource = [...sources].sort((a, b) => b.count - a.count)[0];
    const maxMonth = [...monthlyTrend].sort((a, b) => b.count - a.count)[0];
    const qualifiedLeads = byStatus.Qualified || 0;
    const conversionRate = total ? Math.round((qualifiedLeads / total) * 100) : 0;

    let suggestion = 'Pipeline velocity is strong. Maintain active outbound engagement on highest converting channels.';
    if (conversionRate < 15) {
      suggestion = 'Conversion rate is slightly low. Optimize lead qualification processes and follow up within 24 hours.';
    } else if ((byStatus.Lost || 0) > total * 0.25) {
      suggestion = 'Leakage detected: Lost rate is over 25%. Schedule a sync to review common friction points.';
    } else if ((bySource.Referral || 0) < total * 0.15) {
      suggestion = 'Referrals are underrepresented. Implement a client referral reward loop to tap into organic growth.';
    }

    return {
      total,
      byStatus,
      sources,
      totalSourceCount,
      funnelStages,
      trendWithMoM,
      maxSource,
      maxMonth,
      conversionRate,
      suggestion,
    };
  }, [stats]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          className="w-12 h-12 border-4 border-t-primary-fixed border-r-transparent border-b-primary-fixed border-l-transparent rounded-full shadow-[0_0_15px_rgba(99,247,255,0.4)] mb-4"
        />
        <p className="font-mono text-xs tracking-widest text-on-surface-variant animate-pulse">
          SYNCHRONIZING ANALYTICS CORE...
        </p>
      </div>
    );
  }

  if (!stats || !leadData) {
    return (
      <div className="p-8 max-w-7xl mx-auto text-center">
        <span className="material-symbols-outlined text-error text-5xl mb-3">warning</span>
        <h3 className="font-sora font-semibold text-lg text-on-surface">No Stats Available</h3>
        <p className="font-hanken text-on-surface-variant mt-1">Please seed the database or check your connection.</p>
      </div>
    );
  }

  // ─── 2. Trend Area Chart Calculations ──────────────────────────────────────
  const trendData = leadData.trendWithMoM;
  const maxTrendVal = Math.max(...trendData.map((d) => d.count), 1);
  const svgW = 500;
  const svgH = 220;
  const padX = 40;
  const padY = 30;
  const chartW = svgW - 2 * padX;
  const chartH = svgH - 2 * padY;

  const trendPoints = trendData.map((d, i) => {
    const x = padX + (i / Math.max(trendData.length - 1, 1)) * chartW;
    const y = padY + chartH - (d.count / maxTrendVal) * chartH;
    return { x, y };
  });

  // Calculate smooth cubic bezier path for Area Chart
  let trendPathStr = '';
  let trendAreaStr = '';
  if (trendPoints.length > 0) {
    trendPathStr = `M ${trendPoints[0].x} ${trendPoints[0].y}`;
    for (let i = 1; i < trendPoints.length; i++) {
      const prev = trendPoints[i - 1];
      const curr = trendPoints[i];
      const cp1x = prev.x + chartW / (2 * (trendData.length - 1));
      const cp1y = prev.y;
      const cp2x = curr.x - chartW / (2 * (trendData.length - 1));
      const cp2y = curr.y;
      trendPathStr += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }
    trendAreaStr = `${trendPathStr} L ${trendPoints[trendPoints.length - 1].x} ${padY + chartH} L ${trendPoints[0].x} ${padY + chartH} Z`;
  }

  // ─── 3. Donut Chart Calculations ──────────────────────────────────────────
  const donutR = 55;
  const donutCircumference = 2 * Math.PI * donutR; // ~345.57
  let cumulativeDonutPercent = 0;

  return (
    <main className="p-5 max-w-7xl w-full mx-auto pb-16">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h2 className="font-sora font-semibold text-2xl text-stone-900 dark:text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-sky-500 dark:text-primary-fixed">analytics</span>
              Analytics Terminal
            </h2>
            <p className="font-hanken text-stone-500 dark:text-on-surface-variant mt-1 text-sm">
              Real-time sales velocity, lead pipeline metrics, and channel acquisition insights.
            </p>
          </div>
          <div className="mt-4 md:mt-0 bg-stone-100 dark:bg-surface-container-low px-4 py-2 rounded-xl border border-stone-200 dark:border-outline-variant/20 flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="font-mono text-xs font-semibold tracking-wider text-stone-600 dark:text-primary-fixed">
              LIVE DATA STREAM ACTIVE
            </span>
          </div>
        </div>

        {/* ─── Top Stats Grid ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { 
              label: 'TOTAL LEAD VOLUME', 
              value: leadData.total, 
              color: 'text-sky-600 dark:text-primary-fixed', 
              icon: 'monitoring',
              desc: 'Cumulative lead accounts registered'
            },
            { 
              label: 'QUALIFIED CONVERSIONS', 
              value: leadData.byStatus?.Qualified || 0, 
              color: 'text-amber-600 dark:text-tertiary-fixed', 
              icon: 'emoji_events',
              desc: 'High-intent leads qualified for sales'
            },
            { 
              label: 'PIPELINE CONVERSION', 
              value: `${leadData.conversionRate}%`, 
              color: 'text-violet-600 dark:text-secondary-fixed', 
              icon: 'percent',
              desc: 'Ratio of total leads qualified'
            },
          ].map((stat, i) => (
            <motion.div 
              whileHover={{ y: -4, scale: 1.01 }}
              key={i} 
              className="bg-white dark:bg-surface-container/40 backdrop-blur-xl border border-stone-200 dark:border-outline-variant/20 rounded-2xl p-6 flex flex-col justify-between shadow-sm dark:shadow-lg relative overflow-hidden group"
            >
              <div className="absolute -right-4 -top-4 opacity-5 dark:opacity-[0.03] group-hover:opacity-10 dark:group-hover:opacity-5 transition-opacity duration-300 pointer-events-none">
                <span className="material-symbols-outlined text-9xl">{stat.icon}</span>
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-widest text-stone-400 dark:text-on-surface-variant font-bold mb-1">
                  {stat.label}
                </p>
                <h3 className={`font-sora font-black text-4xl md:text-5xl ${stat.color} leading-none tracking-tight`}>
                  {stat.value}
                </h3>
              </div>
              <p className="font-hanken text-xs text-stone-500 dark:text-on-surface-variant mt-4 flex items-center gap-1.5 border-t border-stone-100 dark:border-outline-variant/10 pt-3">
                <span className="material-symbols-outlined text-sm opacity-60">info</span>
                {stat.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ─── Main Charts Grid ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8">
          
          {/* Card 1: Lead Trend Area Chart (3/5 Columns) */}
          <div className="lg:col-span-3 bg-white dark:bg-surface-container/40 backdrop-blur-xl border border-stone-200 dark:border-outline-variant/20 rounded-2xl p-6 shadow-sm dark:shadow-lg flex flex-col justify-between h-[380px] relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-sora font-semibold text-base text-stone-900 dark:text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-sky-500 dark:text-primary-fixed">show_chart</span>
                  Lead Acquisition Velocity
                </h3>
                <span className="font-mono text-[10px] bg-sky-50 dark:bg-primary-fixed/10 text-sky-600 dark:text-primary-fixed px-2 py-0.5 rounded-full border border-sky-100 dark:border-primary-fixed/20">
                  Timeline Trend
                </span>
              </div>
              <p className="font-hanken text-xs text-stone-500 dark:text-on-surface-variant mb-4">
                Monthly lead creation volume across the past 6 months.
              </p>
            </div>

            {/* Custom Responsive SVG Area Chart */}
            <div className="relative flex-grow h-48 w-full mt-2">
              <svg className="w-full h-full" viewBox={`0 0 ${svgW} ${svgH}`} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#00f5ff" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#63f7ff" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ffe16c" />
                  </linearGradient>
                  
                  {/* Light Mode Gradients */}
                  <linearGradient id="areaGradLight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Gridlines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                  const y = padY + chartH * ratio;
                  return (
                    <line
                      key={i}
                      x1={padX}
                      y1={y}
                      x2={padX + chartW}
                      y2={y}
                      stroke="currentColor"
                      className="text-stone-100 dark:text-outline-variant/10"
                      strokeDasharray="4 4"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Area under the line */}
                {trendAreaStr && (
                  <path
                    d={trendAreaStr}
                    fill="url(#areaGradLight)"
                    className="block dark:hidden"
                  />
                )}
                {trendAreaStr && (
                  <path
                    d={trendAreaStr}
                    fill="url(#areaGrad)"
                    className="hidden dark:block"
                  />
                )}

                {/* Line Path */}
                {trendPathStr && (
                  <path
                    d={trendPathStr}
                    fill="none"
                    stroke="url(#lineGrad)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Vertical Dotted Guide Line on Hover */}
                {activeTrendIndex !== null && (
                  <line
                    x1={trendPoints[activeTrendIndex].x}
                    y1={padY}
                    x2={trendPoints[activeTrendIndex].x}
                    y2={padY + chartH}
                    stroke="currentColor"
                    className="text-stone-300 dark:text-[#63f7ff] opacity-60"
                    strokeDasharray="3 3"
                    strokeWidth="1.5"
                  />
                )}

                {/* Axis Labels */}
                {trendData.map((d, i) => {
                  const x = padX + (i / Math.max(trendData.length - 1, 1)) * chartW;
                  const labelParts = d.label.split(' ');
                  const monthName = labelParts[0];
                  return (
                    <text
                      key={i}
                      x={x}
                      y={svgH - 8}
                      textAnchor="middle"
                      className="font-mono text-[9px] font-semibold fill-stone-400 dark:fill-on-surface-variant"
                    >
                      {monthName}
                    </text>
                  );
                })}

                {/* Y Axis Max Label */}
                <text
                  x={padX - 8}
                  y={padY + 4}
                  textAnchor="end"
                  className="font-mono text-[9px] fill-stone-400 dark:fill-on-surface-variant font-bold"
                >
                  {maxTrendVal}
                </text>
                <text
                  x={padX - 8}
                  y={padY + chartH + 4}
                  textAnchor="end"
                  className="font-mono text-[9px] fill-stone-400 dark:fill-on-surface-variant"
                >
                  0
                </text>

                {/* Glowing Active Points and Hover Triggers */}
                {trendPoints.map((p, i) => {
                  const isActive = activeTrendIndex === i;
                  return (
                    <g key={i}>
                      {/* Interactive Hover Area (Invisible rects) */}
                      <rect
                        x={p.x - chartW / (2 * Math.max(trendData.length - 1, 1))}
                        y={padY}
                        width={chartW / Math.max(trendData.length - 1, 1)}
                        height={chartH}
                        fill="transparent"
                        className="cursor-pointer"
                        onMouseEnter={() => setActiveTrendIndex(i)}
                        onMouseLeave={() => setActiveTrendIndex(null)}
                      />

                      {/* Spark Circle */}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={isActive ? 6 : 4}
                        fill={isActive ? '#ffffff' : '#0d1515'}
                        stroke={isActive ? '#63f7ff' : 'url(#lineGrad)'}
                        strokeWidth={isActive ? 3 : 2}
                        className="transition-all duration-200 pointer-events-none"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Floating Dynamic Tooltip inside card container */}
              <AnimatePresence>
                {activeTrendIndex !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute bg-white dark:bg-stone-900 border border-stone-200 dark:border-outline-variant/30 rounded-xl p-3 shadow-lg pointer-events-none z-10 w-44"
                    style={{
                      left: `${Math.min(
                        Math.max((trendPoints[activeTrendIndex].x / svgW) * 100 - 22, 2),
                        68
                      )}%`,
                      top: `${Math.max((trendPoints[activeTrendIndex].y / svgH) * 100 - 32, -5)}%`,
                    }}
                  >
                    <p className="font-mono text-[9px] text-stone-400 dark:text-on-surface-variant font-bold leading-none uppercase">
                      {trendData[activeTrendIndex].label}
                    </p>
                    <p className="font-sora text-xl font-bold text-stone-900 dark:text-on-surface leading-snug mt-1">
                      {trendData[activeTrendIndex].count}{' '}
                      <span className="text-xs font-normal text-stone-500 dark:text-on-surface-variant">leads</span>
                    </p>
                    {trendData[activeTrendIndex].growth && (
                      <p className={`font-mono text-[10px] font-semibold mt-1 flex items-center gap-1 ${
                        trendData[activeTrendIndex].growth.includes('▲') 
                          ? 'text-emerald-600 dark:text-emerald-400' 
                          : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {trendData[activeTrendIndex].growth} vs last month
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Card 2: Lead Acquisition Sources (2/5 Columns) */}
          <div className="lg:col-span-2 bg-white dark:bg-surface-container/40 backdrop-blur-xl border border-stone-200 dark:border-outline-variant/20 rounded-2xl p-6 shadow-sm dark:shadow-lg flex flex-col justify-between h-[380px]">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-sora font-semibold text-base text-stone-900 dark:text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-sky-500 dark:text-primary-fixed">pie_chart</span>
                  Acquisition Sources
                </h3>
                <span className="font-mono text-[10px] bg-amber-50 dark:bg-tertiary-fixed/10 text-amber-600 dark:text-tertiary-fixed px-2 py-0.5 rounded-full border border-amber-100 dark:border-tertiary-fixed/20">
                  Lead Channels
                </span>
              </div>
              <p className="font-hanken text-xs text-stone-500 dark:text-on-surface-variant mb-4">
                Acquisition performance across channels.
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 flex-grow my-2">
              {/* Dynamic SVG Donut Chart */}
              <div className="relative w-36 h-36 flex-shrink-0">
                <svg className="w-full h-full" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r={donutR}
                    fill="transparent"
                    stroke="currentColor"
                    className="text-stone-100 dark:text-outline-variant/10"
                    strokeWidth="9"
                  />
                  {leadData.sources.map((s, idx) => {
                    const percent = s.count / leadData.totalSourceCount;
                    const strokeLen = percent * donutCircumference;
                    const strokeOffset = -cumulativeDonutPercent * donutCircumference;
                    cumulativeDonutPercent += percent;

                    const isHovered = activeSourceIndex === idx;

                    return (
                      <circle
                        key={idx}
                        cx="60"
                        cy="60"
                        r={donutR}
                        fill="transparent"
                        stroke={s.color}
                        className="transition-all duration-300 ease-out cursor-pointer dark:block hidden"
                        strokeWidth={isHovered ? '13' : '9'}
                        strokeDasharray={`${strokeLen} ${donutCircumference - strokeLen}`}
                        strokeDashoffset={strokeOffset}
                        transform="rotate(-90 60 60)"
                        style={{ transformOrigin: 'center' }}
                        onMouseEnter={() => setActiveSourceIndex(idx)}
                        onMouseLeave={() => setActiveSourceIndex(null)}
                      />
                    );
                  })}
                  {/* Light Mode circles */}
                  {(() => {
                    let cumulativeLight = 0;
                    return leadData.sources.map((s, idx) => {
                      const percent = s.count / leadData.totalSourceCount;
                      const strokeLen = percent * donutCircumference;
                      const strokeOffset = -cumulativeLight * donutCircumference;
                      cumulativeLight += percent;

                      const isHovered = activeSourceIndex === idx;

                      return (
                        <circle
                          key={`light-${idx}`}
                          cx="60"
                          cy="60"
                          r={donutR}
                          fill="transparent"
                          stroke={s.lightColor}
                          className="transition-all duration-300 ease-out cursor-pointer dark:hidden block"
                          strokeWidth={isHovered ? '13' : '9'}
                          strokeDasharray={`${strokeLen} ${donutCircumference - strokeLen}`}
                          strokeDashoffset={strokeOffset}
                          transform="rotate(-90 60 60)"
                          style={{ transformOrigin: 'center' }}
                          onMouseEnter={() => setActiveSourceIndex(idx)}
                          onMouseLeave={() => setActiveSourceIndex(null)}
                        />
                      );
                    });
                  })()}
                </svg>

                {/* Readout in the center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <p className="font-mono text-[8px] tracking-wider text-stone-400 dark:text-on-surface-variant font-bold leading-none uppercase">
                    {activeSourceIndex !== null ? leadData.sources[activeSourceIndex].name : 'TOTAL'}
                  </p>
                  <p className="font-sora font-black text-2xl text-stone-900 dark:text-on-surface leading-none mt-1">
                    {activeSourceIndex !== null
                      ? leadData.sources[activeSourceIndex].count
                      : leadData.total}
                  </p>
                  <p className="font-mono text-[9px] text-stone-500 dark:text-on-surface-variant leading-none mt-1">
                    {activeSourceIndex !== null
                      ? `${Math.round((leadData.sources[activeSourceIndex].count / leadData.totalSourceCount) * 100)}%`
                      : 'Leads'}
                  </p>
                </div>
              </div>
            </div>

            {/* Glowing Custom Legend */}
            <div className="grid grid-cols-3 gap-2 border-t border-stone-100 dark:border-outline-variant/10 pt-4">
              {leadData.sources.map((s, idx) => {
                const isHovered = activeSourceIndex === idx;
                const percent = Math.round((s.count / leadData.totalSourceCount) * 100);
                return (
                  <div
                    key={idx}
                    className={`flex flex-col items-center justify-center p-1.5 rounded-xl border transition-all duration-300 cursor-pointer ${
                      isHovered
                        ? 'bg-stone-50 border-stone-300 dark:bg-surface-container-high dark:border-outline-variant'
                        : 'border-transparent hover:bg-stone-50 dark:hover:bg-surface-container/20'
                    }`}
                    onMouseEnter={() => setActiveSourceIndex(idx)}
                    onMouseLeave={() => setActiveSourceIndex(null)}
                  >
                    <span className="material-symbols-outlined text-lg mb-1" style={{ color: s.lightColor }}>
                      {s.icon}
                    </span>
                    <span className="font-hanken text-[10px] text-stone-600 dark:text-on-surface font-semibold truncate w-full text-center">
                      {s.name}
                    </span>
                    <span className="font-mono text-xs font-bold text-stone-900 dark:text-on-surface mt-0.5">
                      {percent}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── Bottom Sections Grid ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 3: Lead Pipeline Funnel */}
          <div className="bg-white dark:bg-surface-container/40 backdrop-blur-xl border border-stone-200 dark:border-outline-variant/20 rounded-2xl p-6 shadow-sm dark:shadow-lg flex flex-col justify-between h-[360px]">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-sora font-semibold text-base text-stone-900 dark:text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-violet-500 dark:text-secondary-fixed">filter_alt</span>
                  Pipeline Conversion Funnel
                </h3>
                <span className="font-mono text-[10px] bg-violet-50 dark:bg-secondary-fixed/10 text-violet-600 dark:text-secondary-fixed px-2 py-0.5 rounded-full border border-violet-100 dark:border-secondary-fixed/20">
                  Stages Breakdown
                </span>
              </div>
              <p className="font-hanken text-xs text-stone-500 dark:text-on-surface-variant mb-4">
                Detailed funnel performance tracking conversion velocity.
              </p>
            </div>

            {/* Custom Funnel Stages */}
            <div className="flex-grow flex flex-col justify-around gap-2 mt-2">
              {leadData.funnelStages.map((stage, idx) => {
                const maxVal = Math.max(...leadData.funnelStages.map((st) => st.count), 1);
                const widthPercent = (stage.count / maxVal) * 100;
                const conversionFromTotal = leadData.total ? Math.round((stage.count / leadData.total) * 100) : 0;
                const isHovered = hoveredFunnelIndex === idx;

                return (
                  <div
                    key={idx}
                    className="relative group cursor-pointer"
                    onMouseEnter={() => setHoveredFunnelIndex(idx)}
                    onMouseLeave={() => setHoveredFunnelIndex(null)}
                  >
                    <div className="flex items-center justify-between mb-1 z-10 relative">
                      <span className="font-hanken text-xs text-stone-700 dark:text-on-surface font-semibold flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${stage.color} dark:block hidden`} />
                        <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${stage.lightColor} dark:hidden block`} />
                        {stage.name}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-stone-500 dark:text-on-surface-variant">
                          {conversionFromTotal}%
                        </span>
                        <span className="font-mono text-xs font-bold text-stone-900 dark:text-on-surface">
                          {stage.count} leads
                        </span>
                      </div>
                    </div>

                    {/* Progress track */}
                    <div className="w-full h-3 bg-stone-100 dark:bg-surface-container-lowest/80 border border-stone-200/55 dark:border-outline-variant/15 rounded-full overflow-hidden relative">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${widthPercent}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full bg-gradient-to-r dark:block hidden ${stage.color} ${
                          isHovered ? 'shadow-[0_0_12px_rgba(99,247,255,0.4)]' : ''
                        }`}
                      />
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${widthPercent}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full bg-gradient-to-r dark:hidden block ${stage.lightColor}`}
                      />
                    </div>

                    {/* Tooltip detail description on hover */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute right-0 top-[-36px] bg-stone-900 text-white text-[10px] font-hanken px-2.5 py-1 rounded-lg shadow-lg border border-outline-variant/30 pointer-events-none z-20 max-w-xs"
                        >
                          {stage.description}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 4: AI Intelligent Lead Insights */}
          <div className="bg-white dark:bg-surface-container/40 backdrop-blur-xl border border-stone-200 dark:border-outline-variant/20 rounded-2xl p-6 shadow-sm dark:shadow-lg flex flex-col justify-between h-[360px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-container/5 dark:from-primary-container/10 to-transparent pointer-events-none" />
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-sora font-semibold text-base text-stone-900 dark:text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-container dark:text-primary-fixed animate-pulse">
                    psychology
                  </span>
                  Lumina AI Lead Intelligence
                </h3>
                <span className="font-mono text-[10px] bg-primary-container/10 text-primary-container dark:text-primary-fixed px-2 py-0.5 rounded-full border border-primary-container/30">
                  AI INSIGHTS
                </span>
              </div>
              <p className="font-hanken text-xs text-stone-500 dark:text-on-surface-variant mb-4">
                Real-time metrics synthesis and strategic outbound recommendations.
              </p>
            </div>

            {/* Computed Insights Block */}
            <div className="flex-grow flex flex-col justify-center gap-4 py-2 z-10 relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-stone-50 dark:bg-surface-container-low/60 rounded-xl p-3 border border-stone-200/60 dark:border-outline-variant/10">
                  <p className="font-mono text-[9px] text-stone-400 dark:text-on-surface-variant font-bold leading-none uppercase">
                    HIGH-VELOCITY SOURCE
                  </p>
                  <p className="font-sora text-sm font-bold text-stone-900 dark:text-on-surface mt-2 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-lg text-emerald-500">
                      {leadData.maxSource?.icon}
                    </span>
                    {leadData.maxSource?.name || 'None'}
                  </p>
                  <p className="font-hanken text-[10px] text-stone-500 dark:text-on-surface-variant mt-1">
                    {leadData.maxSource ? `${leadData.maxSource.count} total leads acquired` : ''}
                  </p>
                </div>

                <div className="bg-stone-50 dark:bg-surface-container-low/60 rounded-xl p-3 border border-stone-200/60 dark:border-outline-variant/10">
                  <p className="font-mono text-[9px] text-stone-400 dark:text-on-surface-variant font-bold leading-none uppercase">
                    PEAK VOLUME PERIOD
                  </p>
                  <p className="font-sora text-sm font-bold text-stone-900 dark:text-on-surface mt-2 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-lg text-amber-500">calendar_month</span>
                    {leadData.maxMonth?.label || 'None'}
                  </p>
                  <p className="font-hanken text-[10px] text-stone-500 dark:text-on-surface-variant mt-1">
                    {leadData.maxMonth ? `${leadData.maxMonth.count} new leads created` : ''}
                  </p>
                </div>
              </div>

              {/* Action Recommendation Card */}
              <div className="bg-sky-50/50 dark:bg-surface-container-high/50 rounded-xl p-4 border border-sky-100 dark:border-primary-fixed/15 flex items-start gap-3">
                <span className="material-symbols-outlined text-sky-600 dark:text-primary-fixed mt-0.5">
                  lightbulb
                </span>
                <div>
                  <p className="font-mono text-[9px] text-sky-700 dark:text-primary-fixed font-bold leading-none uppercase">
                    STRATEGIC RECOMMENDATION
                  </p>
                  <p className="font-hanken text-xs text-stone-600 dark:text-on-surface mt-2 leading-relaxed font-medium">
                    {leadData.suggestion}
                  </p>
                </div>
              </div>
            </div>

            {/* Button */}
            <div className="mt-4 pt-3 border-t border-stone-100 dark:border-outline-variant/10 flex items-center justify-between">
              <span className="font-mono text-[9px] text-stone-400 dark:text-on-surface-variant">
                Lumina Engine v2.1
              </span>
              <button 
                onClick={handleExport}
                className="bg-stone-100 dark:bg-primary-container text-stone-800 dark:text-on-primary hover:bg-stone-200 dark:hover:bg-primary-fixed px-4 py-2 rounded-xl font-mono text-[10px] font-bold tracking-wider transition-all duration-300 active:scale-95"
              >
                EXPORT INTEL REPORT
              </button>
            </div>
          </div>

        </div>

      </motion.div>
    </main>
  );
};
