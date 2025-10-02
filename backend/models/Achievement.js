const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true // No two achievements should have the same title
  },
  description: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true,
    default: 50
  },
  // This key is for our code to programmatically check for achievements
  criteriaKey: {
    type: String,
    required: true,
    unique: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

const Achievement = mongoose.model('Achievement', achievementSchema);

module.exports = Achievement;