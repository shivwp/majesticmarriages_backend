const { validationResult } = require('express-validator');
const Booking = require('../models/Booking.model');
const emailService = require('../services/email.service');

// Submit booking form
exports.submitBooking = async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Extract data from request
    const {
      eventType,
      eventDate,
      location,
      guestCount,
      budgetRange,
      name,
      email,
      phone,
      message
    } = req.body;

    // Create booking record
    const booking = new Booking({
      eventType,
      eventDate,
      location,
      guestCount,
      budgetRange,
      name,
      email,
      phone,
      message,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });

    // Save to database
    await booking.save();

    // Send confirmation email to customer
    try {
      await emailService.sendBookingConfirmation({
        name,
        email,
        eventType,
        eventDate,
        bookingReference: booking.bookingReference
      });
    } catch (emailError) {
      console.error('Failed to send booking confirmation email:', emailError);
    }

    // Send notification email to admin
    try {
      await emailService.sendBookingNotification({
        name,
        email,
        phone,
        eventType,
        eventDate,
        location,
        guestCount,
        budgetRange,
        message,
        bookingReference: booking.bookingReference,
        bookingId: booking._id
      });
    } catch (emailError) {
      console.error('Failed to send admin notification:', emailError);
    }

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Booking submitted successfully! We will contact you within 24 hours.',
      data: {
        id: booking._id,
        bookingReference: booking.bookingReference,
        name: booking.name,
        email: booking.email,
        eventType: booking.eventType,
        eventDate: booking.eventDate,
        createdAt: booking.createdAt
      }
    });

  } catch (error) {
    console.error('Booking submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit booking. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all bookings (Admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const { status, eventType, page = 1, limit = 20, sortBy = '-createdAt' } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (eventType) query.eventType = eventType;

    const bookings = await Booking.find(query)
      .sort(sortBy)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-userAgent -ipAddress -adminNotes');

    const count = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    });

  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get booking by reference number
exports.getBookingByReference = async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      bookingReference: req.params.reference 
    }).select('-userAgent -ipAddress -adminNotes');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });

  } catch (error) {
    console.error('Get booking by reference error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, priority } = req.body;

    const updateData = {};
    if (status && ['pending', 'contacted', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      updateData.status = status;
    }
    if (priority && ['low', 'medium', 'high'].includes(priority)) {
      updateData.priority = priority;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid update fields provided'
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      data: booking
    });

  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Add admin note to booking
exports.addAdminNote = async (req, res) => {
  try {
    const { note, addedBy } = req.body;

    if (!note || !addedBy) {
      return res.status(400).json({
        success: false,
        message: 'Note and addedBy fields are required'
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          adminNotes: {
            note,
            addedBy,
            addedAt: new Date()
          }
        }
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Admin note added successfully',
      data: booking
    });

  } catch (error) {
    console.error('Add admin note error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add admin note',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Delete booking
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully'
    });

  } catch (error) {
    console.error('Delete booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
