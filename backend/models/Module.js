// backend/models/Module.js

const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // The title is mandatory
    trim: true      // Removes any extra whitespace
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  level: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced'] // Only allows these values
  },
  lessons: {
    type: Number,
    default: 0 // Sets a default value if not provided
  }
}, {
  timestamps: true // Automatically adds 'createdAt' and 'updatedAt' fields
});

const Module = mongoose.model('Module', moduleSchema);

module.exports = Module;