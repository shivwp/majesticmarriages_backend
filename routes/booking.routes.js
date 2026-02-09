const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const bookingController = require('../controllers/booking.controller');

// Validation rules for booking form
const bookingValidation = [
  body('eventType')
    .notEmpty().withMessage('Event type is required')
    .isIn(['Wedding', 'Reception', 'Engagement', 'Birthday Party', 'Corporate Event', 'Anniversary', 'Other'])
    .withMessage('Invalid event type'),
  
  body('eventDate')
    .notEmpty().withMessage('Event date is required')
    .isISO8601().withMessage('Please provide a valid date')
    .custom((value) => {
      const eventDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (eventDate < today) {
        throw new Error('Event date cannot be in the past');
      }
      return true;
    }),
  
  body('location')
    .trim()
    .notEmpty().withMessage('Location is required')
    .isLength({ max: 200 }).withMessage('Location cannot exceed 200 characters'),
  
  body('guestCount')
    .notEmpty().withMessage('Guest count is required')
    .isIn(['Under 50', '50 - 100', '100 - 250', '250 - 500', '500+'])
    .withMessage('Invalid guest count range'),
  
  body('budgetRange')
    .notEmpty().withMessage('Budget range is required')
    .isIn(['Under ₹2,00,000', '₹2,00,000 - ₹5,00,000', '₹5,00,000 - ₹10,00,000', '₹10,00,000 - ₹20,00,000', 'Above ₹20,00,000'])
    .withMessage('Invalid budget range'),
  
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[\d\s\+\-\(\)]+$/).withMessage('Please provide a valid phone number'),
  
  body('message')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Message cannot exceed 2000 characters')
];

// Routes
router.post('/submit', bookingValidation, bookingController.submitBooking);
router.get('/all', bookingController.getAllBookings);
router.get('/:id', bookingController.getBookingById);
router.get('/reference/:reference', bookingController.getBookingByReference);
router.patch('/:id/status', bookingController.updateBookingStatus);
router.patch('/:id/notes', bookingController.addAdminNote);
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
