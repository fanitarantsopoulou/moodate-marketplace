const mongoose = require('mongoose');

const cowSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Cow name is required'],
    trim: true
  },
  breed: {
    type: String,
    required: [true, 'Breed is required'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: 0
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  weight: {
    type: Number,
    min: 0
  },
  images: [{
    type: String
  }],
  location: {
    address: {
      type: String,
      trim: true
    },
    coordinates: {
      lat: {
        type: Number
      },
      lng: {
        type: Number
      }
    }
  },
  description: {
    type: String,
    trim: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'sold'],
    default: 'available'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for filtering
cowSchema.index({ breed: 1, price: 1, age: 1, status: 1 });

module.exports = mongoose.model('Cow', cowSchema);

