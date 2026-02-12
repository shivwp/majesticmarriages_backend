# Majestic Marriages API Documentation

Backend API for Majestic Marriages Event Management Website

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install Dependencies**
```bash
cd api
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start MongoDB** (if using local)
```bash
mongod
```

4. **Run Server**
```bash
# Development
npm run dev

# Production
npm start
```

The API will be available at `http://localhost:5000`

## 📋 API Endpoints

### Health Check
- **GET** `/api/health`
- Check if API is running
- No authentication required

---

### Contact Form

#### Submit Contact Form
- **POST** `/api/contact/submit`
- Submit a new contact inquiry
- **Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 98765 43210",
  "subject": "Wedding Planning Inquiry",
  "message": "I would like to discuss wedding planning services..."
}
```
- **Response (201):**
```json
{
  "success": true,
  "message": "Thank you for contacting us! We will get back to you within 24 hours.",
  "data": {
    "id": "65f1234567890abcdef12345",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2026-02-06T10:30:00.000Z"
  }
}
```

#### Get All Contacts (Admin)
- **GET** `/api/contact/all`
- Query Parameters:
  - `status`: Filter by status (new/contacted/resolved/closed)
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 20)

#### Get Contact by ID (Admin)
- **GET** `/api/contact/:id`

#### Update Contact Status (Admin)
- **PATCH** `/api/contact/:id/status`
- **Request Body:**
```json
{
  "status": "contacted"
}
```

#### Delete Contact (Admin)
- **DELETE** `/api/contact/:id`

---

### Booking Form

#### Submit Booking
- **POST** `/api/booking/submit`
- Submit a new event booking
- **Request Body:**
```json
{
  "eventType": "Wedding",
  "eventDate": "2026-12-15",
  "location": "Jaipur, Rajasthan",
  "guestCount": "250 - 500",
  "budgetRange": "₹10,00,000 - ₹20,00,000",
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "phone": "+91 98765 43210",
  "message": "Looking for a grand wedding setup with traditional themes"
}
```
- **Response (201):**
```json
{
  "success": true,
  "message": "Booking submitted successfully! We will contact you within 24 hours.",
  "data": {
    "id": "65f1234567890abcdef12346",
    "bookingReference": "MM2602001",
    "name": "Priya Sharma",
    "email": "priya@example.com",
    "eventType": "Wedding",
    "eventDate": "2026-12-15T00:00:00.000Z",
    "createdAt": "2026-02-06T10:35:00.000Z"
  }
}
```

#### Get All Bookings (Admin)
- **GET** `/api/booking/all`
- Query Parameters:
  - `status`: Filter by status
  - `eventType`: Filter by event type
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 20)
  - `sortBy`: Sort field (default: -createdAt)

#### Get Booking by ID (Admin)
- **GET** `/api/booking/:id`

#### Get Booking by Reference
- **GET** `/api/booking/reference/:reference`
- Public endpoint for customers to check booking status

#### Update Booking Status (Admin)
- **PATCH** `/api/booking/:id/status`
- **Request Body:**
```json
{
  "status": "confirmed",
  "priority": "high"
}
```

#### Add Admin Note (Admin)
- **PATCH** `/api/booking/:id/notes`
- **Request Body:**
```json
{
  "note": "Client called for venue options",
  "addedBy": "admin@majesticmarriages.com"
}
```

#### Delete Booking (Admin)
- **DELETE** `/api/booking/:id`

---

## 🔒 Security Notes

- All endpoints validate input data
- Email addresses are normalized (lowercase)
- Phone numbers are validated for format
- IP addresses and user agents are logged for tracking
- CORS is enabled for frontend domain

---

## 📧 Email Notifications

The API automatically sends emails for:

1. **Contact Form Submission**
   - Confirmation email to customer
   - Notification email to admin team

2. **Booking Submission**
   - Confirmation email with booking reference to customer
   - Detailed notification with all booking info to admin team

---

## 🗄️ Database Schema

### Contact Collection
```javascript
{
  name: String (required, 2-100 chars),
  email: String (required, valid email),
  phone: String (required, valid format),
  subject: String (required, 3-200 chars),
  message: String (required, 10-2000 chars),
  status: String (enum: new/contacted/resolved/closed),
  source: String (default: 'website'),
  ipAddress: String,
  userAgent: String,
  timestamps: true
}
```

### Booking Collection
```javascript
{
  eventType: String (required, enum),
  eventDate: Date (required, future date),
  location: String (required),
  guestCount: String (required, enum),
  budgetRange: String (required, enum),
  name: String (required, 2-100 chars),
  email: String (required, valid email),
  phone: String (required, valid format),
  message: String (optional),
  status: String (enum: pending/contacted/confirmed/completed/cancelled),
  priority: String (enum: low/medium/high),
  bookingReference: String (unique, auto-generated),
  adminNotes: Array,
  source: String,
  ipAddress: String,
  userAgent: String,
  timestamps: true
}
```

---

## 🛠️ Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors if applicable
}
```

**HTTP Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request (validation errors)
- 404: Not Found
- 500: Internal Server Error

---

## 📊 Testing

Import the Postman collection (`Majestic_Marriages_API.postman_collection.json`) for easy testing of all endpoints.

---

## 🔐 Environment Variables

Required variables in `.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/majestic-marriages
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=info@majesticmarriages.com
BUSINESS_EMAIL=info@majesticmarriages.com
BUSINESS_PHONE=+91 8949051540
BUSINESS_WHATSAPP=+91 8949051540
FRONTEND_URL=http://localhost:5173
ADMIN_EMAILS=admin@majesticmarriages.com
```

---

## 📝 Notes

- All dates are stored in ISO 8601 format
- Booking references are auto-generated in format: MM[YY][MM][XXXX]
- MongoDB indexes are created for efficient querying
- Email service uses Nodemailer (configure for your SMTP provider)

---

## 🤝 Support

For issues or questions, contact: info@majesticmarriages.com
