import { Response } from 'express';
import mongoose from 'mongoose';
import Lead from '../models/Lead';
import {
  AuthRequest,
  LeadQueryParams,
  LeadFilterQuery,
  LeadStatus,
  LeadSource,
  UserRole,
  ILeadCreate,
  ILeadUpdate,
} from '../types';
import {
  asyncHandler,
  sendSuccess,
  sendError,
  sendPaginated,
} from '../utils/helpers';

// ─── Build Filter Query ───────────────────────────────────────────────────────

const buildFilterQuery = (
  params: LeadQueryParams,
  userId: string,
  role: UserRole
): LeadFilterQuery => {
  const filter: LeadFilterQuery = {};

  // Sales users can only see their own leads
  if (role === UserRole.SALES) {
    (filter as Record<string, unknown>).createdBy = userId;
  }

  if (params.status) filter.status = params.status as LeadStatus;
  if (params.source) filter.source = params.source as LeadSource;

  if (params.search) {
    const regex = params.search.trim();
    filter.$or = [
      { name: { $regex: regex, $options: 'i' } },
      { email: { $regex: regex, $options: 'i' } },
    ];
  }

  return filter;
};

// ─── GET /api/leads ───────────────────────────────────────────────────────────

export const getLeads = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const query = req.query as LeadQueryParams;

  const page = Math.max(1, parseInt(query.page ?? '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit ?? '10', 10)));
  const skip = (page - 1) * limit;
  const sortOrder = query.sort === 'oldest' ? 1 : -1;

  const filter = buildFilterQuery(query, user._id, user.role);

  const [leads, total] = await Promise.all([
    Lead.find(filter)
      .populate('createdBy', 'name email')
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),
    Lead.countDocuments(filter),
  ]);

  sendPaginated(res, leads, total, page, limit, 'Leads fetched successfully');
});

// ─── GET /api/leads/:id ───────────────────────────────────────────────────────

export const getLeadById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user!;

  const lead = await Lead.findById(req.params.id)
    .populate('createdBy', 'name email')
    .lean();

  if (!lead) {
    sendError(res, 'Lead not found', 404);
    return;
  }

  // Sales users can only view their own leads
  type PopulatedCreatedBy = { _id: mongoose.Types.ObjectId; name: string; email: string };
  const createdBy = lead.createdBy as PopulatedCreatedBy | mongoose.Types.ObjectId;
  const creatorId =
    createdBy && typeof createdBy === 'object' && '_id' in createdBy
      ? (createdBy as PopulatedCreatedBy)._id.toString()
      : lead.createdBy?.toString();
  if (
    user.role === UserRole.SALES &&
    creatorId !== user._id
  ) {
    sendError(res, 'Access denied. You can only view your own leads.', 403);
    return;
  }

  sendSuccess(res, lead, 'Lead fetched successfully');
});

// ─── POST /api/leads ──────────────────────────────────────────────────────────

export const createLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const { name, email, status, source } = req.body as ILeadCreate;

  const lead = await Lead.create({
    name,
    email,
    status: status ?? LeadStatus.NEW,
    source,
    createdBy: user._id,
  });

  const populated = await lead.populate('createdBy', 'name email');

  sendSuccess(res, populated, 'Lead created successfully', 201);
});

// ─── PUT /api/leads/:id ───────────────────────────────────────────────────────

export const updateLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const updates = req.body as ILeadUpdate;

  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    sendError(res, 'Lead not found', 404);
    return;
  }

  // Sales users can only update their own leads
  if (
    user.role === UserRole.SALES &&
    lead.createdBy.toString() !== user._id
  ) {
    sendError(res, 'Access denied. You can only update your own leads.', 403);
    return;
  }

  const updated = await Lead.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true }
  ).populate('createdBy', 'name email');

  sendSuccess(res, updated, 'Lead updated successfully');
});

// ─── DELETE /api/leads/:id (Admin only) ──────────────────────────────────────

export const deleteLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const lead = await Lead.findById(req.params.id);

  if (!lead) {
    sendError(res, 'Lead not found', 404);
    return;
  }

  await lead.deleteOne();

  sendSuccess(res, { id: req.params.id }, 'Lead deleted successfully');
});

// ─── GET /api/leads/export/csv (Admin only) ───────────────────────────────────

export const exportLeadsCSV = asyncHandler(async (req: AuthRequest, res: Response) => {
  const query = req.query as LeadQueryParams;
  const user = req.user!;

  const filter = buildFilterQuery(query, user._id, user.role);
  const sortOrder = query.sort === 'oldest' ? 1 : -1;

  const leads = await Lead.find(filter)
    .populate('createdBy', 'name email')
    .sort({ createdAt: sortOrder })
    .lean();

  // Build CSV
  const headers = ['Name', 'Email', 'Status', 'Source', 'Created By', 'Created At'];
  const rows = leads.map((lead) => {
    const createdBy = lead.createdBy as unknown as { name: string; email: string };
    return [
      `"${lead.name}"`,
      `"${lead.email}"`,
      `"${lead.status}"`,
      `"${lead.source}"`,
      `"${createdBy?.name ?? 'Unknown'}"`,
      `"${new Date(lead.createdAt).toISOString()}"`,
    ].join(',');
  });

  const csv = [headers.join(','), ...rows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename="leads-${Date.now()}.csv"`
  );
  res.status(200).send(csv);
});

// ─── GET /api/leads/stats (Admin only) ───────────────────────────────────────

export const getLeadStats = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user!;
  const filter: Record<string, mongoose.Types.ObjectId> = {};

  if (user.role === UserRole.SALES) {
    filter.createdBy = new mongoose.Types.ObjectId(user._id);
  }

  const stats = await Lead.aggregate([
    { $match: filter },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const total = await Lead.countDocuments(filter);

  const formattedStats = {
    total,
    byStatus: stats.reduce(
      (acc, curr) => {
        acc[curr._id as string] = curr.count as number;
        return acc;
      },
      {} as Record<string, number>
    ),
  };

  sendSuccess(res, formattedStats, 'Stats fetched successfully');
});
