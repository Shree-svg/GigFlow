import { body, query, param } from 'express-validator';
import { LeadStatus, LeadSource, UserRole } from '../types';

// ─── Auth Validators ──────────────────────────────────────────────────────────

export const registerValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2-50 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  body('role')
    .optional()
    .isIn(Object.values(UserRole))
    .withMessage('Invalid role'),
];

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required'),
];

// ─── Lead Validators ──────────────────────────────────────────────────────────

export const createLeadValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2-100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),

  body('status')
    .optional()
    .isIn(Object.values(LeadStatus))
    .withMessage(`Status must be one of: ${Object.values(LeadStatus).join(', ')}`),

  body('source')
    .notEmpty().withMessage('Source is required')
    .isIn(Object.values(LeadSource))
    .withMessage(`Source must be one of: ${Object.values(LeadSource).join(', ')}`),
];

export const updateLeadValidator = [
  param('id')
    .isMongoId().withMessage('Invalid lead ID'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2-100 characters'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please enter a valid email')
    .normalizeEmail(),

  body('status')
    .optional()
    .isIn(Object.values(LeadStatus))
    .withMessage(`Status must be one of: ${Object.values(LeadStatus).join(', ')}`),

  body('source')
    .optional()
    .isIn(Object.values(LeadSource))
    .withMessage(`Source must be one of: ${Object.values(LeadSource).join(', ')}`),
];

export const leadsQueryValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1-100'),

  query('status')
    .optional()
    .isIn(Object.values(LeadStatus))
    .withMessage(`Status must be one of: ${Object.values(LeadStatus).join(', ')}`),

  query('source')
    .optional()
    .isIn(Object.values(LeadSource))
    .withMessage(`Source must be one of: ${Object.values(LeadSource).join(', ')}`),

  query('sort')
    .optional()
    .isIn(['latest', 'oldest'])
    .withMessage('Sort must be latest or oldest'),
];
