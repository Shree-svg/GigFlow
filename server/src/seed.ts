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

    console.log('📋 Generating and seeding 120 realistic leads spread across 6 months...');

    const names = [
      'John Miller', 'Alice Smith', 'Bob Johnson', 'David Lee', 'Emma Watson',
      'Franklin Roosevelt', 'Grace Hopper', 'Henry Cavill', 'Ivy League', 'Jack Ryan',
      'Kate Beckinsale', 'Leo Tolstoy', 'Mona Lisa', 'Nikola Tesla', 'Oscar Wilde',
      'Winston Churchill', 'Jane Austen', 'Albert Einstein', 'Marie Curie', 'Isaac Newton',
      'Charles Darwin', 'Ada Lovelace', 'Alan Turing', 'Margaret Hamilton', 'Stephen Hawking',
      'Richard Feynman', 'Galileo Galilei', 'Thomas Edison', 'Alexander Bell', 'Steve Jobs',
      'Bill Gates', 'Elon Musk', 'Jeff Bezos', 'Warren Buffett', 'Mark Zuckerberg',
      'Sheryl Sandberg', 'Indra Nooyi', 'Satya Nadella', 'Sundar Pichai', 'Tim Cook',
      'Larry Page', 'Sergey Brin', 'Jack Ma', 'Pony Ma', 'Richard Branson',
      'Oprah Winfrey', 'Walt Disney', 'Steve Wozniak', 'Linus Torvalds', 'Guido van Rossum',
      'Bjarne Stroustrup', 'Dennis Ritchie', 'Ken Thompson', 'Donald Knuth', 'Grace Murray',
      'James Gosling', 'Tim Berners-Lee', 'Marc Andreessen', 'Brendan Eich', 'John Resig',
      'Ryan Dahl', 'Dan Abramov', 'Rich Harris', 'Evan You', 'Taylor Otwell',
      'David Heinemeier', 'Rasmus Lerdorf', 'Yukihiro Matsumoto', 'Larry Wall', 'Brendan Fraser',
      'Christian Bale', 'Anne Hathaway', 'Tom Hardy', 'Cillian Murphy', 'Robert Downey',
      'Scarlett Johansson', 'Chris Evans', 'Mark Ruffalo', 'Jeremy Renner', 'Paul Rudd',
      'Brie Larson', 'Tom Holland', 'Chadwick Boseman', 'Benedict Cumberbatch', 'Elizabeth Olsen',
      'Paul Bettany', 'Anthony Mackie', 'Sebastian Stan', 'Zoe Saldana', 'Dave Bautista',
      'Chris Pratt', 'Vin Diesel', 'Bradley Cooper', 'Karen Gillan', 'Pom Klementieff',
      'Gwyneth Paltrow', 'Jon Favreau', 'Samuel Jackson', 'Cobie Smulders', 'Clark Gregg'
    ];

    const companies = [
      'techcorp.com', 'designco.io', 'salesforce.org', 'startup.net', 'creativeagency.com',
      'legacygroup.us', 'compilertech.edu', 'moviespectrum.co.uk', 'educationalconsulting.com',
      'defenseintelligence.gov', 'underworldmedia.com', 'classicnovels.ru', 'louvregallery.fr',
      'alternatingcurrents.io', 'aestheticism.org', 'empirestate.co', 'prideandprejudice.net',
      'relativity.phys', 'radiology.sci', 'gravity.math', 'evolution.bio', 'analyticalengine.uk',
      'enigma.gov', 'apollo11.nasa.gov', 'blackholes.space', 'quantum.edu', 'telescope.it',
      'lightbulb.invent', 'telephone.comm', 'apple.com', 'microsoft.com', 'spacex.com',
      'amazon.com', 'berkshire.com', 'meta.com', 'google.com', 'disney.com', 'linux.org',
      'mit.edu', 'stanford.edu', 'harvard.edu', 'berkeley.edu', 'oxford.ac.uk', 'cambridge.org'
    ];

    const statuses = [
      { status: LeadStatus.NEW, weight: 0.35 },
      { status: LeadStatus.CONTACTED, weight: 0.30 },
      { status: LeadStatus.QUALIFIED, weight: 0.20 },
      { status: LeadStatus.LOST, weight: 0.15 }
    ];

    const sources = [LeadSource.WEBSITE, LeadSource.INSTAGRAM, LeadSource.REFERRAL];
    const creators = [admin._id, sales1._id, sales2._id];

    const leadsData = [];
    const now = new Date();

    for (let i = 0; i < 120; i++) {
      const name = names[i % names.length] + (i >= names.length ? ` ${Math.floor(i / names.length) + 1}` : '');
      const email = `${name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@${companies[i % companies.length]}`;
      
      // Select status based on weighted probabilities
      let status = LeadStatus.NEW;
      const rand = Math.random();
      let cumulativeWeight = 0;
      for (const s of statuses) {
        cumulativeWeight += s.weight;
        if (rand <= cumulativeWeight) {
          status = s.status;
          break;
        }
      }

      const source = sources[Math.floor(Math.random() * sources.length)];
      const createdBy = creators[Math.floor(Math.random() * creators.length)];

      // Distribute dates back over 6 months
      const daysAgo = Math.floor(Math.random() * 180);
      const createdAt = new Date();
      createdAt.setDate(now.getDate() - daysAgo);
      // Give a random time of day
      createdAt.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

      const updatedAt = new Date(createdAt);
      if (status !== LeadStatus.NEW) {
        // Updated some days after creation
        updatedAt.setDate(createdAt.getDate() + Math.floor(Math.random() * 10));
      }

      leadsData.push({
        name,
        email,
        status,
        source,
        createdBy,
        createdAt,
        updatedAt
      });
    }

    // Insert leads
    await Lead.create(leadsData);

    console.log('✅ Seeding completed successfully!');
    console.log(`Created 3 Users:`);
    console.log(`  - ${admin.email} (Admin)`);
    console.log(`  - ${sales1.email} (Sales)`);
    console.log(`  - ${sales2.email} (Sales)`);
    console.log(`Created ${leadsData.length} Leads distributed across 6 months.`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedData();
