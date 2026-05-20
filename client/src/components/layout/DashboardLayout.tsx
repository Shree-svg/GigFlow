import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Modal } from '../ui';
import { LeadForm } from '../leads/LeadForm';
import type { Lead } from '../../types';
import { leadsService } from '../../services/leads.service';

export const DashboardLayout = () => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [isExporting, setExporting] = useState(false);

  const openCreate = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      await leadsService.exportCSV({ page: 1, limit: 1000, sort: 'latest' });
    } catch {
      // ignore
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="h-screen bg-background bg-grid-pattern flex relative overflow-hidden">
      {/* Dynamic Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary-container/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-secondary-container/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Sidebar */}
      <Sidebar onNewLead={openCreate} onExport={handleExport} />
      
      <div className="flex-1 flex flex-col z-10" style={{ marginLeft: 72 }}>
        <Navbar search={search} onSearch={setSearch} />
        
        {/* Pass search via context if children need it */}
        <div className="flex-1 overflow-y-auto">
          <Outlet context={{ search }} />
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal} title="Add New Lead">
        <LeadForm onSuccess={closeModal} onCancel={closeModal} />
      </Modal>
    </div>
  );
};
