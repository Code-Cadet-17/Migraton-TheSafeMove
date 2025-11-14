const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// 🔐 Google OAuth Passport setup
require('./config/passport-client');
app.use(session({ secret: 'hoodwise', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Route Imports
const userRoutes = require('./routes/userRoutes');
const pgRoutes = require('./routes/pgRoutes');
const authRoutes = require('./routes/authRoutes');
const clientRoutes = require('./routes/clientRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/pgs', pgRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/admin', adminRoutes); // ✅ Admin OTP + approval

// 404 Not Found
app.use((req, res, next) => {
  const error = new Error(`🔍 Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Global error handler
const errorHandler = require('./middlewares/errorHandler');
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
