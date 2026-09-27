const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/feedants_competition';
  
  try {
    console.log(`Connecting to MongoDB at: ${uri}`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log('MongoDB connected successfully via process.env.MONGODB_URI');
  } catch (error) {
    console.warn(`Could not connect to external MongoDB (${error.message}). Falling back to MongoMemoryServer for standalone execution...`);
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memUri = mongoMemoryServer.getUri();
      await mongoose.connect(memUri);
      console.log(`MongoDB connected in-memory at: ${memUri}`);
    } catch (memErr) {
      console.error('Failed to initialize MongoMemoryServer:', memErr);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
