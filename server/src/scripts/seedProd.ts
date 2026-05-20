import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import User from '../models/User';
import Lead from '../models/Lead';
import { UserRole, LeadStatus, LeadSource } from '../types';

const MONGO_URI = process.env.MONGO_URI!;

const run = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to DB');
  await User.deleteMany({});
  await Lead.deleteMany({});
  const admin = await User.create({ name: 'Elena Rostova', email: 'admin@smartleads.com', password: 'Password123', role: UserRole.ADMIN });
  const sales1 = await User.create({ name: 'Sarah Connor', email: 'sales@smartleads.com', password: 'Password123', role: UserRole.SALES });
  const sales2 = await User.create({ name: 'Marcus Wright', email: 'marcus@smartleads.com', password: 'Password123', role: UserRole.SALES });
  await Lead.create([
    { name: 'John Miller', email: 'john@techcorp.com', status: LeadStatus.NEW, source: LeadSource.WEBSITE, createdBy: sales1._id },
    { name: 'Alice Smith', email: 'alice@designco.io', status: LeadStatus.CONTACTED, source: LeadSource.INSTAGRAM, createdBy: sales1._id },
    { name: 'Bob Johnson', email: 'bob@salesforce.org', status: LeadStatus.QUALIFIED, source: LeadSource.REFERRAL, createdBy: admin._id },
    { name: 'Nikola Tesla', email: 'nikola@currents.io', status: LeadStatus.NEW, source: LeadSource.WEBSITE, createdBy: admin._id },
    { name: 'Grace Hopper', email: 'grace@compiler.edu', status: LeadStatus.QUALIFIED, source: LeadSource.WEBSITE, createdBy: sales2._id },
  ]);
  console.log('✅ Seeded!');
  console.log('admin@smartleads.com / Password123');
  console.log('sales@smartleads.com / Password123');
  console.log('marcus@smartleads.com / Password123');
  await mongoose.disconnect();
};

run().catch(console.error);
