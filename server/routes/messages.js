const express = require('express');
const Message = require('../models/Message');
const Cow = require('../models/Cow');
const { auth } = require('../middleware/auth');

const router = express.Router();

// GET /api/messages/conversations - Get user's conversations
router.get('/conversations', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get unique conversations (grouped by cow and other user)
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            cow: '$cow',
            otherUser: {
              $cond: [{ $eq: ['$sender', userId] }, '$receiver', '$sender']
            }
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$receiver', userId] }, { $eq: ['$read', false] }] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $sort: { 'lastMessage.createdAt': -1 }
      }
    ]);

    // Populate references
    await Message.populate(conversations, [
      { path: '_id.cow', select: 'name images price' },
      { path: '_id.otherUser', select: 'name email' },
      { path: 'lastMessage.sender', select: 'name' }
    ]);

    const formattedConversations = conversations.map(conv => ({
      cow: conv._id.cow,
      otherUser: conv._id.otherUser,
      lastMessage: conv.lastMessage,
      unreadCount: conv.unreadCount
    }));

    res.json(formattedConversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/messages/:oderId - Get messages for a conversation (cow + other user)
router.get('/:oderId', auth, async (req, res) => {
  try {
    const { oderId } = req.params;
    const { otherUserId } = req.query;
    const userId = req.user._id;

    if (!otherUserId) {
      return res.status(400).json({ error: 'otherUserId query parameter is required' });
    }

    const messages = await Message.find({
      cow: oderId,
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId }
      ]
    })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .populate('cow', 'name images')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      {
        cow: oderId,
        sender: otherUserId,
        receiver: userId,
        read: false
      },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/messages - Send a message
router.post('/', auth, async (req, res) => {
  try {
    const { receiverId, cowId, content } = req.body;
    const senderId = req.user._id;

    // Verify cow exists
    const cow = await Cow.findById(cowId);
    if (!cow) {
      return res.status(404).json({ error: 'Cow not found' });
    }

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      cow: cowId,
      content
    });

    await message.save();
    await message.populate([
      { path: 'sender', select: 'name email' },
      { path: 'receiver', select: 'name email' },
      { path: 'cow', select: 'name images' }
    ]);

    // Emit socket event for real-time messaging
    const io = req.app.get('io');
    if (io) {
      io.to(receiverId.toString()).emit('newMessage', message);
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

