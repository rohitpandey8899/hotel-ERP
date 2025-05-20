import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  guestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guest',
    required: true,
  },
  checkInDate: {
    type: Date,
    required: true,
  },
  checkOutDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['confirmed', 'checked-in', 'checked-out', 'cancelled'],
    default: 'confirmed',
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  paidAmount: {
    type: Number,
    default: 0,
    min: 0,
  },
  specialRequests: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Virtual for calculating the number of nights
bookingSchema.virtual('numberOfNights').get(function() {
  const checkIn = new Date(this.checkInDate);
  const checkOut = new Date(this.checkOutDate);
  const timeDiff = checkOut.getTime() - checkIn.getTime();
  const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return nights;
});

// Virtual for calculating balance amount
bookingSchema.virtual('balanceAmount').get(function() {
  return this.totalAmount - this.paidAmount;
});

// Pre-save hook to update room status when booking is created
bookingSchema.pre('save', async function(next) {
  if (this.isNew && this.status === 'confirmed') {
    try {
      const Room = mongoose.model('Room');
      const room = await Room.findById(this.roomId);
      
      if (room) {
        // If check-in date is today, mark room as reserved
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const checkInDate = new Date(this.checkInDate);
        checkInDate.setHours(0, 0, 0, 0);
        
        if (checkInDate.getTime() === today.getTime()) {
          room.status = 'reserved';
          await room.save();
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Method to check in a booking
bookingSchema.methods.checkIn = async function() {
  try {
    const Room = mongoose.model('Room');
    const room = await Room.findById(this.roomId);
    
    if (room) {
      room.status = 'occupied';
      await room.save();
    }
    
    this.status = 'checked-in';
    await this.save();
    
    return this;
  } catch (error) {
    throw error;
  }
};

// Method to check out a booking
bookingSchema.methods.checkOut = async function() {
  try {
    const Room = mongoose.model('Room');
    const room = await Room.findById(this.roomId);
    
    if (room) {
      room.status = 'available';
      await room.save();
    }
    
    this.status = 'checked-out';
    await this.save();
    
    return this;
  } catch (error) {
    throw error;
  }
};

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;