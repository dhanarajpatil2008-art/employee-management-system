import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB } from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import recordRoutes from './routes/recordRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// 🛡️ Middlewares
// ==========================================
app.use(cors({
  origin: '*', // Allow all origins for dev
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // JSON Body Parser
app.use(express.urlencoded({ extended: true }));

// ==========================================
// 🚀 API Routes
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);

// Root Health Check Route
app.get('/', (req, res) => {
  res.json({
    status: 'Running',
    project: 'Employee Management System (EMS)',
    developed_by: 'Dhanaraj Patil',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      records: '/api/records'
    }
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Endpoint not found.' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred.',
    error: err.message
  });
});

// ==========================================
// 🏁 Server Start & Database Initialization
// ==========================================
const startServer = async () => {
  try {
    // Check and initialize Database and tables (`users`, `records`)
    await initDB();

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 EMS Backend Server is running at: http://localhost:${PORT}`);
      console.log(`📡 Database: MySQL (2 Tables: users, records)`);
      console.log(`🔑 Auth: JWT Enabled | Passwords: Plain Text`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
