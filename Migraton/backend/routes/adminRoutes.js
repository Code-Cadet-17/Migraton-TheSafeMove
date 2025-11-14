const express = require('express');
const router = express.Router();
const {
    sendOTP,
    verifyOTP,
    getPendingPGs,
    approvePG,
    getStats,
    getAllClients,      // ✅ Client list
    deleteClient        // ✅ Client deletion
} = require('../controllers/adminController');

const authAdmin = require('../middlewares/authAdmin'); // 🔐 Only admins allowed

// 🔐 Admin OTP Login Routes
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

// 🔒 Protected Routes (Admin Dashboard)
router.get('/stats', authAdmin, getStats);              // 📊 Platform Stats
router.get('/pending-pgs', authAdmin, getPendingPGs);   // ⏳ Pending PGs
router.put('/approve-pg/:id', authAdmin, approvePG);    // ✅ Approve PG

// 👥 Client Management
router.get('/clients', authAdmin, getAllClients);       // 📋 Get all clients with PG count
router.delete('/clients/:id', authAdmin, deleteClient); // 🗑️ Delete client and their PGs

module.exports = router;
