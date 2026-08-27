const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./src/config/db');

// Import Route Handlers
const authRoutes = require('./src/routes/authRoutes');
const gameRoutes = require('./src/routes/gameRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());

// Health Check Endpoint

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Letterbox Financial Literacy API!',
    healthCheck: 'http://localhost:5000/api/health'
  });
});
// Mounted Application Routes
app.use('/api/auth', authRoutes);       // Authentication (Register/Login)
app.use('/api/games', gameRoutes);     // Player Game Logic, Questions & Submissions
app.use('/api/admin', adminRoutes);     // Content Management (CRUD Games, Questions, Badges)

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// Test Database Connection and Start Server
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL Database (letter_box)!');
    connection.release();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error.message);
    process.exit(1); // Exit process on database failure
  }
}

startServer();