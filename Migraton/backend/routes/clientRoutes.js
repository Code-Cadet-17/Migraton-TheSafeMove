const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const Client = require('../models/Client');

// ------------------- 🔐 Google OAuth Routes -------------------

// Step 1: Redirect user to Google for consent
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Step 2: Handle Google's callback and login
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/client/login-client.html',
  }),
  (req, res) => {
    const client = req.user;

    // Sign a JWT token to send to frontend
    const token = jwt.sign(
      { id: client._id, role: 'client', email: client.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    // Redirect back to dashboard with token
  res.redirect(`http://localhost:5501/client/client-dashboard.html?token=${token}`);


  }
);

// ------------------- 📝 Manual Signup Route -------------------

router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, password, defaultLocation } = req.body;

    const existing = await Client.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Client already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const client = new Client({
      name,
      email,
      phone,
      password: hashedPassword,
      defaultLocation
    });

    await client.save();

    const token = jwt.sign({ id: client._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.status(201).json({ token });
  } catch (err) {
    console.error('Client signup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ------------------- 🔑 Manual Login Route -------------------

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const client = await Client.findOne({ email });
    if (!client) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: client._id }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({ token });
  } catch (err) {
    console.error('Client login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
