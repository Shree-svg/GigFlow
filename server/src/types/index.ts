import { Request } from 'express';
import { Document, Types } from 'mongoose';

// ─── Enums ───────────────────────────────────────────────────────────────────

export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  LOST = 'Lost',
}

export enum LeadSource {
  WEBSITE = 'Website',
  INSTAGRAM = 'Instagram',
  REFERRAL = 'Referral',
}

export enum UserRole {
  ADMIN = 'Admin',
  SALES = 'Sales User',
}

// ─── User Types ───────────────────────────────────────────────────────────────

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserPublic {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

// ─── Lead Types ───────────────────────────────────────────────────────────────

export interface ILead extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILeadCreate {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}

export interface ILeadUpdate {
  name?: string;
  email?: string;
  status?: LeadStatus;
  source?: LeadSource;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// ─── Query / Filter Types ─────────────────────────────────────────────────────

export interface LeadQueryParams {
  page?: string;
  limit?: string;
  status?: LeadStatus;
  source?: LeadSource;
  search?: string;
  sort?: 'latest' | 'oldest';
}

export interface LeadFilterQuery {
  status?: LeadStatus;
  source?: LeadSource;
  $or?: Array<{
    name?: { $regex: string; $options: string };
    email?: { $regex: string; $options: string };
  }>;
}

// ─── JWT Payload ──────────────────────────────────────────────────────────────

export interface JwtPayload {
  userId: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// ─── Extended Express Request ─────────────────────────────────────────────────

export interface AuthRequest extends Request {
  user?: IUserPublic;
  body: any;
  params: any;
  query: any;
  headers: any;
}