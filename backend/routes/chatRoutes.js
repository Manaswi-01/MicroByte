const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get recent chat messages
// @route   GET /api/chat/messages
// @access  Private
router.get('/messages', protect, async (req, res) => {
  try {
    // Find the last 50 messages, sorted from oldest to newest
    const messages = await Message.find()
      .sort({ createdAt: -1 }) // Get newest first
      .limit(50)                // Limit to 50
      .sort({ createdAt: 1 });  // Sort them back to oldest first for display

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
});

module.exports = router;