const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String
  },
  password: {
    type: String,
    required: false // ❗Make password optional for Google-based users
  },
  defaultLocation: {
    type: String
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows null values but still ensures uniqueness if present
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Client', clientSchema);
