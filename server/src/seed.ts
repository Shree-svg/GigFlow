import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db';
import User from './models/User';
import Lead from './models/Lead';
import { UserRole, LeadStatus, LeadSource } from './types';

// Load env vars
dotenv.config();

const seedData = async () => {
  try {
    // Connect to DB
    await connectDB();

    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Lead.deleteMany({});

    console.log('👥 Seeding users...');
    
    // Create Admin
    const admin = await User.create({
      name: 'Elena Rostova',
      email: 'admin@smartleads.com',
      password: 'Password123',
      role: UserRole.ADMIN
    });

    // Create Sales User 1
    const sales1 = await User.create({
      name: 'Sarah Connor',
      email: 'sales@smartleads.com',
      password: 'Password123',
      role: UserRole.SALES
    });

    // Create Sales User 2
    const sales2 = await User.create({
      name: 'Marcus Wright',
      email: 'marcus@smartleads.com',
      password: 'Password123',
      role: UserRole.SALES
    });

    console.log('📋 Seeding leads...');

    const leadsData = [
      // Leads for Sarah Connor
      {
        name: 'John Miller',
        email: 'john.miller@techcorp.com',
        status: LeadStatus.NEW,
        source: LeadSource.WEBSITE,
        createdBy: sales1._id
      },
      {
        name: 'Alice Smith',
        email: 'alice.smith@designco.io',
        status: LeadStatus.CONTACTED,
        source: LeadSource.INSTAGRAM,
        createdBy: sales1._id
      },
      {
        name: 'Bob Johnson',
        email: 'bob.j@salesforce.org',
        status: LeadStatus.QUALIFIED,
        source: LeadSource.REFERRAL,
        createdBy: sales1._id
      },
      {
        name: 'David Lee',
        email: 'dlee@startup.net',
        status: LeadStatus.LOST,
        source: LeadSource.WEBSITE,
        createdBy: sales1._id
      },
      {
        name: 'Emma Watson',
        email: 'emma@creativeagency.com',
        status: LeadStatus.NEW,
        source: LeadSource.WEBSITE,
        createdBy: sales1._id
      },
      {
        name: 'Franklin Roosevelt',
        email: 'franklin@legacygroup.us',
        status: LeadStatus.CONTACTED,
        source: LeadSource.REFERRAL,
        createdBy: sales1._id
      },

      // Leads for Marcus Wright
      {
        name: 'Grace Hopper',
        email: 'grace@compilertech.edu',
        status: LeadStatus.QUALIFIED,
        source: LeadSource.WEBSITE,
        createdBy: sales2._id
      },
      {
        name: 'Henry Cavill',
        email: 'henry@moviespectrum.co.uk',
        status: LeadStatus.NEW,
        source: LeadSource.INSTAGRAM,
        createdBy: sales2._id
      },
      {
        name: 'Ivy League',
        email: 'ivy@educationalconsulting.com',
        status: LeadStatus.CONTACTED,
        source: LeadSource.REFERRAL,
        createdBy: sales2._id
      },
      {
        name: 'Jack Ryan',
        email: 'jack@defenseintelligence.gov',
        status: LeadStatus.LOST,
        source: LeadSource.WEBSITE,
        createdBy: sales2._id
      },
      {
        name: 'Kate Beckinsale',
        email: 'kate@underworldmedia.com',
        status: LeadStatus.NEW,
        source: LeadSource.INSTAGRAM,
        createdBy: sales2._id
      },

      // Leads for Admin (Elena Rostova)
      {
        name: 'Leo Tolstoy',
        email: 'leo@classicnovels.ru',
        status: LeadStatus.QUALIFIED,
        source: LeadSource.REFERRAL,
        createdBy: admin._id
      },
      {
        name: 'Mona Lisa',
        email: 'mona@louvregallery.fr',
        status: LeadStatus.CONTACTED,
        source: LeadSource.WEBSITE,
        createdBy: admin._id
      },
      {
        name: 'Nikola Tesla',
        email: 'nikola@alternatingcurrents.io',
        status: LeadStatus.NEW,
        source: LeadSource.WEBSITE,
        createdBy: admin._id
      },
      {
        name: 'Oscar Wilde',
        email: 'oscar@aestheticism.org',
        status: LeadStatus.LOST,
        source: LeadSource.REFERRAL,
        createdBy: admin._id
      }
    ];

    await Lead.create(leadsData);

    console.log('✅ Seeding completed successfully!');
    console.log(`Created 3 Users:`);
    console.log(`  - ${admin.email} (Admin)`);
    console.log(`  - ${sales1.email} (Sales)`);
    console.log(`  - ${sales2.email} (Sales)`);
    console.log(`Created ${leadsData.length} Leads.`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedData();
