import { Router } from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
  getLeadStats,
} from '../controllers/leadController';
import { protect, adminOnly } from '../middleware/auth';
import {
  createLeadValidator,
  updateLeadValidator,
  leadsQueryValidator,
} from '../validators';
import { validate } from '../middleware/validate';

const router = Router();

// All routes require authentication
router.use(protect);

// GET  /api/leads/export/csv  → Admin only (must be before /:id)
router.get('/export/csv', adminOnly, exportLeadsCSV);

// GET  /api/leads/stats       → All authenticated users
router.get('/stats', getLeadStats);

// GET  /api/leads             → All authenticated users
router.get('/', leadsQueryValidator, validate, getLeads);

// POST /api/leads             → All authenticated users
router.post('/', createLeadValidator, validate, createLead);

// GET  /api/leads/:id         → All authenticated users (with ownership check)
router.get('/:id', getLeadById);

// PUT  /api/leads/:id         → All authenticated users (with ownership check)
router.put('/:id', updateLeadValidator, validate, updateLead);

// DELETE /api/leads/:id       → Admin only
router.delete('/:id', adminOnly, deleteLead);

export default router;
