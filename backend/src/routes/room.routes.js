import express from 'express';
import { body } from 'express-validator';
import { 
  getAllRooms, 
  getRoomById, 
  createRoom, 
  updateRoom, 
  deleteRoom,
  getAvailableRooms,
  changeRoomStatus
} from '../controllers/room.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Validation middleware for room creation/update
const validateRoom = [
  body('roomNumber').notEmpty().withMessage('Room number is required'),
  body('type').isIn(['single', 'double', 'twin', 'suite', 'deluxe', 'presidential']).withMessage('Invalid room type'),
  body('price').isNumeric().withMessage('Price must be a number').isFloat({ min: 0 }).withMessage('Price must be positive'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('status').optional().isIn(['available', 'occupied', 'maintenance', 'reserved']).withMessage('Invalid room status'),
  body('amenities').optional().isArray().withMessage('Amenities must be an array'),
  body('images').optional().isArray().withMessage('Images must be an array'),
  body('description').optional().isString().withMessage('Description must be a string'),
];

// Get all rooms (public)
router.get('/', getAllRooms);

// Get available rooms for date range (public)
router.get('/available', getAvailableRooms);

// Get room by ID (public)
router.get('/:id', getRoomById);

// Create room (admin only)
router.post('/', authenticate, authorize(['admin']), validateRoom, createRoom);

// Update room (admin & staff)
router.put('/:id', authenticate, validateRoom, updateRoom);

// Delete room (admin only)
router.delete('/:id', authenticate, authorize(['admin']), deleteRoom);

// Change room status (admin & staff)
router.patch('/:id/status', authenticate, changeRoomStatus);

export default router;