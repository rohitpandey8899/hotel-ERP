const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  idProofType: {
    type: String,
    enum: ['passport', 'drivers_license', 'national_id', 'other'],
    required: true
  },
  idNumber: {
    type: String,
    required: true,
    trim: true
  },
  idProofFile: {
    type: String, // Store file path
    required: true
  },
  vehicleNumber: {
    type: String,
    trim: true
  },
  additionalGuests: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    age: {
      type: Number,
      required: true
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
guestSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Guest = mongoose.model('Guest', guestSchema);

module.exports = Guest;