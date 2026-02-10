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
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #ffffff; background-color: #0c0c0c; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; padding: 0; border: 1px solid #333; border-radius: 10px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #8B0000 0%, #0F4C81 100%); color: #ffffff; padding: 40px 20px; text-align: center; }
          .content { background: #1a1a1a; padding: 30px; color: #ffffff; }
          .footer { background: #0c0c0c; padding: 25px; text-align: center; font-size: 13px; color: #aaaaaa; border-top: 1px solid #333; }
          .button { display: inline-block; padding: 14px 35px; background: #8B0000; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
          .highlight { color: #D4AF37; font-weight: bold; }
          h2 { color: #ffffff; margin-top: 0; }
          p { color: #e0e0e0; }
          ul li { color: #e0e0e0; margin-bottom: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 30px; color: #ffffff;">Majestic Marriages</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9; color: #ffffff;">Premium Wedding & Event Planning</p>
          </div>
          <div class="content">
            <h2 style="color: #ffffff; font-size: 24px;">Thank You for Reaching Out!</h2>
            <p>Dear ${name},</p>
            <p>We have received your message regarding "<span class="highlight">${subject}</span>" and truly appreciate you taking the time to contact us.</p>
            <p>Our team at Majestic Marriages is committed to providing you with exceptional service. One of our event specialists will review your inquiry and get back to you within 24 hours.</p>
            <p>In the meantime, feel free to explore our services and portfolio.</p>
            <div style="text-align: center;">
              <a href="https://wa.me/${process.env.BUSINESS_WHATSAPP}" class="button">Chat on WhatsApp</a>
            </div>
            <p style="margin-top: 30px;">If you have any urgent queries, please don't hesitate to call us at <strong style="color: #D4AF37;">${process.env.BUSINESS_PHONE}</strong>.</p>
            <p>Warm regards,<br><strong style="color: #ffffff;">Team Majestic Marriages</strong></p>
          </div>
          <div class="footer">
            <p style="color: #ffffff; font-weight: bold; margin-bottom: 5px;">Majestic Marriages</p>
            <p>C-56 First floor, Extension, Nemi Nagar, Vaishali Nagar, Jaipur, Rajasthan 302021</p>
            <p>📞 ${process.env.BUSINESS_PHONE} | 📧 ${process.env.BUSINESS_EMAIL}</p>
            <p style="margin-top: 20px; color: #777; font-size: 11px;">© 2026 Majestic Marriages. All rights reserved.</p>
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
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #ffffff; background-color: #0c0c0c; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; padding: 20px; background: #1a1a1a; border-radius: 12px; border: 1px solid #333; }
          .card { background: #242424; padding: 30px; border-radius: 10px; border: 1px solid #444; }
          .header { background: #8B0000; color: #ffffff; padding: 20px; border-radius: 8px; margin-bottom: 25px; text-align: center; }
          .field { margin: 15px 0; padding: 12px; background: #1f1f1f; border-left: 4px solid #D4AF37; border-radius: 4px; }
          .label { font-weight: bold; color: #D4AF37; margin-right: 10px; }
          .message-box { background: #2d2d2d; padding: 20px; border-radius: 8px; border: 1px solid #444; margin: 20px 0; }
          a { color: #D4AF37; text-decoration: none; }
          p, div { color: #ffffff; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <h2 style="margin: 0; font-size: 22px; color: #ffffff;">New Contact Form Submission</h2>
            </div>
            
            <div class="field">
              <span class="label">Name:</span> <span>${name}</span>
            </div>
            
            <div class="field">
              <span class="label">Email:</span> <a href="mailto:${email}">${email}</a>
            </div>
            
            <div class="field">
              <span class="label">Phone:</span> <a href="tel:${phone}">${phone}</a>
            </div>
            
            <div class="field">
              <span class="label">Subject:</span> <span style="color: #ffffff;">${subject}</span>
            </div>
            
            <div class="message-box">
              <span class="label" style="display: block; margin-bottom: 10px;">Message:</span>
              <p style="margin: 0; white-space: pre-wrap; color: #e0e0e0;">${message}</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #444; font-size: 13px; color: #888;">
              <p style="margin: 5px 0;"><strong>Contact ID:</strong> ${contactId}</p>
              <p style="margin: 5px 0;"><strong>Submitted:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="tel:${phone}" style="display: inline-block; padding: 12px 25px; background: #8B0000; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 5px;">Call Now</a>
              <a href="mailto:${email}" style="display: inline-block; padding: 12px 25px; background: #0F4C81; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 5px;">Reply Email</a>
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
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #ffffff; background-color: #0c0c0c; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; padding: 0; border: 1px solid #333; border-radius: 12px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #8B0000 0%, #0F4C81 100%); color: #ffffff; padding: 40px 20px; text-align: center; }
          .content { background: #1a1a1a; padding: 35px; color: #ffffff; }
          .booking-ref { background: #D4AF37; color: #1a1a1a; padding: 20px; text-align: center; font-size: 28px; font-weight: bold; border-radius: 8px; margin: 25px 0; letter-spacing: 2px; }
          .info-box { background: #242424; padding: 18px; border-left: 5px solid #8B0000; margin: 15px 0; border-radius: 0 6px 6px 0; }
          .footer { background: #0c0c0c; padding: 30px; text-align: center; font-size: 13px; color: #999; border-top: 1px solid #333; }
          .button { display: inline-block; padding: 14px 35px; background: #8B0000; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px 5px; }
          h2, h3 { color: #ffffff; margin-top: 0; }
          p { color: #e0e0e0; }
          .tip-box { background: #1f1f1f; padding: 20px; border-radius: 8px; border: 1px solid #D4AF37; border-left: 5px solid #D4AF37; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 34px; color: #ffffff;">🎉 Booking Confirmed!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9; color: #ffffff;">Majestic Marriages</p>
          </div>
          <div class="content">
            <h2 style="color: #ffffff; font-size: 26px;">Dear ${name},</h2>
            <p>Thank you for choosing <strong style="color: #D4AF37;">Majestic Marriages</strong> for your special event! We're thrilled to be part of your celebration.</p>
            
            <div class="booking-ref">
              ${bookingReference}
            </div>
            <p style="text-align: center; color: #aaaaaa; margin-top: -15px; font-size: 14px;">Your Booking Reference Number</p>
            
            <h3 style="color: #D4AF37; margin-top: 40px; border-bottom: 1px solid #333; padding-bottom: 10px;">Booking Details:</h3>
            
            <div class="info-box">
              <strong style="color: #D4AF37;">Event Type:</strong> <span style="color: #ffffff;">${eventType}</span>
            </div>
            
            <div class="info-box">
              <strong style="color: #D4AF37;">Event Date:</strong> <span style="color: #ffffff;">${formattedDate}</span>
            </div>
            
            <h3 style="color: #D4AF37; margin-top: 40px; border-bottom: 1px solid #333; padding-bottom: 10px;">What Happens Next?</h3>
            <ol style="color: #e0e0e0; padding-left: 20px;">
              <li style="margin-bottom: 10px;">Our event specialist will contact you within 24 hours</li>
              <li style="margin-bottom: 10px;">We'll schedule a detailed consultation meeting</li>
              <li style="margin-bottom: 10px;">Together, we'll finalize all event details and preferences</li>
              <li style="margin-bottom: 10px;">We'll create a customized event plan just for you</li>
            </ol>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="https://wa.me/${process.env.BUSINESS_WHATSAPP}?text=Hi, my booking reference is ${bookingReference}" class="button">Chat on WhatsApp</a>
              <a href="tel:${process.env.BUSINESS_PHONE}" class="button" style="background: #0F4C81;">Call Us Now</a>
            </div>
            
            <div class="tip-box">
              <strong style="color: #D4AF37; display: block; margin-bottom: 5px;">💡 Pro Tip:</strong> 
              <span style="color: #ffffff;">Save this email! Your booking reference number will help us serve you better during planning.</span>
            </div>
            
            <p style="margin-top: 40px; text-align: center; font-style: italic; color: #aaaaaa;">We look forward to creating magical memories together!</p>
            <p style="text-align: center;">Warm regards,<br><strong style="color: #ffffff;">Team Majestic Marriages</strong></p>
          </div>
          <div class="footer">
            <p style="color: #ffffff; font-weight: bold; margin-bottom: 5px;">Majestic Marriages</p>
            <p>C-56 First floor, Extension, Nemi Nagar, Vaishali Nagar, Jaipur, Rajasthan 302021</p>
            <p>📞 ${process.env.BUSINESS_PHONE} | 📧 ${process.env.BUSINESS_EMAIL}</p>
            <p style="margin-top: 20px; color: #555; font-size: 11px;">© 2026 Majestic Marriages. All rights reserved.</p>
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
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #ffffff; background-color: #0c0c0c; margin: 0; padding: 0; }
          .container { max-width: 700px; margin: 20px auto; padding: 25px; background: #1a1a1a; border-radius: 12px; border: 1px solid #333; }
          .card { background: #242424; padding: 35px; border-radius: 10px; border: 1px solid #444; }
          .header { background: linear-gradient(135deg, #8B0000 0%, #0F4C81 100%); color: #ffffff; padding: 25px; border-radius: 8px; margin-bottom: 30px; text-align: center; }
          .ref-badge { background: #D4AF37; color: #1a1a1a; padding: 12px 25px; border-radius: 6px; font-size: 22px; font-weight: bold; display: inline-block; letter-spacing: 1px; }
          .section { margin: 30px 0; }
          .field { margin: 12px 0; padding: 15px; background: #1f1f1f; border-left: 4px solid #D4AF37; border-radius: 4px; }
          .label { font-weight: bold; color: #D4AF37; display: inline-block; min-width: 130px; }
          .priority { background: #ff4444; color: #ffffff; padding: 6px 18px; border-radius: 20px; font-size: 13px; font-weight: bold; text-transform: uppercase; }
          .message-box { background: #2d2d2d; padding: 20px; border-radius: 8px; border: 1px solid #444; margin: 20px 0; }
          a { color: #D4AF37; text-decoration: none; }
          p, div, span { color: #ffffff; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="header">
              <h1 style="margin: 0; font-size: 28px; color: #ffffff;">🎊 New Event Booking</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9; color: #ffffff;">Action Required</p>
            </div>
            
            <div style="text-align: center; margin: 20px 0;">
              <div class="ref-badge">${bookingReference}</div>
              <p style="margin: 10px 0; color: #aaaaaa;">Booking Reference Number</p>
            </div>
            
            <div class="section">
              <h3 style="color: #D4AF37; border-bottom: 1px solid #444; padding-bottom: 10px;">Client Information</h3>
              <div class="field">
                <span class="label">Name:</span> <span style="color: #ffffff;">${name}</span>
              </div>
              <div class="field">
                <span class="label">Email:</span> <a href="mailto:${email}">${email}</a>
              </div>
              <div class="field">
                <span class="label">Phone:</span> <a href="tel:${phone}">${phone}</a>
              </div>
            </div>
            
            <div class="section">
              <h3 style="color: #D4AF37; border-bottom: 1px solid #444; padding-bottom: 10px;">Event Details</h3>
              <div class="field">
                <span class="label">Event Type:</span> <strong style="color: #ffffff;">${eventType}</strong>
              </div>
              <div class="field">
                <span class="label">Event Date:</span> <strong style="color: #D4AF37;">${formattedDate}</strong>
              </div>
              <div class="field">
                <span class="label">Location:</span> <span style="color: #ffffff;">${location}</span>
              </div>
              <div class="field">
                <span class="label">Guest Count:</span> <span style="color: #ffffff;">${guestCount}</span>
              </div>
              <div class="field">
                <span class="label">Budget Range:</span> <strong style="color: #ffffff;">${budgetRange}</strong>
              </div>
            </div>
            
            ${message ? `
            <div class="section">
              <h3 style="color: #D4AF37; border-bottom: 1px solid #444; padding-bottom: 10px;">Additional Message</h3>
              <div class="message-box">
                <p style="margin: 0; white-space: pre-wrap; color: #e0e0e0;">${message}</p>
              </div>
            </div>
            ` : ''}
            
            <div style="margin-top: 30px; padding: 25px; background: #1f1f1f; border-radius: 8px; border: 2px solid #D4AF37;">
              <p style="margin: 0 0 15px 0;"><span class="priority">ACTION REQUIRED</span></p>
              <p style="margin: 0; color: #ffffff;"><strong>⏰ Follow-up:</strong> Please contact the client within 24 hours to confirm details.</p>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="tel:${phone}" style="display: inline-block; padding: 14px 30px; background: #8B0000; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px;">📞 Call Client</a>
              <a href="mailto:${email}" style="display: inline-block; padding: 14px 30px; background: #0F4C81; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 10px;">📧 Email Client</a>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #444; font-size: 13px; color: #888;">
              <p style="margin: 5px 0;"><strong>Booking ID:</strong> ${bookingId}</p>
              <p style="margin: 5px 0;"><strong>Submitted:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
};
