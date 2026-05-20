import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Lead, LeadFilters } from '../types';
import { useLeads, useStats, useDebounce } from '../hooks';
import { useAuth } from '../context/AuthContext';
import { leadsService } from '../services/leads.service';
import { Sidebar } from '../components/layout/Sidebar';
import { Navbar } from '../components/layout/Navbar';
import { StatsRow } from '../components/leads/StatsRow';
import { FilterBar } from '../components/leads/FilterBar';
import { LeadsTable } from '../components/leads/LeadsTable';
import { Modal } from '../components/ui';
import { LeadForm } from '../components/leads/LeadForm';
import { AnalyticsView } from '../components/dashboard/AnalyticsView';
import { CampaignsView } from '../components/dashboard/CampaignsView';
import { SettingsView } from '../components/dashboard/SettingsView';

const DEFAULT_FILTERS: LeadFilters = { page: 1, limit: 10, sort: 'latest' };

export const Dashboard = () => {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'campaigns' | 'settings'>('dashboard');

  // Search with debounce
  const [rawSearch, setRawSearch] = useState('');
  const search = useDebounce(rawSearch, 300);

  // Filters
  const [filters, setFilters] = useState<LeadFilters>(DEFAULT_FILTERS);
  const activeFilters = { ...filters, ...(search ? { search } : {}) };

  // Data
  const { leads, pagination, isLoading, error, refetch: refetchLeads } = useLeads(activeFilters);
  const { stats, refetch: refetchStats } = useStats();

  const refetchAll = () => {
    void refetchLeads();
    void refetchStats();
  };

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | undefined>();

  // CSV export
  const [isExporting, setExporting] = useState(false);

  const updateFilters = (partial: Partial<LeadFilters>) =>
    setFilters((prev) => ({ ...prev, ...partial }));

  const openCreate = () => { setEditingLead(undefined); setModalOpen(true); };
  const openEdit = (lead: Lead) => { setEditingLead(lead); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditingLead(undefined); };

  const onFormSuccess = () => { closeModal(); refetchAll(); };

  const handleExport = async () => {
    setExporting(true);
    try {
      await leadsService.exportCSV(activeFilters);
    } catch {
      // Backend export failed — fall back to client-side CSV from loaded leads
      try {
        const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];
        const rows = leads.map((l) => [
          `"${l.name ?? ''}"`,
          `"${l.email ?? ''}"`,
          `"${l.status ?? ''}"`,
          `"${l.source ?? ''}"`,
          `"${l.createdAt ? new Date(l.createdAt).toLocaleDateString() : ''}"`,
        ]);
        const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `leads-${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      } catch {
        // ignore final fallback error
      }
    } finally {
      setExporting(false);
    }
  };

  // Tab configurations
  const tabConfig = {
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Overview of your lead intelligence network.',
    },
    analytics: {
      title: 'Analytics Hub',
      subtitle: 'Deep insight metrics, conversion tracking, and pipeline performance.',
    },
    campaigns: {
      title: 'Campaign Registry',
      subtitle: 'Automate, deploy, and monitor lead engagement campaigns.',
    },
    settings: {
      title: 'System Settings',
      subtitle: 'Manage user profile preferences, visual interface themes, and credentials.',
    },
  };

  return (
    <div className="min-h-screen bg-background bg-grid-pattern flex">
      {/* Sidebar */}
      <Sidebar onNewLead={openCreate} activeTab={activeTab} onTabChange={(tab: 'dashboard' | 'analytics' | 'campaigns' | 'settings') => setActiveTab(tab)} />

      {/* Main content */}
      <div className="flex-1 flex flex-col" style={{ marginLeft: 72 }}>
        {/* Navbar */}
        <Navbar search={rawSearch} onSearch={setRawSearch} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Page canvas */}
        <main className="flex-1 overflow-y-auto p-5 space-y-5 max-w-7xl w-full mx-auto">

          {/* Page header */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-end justify-between"
          >
            <div>
              <h2 className="font-sora font-semibold text-2xl text-on-surface">{tabConfig[activeTab].title}</h2>
              <p className="font-hanken text-sm text-on-surface-variant mt-0.5">{tabConfig[activeTab].subtitle}</p>
            </div>
            {activeTab === 'dashboard' && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={openCreate}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container text-on-primary font-mono text-xs tracking-wider animate-glow"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                NEW LEAD
              </motion.button>
            )}
          </motion.div>

          {/* Conditionally render based on activeTab */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && (
                <div className="space-y-5">
                  {/* Stats — respects role limits */}
                  <StatsRow stats={stats} />

                  {/* Filter bar */}
                  <FilterBar
                    filters={filters}
                    onChange={updateFilters}
                    onExport={handleExport}
                    isAdmin={isAdmin}
                    isExporting={isExporting}
                  />

                  {/* API error banner */}
                  {error && (
                    <div className="p-4 rounded-lg bg-error-container/20 border border-error/30 text-error font-hanken text-sm flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">error</span>
                      {error} — Check that your backend is running on port 5000.
                    </div>
                  )}

                  {/* Leads table */}
                  <LeadsTable
                    leads={leads}
                    pagination={pagination}
                    isLoading={isLoading}
                    isAdmin={isAdmin}
                    onEdit={openEdit}
                    onRefetch={refetchAll}
                    onPageChange={(page: number) => updateFilters({ page })}
                  />
                </div>
              )}

              {activeTab === 'analytics' && <AnalyticsView stats={stats || { total: 0, byStatus: {} }} />}

              {activeTab === 'campaigns' && <CampaignsView />}

              {activeTab === 'settings' && <SettingsView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingLead ? 'Edit Lead' : 'Add New Lead'}
      >
        <LeadForm
          lead={editingLead}
          onSuccess={onFormSuccess}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};
