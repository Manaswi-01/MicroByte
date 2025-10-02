const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  sender: {
    type: String,
    required: true
  },
  // This field will be used for automatic deletion
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '1d' // This tells MongoDB to delete the document after 1 day
  }
});

// Note: For the 'expires' option to work, you must ensure you have a TTL index
// on this collection in your MongoDB Atlas dashboard. Mongoose will attempt to
// create it for you, but it's good practice to verify.

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;