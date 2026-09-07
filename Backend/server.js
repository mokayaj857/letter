const express = require('express');
const cors = require('cors');
const pool = require('./src/config/db');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const gameRoutes = require('./src/routes/gameRoutes');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'LetterBox API' });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/games', gameRoutes);

async function startServer() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connected to MySQL Database!');
    connection.release();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error.message);
  }
}

startServer();
