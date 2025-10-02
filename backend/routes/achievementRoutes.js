const express = require('express');
const router = express.Router();
const Achievement = require('../models/Achievement');

// GET all achievements
// Route: GET /api/achievements/
router.get('/', async (req, res) => {
  try {
    const achievements = await Achievement.find({});
    res.status(200).json(achievements);
  } catch (error) {
    res.status(500).json({ message: "Error fetching achievements" });
  }
});

// POST a new achievement
// Route: POST /api/achievements/
router.post('/', async (req, res) => {
  try {
    const newAchievement = new Achievement({
      title: req.body.title,
      description: req.body.description,
      points: req.body.points,
      criteriaKey: req.body.criteriaKey
    });

    const savedAchievement = await newAchievement.save();
    res.status(201).json(savedAchievement);
  } catch (error) {
    res.status(400).json({ message: "Error creating achievement", error: error.message });
  }
});

module.exports = router;