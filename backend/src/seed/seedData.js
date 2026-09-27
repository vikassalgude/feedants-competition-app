require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const competitionController = require('../controllers/competitionController');

const runSeed = async () => {
  try {
    await connectDB();
    console.log('Running database seed script...');
    
    // Create mock request/response objects
    const req = {};
    const res = {
      json: (data) => console.log('Seed Response:', data),
      status: (code) => ({
        json: (data) => console.error(`Seed Error (${code}):`, data)
      })
    };

    await competitionController.seedDatabase(req, res);
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding script failed:', err);
    process.exit(1);
  }
};

runSeed();
