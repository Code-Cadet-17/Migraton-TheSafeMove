const express = require('express');
const router = express.Router();

const {
    registerUser,
    loginUser,
    getProfile,
    getAllUsers
} = require('../controllers/userController'); // ✅ Correct path

const { protect, isAdmin } = require('../middlewares/authMiddleware'); // ✅ Folder name fixed

// ✅ Public Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// ✅ Protected Route (Profile)
router.get('/profile', protect, getProfile);

// ✅ Admin Route (Get All Users)
router.get('/all', protect, isAdmin, getAllUsers); // 🔁 NOTE: Changed path from '/' to '/all'

module.exports = router;
