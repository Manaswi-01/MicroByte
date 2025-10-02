const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
  order: { type: Number, required: true },
  content: [{
    type: { 
      type: String, 
      required: true, 
      enum: ['paragraph', 'code', 'video'] // --- ADDED 'video' HERE ---
    },
    value: { type: String, required: true },
    language: { type: String }
    // We removed 'caption' as it's not used in our current form
  }]
});

const Lesson = mongoose.model('Lesson', lessonSchema);
module.exports = Lesson;