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
    console.log('✅ MongoDB connected successfully via process.env.MONGODB_URI');
  } catch (error) {
    console.warn(`\n================================================================`);
    console.warn(`⚠️ WARNING: MONGODB_URI is missing or unreachable (${error.message}).`);
    console.warn(`⚠️ Falling back to MongoMemoryServer (In-Memory Database) for standalone execution.`);
    console.warn(`⚠️ NOTE: DATA WILL NOT PERSIST across server restarts!`);
    console.warn(`================================================================\n`);
    
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memUri = mongoMemoryServer.getUri();
      await mongoose.connect(memUri);
      console.log(`✅ MongoDB connected in-memory at: ${memUri}`);
    } catch (memErr) {
      console.error('❌ Failed to initialize MongoMemoryServer:', memErr);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
