import { useState, useEffect, useCallback } from 'react';
import type { Lead, LeadFilters, PaginationMeta, LeadStats } from '../types';
import { leadsService } from '../services/leads.service';

// ─── useDebounce ──────────────────────────────────────────────────────────────

export const useDebounce = <T>(value: T, delay = 300): T => {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

// ─── useTheme ─────────────────────────────────────────────────────────────────

export const useTheme = () => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true; // default dark
  });

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      html.classList.remove('light');
    } else {
      html.classList.add('light');
      html.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggle = () => setIsDark((d) => !d);
  return { isDark, toggle };
};

// ─── useLeads ─────────────────────────────────────────────────────────────────

export const useLeads = (filters: LeadFilters) => {
  const [leads, setLeads]       = useState<Lead[]>([]);
  const [pagination, setPag]    = useState<PaginationMeta | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await leadsService.getLeads(filters);
      setLeads(res.data);
      setPag(res.pagination);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch leads';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]); // eslint-disable-line

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void fetch(); }, [fetch]);

  return { leads, pagination, isLoading, error, refetch: fetch };
};

// ─── useStats ─────────────────────────────────────────────────────────────────

export const useStats = () => {
  const [stats, setStats]       = useState<LeadStats | null>(null);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    leadsService.getStats()
      .then((res) => { if (res.data) setStats(res.data); })
      .catch(() => {/* non-admin gets 403, ignore */})
      .finally(() => setLoading(false));
  }, []);

  return { stats, isLoading };
};
