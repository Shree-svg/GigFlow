import mongoose, { Schema } from 'mongoose';
import { ILead, LeadStatus, LeadSource } from '../types';

const LeadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    status: {
      type: String,
      enum: Object.values(LeadStatus),
      default: LeadStatus.NEW,
    },
    source: {
      type: String,
      enum: Object.values(LeadSource),
      required: [true, 'Source is required'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster querying
LeadSchema.index({ status: 1 });
LeadSchema.index({ source: 1 });
LeadSchema.index({ createdBy: 1 });
LeadSchema.index({ name: 'text', email: 'text' }); // text search index
LeadSchema.index({ createdAt: -1 });

const Lead = mongoose.model<ILead>('Lead', LeadSchema);
export default Lead;
