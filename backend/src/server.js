require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const competitionRoutes = require('./routes/competitionRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for Expo Mobile & Web clients
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id']
}));

app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} (User: ${req.headers['x-user-id'] || 'anonymous'})`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Feedants Competition API active', timestamp: new Date() });
});

// Competition routes
app.use('/api/competitions', competitionRoutes);

// Helper route for direct seed
const competitionController = require('./controllers/competitionController');
app.post('/api/seed', competitionController.seedDatabase);

// Connect DB and launch server
connectDB().then(async () => {
  // Auto-seed sample competition if database is empty
  const Competition = require('./models/Competition');
  const count = await Competition.countDocuments();
  if (count === 0) {
    console.log('No competitions found. Auto-seeding initial reference competition...');
    await competitionController.seedDatabase({ headers: {} }, { json: () => {}, status: () => ({ json: () => {} }) });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(`🚀 Feedants Competition Backend Server Running!`);
    console.log(`📡 Local Access:   http://localhost:${PORT}`);
    console.log(`🌐 Network Access: http://0.0.0.0:${PORT}`);
    console.log(`=======================================================`);
  });
});
