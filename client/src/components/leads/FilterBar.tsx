import { motion } from 'framer-motion';
import type { LeadStatus, LeadSource, LeadFilters } from '../../types';

interface FilterBarProps {
  filters: LeadFilters;
  onChange: (f: Partial<LeadFilters>) => void;
  onExport: () => void;
  isAdmin: boolean;
  isExporting: boolean;
}

const STATUS_OPTIONS: (LeadStatus | undefined)[] = [undefined, 'New', 'Contacted', 'Qualified', 'Lost'];
const SOURCE_OPTIONS: (LeadSource | undefined)[] = [undefined, 'Website', 'Instagram', 'Referral'];

export const FilterBar = ({ filters, onChange, onExport, isAdmin, isExporting }: FilterBarProps) => {
  const hasActiveFilters = filters.status || filters.source || filters.sort !== 'latest';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-panel rounded-xl p-4 flex flex-col gap-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-wrap">
        {/* Status pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[10px] tracking-widest text-on-surface-variant uppercase mr-1">Status</span>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s ?? 'all'}
              onClick={() => onChange({ status: s, page: 1 })}
              className={`px-3 py-1 rounded-full font-mono text-[10px] tracking-widest transition-all duration-200
                ${filters.status === s
                  ? 'bg-primary-container text-on-primary animate-glow'
                  : 'border border-outline-variant/50 text-on-surface-variant hover:bg-surface-variant/30'
                }`}
            >
              {s ?? 'ALL'}
            </button>
          ))}
        </div>

        {/* Source pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[10px] tracking-widest text-on-surface-variant uppercase mr-1">Source</span>
          {SOURCE_OPTIONS.map((s) => (
            <button
              key={s ?? 'all'}
              onClick={() => onChange({ source: s, page: 1 })}
              className={`px-3 py-1 rounded-full font-mono text-[10px] tracking-widest transition-all duration-200
                ${filters.source === s
                  ? 'bg-secondary-container text-secondary-fixed-dim border border-secondary/40'
                  : 'border border-outline-variant/50 text-on-surface-variant hover:bg-surface-variant/30'
                }`}
            >
              {s ?? 'ALL'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] tracking-widest text-on-surface-variant uppercase">Sort</span>
          <div className="relative">
            <select
              value={filters.sort}
              onChange={(e) => onChange({ sort: e.target.value as 'latest' | 'oldest', page: 1 })}
              className="bg-surface-container border border-outline-variant/50 text-on-surface rounded-lg px-3 py-1.5 font-mono text-xs appearance-none focus:outline-none focus:border-primary-container pr-7"
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-sm">expand_more</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Clear filters */}
          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => onChange({ status: undefined, source: undefined, sort: 'latest', page: 1 })}
              className="font-mono text-[10px] tracking-widest text-on-surface-variant hover:text-error transition-colors border border-outline-variant/30 rounded-full px-3 py-1"
            >
              CLEAR FILTERS
            </motion.button>
          )}

          {/* CSV Export - Admin only */}
          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExport}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg font-mono text-xs tracking-wider bg-tertiary-fixed/10 text-tertiary-fixed border border-tertiary-fixed/30 hover:bg-tertiary-fixed/20 hover:shadow-[0_0_12px_rgba(255,219,63,0.3)] transition-all disabled:opacity-50"
            >
              <motion.span
                className="material-symbols-outlined text-sm"
                animate={isExporting ? { y: [0, 3, 0] } : {}}
                transition={{ repeat: Infinity, duration: 0.6 }}
              >
                download
              </motion.span>
              {isExporting ? 'EXPORTING…' : 'EXPORT CSV'}
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
