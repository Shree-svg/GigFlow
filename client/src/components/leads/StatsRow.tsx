import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LeadStats } from '../../types';

interface StatCardProps {
  label: string;
  value: number;
  icon: string;
  color: string;
  trend?: string;
  delay: number;
}

const AnimatedNumber = ({ target }: { target: number }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const duration = 1000;
    const steps = 40;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setDisplay(target); clearInterval(timer); }
      else setDisplay(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target]);
  return <>{display.toLocaleString()}</>;
};

const StatCard = ({ label, value, icon, color, trend, delay }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, type: 'spring', stiffness: 300, damping: 20 }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className="glass-panel rounded-xl p-5 flex flex-col justify-between relative overflow-hidden group cursor-default"
  >
    <div className="flex items-start justify-between">
      <span className="font-mono text-[10px] tracking-widest text-on-surface-variant uppercase">{label}</span>
      <span className={`material-symbols-outlined text-xl ${color}`}>{icon}</span>
    </div>
    <div className="mt-5">
      <div className={`font-mono text-4xl font-bold text-on-surface group-hover:${color} transition-colors`}>
        <AnimatedNumber target={value} />
      </div>
      {trend && (
        <div className="flex items-center gap-1 mt-1.5">
          <span className="material-symbols-outlined text-sm text-primary-fixed-dim">trending_up</span>
          <span className="font-hanken text-xs text-on-surface-variant">{trend}</span>
        </div>
      )}
    </div>
    {/* Decorative gradient */}
    <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-primary-container/5 to-transparent" />
  </motion.div>
);

export const StatsRow = ({ stats }: { stats: LeadStats | null }) => {
  const cards = [
    { label: 'Total Leads', value: stats?.total ?? 0, icon: 'groups', color: 'text-primary-container', trend: 'Live count', delay: 0.2 },
    { label: 'New Leads', value: stats?.byStatus?.New ?? 0, icon: 'fiber_new', color: 'text-primary-fixed-dim', trend: 'Awaiting contact', delay: 0.25 },
    { label: 'Qualified', value: stats?.byStatus?.Qualified ?? 0, icon: 'verified', color: 'text-tertiary-fixed', trend: 'Ready to close', delay: 0.3 },
    { label: 'Lost', value: stats?.byStatus?.Lost ?? 0, icon: 'cancel', color: 'text-error', trend: 'Needs review', delay: 0.35 },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
      {cards.map((c) => <StatCard key={c.label} {...c} />)}
    </div>
  );
};
