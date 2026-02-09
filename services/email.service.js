const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send contact form confirmation to customer
exports.sendContactConfirmation = async ({ name, email, subject }) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"Majestic Marriages" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Thank you for contacting Majestic Marriages',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8B0000 0%, #0F4C81 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
          .footer { background: #f8f8f8; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666; }
          .button { display: inline-block; padding: 12px 30px; background: #8B0000; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .highlight { color: #D4AF37; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">Majestic Marriages</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Premium Wedding & Event Planning</p>
          </div>
          <div class="content">
            <h2 style="color: #8B0000;">Thank You for Reaching Out!</h2>
            <p>Dear ${name},</p>
            <p>We have received your message regarding "<span class="highlight">${subject}</span>" and truly appreciate you taking the time to contact us.</p>
            <p>Our team at Majestic Marriages is committed to providing you with exceptional service. One of our event specialists will review your inquiry and get back to you within 24 hours.</p>
            <p>In the meantime, feel free to:</p>
            <ul>
              <li>Browse our portfolio of past events</li>
              <li>Check out our service packages</li>
              <li>Follow us on social media for inspiration</li>
            </ul>
            <div style="text-align: center;">
              <a href="https://wa.me/${process.env.BUSINESS_WHATSAPP}" class="button">Chat on WhatsApp</a>
            </div>
            <p style="margin-top: 30px;">If you have any urgent queries, please don't hesitate to call us at <strong>${process.env.BUSINESS_PHONE}</strong>.</p>
            <p>Warm regards,<br><strong>Team Majestic Marriages</strong></p>
          </div>
          <div class="footer">
            <p><strong>Majestic Marriages</strong></p>
            <p>C-56 First floor, Extension, Nemi Nagar, Vaishali Nagar, Jaipur, Rajasthan 302021</p>
            <p>📞 ${process.env.BUSINESS_PHONE} | 📧 ${process.env.BUSINESS_EMAIL}</p>
            <p style="margin-top: 15px; color: #999;">© 2026 Majestic Marriages. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Send contact notification to admin
exports.sendContactNotification = async ({ name, email, phone, subject, message, contactId }) => {
  const transporter = createTransporter();
  const adminEmails = process.env.ADMIN_EMAILS.split(',');

  const mailOptions = {
    from: `"Majestic Marriages Website" <${process.env.EMAIL_FROM}>`,
    to: adminEmails,
    subject: `🔔 New Contact Form Submission - ${subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f8f8f8; }
          .card { background: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: #8B0000; color: white; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
          .field { margin: 15px 0; padding: 10px; background: #f8f8f8; border-left: 3px solid #D4AF37; }
          .label { font-weight: bold; color: #8B0000; }
          .message-box { background: #fffbf0; padding: 15px; border-radius: 5px; border: 1px solid #D4AF37; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <h2 style="margin: 0;">New Contact Form Submission</h2>
            </div>
            
            <div class="field">
              <span class="label">Name:</span> ${name}
            </div>
            
            <div class="field">
              <span class="label">Email:</span> <a href="mailto:${email}">${email}</a>
            </div>
            
            <div class="field">
              <span class="label">Phone:</span> <a href="tel:${phone}">${phone}</a>
            </div>
            
            <div class="field">
              <span class="label">Subject:</span> ${subject}
            </div>
            
            <div class="message-box">
              <span class="label">Message:</span>
              <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${message}</p>
            </div>
            
            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666;">
              <p><strong>Contact ID:</strong> ${contactId}</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
              <a href="tel:${phone}" style="display: inline-block; padding: 10px 20px; background: #8B0000; color: white; text-decoration: none; border-radius: 5px; margin: 5px;">Call Now</a>
              <a href="mailto:${email}" style="display: inline-block; padding: 10px 20px; background: #0F4C81; color: white; text-decoration: none; border-radius: 5px; margin: 5px;">Reply via Email</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Send booking confirmation to customer
exports.sendBookingConfirmation = async ({ name, email, eventType, eventDate, bookingReference }) => {
  const transporter = createTransporter();
  const formattedDate = new Date(eventDate).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const mailOptions = {
    from: `"Majestic Marriages" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `Booking Confirmed - ${bookingReference} | Majestic Marriages`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8B0000 0%, #0F4C81 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
          .booking-ref { background: #D4AF37; color: #333; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 5px; margin: 20px 0; }
          .info-box { background: #f8f8f8; padding: 15px; border-left: 4px solid #8B0000; margin: 15px 0; }
          .footer { background: #f8f8f8; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666; }
          .button { display: inline-block; padding: 12px 30px; background: #8B0000; color: white; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 32px;">🎉 Booking Confirmed!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Majestic Marriages</p>
          </div>
          <div class="content">
            <h2 style="color: #8B0000;">Dear ${name},</h2>
            <p>Thank you for choosing <strong>Majestic Marriages</strong> for your special event! We're thrilled to be part of your celebration.</p>
            
            <div class="booking-ref">
              ${bookingReference}
            </div>
            <p style="text-align: center; color: #666; margin-top: -10px;">Your Booking Reference Number</p>
            
            <h3 style="color: #8B0000; margin-top: 30px;">Booking Details:</h3>
            
            <div class="info-box">
              <strong>Event Type:</strong> ${eventType}
            </div>
            
            <div class="info-box">
              <strong>Event Date:</strong> ${formattedDate}
            </div>
            
            <h3 style="color: #8B0000; margin-top: 30px;">What Happens Next?</h3>
            <ol>
              <li>Our event specialist will contact you within 24 hours</li>
              <li>We'll schedule a detailed consultation meeting</li>
              <li>Together, we'll finalize all event details and preferences</li>
              <li>We'll create a customized event plan just for you</li>
            </ol>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://wa.me/${process.env.BUSINESS_WHATSAPP}?text=Hi, my booking reference is ${bookingReference}" class="button">Chat on WhatsApp</a>
              <a href="tel:${process.env.BUSINESS_PHONE}" class="button" style="background: #0F4C81;">Call Us</a>
            </div>
            
            <p style="background: #fffbf0; padding: 15px; border-radius: 5px; border-left: 4px solid #D4AF37;">
              <strong>💡 Tip:</strong> Save this email! Your booking reference number will help us serve you better.
            </p>
            
            <p style="margin-top: 30px;">We look forward to creating magical memories together!</p>
            <p>Warm regards,<br><strong>Team Majestic Marriages</strong></p>
          </div>
          <div class="footer">
            <p><strong>Majestic Marriages</strong></p>
            <p>C-56 First floor, Extension, Nemi Nagar, Vaishali Nagar, Jaipur, Rajasthan 302021</p>
            <p>📞 ${process.env.BUSINESS_PHONE} | 📧 ${process.env.BUSINESS_EMAIL}</p>
            <p style="margin-top: 15px; color: #999;">© 2026 Majestic Marriages. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Send booking notification to admin
exports.sendBookingNotification = async ({ 
  name, email, phone, eventType, eventDate, location, 
  guestCount, budgetRange, message, bookingReference, bookingId 
}) => {
  const transporter = createTransporter();
  const adminEmails = process.env.ADMIN_EMAILS.split(',');
  const formattedDate = new Date(eventDate).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const mailOptions = {
    from: `"Majestic Marriages Website" <${process.env.EMAIL_FROM}>`,
    to: adminEmails,
    subject: `🎊 New Booking - ${eventType} | ${bookingReference}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 700px; margin: 0 auto; padding: 20px; background: #f8f8f8; }
          .card { background: white; padding: 25px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #8B0000 0%, #0F4C81 100%); color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; text-align: center; }
          .ref-badge { background: #D4AF37; color: #333; padding: 10px 20px; border-radius: 5px; font-size: 20px; font-weight: bold; display: inline-block; }
          .section { margin: 20px 0; }
          .field { margin: 10px 0; padding: 12px; background: #f8f8f8; border-left: 3px solid #D4AF37; }
          .label { font-weight: bold; color: #8B0000; display: inline-block; min-width: 120px; }
          .priority { background: #ff4444; color: white; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; }
          .message-box { background: #fffbf0; padding: 15px; border-radius: 5px; border: 1px solid #D4AF37; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <h1 style="margin: 0;">🎊 New Event Booking</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Action Required</p>
            </div>
            
            <div style="text-align: center; margin: 20px 0;">
              <div class="ref-badge">${bookingReference}</div>
              <p style="margin: 10px 0; color: #666;">Booking Reference Number</p>
            </div>
            
            <div class="section">
              <h3 style="color: #8B0000; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">Client Information</h3>
              <div class="field">
                <span class="label">Name:</span> ${name}
              </div>
              <div class="field">
                <span class="label">Email:</span> <a href="mailto:${email}">${email}</a>
              </div>
              <div class="field">
                <span class="label">Phone:</span> <a href="tel:${phone}">${phone}</a>
              </div>
            </div>
            
            <div class="section">
              <h3 style="color: #8B0000; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">Event Details</h3>
              <div class="field">
                <span class="label">Event Type:</span> <strong>${eventType}</strong>
              </div>
              <div class="field">
                <span class="label">Event Date:</span> <strong style="color: #8B0000;">${formattedDate}</strong>
              </div>
              <div class="field">
                <span class="label">Location:</span> ${location}
              </div>
              <div class="field">
                <span class="label">Guest Count:</span> ${guestCount}
              </div>
              <div class="field">
                <span class="label">Budget Range:</span> <strong>${budgetRange}</strong>
              </div>
            </div>
            
            ${message ? `
            <div class="section">
              <h3 style="color: #8B0000; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">Additional Message</h3>
              <div class="message-box">
                <p style="margin: 0; white-space: pre-wrap;">${message}</p>
              </div>
            </div>
            ` : ''}
            
            <div style="margin-top: 25px; padding: 20px; background: #fffbf0; border-radius: 5px; border: 2px solid #D4AF37;">
              <p style="margin: 0 0 10px 0;"><span class="priority">ACTION REQUIRED</span></p>
              <p style="margin: 0;"><strong>⏰ Follow-up Required:</strong> Contact client within 24 hours</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="tel:${phone}" style="display: inline-block; padding: 12px 25px; background: #8B0000; color: white; text-decoration: none; border-radius: 5px; margin: 5px;">📞 Call Client</a>
              <a href="mailto:${email}" style="display: inline-block; padding: 12px 25px; background: #0F4C81; color: white; text-decoration: none; border-radius: 5px; margin: 5px;">📧 Email Client</a>
              <a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}" style="display: inline-block; padding: 12px 25px; background: #25D366; color: white; text-decoration: none; border-radius: 5px; margin: 5px;">💬 WhatsApp</a>
            </div>
            
            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666;">
              <p><strong>Booking ID:</strong> ${bookingId}</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
};
