import Room from '../models/room.model.js';
import { validationResult } from 'express-validator';

// Get all rooms
export const getAllRooms = async (req, res) => {
  try {
    // Parse query parameters for filtering
    const { type, status, minPrice, maxPrice } = req.query;
    
    // Build query object based on filters
    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;
    
    // Add price range filter if provided
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }
    
    const rooms = await Room.find(query).sort({ roomNumber: 1 });
    
    return res.status(200).json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return res.status(500).json({ message: 'Server error while fetching rooms' });
  }
};

// Get room by ID
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    return res.status(200).json(room);
  } catch (error) {
    console.error('Error fetching room:', error);
    return res.status(500).json({ message: 'Server error while fetching room' });
  }
};

// Create new room
export const createRoom = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    // Check if room number already exists
    const existingRoom = await Room.findOne({ roomNumber: req.body.roomNumber });
    if (existingRoom) {
      return res.status(400).json({ message: 'Room number already exists' });
    }
    
    // Create new room
    const room = new Room(req.body);
    
    // Save room to database
    await room.save();
    
    return res.status(201).json(room);
  } catch (error) {
    console.error('Error creating room:', error);
    return res.status(500).json({ message: 'Server error while creating room' });
  }
};

// Update room
export const updateRoom = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    // Check if room exists
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Check if updating room number and if it already exists
    if (req.body.roomNumber && req.body.roomNumber !== room.roomNumber) {
      const existingRoom = await Room.findOne({ roomNumber: req.body.roomNumber });
      if (existingRoom) {
        return res.status(400).json({ message: 'Room number already exists' });
      }
    }
    
    // Update room
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    return res.status(200).json(updatedRoom);
  } catch (error) {
    console.error('Error updating room:', error);
    return res.status(500).json({ message: 'Server error while updating room' });
  }
};

// Delete room
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Check if room has associated bookings before allowing deletion
    // This check should be implemented in production
    
    await Room.findByIdAndDelete(req.params.id);
    
    return res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    return res.status(500).json({ message: 'Server error while deleting room' });
  }
};

// Get available rooms for a date range
export const getAvailableRooms = async (req, res) => {
  try {
    const { checkInDate, checkOutDate, type } = req.query;
    
    // Validate dates
    if (!checkInDate || !checkOutDate) {
      return res.status(400).json({ message: 'Check-in and check-out dates are required' });
    }
    
    // Ensure check-in date is before check-out date
    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      return res.status(400).json({ message: 'Check-in date must be before check-out date' });
    }
    
    // Get available rooms
    const availableRooms = await Room.findAvailable(checkInDate, checkOutDate, type);
    
    return res.status(200).json(availableRooms);
  } catch (error) {
    console.error('Error finding available rooms:', error);
    return res.status(500).json({ message: 'Server error while finding available rooms' });
  }
};

// Change room status
export const changeRoomStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    if (!status || !['available', 'occupied', 'maintenance', 'reserved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    // Find room
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Update status
    room.status = status;
    await room.save();
    
    return res.status(200).json(room);
  } catch (error) {
    console.error('Error changing room status:', error);
    return res.status(500).json({ message: 'Server error while changing room status' });
  }
};