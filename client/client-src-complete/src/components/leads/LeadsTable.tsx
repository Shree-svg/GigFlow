import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Lead, PaginationMeta } from '../../types';
import { StatusBadge, SkeletonRow, Button } from '../ui';
import { leadsService } from '../../services/leads.service';

interface LeadsTableProps {
  leads: Lead[];
  pagination: PaginationMeta | null;
  isLoading: boolean;
  isAdmin: boolean;
  onEdit: (lead: Lead) => void;
  onRefetch: () => void;
  onPageChange: (page: number) => void;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

export const LeadsTable = ({
  leads, pagination, isLoading, isAdmin, onEdit, onRefetch, onPageChange,
}: LeadsTableProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await leadsService.deleteLead(id);
      onRefetch();
    } catch {
      // show nothing, row stays
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-panel rounded-xl overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/20 bg-surface-container/30">
              {['Lead Details', 'Status', 'Source', 'Created', 'Actions'].map((h) => (
                <th key={h} className="px-5 py-3.5 font-mono text-[10px] tracking-widest text-on-surface-variant uppercase">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              : leads.length === 0
                ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center gap-3"
                      >
                        <span className="material-symbols-outlined text-5xl text-on-surface-variant/40">search_off</span>
                        <p className="font-mono text-sm text-on-surface-variant">No leads found</p>
                        <p className="font-hanken text-xs text-on-surface-variant/60">Try adjusting your filters or search query</p>
                      </motion.div>
                    </td>
                  </tr>
                )
                : (
                  <AnimatePresence>
                    {leads.map((lead, i) => (
                      <motion.tr
                        key={lead._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -40, scale: 0.95 }}
                        transition={{ delay: i * 0.03, type: 'spring', stiffness: 300, damping: 25 }}
                        className="border-b border-outline-variant/10 hover:bg-primary-container/5 transition-colors group"
                      >
                        {/* Lead details */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-surface-variant flex items-center justify-center font-bold font-mono text-sm text-on-surface-variant shrink-0">
                              {lead.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-hanken font-semibold text-on-surface text-sm">{lead.name}</p>
                              <p className="font-mono text-xs text-on-surface-variant">{lead.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <StatusBadge status={lead.status} />
                        </td>

                        {/* Source */}
                        <td className="px-5 py-4">
                          <span className="font-mono text-xs text-on-surface-variant">{lead.source}</span>
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4">
                          <span className="font-mono text-xs text-on-surface-variant">{formatDate(lead.createdAt)}</span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Edit */}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onEdit(lead)}
                              className="p-1.5 rounded text-on-surface-variant hover:text-primary-container hover:bg-primary-container/10 transition-colors"
                              title="Edit lead"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </motion.button>

                            {/* Delete — admin only */}
                            {isAdmin && (
                              confirmId === lead._id ? (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1, x: [0, -3, 3, -3, 0] }}
                                  className="flex items-center gap-1"
                                >
                                  <Button
                                    variant="danger"
                                    size="sm"
                                    loading={deletingId === lead._id}
                                    onClick={() => handleDelete(lead._id)}
                                  >
                                    Confirm
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => setConfirmId(null)}>✕</Button>
                                </motion.div>
                              ) : (
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => setConfirmId(lead._id)}
                                  className="p-1.5 rounded text-on-surface-variant hover:text-error hover:bg-error-container/20 transition-colors"
                                  title="Delete lead"
                                >
                                  <span className="material-symbols-outlined text-sm">delete</span>
                                </motion.button>
                              )
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )
            }
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-5 py-4 border-t border-outline-variant/20 flex items-center justify-between">
          <span className="font-mono text-xs text-on-surface-variant">
            Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total.toLocaleString()}
          </span>

          <div className="flex items-center gap-1.5">
            <button
              disabled={!pagination.hasPrevPage}
              onClick={() => onPageChange(pagination.page - 1)}
              className="p-1.5 rounded border border-outline-variant/50 text-on-surface-variant hover:bg-surface-variant/30 disabled:opacity-30 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>

            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`w-8 h-8 rounded font-mono text-xs transition-all duration-200
                    ${pagination.page === page
                      ? 'bg-primary-container text-on-primary animate-glow'
                      : 'border border-outline-variant/50 text-on-surface-variant hover:bg-surface-variant/30'
                    }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              disabled={!pagination.hasNextPage}
              onClick={() => onPageChange(pagination.page + 1)}
              className="p-1.5 rounded border border-outline-variant/50 text-on-surface-variant hover:bg-surface-variant/30 disabled:opacity-30 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
