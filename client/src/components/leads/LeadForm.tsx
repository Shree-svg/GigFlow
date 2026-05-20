import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Lead, LeadFormData, LeadSource, LeadStatus } from '../../types';
import { leadsService } from '../../services/leads.service';
import { Button } from '../ui';

interface LeadFormProps {
  lead?: Lead;
  onSuccess: () => void;
  onCancel: () => void;
}

const STATUS_OPTIONS: LeadStatus[] = ['New', 'Contacted', 'Qualified', 'Lost'];
const SOURCE_OPTIONS: LeadSource[] = ['Website', 'Instagram', 'Referral'];

const inputCls = 'w-full bg-surface/50 border border-outline-variant/30 text-on-surface rounded-lg py-2.5 pl-10 pr-3 focus:outline-none focus:border-primary-container focus:shadow-[0_0_12px_rgba(0,245,255,0.15)] transition-all font-hanken text-sm placeholder-on-surface-variant/50';
const selectCls = 'w-full bg-surface/50 border border-outline-variant/30 text-on-surface rounded-lg py-2.5 pl-10 pr-8 appearance-none focus:outline-none focus:border-primary-container focus:shadow-[0_0_12px_rgba(0,245,255,0.15)] transition-all font-hanken text-sm';

type FormErrors = Partial<Record<keyof LeadFormData, string>>;

export const LeadForm = ({ lead, onSuccess, onCancel }: LeadFormProps) => {
  const isEdit = !!lead;
  const [form, setForm] = useState<LeadFormData>({
    name:   lead?.name   ?? '',
    email:  lead?.email  ?? '',
    status: lead?.status ?? 'New',
    source: lead?.source ?? 'Website',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.name.trim() || form.name.length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Please enter a valid email';
    if (!form.source) e.source = 'Source is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      if (isEdit) await leadsService.updateLead(lead._id, form);
      else await leadsService.createLead(form);
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setApiError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name' as const, label: 'Full Name', icon: 'person', type: 'text', placeholder: 'e.g. Jane Doe' },
    { key: 'email' as const, label: 'Email Address', icon: 'mail', type: 'email', placeholder: 'jane@company.com' },
  ];

  return (
    <div className="p-6 flex flex-col gap-5">
      {/* Autofill Demo Lead */}
      {!isEdit && (
        <motion.button
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          type="button"
          onClick={() => {
            setForm({
              name: 'Alexander Mercer',
              email: 'alex.mercer@cybernet.io',
              status: 'Qualified',
              source: 'Website'
            });
            setErrors({});
          }}
          className="w-full py-2 bg-primary-container/10 border border-primary-container/20 rounded-lg text-primary-fixed hover:bg-primary-container/20 text-xs font-mono tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">precision_manufacturing</span>
          Autofill Demo Lead
        </motion.button>
      )}

      {/* Text fields */}
      {fields.map((f, i) => (
        <motion.div
          key={f.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className="flex flex-col gap-1.5"
        >
          <label className="font-mono text-[10px] tracking-widest text-on-surface-variant uppercase">
            {f.label} <span className="text-error">*</span>
          </label>
          <div className="relative group">
            <span className={`material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm transition-colors ${errors[f.key] ? 'text-error' : 'text-on-surface-variant group-focus-within:text-primary-fixed'}`}>
              {f.icon}
            </span>
            <input
              type={f.type}
              value={form[f.key]}
              onChange={(e) => { setForm((p) => ({ ...p, [f.key]: e.target.value })); setErrors((p) => ({ ...p, [f.key]: '' })); }}
              placeholder={f.placeholder}
              className={`${inputCls} ${errors[f.key] ? '!border-error/50 !bg-error-container/10' : ''}`}
            />
          </div>
          {errors[f.key] && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1 text-error">
              <span className="material-symbols-outlined text-xs">error</span>
              <span className="font-hanken text-xs">{errors[f.key]}</span>
            </motion.div>
          )}
        </motion.div>
      ))}

      {/* Status + Source selects */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14 }}
        className="grid grid-cols-2 gap-4"
      >
        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[10px] tracking-widest text-on-surface-variant uppercase">Status</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">cycle</span>
            <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as LeadStatus }))} className={selectCls}>
              {STATUS_OPTIONS.map((s) => <option key={s} value={s} className="bg-surface-container">{s}</option>)}
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-sm">expand_more</span>
          </div>
        </div>

        {/* Source */}
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[10px] tracking-widest text-on-surface-variant uppercase">
            Source <span className="text-error">*</span>
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">campaign</span>
            <select value={form.source} onChange={(e) => setForm((p) => ({ ...p, source: e.target.value as LeadSource }))} className={selectCls}>
              {SOURCE_OPTIONS.map((s) => <option key={s} value={s} className="bg-surface-container">{s}</option>)}
            </select>
            <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-sm">expand_more</span>
          </div>
        </div>
      </motion.div>

      {/* API error */}
      {apiError && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-error-container/20 border border-error/30 text-error font-hanken text-sm">
          <span className="material-symbols-outlined text-sm">error</span>
          {apiError}
        </div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex justify-end gap-3 pt-2 border-t border-primary-container/10"
      >
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" loading={loading} onClick={handleSubmit}>
          <span className="material-symbols-outlined text-sm">{isEdit ? 'save' : 'add_circle'}</span>
          {isEdit ? 'Save Changes' : 'Create Lead'}
        </Button>
      </motion.div>
    </div>
  );
};
