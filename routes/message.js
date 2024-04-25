const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  messageText: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Message', messageSchema);


