const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const Module = require('../models/Module'); 
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// GET all lessons AND the parent module for a specific module
router.get('/by-module/:moduleId', protect, async (req, res) => {
  try {
    const module = await Module.findById(req.params.moduleId);
    const lessons = await Lesson.find({ module: req.params.moduleId }).sort({ order: 1 });
    
    if (!module) return res.status(404).json({ message: 'Module not found' });
    
    res.status(200).json({ module, lessons }); // Return both
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lessons' });
  }
});

// POST a new lesson
// Route: POST /api/lessons
// Access: Private/Admin
router.post('/', [protect, admin], async (req, res) => {
  try {
    const { title, module, order, content } = req.body;
    const newLesson = new Lesson({ title, module, order, content });
    const savedLesson = await newLesson.save();
    res.status(201).json(savedLesson);
  } catch (error) {
    res.status(400).json({ message: 'Error creating lesson', error: error.message });
  }
});

// PUT (update) a lesson by ID
// Route: PUT /api/lessons/:lessonId
// Access: Private/Admin
router.put('/:lessonId', [protect, admin], async (req, res) => {
  try {
    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.lessonId,
      req.body,
      { new: true } // This option returns the updated document
    );
    if (!updatedLesson) return res.status(404).json({ message: 'Lesson not found' });
    res.status(200).json(updatedLesson);
  } catch (error) {
    res.status(400).json({ message: 'Error updating lesson', error: error.message });
  }
});

// DELETE a lesson by ID
// Route: DELETE /api/lessons/:lessonId
// Access: Private/Admin
router.delete('/:lessonId', [protect, admin], async (req, res) => {
  try {
    const deletedLesson = await Lesson.findByIdAndDelete(req.params.lessonId);
    if (!deletedLesson) return res.status(404).json({ message: 'Lesson not found' });
    res.status(200).json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lesson', error: error.message });
  }
});

module.exports = router;