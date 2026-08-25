const express = require('express');
const cors = require('cors');
const pool = require('./src/config/db'); // Imports your MySQL pool connection
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'FinLit Kids API' });
});

// Test DB Connection on Server Startup
async function startServer() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL Database!');
    connection.release(); // Release connection back to pool

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error.message);
  }
}

startServer();