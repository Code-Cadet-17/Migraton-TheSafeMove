const mongoose = require('mongoose');

const pgSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  rent: {
    type: Number,
    required: true
  },
  amenities: {
    type: [String],
    default: []
  },
  description: {
    type: String
  },
  images: {
    type: [String],
    default: []
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',  // for PG owners
    required: false  // optional, if some PGs are added by admin
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',    // for future admin/user-based management
    required: false
  },
  approved: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PG', pgSchema);
