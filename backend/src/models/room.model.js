import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['single', 'double', 'twin', 'suite', 'deluxe', 'presidential'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance', 'reserved'],
    default: 'available',
  },
  amenities: {
    type: [String],
    default: [],
  },
  images: {
    type: [String],
    default: [],
  },
  description: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Virtual for bookings (if using MongoDB)
roomSchema.virtual('bookings', {
  ref: 'Booking',
  localField: '_id',
  foreignField: 'roomId',
});

// Method to check if room is available for a specific date range
roomSchema.methods.isAvailableForDates = async function(checkInDate, checkOutDate) {
  const Booking = mongoose.model('Booking');
  
  // Convert dates to Date objects
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  
  // Find any bookings that overlap with the requested date range
  const overlappingBookings = await Booking.find({
    roomId: this._id,
    status: { $ne: 'cancelled' },
    $or: [
      // Check-in date falls within existing booking
      {
        checkInDate: { $lte: checkOutDate },
        checkOutDate: { $gte: checkInDate },
      },
    ],
  });
  
  return overlappingBookings.length === 0;
};

// Static method to find all available rooms for a date range
roomSchema.statics.findAvailable = async function(checkInDate, checkOutDate, type = null) {
  const Booking = mongoose.model('Booking');
  
  // Find rooms that are available and not in maintenance
  const query = { status: { $in: ['available', 'reserved'] } };
  
  // Add room type filter if specified
  if (type) {
    query.type = type;
  }
  
  // Find all rooms matching the initial query
  const rooms = await this.find(query);
  
  // Get room IDs with bookings in the specified date range
  const bookedRoomIds = await Booking.distinct('roomId', {
    status: { $ne: 'cancelled' },
    $or: [
      // Check-in date falls within existing booking
      {
        checkInDate: { $lte: checkOutDate },
        checkOutDate: { $gte: checkInDate },
      },
    ],
  });
  
  // Filter out rooms that have bookings in the date range
  return rooms.filter(room => !bookedRoomIds.includes(room._id.toString()));
};

const Room = mongoose.model('Room', roomSchema);

export default Room;