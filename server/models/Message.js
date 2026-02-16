const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cow: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cow',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  read: {
    type: Boolean,
    default: false
  }
});

// Index for efficient conversation queries
messageSchema.index({ sender: 1, receiver: 1, cow: 1, createdAt: -1 });

module.exports = mongoose.model('Message', messageSchema);

