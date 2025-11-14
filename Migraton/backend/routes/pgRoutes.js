const express = require('express');
const router = express.Router();
const {
  createPG,
  getAllPGs,
  getPGById,
  updatePG,
  deletePG
} = require('../controllers/pgController');

const authClient = require('../middlewares/authClient');
const PG = require('../models/PG');

// ✅ Client-only route: Get PGs added by the logged-in client
router.get('/client', authClient, async (req, res) => {
  try {
    const pgs = await PG.find({ owner: req.client._id }).sort({ createdAt: -1 });
    res.json(pgs);
  } catch (err) {
    console.error("❌ Failed to fetch client PGs:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Create new PG (Client only)
router.post('/', authClient, createPG);

// ✅ Get all PGs (public)
router.get('/', getAllPGs);

// ✅ Get PG by ID
router.get('/:id', getPGById);

// ✅ Update PG
router.put('/:id', updatePG);

// ✅ Delete PG
router.delete('/:id', deletePG);

module.exports = router;
