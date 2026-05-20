import { useState } from 'react';
import { motion } from 'framer-motion';
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

const DEFAULT_FILTERS: LeadFilters = { page: 1, limit: 10, sort: 'latest' };

export const Dashboard = () => {
  const { isAdmin } = useAuth();

  // Search with debounce
  const [rawSearch, setRawSearch] = useState('');
  const search = useDebounce(rawSearch, 300);

  // Filters
  const [filters, setFilters] = useState<LeadFilters>(DEFAULT_FILTERS);
  const activeFilters = { ...filters, ...(search ? { search } : {}) };

  // Data
  const { leads, pagination, isLoading, error, refetch } = useLeads(activeFilters);
  const { stats } = useStats();

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

  const onFormSuccess = () => { closeModal(); void refetch(); };

  const handleExport = async () => {
    setExporting(true);
    try { await leadsService.exportCSV(activeFilters); }
    catch { /* silently fail */ }
    finally { setExporting(false); }
  };

  return (
    <div className="min-h-screen bg-background bg-grid-pattern flex">
      {/* Sidebar */}
      <Sidebar onNewLead={openCreate} />

      {/* Main content */}
      <div className="flex-1 flex flex-col" style={{ marginLeft: 72 }}>
        {/* Navbar */}
        <Navbar search={rawSearch} onSearch={setRawSearch} />

        {/* Page canvas */}
        <main className="flex-1 overflow-y-auto p-5 space-y-5 max-w-7xl w-full mx-auto">

          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex items-end justify-between"
          >
            <div>
              <h2 className="font-sora font-semibold text-2xl text-on-surface">Dashboard</h2>
              <p className="font-hanken text-sm text-on-surface-variant mt-0.5">Overview of your lead intelligence network.</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={openCreate}
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container text-on-primary font-mono text-xs tracking-wider animate-glow"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              NEW LEAD
            </motion.button>
          </motion.div>

          {/* Stats — admin only (403 otherwise) */}
          {isAdmin && <StatsRow stats={stats} />}

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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 rounded-lg bg-error-container/20 border border-error/30 text-error font-hanken text-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">error</span>
              {error} — Check that your backend is running on port 5000.
            </motion.div>
          )}

          {/* Leads table */}
          <LeadsTable
            leads={leads}
            pagination={pagination}
            isLoading={isLoading}
            isAdmin={isAdmin}
            onEdit={openEdit}
            onRefetch={refetch}
            onPageChange={(page) => updateFilters({ page })}
          />
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
