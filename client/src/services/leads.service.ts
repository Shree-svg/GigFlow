import api from './api';
import type { ApiResponse, Lead, LeadFilters, LeadFormData, LeadStats, PaginatedResponse } from '../types';

export const leadsService = {
  async getLeads(filters: Partial<LeadFilters>) {
    const params = new URLSearchParams();
    if (filters.page)   params.set('page',   String(filters.page));
    if (filters.limit)  params.set('limit',  String(filters.limit));
    if (filters.status) params.set('status', filters.status);
    if (filters.source) params.set('source', filters.source);
    if (filters.search) params.set('search', filters.search);
    if (filters.sort)   params.set('sort',   filters.sort);

    const { data } = await api.get<PaginatedResponse<Lead>>(`/leads?${params.toString()}`);
    return data;
  },

  async getLead(id: string) {
    const { data } = await api.get<ApiResponse<Lead>>(`/leads/${id}`);
    return data;
  },

  async createLead(payload: LeadFormData) {
    const { data } = await api.post<ApiResponse<Lead>>('/leads', payload);
    return data;
  },

  async updateLead(id: string, payload: Partial<LeadFormData>) {
    const { data } = await api.put<ApiResponse<Lead>>(`/leads/${id}`, payload);
    return data;
  },

  async deleteLead(id: string) {
    const { data } = await api.delete<ApiResponse>(`/leads/${id}`);
    return data;
  },

  async getStats() {
    const { data } = await api.get<ApiResponse<LeadStats>>('/leads/stats');
    return data;
  },

  async exportCSV(filters: Partial<LeadFilters>) {
    const params = new URLSearchParams();
    if (filters.status) params.set('status', filters.status);
    if (filters.source) params.set('source', filters.source);
    if (filters.search) params.set('search', filters.search);
    if (filters.sort)   params.set('sort',   filters.sort);

    const response = await api.get(`/leads/export/csv?${params.toString()}`, {
      responseType: 'blob',
    });

    // Trigger browser download
    const url = window.URL.createObjectURL(new Blob([response.data as BlobPart]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
