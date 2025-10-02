const express = require('express');
const router = express.Router();
const Module = require('../models/Module');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// GET all modules
router.get('/', async (req, res) => {
  try {
    const modules = await Module.find({});
    res.status(200).json(modules);
  } catch (error) {
    res.status(500).json({ message: "Error fetching modules" });
  }
});

// GET a single module by ID --- (NEW!) ---
router.get('/:id', async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    if (!module) return res.status(404).json({ message: 'Module not found' });
    res.status(200).json(module);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching module' });
  }
});

// POST a new module
router.post('/', [protect, admin], async (req, res) => {
  try {
    const newModule = new Module({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      level: req.body.level,
      lessons: req.body.lessons
    });
    const savedModule = await newModule.save();
    res.status(201).json(savedModule);
  } catch (error) {
    res.status(400).json({ message: "Error creating module", error: error.message });
  }
});

// PUT (update) a module by ID --- (NEW!) ---
router.put('/:id', [protect, admin], async (req, res) => {
  try {
    const updatedModule = await Module.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedModule) return res.status(404).json({ message: 'Module not found' });
    res.status(200).json(updatedModule);
  } catch (error) {
    res.status(400).json({ message: 'Error updating module', error: error.message });
  }
});

// DELETE a module by ID --- (NEW!) ---
// Route: DELETE /api/modules/:id
// Access: Private/Admin
router.delete('/:id', [protect, admin], async (req, res) => {
  try {
    const module = await Module.findByIdAndDelete(req.params.id);
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    res.status(200).json({ message: 'Module deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting module', error: error.message });
  }
});

module.exports = router;