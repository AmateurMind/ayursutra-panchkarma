import axios from 'axios';
import { WEB3FORMS_CONFIG, BUSINESS_INFO, SUPPORT_CONTACTS } from '../config/notificationConfig.js';

/**
 * PanchKarma Therapy Notification Service
 * Handles email notifications for therapy bookings, confirmations, and reminders
 */
export class TherapyNotificationService {
  constructor(patientApiKey = null, doctorApiKey = null) {
    // Use provided keys or fall back to config
    this.patientApiKey = patientApiKey || WEB3FORMS_CONFIG.PATIENT.ACCESS_KEY;
    this.doctorApiKey = doctorApiKey || WEB3FORMS_CONFIG.DOCTOR.ACCESS_KEY;
    this.web3formsEndpoint = WEB3FORMS_CONFIG.ENDPOINT;
    
    // Separate configurations for patient and doctor notifications
    this.patientConfig = {
      fromName: WEB3FORMS_CONFIG.PATIENT.FROM_NAME,
      replyTo: WEB3FORMS_CONFIG.PATIENT.REPLY_TO
    };
    
    this.doctorConfig = {
      fromName: WEB3FORMS_CONFIG.DOCTOR.FROM_NAME,
      replyTo: WEB3FORMS_CONFIG.DOCTOR.REPLY_TO
    };
  }

  /**
   * Send booking confirmation to patient
   */
  async sendPatientBookingConfirmation(appointmentData) {
    const { userData, docData, slotDate, slotTime, amount } = appointmentData;

    const formData = new FormData();
    formData.append('access_key', this.patientApiKey);
    formData.append('to', userData.email);
    formData.append('subject', '🌿 PanchKarma Therapy Booking Confirmed');
    formData.append('from_name', this.patientConfig.fromName);
    formData.append('reply_to', this.patientConfig.replyTo);

    // Create beautiful but Web3Forms-compatible email content
    const emailContent = `
🌿 PanchKarma Therapy Booking Confirmed!

Dear ${userData.name},

We're excited to confirm your PanchKarma therapy booking! Your path to holistic wellness and detoxification is now scheduled with our certified specialist.

📋 BOOKING DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏥 Specialist: ${docData.name}
🎯 Specialization: ${docData.speciality}
⭐ Experience: ${docData.experience}

🗓 Date: ${this.formatSlotDate(slotDate)}
⏰ Time: ${slotTime}
📍 Location: ${docData.address?.line1 || 'PanchKarma Wellness Center'}, ${docData.address?.line2 || ''}
💰 Consultation Fee: ₹${amount}

🧘‍♀️ PRE-THERAPY PREPARATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PanchKarma requires specific preparation for optimal results:

• Begin light diet (laghu ahara) 3 days before therapy
• Avoid heavy, oily, and processed foods
• Stay hydrated with warm water and herbal teas
• Complete any prescribed pre-therapy medications
• Prepare mentally for the detoxification process

📋 Access your detailed preparation guide in the app

📞 NEED ASSISTANCE?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Our PanchKarma specialists are here to guide you:

📱 Phone: ${SUPPORT_CONTACTS.MAIN.phone}
📧 Email: ${SUPPORT_CONTACTS.MAIN.email}
🕐 Support: ${SUPPORT_CONTACTS.MAIN.hours}

We look forward to supporting your wellness journey with authentic PanchKarma therapies.

With wellness,
The PanchKarma Wellness Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌿 ${BUSINESS_INFO.name} | ${BUSINESS_INFO.tagline}
📍 ${BUSINESS_INFO.address.line1}, ${BUSINESS_INFO.address.line2}, ${BUSINESS_INFO.address.city}, ${BUSINESS_INFO.address.country}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    formData.append('message', emailContent);

    try {
      const response = await fetch(this.web3formsEndpoint, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('Patient booking confirmation sent successfully');
        return { success: true, data: result };
      } else {
        throw new Error(result.message || 'Failed to send patient notification');
      }
    } catch (error) {
      console.error('Error sending patient booking confirmation:', error);
      throw error;
    }
  }

  /**
   * Send booking notification to doctor/specialist
   */
  async sendDoctorBookingNotification(appointmentData) {
    const { userData, docData, slotDate, slotTime, amount } = appointmentData;

    const formData = new FormData();
    formData.append('access_key', this.doctorApiKey);
    formData.append('to', docData.email || 'doctor@panchkarmawellness.com');
    formData.append('subject', '📅 New PanchKarma Therapy Booking - Patient Scheduled');
    formData.append('from_name', this.doctorConfig.fromName);
    formData.append('reply_to', this.doctorConfig.replyTo);

    const emailContent = `
👨‍⚕️ New Patient Booking - PanchKarma Therapy Session Scheduled

Dear Dr. ${docData.name},

A new PanchKarma therapy session has been booked with you. Please review the patient details and prepare for the consultation.

👤 PATIENT INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💴 Name: ${userData.name}
📧 Email: ${userData.email}
📱 Phone: ${userData.phone || 'Not provided'}
🎂 Age: ${userData.dob ? this.calculateAge(userData.dob) : 'Not provided'} years
⚙️ Gender: ${userData.gender || 'Not provided'}

📅 APPOINTMENT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🗓 Date: ${this.formatSlotDate(slotDate)}
⏰ Time: ${slotTime}
🌿 Therapy Type: ${docData.speciality}
💰 Fee: ₹${amount}

📋 PRE-SESSION PREPARATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Please ensure you have:

• Reviewed patient's medical history (if available)
• Prepared necessary oils and herbal medicines
• Planned the specific PanchKarma protocol
• Set up the therapy room and equipment

📞 SUPPORT & COORDINATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
For any scheduling conflicts or patient coordination:

📞 Admin Team: ${SUPPORT_CONTACTS.ADMIN.phone}
📧 System Support: ${SUPPORT_CONTACTS.ADMIN.email}

Thank you for your dedication to authentic PanchKarma healing.

Best regards,
PanchKarma Wellness Administration

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏥 PanchKarma Wellness Provider Portal
This is an automated notification from our booking system
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    formData.append('message', emailContent);

    try {
      const response = await fetch(this.web3formsEndpoint, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('Doctor booking notification sent successfully');
        return { success: true, data: result };
      } else {
        throw new Error(result.message || 'Failed to send doctor notification');
      }
    } catch (error) {
      console.error('Error sending doctor booking notification:', error);
      throw error;
    }
  }

  /**
   * Send both notifications (patient and doctor) for a new booking
   */
  async sendBookingNotifications(appointmentData) {
    try {
      const results = await Promise.allSettled([
        this.sendPatientBookingConfirmation(appointmentData),
        this.sendDoctorBookingNotification(appointmentData)
      ]);

      const patientResult = results[0];
      const doctorResult = results[1];

      console.log('Booking notifications results:', {
        patient: patientResult.status,
        doctor: doctorResult.status
      });

      return {
        success: true,
        patientNotification: patientResult.status === 'fulfilled',
        doctorNotification: doctorResult.status === 'fulfilled',
        errors: [
          ...(patientResult.status === 'rejected' ? [`Patient: ${patientResult.reason}`] : []),
          ...(doctorResult.status === 'rejected' ? [`Doctor: ${doctorResult.reason}`] : [])
        ]
      };
    } catch (error) {
      console.error('Error sending booking notifications:', error);
      throw error;
    }
  }

  /**
   * Send therapy reminder notification
   */
  async sendTherapyReminder(appointmentData, hoursBeforeAppointment = 24) {
    const { userData, docData, slotDate, slotTime } = appointmentData;

    const formData = new FormData();
    formData.append('access_key', this.patientApiKey);
    formData.append('to', userData.email);
    formData.append('subject', `⏰ PanchKarma Therapy Reminder - ${hoursBeforeAppointment}h Before Session`);
    formData.append('from_name', this.patientConfig.fromName);
    formData.append('reply_to', this.patientConfig.replyTo);

    const emailContent = `
⏰ PanchKarma Therapy Reminder - ${hoursBeforeAppointment}h Before Session

Dear ${userData.name},

Your PanchKarma therapy session is approaching in ${hoursBeforeAppointment} hours! Please prepare accordingly.

🌿 YOUR PANCHKARMA SESSION DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏥 Specialist: ${docData.name}
🗓 Date & Time: ${this.formatSlotDate(slotDate)} at ${slotTime}
🌿 Therapy: ${docData.speciality}
📍 Location: ${docData.address?.line1 || 'PanchKarma Wellness Center'}

✅ FINAL PREPARATION CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Complete fasting as instructed
• Wear loose, comfortable clothing
• Bring towels and change of clothes
• Stay hydrated with warm water
• Arrive 15 minutes early

We look forward to seeing you soon for your healing session.

Namaste,
PanchKarma Wellness Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌿 PanchKarma Wellness | Authentic Ayurvedic Detoxification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    formData.append('message', emailContent);

    try {
      const response = await fetch(this.web3formsEndpoint, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('Therapy reminder sent successfully');
        return { success: true, data: result };
      } else {
        throw new Error(result.message || 'Failed to send therapy reminder');
      }
    } catch (error) {
      console.error('Error sending therapy reminder:', error);
      throw error;
    }
  }

  /**
   * Send therapy cancellation notification
   */
  async sendCancellationNotification(appointmentData) {
    const { userData, docData, slotDate, slotTime } = appointmentData;

    const formData = new FormData();
    formData.append('access_key', this.patientApiKey);
    formData.append('to', userData.email);
    formData.append('subject', '❌ PanchKarma Therapy Cancelled - Booking Confirmation');
    formData.append('from_name', this.patientConfig.fromName);
    formData.append('reply_to', this.patientConfig.replyTo);

    const emailContent = `
❌ PanchKarma Therapy Cancelled - Booking Confirmation

Dear ${userData.name},

Your PanchKarma therapy session has been successfully cancelled as requested.

📋 CANCELLED SESSION DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏥 Specialist: ${docData.name}
🗓 Date & Time: ${this.formatSlotDate(slotDate)} at ${slotTime}
🌿 Therapy: ${docData.speciality}

We understand that plans can change. When you're ready to continue your wellness journey, we're here to help you reschedule.

🌿 READY TO BOOK AGAIN?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Visit our platform to book a new PanchKarma therapy session or contact our support team for assistance.

Take care and we hope to support your wellness journey soon.

With compassion,
PanchKarma Wellness Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌿 PanchKarma Wellness | Authentic Ayurvedic Detoxification
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    formData.append('message', emailContent);
    formData.append('_template', 'table');
    formData.append('_format', 'html');

    try {
      const response = await fetch(this.web3formsEndpoint, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('Cancellation notification sent successfully');
        return { success: true, data: result };
      } else {
        throw new Error(result.message || 'Failed to send cancellation notification');
      }
    } catch (error) {
      console.error('Error sending cancellation notification:', error);
      throw error;
    }
  }

  // Helper methods
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

  calculateAge(dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}

// Create singleton instance with default access key
let therapyNotificationService = null;

export const initializeTherapyNotifications = (patientApiKey = null, doctorApiKey = null) => {
  therapyNotificationService = new TherapyNotificationService(patientApiKey, doctorApiKey);
  return therapyNotificationService;
};

export const getTherapyNotificationService = () => {
  if (!therapyNotificationService) {
    throw new Error('TherapyNotificationService not initialized. Call initializeTherapyNotifications first.');
  }
  return therapyNotificationService;
};

export default TherapyNotificationService;