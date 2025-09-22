import nodemailer from 'nodemailer';

// Email service controller for dynamic patient notifications
export class EmailController {
  constructor() {
    this.transporter = null;
    this.initializeEmailService();
  }

  // Initialize email service based on environment
  initializeEmailService() {
    try {
      if (process.env.NODE_ENV === 'production' && process.env.SMTP_HOST) {
        // Production SMTP configuration
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT || 587,
          secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
          }
        });
        console.log('📧 Production SMTP transporter initialized');
      } else {
        // Development/testing - use Ethereal for testing or Gmail
        this.transporter = nodemailer.createTransport({
          service: 'Gmail', // You can change this to your preferred service
          auth: {
            user: process.env.EMAIL_USER || 'your-email@gmail.com',
            pass: process.env.EMAIL_PASS || 'your-app-password'
          }
        });
        console.log('📧 Development Gmail transporter initialized');
      }
    } catch (error) {
      console.error('Error initializing email service:', error);
    }
  }

  // Send patient booking confirmation email
  async sendPatientBookingConfirmation(appointmentData) {
    const { userData, docData, slotDate, slotTime, amount } = appointmentData;

    if (!this.transporter) {
      throw new Error('Email service not initialized');
    }

    const emailContent = this.generatePatientBookingEmail(appointmentData);

    const mailOptions = {
      from: {
        name: 'PanchKarma Wellness',
        address: process.env.EMAIL_FROM || 'noreply@panchkarmawellness.com'
      },
      to: userData.email,
      subject: '🌿 PanchKarma Therapy Booking Confirmed',
      html: emailContent,
      text: this.stripHtml(emailContent) // Plain text fallback
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Patient booking confirmation sent to:', userData.email);
      return {
        success: true,
        messageId: result.messageId,
        recipient: userData.email
      };
    } catch (error) {
      console.error('❌ Error sending patient booking confirmation:', error);
      throw error;
    }
  }

  // Generate HTML email content for patient booking confirmation
  generatePatientBookingEmail(appointmentData) {
    const { userData, docData, slotDate, slotTime, amount } = appointmentData;
    const formattedDate = this.formatSlotDate(slotDate);

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>PanchKarma Therapy Booking Confirmed</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; margin: 0; padding: 20px; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #4CAF50, #2E7D32); color: white; padding: 30px 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 300; }
        .header .emoji { font-size: 40px; margin-bottom: 10px; display: block; }
        .content { padding: 30px 20px; }
        .booking-details { background-color: #f8f9fa; border-left: 4px solid #4CAF50; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .detail-row { display: flex; justify-content: space-between; margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #eee; }
        .detail-label { font-weight: 600; color: #555; }
        .detail-value { font-weight: 400; color: #333; }
        .preparation-section { background-color: #e8f5e8; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .preparation-section h3 { color: #2E7D32; margin-top: 0; }
        .preparation-list { list-style: none; padding: 0; }
        .preparation-list li { padding: 8px 0; padding-left: 25px; position: relative; }
        .preparation-list li:before { content: "✓"; position: absolute; left: 0; color: #4CAF50; font-weight: bold; }
        .support-section { background-color: #fff3cd; padding: 20px; margin: 20px 0; border-radius: 8px; border: 1px solid #ffeaa7; }
        .footer { background-color: #2c3e50; color: white; padding: 30px 20px; text-align: center; }
        .footer-info { margin-bottom: 15px; }
        .divider { height: 2px; background: linear-gradient(90deg, #4CAF50, #2E7D32); margin: 20px 0; }
        @media only screen and (max-width: 600px) {
          .email-container { margin: 10px; border-radius: 5px; }
          .content { padding: 20px 15px; }
          .detail-row { flex-direction: column; }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <span class="emoji">🌿</span>
          <h1>PanchKarma Therapy Booking Confirmed!</h1>
        </div>
        
        <div class="content">
          <p>Dear <strong>${userData.name}</strong>,</p>
          
          <p>We're excited to confirm your PanchKarma therapy booking! Your path to holistic wellness and detoxification is now scheduled with our certified specialist.</p>
          
          <div class="booking-details">
            <h3 style="margin-top: 0; color: #2E7D32;">📋 Booking Details</h3>
            <div class="detail-row">
              <span class="detail-label">🏥 Specialist:</span>
              <span class="detail-value">${docData.name}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">🎯 Specialization:</span>
              <span class="detail-value">${docData.speciality}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">⭐ Experience:</span>
              <span class="detail-value">${docData.experience}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">🗓 Date:</span>
              <span class="detail-value">${formattedDate}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">⏰ Time:</span>
              <span class="detail-value">${slotTime}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">📍 Location:</span>
              <span class="detail-value">${docData.address?.line1 || 'PanchKarma Wellness Center'}, ${docData.address?.line2 || ''}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">💰 Consultation Fee:</span>
              <span class="detail-value">₹${amount}</span>
            </div>
          </div>

          <div class="preparation-section">
            <h3>🧘‍♀️ Pre-Therapy Preparation</h3>
            <p>PanchKarma requires specific preparation for optimal results:</p>
            <ul class="preparation-list">
              <li>Begin light diet (laghu ahara) 3 days before therapy</li>
              <li>Avoid heavy, oily, and processed foods</li>
              <li>Stay hydrated with warm water and herbal teas</li>
              <li>Complete any prescribed pre-therapy medications</li>
              <li>Prepare mentally for the detoxification process</li>
            </ul>
          </div>

          <div class="support-section">
            <h3 style="margin-top: 0; color: #856404;">📞 Need Assistance?</h3>
            <p>Our PanchKarma specialists are here to guide you:</p>
            <p>
              <strong>📱 Phone:</strong> +1 (555) 123-4567<br>
              <strong>📧 Email:</strong> support@panchkarmawellness.com<br>
              <strong>🕐 Support:</strong> 24/7 Support
            </p>
          </div>

          <div class="divider"></div>
          
          <p>We look forward to supporting your wellness journey with authentic PanchKarma therapies.</p>
          
          <p style="margin-bottom: 0;"><strong>With wellness,<br>The PanchKarma Wellness Team</strong></p>
        </div>

        <div class="footer">
          <div class="footer-info">
            <strong>🌿 PanchKarma Wellness | Authentic Ayurvedic Detoxification</strong>
          </div>
          <div class="footer-info">
            📍 54709 Willms Station, Suite 350, Washington, USA
          </div>
        </div>
      </div>
    </body>
    </html>`;
  }

  // Send patient therapy reminder
  async sendPatientTherapyReminder(appointmentData, hoursBeforeAppointment = 24) {
    const { userData, docData, slotDate, slotTime } = appointmentData;

    if (!this.transporter) {
      throw new Error('Email service not initialized');
    }

    const emailContent = this.generateReminderEmail(appointmentData, hoursBeforeAppointment);

    const mailOptions = {
      from: {
        name: 'PanchKarma Wellness',
        address: process.env.EMAIL_FROM || 'noreply@panchkarmawellness.com'
      },
      to: userData.email,
      subject: `⏰ PanchKarma Therapy Reminder - ${hoursBeforeAppointment}h Before Session`,
      html: emailContent,
      text: this.stripHtml(emailContent)
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Patient reminder sent to:', userData.email);
      return {
        success: true,
        messageId: result.messageId,
        recipient: userData.email
      };
    } catch (error) {
      console.error('❌ Error sending patient reminder:', error);
      throw error;
    }
  }

  // Helper method to format slot date
  formatSlotDate(slotDate) {
    const [day, month, year] = slotDate.split('_');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Helper method to strip HTML for plain text
  stripHtml(html) {
    return html
      .replace(/<style[^>]*>.*<\/style>/gms, '')
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Generate reminder email content
  generateReminderEmail(appointmentData, hoursBeforeAppointment) {
    const { userData, docData, slotDate, slotTime } = appointmentData;
    const formattedDate = this.formatSlotDate(slotDate);

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>PanchKarma Therapy Reminder</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; margin: 0; padding: 20px; }
        .email-container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #FF9800, #F57C00); color: white; padding: 30px 20px; text-align: center; }
        .content { padding: 30px 20px; }
        .reminder-details { background-color: #fff3e0; border-left: 4px solid #FF9800; padding: 20px; margin: 20px 0; border-radius: 5px; }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>⏰ PanchKarma Therapy Reminder</h1>
          <p>${hoursBeforeAppointment} hours before your session</p>
        </div>
        <div class="content">
          <p>Dear <strong>${userData.name}</strong>,</p>
          <p>Your PanchKarma therapy session is approaching in ${hoursBeforeAppointment} hours! Please prepare accordingly.</p>
          
          <div class="reminder-details">
            <h3>🌿 Your PanchKarma Session Details</h3>
            <p><strong>🏥 Specialist:</strong> ${docData.name}</p>
            <p><strong>🗓 Date & Time:</strong> ${formattedDate} at ${slotTime}</p>
            <p><strong>🌿 Therapy:</strong> ${docData.speciality}</p>
            <p><strong>📍 Location:</strong> ${docData.address?.line1 || 'PanchKarma Wellness Center'}</p>
          </div>

          <p>We look forward to seeing you soon for your healing session.</p>
          <p><strong>Namaste,<br>PanchKarma Wellness Team</strong></p>
        </div>
      </div>
    </body>
    </html>`;
  }
}

// Create and export singleton instance
const emailController = new EmailController();
export default emailController;

// API endpoint functions
export const sendPatientEmail = async (req, res) => {
  try {
    const { appointmentData, type = 'booking_confirmation' } = req.body;

    if (!appointmentData) {
      return res.status(400).json({
        success: false,
        message: 'Appointment data is required'
      });
    }

    let result;
    switch (type) {
      case 'booking_confirmation':
        result = await emailController.sendPatientBookingConfirmation(appointmentData);
        break;
      case 'reminder':
        const hours = req.body.hoursBeforeAppointment || 24;
        result = await emailController.sendPatientTherapyReminder(appointmentData, hours);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid email type'
        });
    }

    return res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      data: result
    });

  } catch (error) {
    console.error('Error in sendPatientEmail:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message
    });
  }
};

export const testEmailService = async (req, res) => {
  try {
    const testData = {
      userData: {
        name: 'Test Patient',
        email: req.body.email || 'test@example.com'
      },
      docData: {
        name: 'Dr. Test Specialist',
        speciality: 'Panchakarma Therapy',
        experience: '10 years',
        address: {
          line1: 'Test Wellness Center',
          line2: 'Test Suite'
        }
      },
      slotDate: '22_12_2024',
      slotTime: '10:00 AM',
      amount: '500'
    };

    const result = await emailController.sendPatientBookingConfirmation(testData);
    
    return res.status(200).json({
      success: true,
      message: 'Test email sent successfully',
      data: result
    });
  } catch (error) {
    console.error('Error in testEmailService:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error.message
    });
  }
};