const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // Event Details
  eventType: {
    type: String,
    required: [true, 'Event type is required'],
    enum: ['Wedding', 'Reception', 'Engagement', 'Birthday Party', 'Corporate Event', 'Anniversary', 'Other']
  },
  eventDate: {
    type: Date,
    required: [true, 'Event date is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  guestCount: {
    type: String,
    required: [true, 'Guest count is required'],
    enum: ['Under 50', '50 - 100', '100 - 250', '250 - 500', '500+']
  },
  budgetRange: {
    type: String,
    required: [true, 'Budget range is required'],
    enum: ['Under ₹2,00,000', '₹2,00,000 - ₹5,00,000', '₹5,00,000 - ₹10,00,000', '₹10,00,000 - ₹20,00,000', 'Above ₹20,00,000']
  },
  
  // Contact Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[\d\s\+\-\(\)]+$/, 'Please provide a valid phone number']
  },
  message: {
    type: String,
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  
  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'contacted', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  
  // Additional metadata
  source: {
    type: String,
    default: 'website'
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  bookingReference: {
    type: String,
    unique: true
  },
  
  // Admin notes
  adminNotes: [{
    note: String,
    addedBy: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Generate booking reference before saving
bookingSchema.pre('save', function(next) {
  if (!this.bookingReference) {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.bookingReference = `MM${year}${month}${random}`;
  }
  next();
});

// Index for efficient querying
bookingSchema.index({ email: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ eventDate: 1 });
bookingSchema.index({ bookingReference: 1 });
bookingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
