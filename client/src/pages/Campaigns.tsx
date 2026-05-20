import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Campaign {
  id: string;
  name: string;
  subject: string;
  segment: string;
  status: 'Active' | 'Paused' | 'Draft';
  sent: number;
  opened: number;
  replied: number;
  sequenceSteps: string[];
  history: number[]; // daily email count for sparklines
}

export const Campaigns = () => {
  // ─── Interactive Campaigns State ──────────────────────────────────────────
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Q1 Outreach',
      subject: 'SaaS Partnerships Q1 Collaboration Opportunity',
      segment: 'Enterprise SaaS Leads',
      status: 'Active',
      sent: 1200,
      opened: 456,
      replied: 84,
      sequenceSteps: ['Initial Hook', 'Value Accent', 'Final Follow-up'],
      history: [10, 45, 30, 80, 50, 95, 120],
    },
    {
      id: '2',
      name: 'Re-engagement',
      subject: "Let's reconnect and build something spectacular",
      segment: 'Inactive Leads',
      status: 'Paused',
      sent: 340,
      opened: 119,
      replied: 13,
      sequenceSteps: ['Re-intro Offer', 'Feedback Request'],
      history: [5, 20, 15, 40, 25, 30, 35],
    },
    {
      id: '3',
      name: 'Newsletter Launch',
      subject: 'Smart Outbound Weekly Insights #1',
      segment: 'All Contacts',
      status: 'Draft',
      sent: 0,
      opened: 0,
      replied: 0,
      sequenceSteps: ['Weekly Digest'],
      history: [0, 0, 0, 0, 0, 0, 0],
    },
  ]);

  // View state: 'grid' | 'table'
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modals and Creators state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formSubject, setFormSubject] = useState('');
  const [formSegment, setFormSegment] = useState('Enterprise SaaS Leads');
  const [formSteps, setFormSteps] = useState<string[]>(['Initial Hook']);
  const [newStepText, setNewStepText] = useState('');

  // AI Analyzer State
  const [aiSubject, setAiSubject] = useState('');
  const [selectedCampaignForAi, setSelectedCampaignForAi] = useState<string>('1');

  // ─── 1. Calculations ──────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const totalSent = campaigns.reduce((acc, c) => acc + c.sent, 0);
    const totalOpened = campaigns.reduce((acc, c) => acc + c.opened, 0);
    const totalReplied = campaigns.reduce((acc, c) => acc + c.replied, 0);
    const openRate = totalSent ? Math.round((totalOpened / totalSent) * 100) : 0;
    const replyRate = totalSent ? Math.round((totalReplied / totalSent) * 100) : 0;

    return { totalSent, totalOpened, totalReplied, openRate, replyRate };
  }, [campaigns]);

  // AI Copy Optimizer feedback generator
  const aiFeedback = useMemo(() => {
    const textToAnalyze = aiSubject || campaigns.find(c => c.id === selectedCampaignForAi)?.subject || '';
    if (!textToAnalyze) {
      return {
        score: 0,
        verdict: 'No outreach subject loaded.',
        advice: 'Enter a subject line in the AI helper or select an active campaign to view performance analysis.',
        color: 'text-stone-400',
        borderColor: 'border-stone-200 dark:border-outline-variant/20',
      };
    }

    const lower = textToAnalyze.toLowerCase();
    let score = 75;
    let advice = 'Good base length. Ensure you append personalization parameters like {{company}} or {{first_name}} to double conversion velocity.';
    let verdict = 'OPTIMIZED';
    let color = 'text-[#ffe16c]';
    let borderColor = 'border-amber-500/30';

    if (lower.includes('free') || lower.includes('buy') || lower.includes('discount')) {
      score -= 30;
      verdict = 'SPAM WARNING';
      advice = 'High spam trigger words detected ("free"/"buy"). Spam filters may quarantine this outreach stream.';
      color = 'text-rose-500';
      borderColor = 'border-rose-500/30';
    } else if (lower.length > 50) {
      score -= 15;
      verdict = 'TOO LONG';
      advice = 'Subject is verbose. Attention spans are short; reduce words to keep it below 40 characters for optimal click velocities.';
      color = 'text-amber-500';
      borderColor = 'border-amber-500/30';
    } else if (lower.includes('collaboration') || lower.includes('opportunity') || lower.includes('partnership')) {
      score += 15;
      verdict = 'HIGH ENGAGEMENT';
      advice = 'Exceptional trigger vocabulary! Appending dynamic fields like "quick question" or "ideas for {{company}}" will boost click potential by another 22%.';
      color = 'text-emerald-500 dark:text-[#63f7ff]';
      borderColor = 'border-emerald-500/30';
    }

    return { score, verdict, advice, color, borderColor };
  }, [aiSubject, selectedCampaignForAi, campaigns]);

  // ─── 2. Handlers ──────────────────────────────────────────────────────────
  const toggleStatus = (id: string) => {
    setCampaigns(prev =>
      prev.map(c => {
        if (c.id === id) {
          const nextStatus = c.status === 'Active' ? 'Paused' : 'Active';
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const deleteCampaign = (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  const openNewCampaignModal = () => {
    setIsEditMode(false);
    setFormName('');
    setFormSubject('');
    setFormSegment('Enterprise SaaS Leads');
    setFormSteps(['Initial Hook']);
    setIsModalOpen(true);
  };

  const openEditCampaignModal = (camp: Campaign) => {
    setIsEditMode(true);
    setEditingId(camp.id);
    setFormName(camp.name);
    setFormSubject(camp.subject);
    setFormSegment(camp.segment);
    setFormSteps(camp.sequenceSteps.length > 0 ? camp.sequenceSteps : ['Initial Hook']);
    setIsModalOpen(true);
  };

  const handleAddStep = () => {
    if (newStepText.trim()) {
      setFormSteps(prev => [...prev, newStepText.trim()]);
      setNewStepText('');
    }
  };

  const handleRemoveStep = (idx: number) => {
    setFormSteps(prev => prev.filter((_, i) => i !== idx));
  };

  const saveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formSubject.trim()) return;

    if (isEditMode && editingId) {
      setCampaigns(prev =>
        prev.map(c => {
          if (c.id === editingId) {
            return {
              ...c,
              name: formName.trim(),
              subject: formSubject.trim(),
              segment: formSegment,
              sequenceSteps: formSteps,
            };
          }
          return c;
        })
      );
    } else {
      const newCamp: Campaign = {
        id: String(Date.now()),
        name: formName.trim(),
        subject: formSubject.trim(),
        segment: formSegment,
        status: 'Draft',
        sent: 0,
        opened: 0,
        replied: 0,
        sequenceSteps: formSteps,
        history: [0, 0, 0, 0, 0, 0, 0],
      };
      setCampaigns(prev => [...prev, newCamp]);
    }

    setIsModalOpen(false);
  };

  return (
    <main className="p-5 max-w-7xl w-full mx-auto pb-16">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h2 className="font-sora font-semibold text-2xl text-stone-900 dark:text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-violet-500 dark:text-[#d2bbff]">campaign</span>
              Campaigns Terminal
            </h2>
            <p className="font-hanken text-stone-500 dark:text-on-surface-variant mt-1 text-sm">
              Deploy and orchestrate automated outreach workflows with dynamic performance intelligence.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="bg-stone-100 dark:bg-surface-container-low p-1 rounded-xl border border-stone-200 dark:border-outline-variant/20 flex">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-wider transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-primary-container text-sky-600 dark:text-on-primary shadow-sm'
                    : 'text-stone-500 dark:text-on-surface-variant hover:text-stone-800'
                }`}
              >
                <span className="material-symbols-outlined text-sm">grid_view</span>
                GRID
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-wider transition-all ${
                  viewMode === 'table'
                    ? 'bg-white dark:bg-primary-container text-sky-600 dark:text-on-primary shadow-sm'
                    : 'text-stone-500 dark:text-on-surface-variant hover:text-stone-800'
                }`}
              >
                <span className="material-symbols-outlined text-sm">table_rows</span>
                LIST
              </button>
            </div>

            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={openNewCampaignModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-sky-500 dark:from-[#d2bbff] dark:to-[#63f7ff] text-white dark:text-stone-950 font-mono text-xs font-bold tracking-wider shadow-lg dark:shadow-[#63f7ff]/10 hover:shadow-violet-500/20 transition-all duration-300"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              NEW CAMPAIGN
            </motion.button>
          </div>
        </div>

        {/* ─── Top Stats Grid ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            {
              label: 'TOTAL OUTBOX VELOCITY',
              value: stats.totalSent.toLocaleString(),
              desc: 'Emails processed across active systems',
              color: 'text-violet-600 dark:text-[#d2bbff]',
              icon: 'forward_to_inbox',
              meter: (
                <div className="w-full bg-stone-100 dark:bg-surface-container-lowest/80 h-1.5 rounded-full mt-3 overflow-hidden border border-stone-200/50 dark:border-outline-variant/10">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: '80%' }} />
                </div>
              ),
            },
            {
              label: 'GLOBAL ENGAGEMENT RATE',
              value: `${stats.openRate}%`,
              desc: 'Average open rate index',
              color: 'text-sky-600 dark:text-[#63f7ff]',
              icon: 'drafts',
              meter: (
                <div className="w-full bg-stone-100 dark:bg-surface-container-lowest/80 h-1.5 rounded-full mt-3 overflow-hidden border border-stone-200/50 dark:border-outline-variant/10">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: `${stats.openRate}%` }} />
                </div>
              ),
            },
            {
              label: 'CONVERSIONS COLLECTED',
              value: stats.totalReplied.toLocaleString(),
              desc: 'Total high-value replies catalogued',
              color: 'text-amber-600 dark:text-[#ffe16c]',
              icon: 'chat_bubble',
              meter: (
                <div className="w-full bg-stone-100 dark:bg-surface-container-lowest/80 h-1.5 rounded-full mt-3 overflow-hidden border border-stone-200/50 dark:border-outline-variant/10">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${stats.replyRate * 5}%` }} />
                </div>
              ),
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white dark:bg-surface-container/40 backdrop-blur-xl border border-stone-200 dark:border-outline-variant/20 rounded-2xl p-6 flex flex-col justify-between shadow-sm dark:shadow-lg relative overflow-hidden group"
            >
              <div className="absolute -right-4 -top-4 opacity-5 dark:opacity-[0.03] group-hover:opacity-10 transition-opacity duration-300 pointer-events-none">
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
              <div>
                {stat.meter}
                <p className="font-hanken text-[10px] text-stone-500 dark:text-on-surface-variant mt-3 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs opacity-60">info</span>
                  {stat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ─── Main Content Splitted Grid ───────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Grid View or Table View (Left 2/3 columns) */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {viewMode === 'grid' ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                >
                  {campaigns.map(camp => {
                    const openRate = camp.sent ? Math.round((camp.opened / camp.sent) * 100) : 0;
                    const replyRate = camp.sent ? Math.round((camp.replied / camp.sent) * 100) : 0;

                    // Sparkline path points calculations
                    const maxHist = Math.max(...camp.history, 10);
                    const sparkPoints = camp.history.map((val, idx) => {
                      const x = (idx / 6) * 120;
                      const y = 30 - (val / maxHist) * 26;
                      return `${x},${y}`;
                    }).join(' ');

                    return (
                      <div
                        key={camp.id}
                        className="bg-white dark:bg-surface-container/40 backdrop-blur-xl border border-stone-200 dark:border-outline-variant/20 rounded-2xl p-5 shadow-sm dark:shadow-lg flex flex-col justify-between h-[360px] relative overflow-hidden group hover:border-violet-500/30 dark:hover:border-outline-variant transition-all duration-300"
                      >
                        {/* Glowing Background gradient */}
                        <div className="absolute -right-16 -top-16 w-32 h-32 bg-violet-500/5 rounded-full filter blur-xl group-hover:bg-violet-500/10 transition-all duration-300 pointer-events-none" />

                        {/* Top Info */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className={`px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold ${
                              camp.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' :
                              camp.status === 'Paused' ? 'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' :
                              'bg-stone-50 text-stone-500 border border-stone-100 dark:bg-surface-container-low dark:text-on-surface-variant dark:border-outline-variant/10'
                            }`}>
                              {camp.status.toUpperCase()}
                            </span>
                            
                            {/* Actions overlay */}
                            <div className="flex items-center gap-1.5">
                              {camp.status !== 'Draft' && (
                                <button
                                  onClick={() => toggleStatus(camp.id)}
                                  className="w-7 h-7 rounded-lg bg-stone-50 hover:bg-stone-100 dark:bg-surface-container-low dark:hover:bg-surface-container-high border border-stone-200/50 dark:border-outline-variant/15 flex items-center justify-center text-stone-500 dark:text-on-surface-variant hover:text-sky-500 transition-colors"
                                  title={camp.status === 'Active' ? 'Pause Campaign' : 'Start Campaign'}
                                >
                                  <span className="material-symbols-outlined text-sm">
                                    {camp.status === 'Active' ? 'pause' : 'play_arrow'}
                                  </span>
                                </button>
                              )}
                              <button
                                onClick={() => openEditCampaignModal(camp)}
                                className="w-7 h-7 rounded-lg bg-stone-50 hover:bg-stone-100 dark:bg-surface-container-low dark:hover:bg-surface-container-high border border-stone-200/50 dark:border-outline-variant/15 flex items-center justify-center text-stone-500 dark:text-on-surface-variant hover:text-violet-500 transition-colors"
                                title="Edit Campaign"
                              >
                                <span className="material-symbols-outlined text-sm">edit</span>
                              </button>
                              <button
                                onClick={() => deleteCampaign(camp.id)}
                                className="w-7 h-7 rounded-lg bg-stone-50 hover:bg-stone-100 dark:bg-surface-container-low dark:hover:bg-surface-container-high border border-stone-200/50 dark:border-outline-variant/15 flex items-center justify-center text-stone-500 dark:text-on-surface-variant hover:text-rose-500 transition-colors"
                                title="Delete Campaign"
                              >
                                <span className="material-symbols-outlined text-sm">delete</span>
                              </button>
                            </div>
                          </div>

                          <h3 className="font-sora font-semibold text-base text-stone-900 dark:text-on-surface truncate group-hover:text-violet-500 dark:group-hover:text-primary-fixed transition-colors">
                            {camp.name}
                          </h3>
                          <p className="font-hanken text-[11px] text-stone-500 dark:text-on-surface-variant mt-1.5 line-clamp-1">
                            Subject: <span className="italic">"{camp.subject}"</span>
                          </p>
                          <p className="font-mono text-[9px] text-stone-400 dark:text-on-surface-variant font-bold mt-1.5 uppercase">
                            Segment: {camp.segment}
                          </p>
                        </div>

                        {/* Sequence Flow */}
                        <div className="my-3 py-2 border-y border-stone-100 dark:border-outline-variant/10">
                          <p className="font-mono text-[8px] text-stone-400 dark:text-on-surface-variant font-bold mb-1.5 uppercase tracking-wider">
                            OUTREACH SEQUENCE
                          </p>
                          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                            {camp.sequenceSteps.map((step, sIdx) => (
                              <div key={sIdx} className="flex items-center flex-shrink-0">
                                <span className="font-hanken text-[10px] bg-stone-50 border border-stone-200/60 dark:bg-surface-container-low dark:border-outline-variant/15 text-stone-700 dark:text-on-surface px-2 py-0.5 rounded-lg">
                                  {step}
                                </span>
                                {sIdx < camp.sequenceSteps.length - 1 && (
                                  <span className="material-symbols-outlined text-stone-300 dark:text-outline-variant/30 text-xs px-0.5">
                                    arrow_forward
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Delivery Sparkline & Stats */}
                        <div className="flex items-end justify-between gap-4 mt-2">
                          <div className="space-y-3 flex-grow">
                            <div>
                              <div className="flex justify-between text-[10px] font-mono text-stone-500 dark:text-on-surface-variant mb-1">
                                <span>OPEN RATE</span>
                                <span className="font-bold text-stone-800 dark:text-on-surface">{openRate}%</span>
                              </div>
                              <div className="w-full bg-stone-100 dark:bg-surface-container-lowest/80 h-1.5 rounded-full overflow-hidden border border-stone-200/50 dark:border-outline-variant/10">
                                <div className="h-full bg-sky-500 rounded-full" style={{ width: `${openRate}%` }} />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between text-[10px] font-mono text-stone-500 dark:text-on-surface-variant mb-1">
                                <span>REPLY RATE</span>
                                <span className="font-bold text-stone-800 dark:text-on-surface">{replyRate}%</span>
                              </div>
                              <div className="w-full bg-stone-100 dark:bg-surface-container-lowest/80 h-1.5 rounded-full overflow-hidden border border-stone-200/50 dark:border-outline-variant/10">
                                <div className="h-full bg-violet-500 rounded-full" style={{ width: `${replyRate}%` }} />
                              </div>
                            </div>
                          </div>

                          {/* SVG Sparkline (Velocity tracker) */}
                          <div className="flex flex-col items-end w-[120px] flex-shrink-0">
                            <p className="font-mono text-[8px] text-stone-400 dark:text-on-surface-variant font-bold mb-1 uppercase tracking-wider">
                              OUTFLOW VELOCITY
                            </p>
                            <div className="h-[32px] w-full border border-stone-100 dark:border-outline-variant/10 rounded-lg p-0.5 bg-stone-50/50 dark:bg-surface-container-lowest/50">
                              <svg className="w-full h-full" viewBox="0 0 120 32" preserveAspectRatio="none">
                                <defs>
                                  <linearGradient id={`sparkGrad-${camp.id}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                                  </linearGradient>
                                </defs>
                                {camp.sent > 0 && (
                                  <>
                                    <polyline
                                      fill={`url(#sparkGrad-${camp.id})`}
                                      stroke="none"
                                      points={`0,30 ${sparkPoints} 120,30 Z`}
                                    />
                                    <polyline
                                      fill="none"
                                      stroke="#a855f7"
                                      strokeWidth="1.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      points={sparkPoints}
                                    />
                                  </>
                                )}
                                {camp.sent === 0 && (
                                  <line x1="0" y1="30" x2="120" y2="30" stroke="#78716c" strokeWidth="1" strokeDasharray="3 3" />
                                )}
                              </svg>
                            </div>
                            <span className="font-mono text-[9px] text-stone-500 dark:text-on-surface-variant mt-1.5">
                              {camp.sent.toLocaleString()} Sent
                            </span>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  key="table"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-surface-container/40 backdrop-blur-xl border border-stone-200 dark:border-outline-variant/20 rounded-2xl overflow-hidden shadow-sm dark:shadow-lg"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="bg-stone-50 dark:bg-surface-variant/20 border-b border-stone-200 dark:border-outline-variant/10">
                          <th className="px-6 py-4 font-mono text-xs tracking-wider text-stone-500 dark:text-on-surface-variant font-bold">CAMPAIGN NAME</th>
                          <th className="px-6 py-4 font-mono text-xs tracking-wider text-stone-500 dark:text-on-surface-variant font-bold">STATUS</th>
                          <th className="px-6 py-4 font-mono text-xs tracking-wider text-stone-500 dark:text-on-surface-variant font-bold text-right">SENT</th>
                          <th className="px-6 py-4 font-mono text-xs tracking-wider text-stone-500 dark:text-on-surface-variant font-bold text-right">OPEN RATE</th>
                          <th className="px-6 py-4 font-mono text-xs tracking-wider text-stone-500 dark:text-on-surface-variant font-bold text-right">REPLY RATE</th>
                          <th className="px-6 py-4 font-mono text-xs tracking-wider text-stone-500 dark:text-on-surface-variant font-bold text-center">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100 dark:divide-outline-variant/5">
                        {campaigns.map(camp => {
                          const openRate = camp.sent ? Math.round((camp.opened / camp.sent) * 100) : 0;
                          const replyRate = camp.sent ? Math.round((camp.replied / camp.sent) * 100) : 0;

                          return (
                            <tr key={camp.id} className="hover:bg-stone-50/50 dark:hover:bg-surface-variant/10 transition-colors group">
                              <td className="px-6 py-4">
                                <div className="font-sora font-medium text-sm text-stone-900 dark:text-on-surface group-hover:text-violet-500 dark:group-hover:text-primary-fixed transition-colors">
                                  {camp.name}
                                </div>
                                <div className="font-hanken text-[11px] text-stone-500 dark:text-on-surface-variant mt-0.5 truncate max-w-xs">
                                  Subject: "{camp.subject}"
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-0.5 rounded-full font-mono text-[9px] font-bold ${
                                  camp.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' :
                                  camp.status === 'Paused' ? 'bg-amber-50 text-amber-600 border border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' :
                                  'bg-stone-50 text-stone-500 border border-stone-100 dark:bg-surface-container-low dark:text-on-surface-variant dark:border-outline-variant/10'
                                }`}>
                                  {camp.status.toUpperCase()}
                                </span>
                              </td>
                              <td className="px-6 py-4 font-mono text-sm text-stone-600 dark:text-on-surface-variant text-right">
                                {camp.sent.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <span className="font-mono text-xs font-bold text-stone-900 dark:text-on-surface">{openRate}%</span>
                                  <div className="w-16 bg-stone-100 dark:bg-surface-container-lowest h-1 rounded-full overflow-hidden border border-stone-200/50 dark:border-outline-variant/10">
                                    <div className="h-full bg-sky-500 rounded-full" style={{ width: `${openRate}%` }} />
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <span className="font-mono text-xs font-bold text-stone-900 dark:text-on-surface">{replyRate}%</span>
                                  <div className="w-16 bg-stone-100 dark:bg-surface-container-lowest h-1 rounded-full overflow-hidden border border-stone-200/50 dark:border-outline-variant/10">
                                    <div className="h-full bg-violet-500 rounded-full" style={{ width: `${replyRate}%` }} />
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-1.5">
                                  {camp.status !== 'Draft' && (
                                    <button
                                      onClick={() => toggleStatus(camp.id)}
                                      className="w-7 h-7 rounded-lg bg-stone-50 hover:bg-stone-100 dark:bg-surface-container-low dark:hover:bg-surface-container-high border border-stone-200/50 dark:border-outline-variant/15 flex items-center justify-center text-stone-500 dark:text-on-surface-variant hover:text-sky-500 transition-colors"
                                      title={camp.status === 'Active' ? 'Pause Campaign' : 'Start Campaign'}
                                    >
                                      <span className="material-symbols-outlined text-sm">
                                        {camp.status === 'Active' ? 'pause' : 'play_arrow'}
                                      </span>
                                    </button>
                                  )}
                                  <button
                                    onClick={() => openEditCampaignModal(camp)}
                                    className="w-7 h-7 rounded-lg bg-stone-50 hover:bg-stone-100 dark:bg-surface-container-low dark:hover:bg-surface-container-high border border-stone-200/50 dark:border-outline-variant/15 flex items-center justify-center text-stone-500 dark:text-on-surface-variant hover:text-violet-500 transition-colors"
                                    title="Edit"
                                  >
                                    <span className="material-symbols-outlined text-sm">edit</span>
                                  </button>
                                  <button
                                    onClick={() => deleteCampaign(camp.id)}
                                    className="w-7 h-7 rounded-lg bg-stone-50 hover:bg-stone-100 dark:bg-surface-container-low dark:hover:bg-surface-container-high border border-stone-200/50 dark:border-outline-variant/15 flex items-center justify-center text-stone-500 dark:text-on-surface-variant hover:text-rose-500 transition-colors"
                                    title="Delete"
                                  >
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AI Copy Critique & Optimization Panel (Right 1/3 column) */}
          <div className="bg-white dark:bg-surface-container/40 backdrop-blur-xl border border-stone-200 dark:border-outline-variant/20 rounded-2xl p-6 shadow-sm dark:shadow-lg flex flex-col justify-between h-[520px] relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-sora font-semibold text-base text-stone-900 dark:text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-violet-500 dark:text-[#d2bbff] animate-pulse">
                    auto_awesome
                  </span>
                  Aetheris copy Optimizer
                </h3>
                <span className="font-mono text-[9px] bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-[#d2bbff] px-2 py-0.5 rounded-full border border-violet-100 dark:border-violet-500/20">
                  REAL-TIME COGNITIVE
                </span>
              </div>
              <p className="font-hanken text-xs text-stone-500 dark:text-on-surface-variant mb-4">
                Evaluate subject copy, resolve spam risks, and analyze delivery velocity factors.
              </p>
            </div>

            <div className="flex-grow flex flex-col justify-start gap-4 py-1 z-10 relative">
              {/* Campaign selector or Subject Editor */}
              <div className="space-y-1">
                <label className="font-mono text-[9px] text-stone-400 dark:text-on-surface-variant font-bold uppercase block">
                  Select Source Campaign
                </label>
                <select
                  value={selectedCampaignForAi}
                  onChange={(e) => {
                    setSelectedCampaignForAi(e.target.value);
                    setAiSubject(''); // reset typed subject to use campaign's subject
                  }}
                  className="w-full bg-stone-50 dark:bg-surface-container-lowest/80 border border-stone-200 dark:border-outline-variant/20 rounded-xl px-3 py-2 text-xs font-hanken text-stone-800 dark:text-on-surface focus:outline-none focus:border-violet-500/50"
                >
                  {campaigns.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[9px] text-stone-400 dark:text-on-surface-variant font-bold uppercase block">
                  Subject Line Sandbox
                </label>
                <textarea
                  value={aiSubject || campaigns.find(c => c.id === selectedCampaignForAi)?.subject || ''}
                  onChange={(e) => setAiSubject(e.target.value)}
                  placeholder="Type a subject line to critique..."
                  rows={2}
                  className="w-full bg-stone-50 dark:bg-surface-container-lowest/80 border border-stone-200 dark:border-outline-variant/20 rounded-xl px-3 py-2 text-xs font-hanken text-stone-800 dark:text-on-surface focus:outline-none focus:border-violet-500/50 resize-none"
                />
              </div>

              {/* AI Score Index Card */}
              <div className={`bg-stone-50 dark:bg-surface-container-lowest/50 rounded-xl p-4 border transition-all duration-300 ${aiFeedback.borderColor}`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-stone-400 dark:text-on-surface-variant font-bold uppercase">
                    SUBJECT SCORE
                  </span>
                  <span className={`font-mono text-xs font-bold ${aiFeedback.color}`}>
                    {aiFeedback.verdict}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className={`font-sora text-3xl font-black ${aiFeedback.color}`}>
                    {aiFeedback.score}
                  </span>
                  <span className="font-mono text-xs text-stone-400">/ 100</span>
                </div>
                <p className="font-hanken text-xs text-stone-600 dark:text-on-surface mt-3 leading-relaxed">
                  {aiFeedback.advice}
                </p>
              </div>
            </div>

            <div className="border-t border-stone-100 dark:border-outline-variant/10 pt-4 mt-2 flex items-center justify-between">
              <span className="font-mono text-[9px] text-stone-400 dark:text-on-surface-variant">
                Aetheris Engine v1.8
              </span>
              <button
                onClick={() => {
                  const currentSub = aiSubject || campaigns.find(c => c.id === selectedCampaignForAi)?.subject || '';
                  if (currentSub && !currentSub.toLowerCase().includes('ideas for')) {
                    setAiSubject(`${currentSub} - ideas for {{company}}`);
                  }
                }}
                className="bg-stone-50 hover:bg-stone-100 dark:bg-surface-container-high dark:hover:bg-surface-container-highest text-stone-700 dark:text-on-surface border border-stone-200 dark:border-outline-variant/15 px-3 py-1.5 rounded-lg font-mono text-[9px] font-bold tracking-wider transition-colors active:scale-95"
              >
                APPLY OPTIMIZATION
              </button>
            </div>
          </div>

        </div>

      </motion.div>

      {/* ─── CREATOR / EDITOR MODAL ───────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 dark:bg-stone-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25 }}
              className="bg-white dark:bg-surface-container-high border border-stone-200 dark:border-outline-variant/20 rounded-2xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent pointer-events-none" />
              
              <div className="flex items-center justify-between mb-5 z-10 relative">
                <h3 className="font-sora font-semibold text-lg text-stone-900 dark:text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-violet-500 dark:text-[#d2bbff]">
                    {isEditMode ? 'edit_note' : 'add_task'}
                  </span>
                  {isEditMode ? 'Modify Campaign Core' : 'Initialize Outreach Core'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-7 h-7 rounded-lg hover:bg-stone-100 dark:hover:bg-surface-container-highest border border-transparent hover:border-stone-200 dark:hover:border-outline-variant/10 flex items-center justify-center text-stone-400 hover:text-stone-700 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              <form onSubmit={saveCampaign} className="space-y-4 z-10 relative">
                <div className="space-y-1">
                  <label className="font-mono text-[9px] text-stone-400 dark:text-on-surface-variant font-bold uppercase block">
                    Campaign Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Q3 Sales Expansion"
                    className="w-full bg-stone-50 dark:bg-surface-container-lowest/80 border border-stone-200 dark:border-outline-variant/20 rounded-xl px-3 py-2 text-xs font-hanken text-stone-800 dark:text-on-surface focus:outline-none focus:border-violet-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[9px] text-stone-400 dark:text-on-surface-variant font-bold uppercase block">
                    Outreach Subject Line
                  </label>
                  <input
                    type="text"
                    required
                    value={formSubject}
                    onChange={(e) => setFormSubject(e.target.value)}
                    placeholder="e.g. Quick question regarding SaaS integrations"
                    className="w-full bg-stone-50 dark:bg-surface-container-lowest/80 border border-stone-200 dark:border-outline-variant/20 rounded-xl px-3 py-2 text-xs font-hanken text-stone-800 dark:text-on-surface focus:outline-none focus:border-violet-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-[9px] text-stone-400 dark:text-on-surface-variant font-bold uppercase block">
                    Target Segment
                  </label>
                  <select
                    value={formSegment}
                    onChange={(e) => setFormSegment(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-surface-container-lowest/80 border border-stone-200 dark:border-outline-variant/20 rounded-xl px-3 py-2 text-xs font-hanken text-stone-800 dark:text-on-surface focus:outline-none focus:border-violet-500/50"
                  >
                    <option value="Enterprise SaaS Leads">Enterprise SaaS Leads</option>
                    <option value="Inactive Leads">Inactive Leads</option>
                    <option value="All Contacts">All Contacts</option>
                    <option value="Qualified Lead Base">Qualified Lead Base</option>
                  </select>
                </div>

                {/* Sequence Builder */}
                <div className="space-y-2">
                  <label className="font-mono text-[9px] text-stone-400 dark:text-on-surface-variant font-bold uppercase block">
                    Sequence Steps Workflow
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newStepText}
                      onChange={(e) => setNewStepText(e.target.value)}
                      placeholder="Add step (e.g. 3-Day Followup)"
                      className="flex-grow bg-stone-50 dark:bg-surface-container-lowest/80 border border-stone-200 dark:border-outline-variant/20 rounded-xl px-3 py-2 text-xs font-hanken text-stone-800 dark:text-on-surface focus:outline-none focus:border-violet-500/50"
                    />
                    <button
                      type="button"
                      onClick={handleAddStep}
                      className="bg-stone-100 hover:bg-stone-200 dark:bg-surface-container-highest px-3 rounded-xl border border-stone-200 dark:border-outline-variant/10 text-stone-700 dark:text-on-surface font-mono text-[10px] font-bold"
                    >
                      ADD
                    </button>
                  </div>

                  {/* List of Steps */}
                  <div className="max-h-[100px] overflow-y-auto space-y-1.5 pr-1 mt-1">
                    {formSteps.map((step, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-stone-50 dark:bg-surface-container-lowest/40 px-3 py-1.5 rounded-lg border border-stone-100 dark:border-outline-variant/5">
                        <span className="font-hanken text-xs text-stone-700 dark:text-on-surface">
                          Step {idx + 1}: {step}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveStep(idx)}
                          className="text-stone-400 hover:text-rose-500 transition-colors flex items-center"
                          disabled={formSteps.length <= 1}
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100 dark:border-outline-variant/10 mt-5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-stone-50 hover:bg-stone-100 dark:bg-surface-container-high dark:hover:bg-surface-container-highest border border-stone-200 dark:border-outline-variant/15 text-stone-600 dark:text-on-surface px-4 py-2 rounded-xl font-mono text-[10px] font-bold tracking-wider transition-colors"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-violet-500 to-sky-500 dark:from-[#d2bbff] dark:to-[#63f7ff] text-white dark:text-stone-950 px-4 py-2 rounded-xl font-mono text-[10px] font-bold tracking-wider shadow-md hover:shadow-violet-500/20 transition-all"
                  >
                    {isEditMode ? 'APPLY CHANGES' : 'CREATE CORE'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
};
