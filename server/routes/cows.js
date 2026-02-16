const express = require('express');
const Cow = require('../models/Cow');
const { auth, sellerOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/cows - List cows with filters
router.get('/', async (req, res) => {
  try {
    const { breed, minPrice, maxPrice, minAge, maxAge, status, page = 1, limit = 20 } = req.query;
    
    const query = {};
    
    if (breed) query.breed = new RegExp(breed, 'i');
    if (status) query.status = status;
    else query.status = 'available';
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    if (minAge || maxAge) {
      query.age = {};
      if (minAge) query.age.$gte = Number(minAge);
      if (maxAge) query.age.$lte = Number(maxAge);
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    const [cows, total] = await Promise.all([
      Cow.find(query)
        .populate('seller', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Cow.countDocuments(query)
    ]);

    res.json({
      cows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/cows/my-listings - Get current user's listings
router.get('/my-listings', auth, async (req, res) => {
  try {
    const cows = await Cow.find({ seller: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ cows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/cows/:id - Get single cow
router.get('/:id', async (req, res) => {
  try {
    const cow = await Cow.findById(req.params.id).populate('seller', 'name email phone');
    
    if (!cow) {
      return res.status(404).json({ error: 'Cow not found' });
    }
    
    res.json(cow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/cows - Create cow (sellers only)
router.post('/', auth, sellerOnly, async (req, res) => {
  try {
    const { name, breed, age, price, weight, images, location, description } = req.body;
    
    const cow = new Cow({
      name,
      breed,
      age,
      price,
      weight,
      images,
      location,
      description,
      seller: req.user._id
    });
    
    await cow.save();
    await cow.populate('seller', 'name email phone');
    
    res.status(201).json(cow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/cows/:id - Update cow (owner only)
router.put('/:id', auth, async (req, res) => {
  try {
    const cow = await Cow.findById(req.params.id);
    
    if (!cow) {
      return res.status(404).json({ error: 'Cow not found' });
    }
    
    if (cow.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to update this listing' });
    }
    
    const updates = ['name', 'breed', 'age', 'price', 'weight', 'images', 'location', 'description', 'status'];
    updates.forEach(field => {
      if (req.body[field] !== undefined) {
        cow[field] = req.body[field];
      }
    });
    
    await cow.save();
    await cow.populate('seller', 'name email phone');
    
    res.json(cow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/cows/:id - Delete cow (owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const cow = await Cow.findById(req.params.id);
    
    if (!cow) {
      return res.status(404).json({ error: 'Cow not found' });
    }
    
    if (cow.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this listing' });
    }
    
    await cow.deleteOne();
    
    res.json({ message: 'Cow listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

