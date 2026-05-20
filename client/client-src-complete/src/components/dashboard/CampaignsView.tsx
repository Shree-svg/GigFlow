import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Campaign {
  id: string;
  name: string;
  channel: 'Email' | 'Social Ad' | 'Referral' | 'Google Ads';
  status: 'Active' | 'Paused' | 'Completed' | 'Draft';
  budget: number;
  spent: number;
  reach: number;
  clicks: number;
  leadsGenerated: number;
  createdAt: string;
}

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'c1',
    name: 'Q2 Enterprise Drip Sequence',
    channel: 'Email',
    status: 'Active',
    budget: 2500,
    spent: 1240,
    reach: 4800,
    clicks: 1420,
    leadsGenerated: 34,
    createdAt: '2026-05-01',
  },
  {
    id: 'c2',
    name: 'Instagram Mid-Market Ad',
    channel: 'Social Ad',
    status: 'Active',
    budget: 1500,
    spent: 850,
    reach: 18200,
    clicks: 980,
    leadsGenerated: 26,
    createdAt: '2026-05-05',
  },
  {
    id: 'c3',
    name: 'Standard Referral Program v2',
    channel: 'Referral',
    status: 'Paused',
    budget: 1000,
    spent: 320,
    reach: 840,
    clicks: 210,
    leadsGenerated: 12,
    createdAt: '2026-04-12',
  },
  {
    id: 'c4',
    name: 'Google Search High-Intent SEO',
    channel: 'Google Ads',
    status: 'Draft',
    budget: 5000,
    spent: 0,
    reach: 0,
    clicks: 0,
    leadsGenerated: 0,
    createdAt: '2026-05-18',
  },
];

export const CampaignsView = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [channel, setChannel] = useState<'Email' | 'Social Ad' | 'Referral' | 'Google Ads'>('Email');
  const [budget, setBudget] = useState(1000);

  const toggleStatus = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const nextStatus: Campaign['status'] = c.status === 'Active' ? 'Paused' : 'Active';
        return { ...c, status: nextStatus };
      })
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newCampaign: Campaign = {
      id: `c_${Date.now()}`,
      name: name.trim(),
      channel,
      status: 'Active',
      budget,
      spent: 0,
      reach: 0,
      clicks: 0,
      leadsGenerated: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setCampaigns((prev) => [newCampaign, ...prev]);
    setName('');
    setBudget(1000);
    setChannel('Email');
    setShowCreateModal(false);
  };

  // Compute aggregated stats
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalReach = campaigns.reduce((sum, c) => sum + c.reach, 0);
  const totalLeads = campaigns.reduce((sum, c) => sum + c.leadsGenerated, 0);

  return (
    <div className="space-y-6">
      {/* Campaign Statistics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'TOTAL CAMPAIGNS', value: campaigns.length, sub: 'Configured campaigns', icon: 'campaign' },
          { label: 'AGGREGATED BUDGET', value: `$${totalSpent.toLocaleString()}`, sub: `Out of $${totalBudget.toLocaleString()} budget`, icon: 'payments' },
          { label: 'TOTAL CAMPAIGN REACH', value: totalReach.toLocaleString(), sub: 'Unique impressions', icon: 'visibility' },
          { label: 'CONVERSIONS CAPTURED', value: totalLeads, sub: 'Leads generated from ads', icon: 'group_add' },
        ].map((stat) => (
          <div key={stat.label} className="glass-panel p-4 rounded-xl border border-outline-variant/15 flex justify-between items-center h-24">
            <div>
              <p className="font-mono text-[9px] tracking-widest text-on-surface-variant/80 uppercase">{stat.label}</p>
              <p className="font-sora font-semibold text-lg text-on-surface mt-1">{stat.value}</p>
              <p className="font-hanken text-[10px] text-on-surface-variant/60">{stat.sub}</p>
            </div>
            <span className="material-symbols-outlined text-primary-fixed opacity-70">{stat.icon}</span>
          </div>
        ))}
      </div>

      {/* Campaigns Header & List */}
      <div className="glass-panel rounded-xl border border-outline-variant/10 overflow-hidden">
        <div className="p-5 border-b border-outline-variant/10 flex justify-between items-center">
          <div>
            <h3 className="font-sora font-semibold text-base text-on-surface">Campaign Registry</h3>
            <p className="font-hanken text-xs text-on-surface-variant">Manage and deploy active marketing efforts</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container text-on-primary font-mono text-[11px] tracking-wider transition-all hover:scale-105 active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">rocket_launch</span>
            NEW CAMPAIGN
          </button>
        </div>

        {/* Campaign Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-hanken">
            <thead className="bg-surface-container-high/20 border-b border-outline-variant/10 text-[10px] tracking-widest font-mono text-on-surface-variant uppercase">
              <tr>
                <th className="py-3.5 px-5">Campaign</th>
                <th className="py-3.5 px-4">Channel</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Budget / Spent</th>
                <th className="py-3.5 px-4 text-center">Open / Clicks</th>
                <th className="py-3.5 px-4 text-center">Leads</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5 text-xs">
              {campaigns.map((camp) => {
                const ctr = camp.clicks > 0 ? ((camp.clicks / camp.reach) * 100).toFixed(1) : '0.0';
                return (
                  <tr key={camp.id} className="hover:bg-surface-variant/10 transition-colors">
                    {/* Campaign Info */}
                    <td className="py-4 px-5">
                      <div className="font-mono text-sm text-on-surface font-semibold">{camp.name}</div>
                      <div className="font-mono text-[10px] text-on-surface-variant/60 mt-0.5">Created: {camp.createdAt}</div>
                    </td>

                    {/* Channel */}
                    <td className="py-4 px-4 font-mono text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-surface-container border border-outline-variant/10 text-on-surface-variant">
                        {camp.channel}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold border
                        ${camp.status === 'Active' ? 'badge-new glow-cyan' : ''}
                        ${camp.status === 'Paused' ? 'badge-contacted' : ''}
                        ${camp.status === 'Completed' ? 'badge-qualified' : ''}
                        ${camp.status === 'Draft' ? 'badge-lost' : ''}
                      `}>
                        <span className={`w-1.5 h-1.5 rounded-full ${camp.status === 'Active' ? 'bg-cyan-400 animate-pulse' : 'bg-current'}`} />
                        {camp.status.toUpperCase()}
                      </span>
                    </td>

                    {/* Budget / Spent */}
                    <td className="py-4 px-4 font-mono">
                      <div className="text-on-surface">${camp.budget.toLocaleString()}</div>
                      <div className="text-[10px] text-on-surface-variant/60 mt-0.5">Spent: ${camp.spent.toLocaleString()}</div>
                    </td>

                    {/* CTR / Clicks */}
                    <td className="py-4 px-4 text-center font-mono">
                      <div className="text-on-surface">{camp.reach > 0 ? `${ctr}%` : '—'}</div>
                      <div className="text-[10px] text-on-surface-variant/60 mt-0.5">{camp.clicks.toLocaleString()} clicks</div>
                    </td>

                    {/* Leads */}
                    <td className="py-4 px-4 text-center font-mono">
                      <span className="text-primary-fixed font-bold text-sm">{camp.leadsGenerated}</span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      {camp.status !== 'Completed' && camp.status !== 'Draft' && (
                        <button
                          onClick={() => toggleStatus(camp.id)}
                          className="px-2.5 py-1 rounded border border-outline-variant/20 hover:bg-surface-variant/40 transition-colors font-mono text-[10px] text-on-surface-variant"
                        >
                          {camp.status === 'Active' ? 'PAUSE' : 'RESUME'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campaign Creation Modal Overlay */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Content Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md glass-panel rounded-2xl border border-outline-variant/15 overflow-hidden shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-sora font-semibold text-lg text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-fixed">rocket_launch</span>
                  Launch Campaign
                </h4>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-on-surface-variant hover:text-on-surface"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4 font-hanken">
                <div className="space-y-1">
                  <label className="block text-xs font-mono text-on-surface-variant">CAMPAIGN NAME</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Q3 Summer Ads Lead Gen"
                    className="w-full bg-surface-container-high/40 border border-outline-variant/20 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary-container"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-mono text-on-surface-variant">CHANNEL</label>
                    <select
                      value={channel}
                      onChange={(e) => setChannel(e.target.value as any)}
                      className="w-full bg-surface-container-high/40 border border-outline-variant/20 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary-container"
                    >
                      <option value="Email">Email</option>
                      <option value="Social Ad">Social Ad</option>
                      <option value="Referral">Referral</option>
                      <option value="Google Ads">Google Ads</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-mono text-on-surface-variant">BUDGET ($)</label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full bg-surface-container-high/40 border border-outline-variant/20 rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary-container"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-outline-variant/10">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-xs font-mono text-on-surface-variant hover:text-on-surface"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-mono rounded-lg bg-primary-container text-on-primary animate-glow"
                  >
                    DEPLOY CAMPAIGN
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
