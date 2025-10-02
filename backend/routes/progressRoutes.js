const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { checkAndAwardAchievements } = require('../utils/achievementChecks');

// GET the current user's progress
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      completedModules: user.completedModules,
      unlockedAchievements: user.unlockedAchievements,
      points: user.points
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress', error: error.message });
  }
});

// Mark a module as complete for a user
router.post('/modules/:moduleId/complete', protect, async (req, res) => {
  try {
    const { moduleId } = req.params;
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user.completedModules.includes(moduleId)) {
      user.completedModules.push(moduleId);
      await user.save();
      
      // Call the achievement check after saving progress
      await checkAndAwardAchievements(userId);
    }
    
    // Fetch the updated user to return the latest progress
    const updatedUser = await User.findById(userId);

    res.status(200).json({ 
      message: 'Module marked as complete.',
      completedModules: updatedUser.completedModules,
      unlockedAchievements: updatedUser.unlockedAchievements,
      points: updatedUser.points
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating progress', error: error.message });
  }
});

module.exports = router;