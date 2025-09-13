/**
 * PanchKarma Wellness Notification Configuration
 * 
 * This file contains all notification-related settings including:
 * - Web3Forms API keys
 * - Email templates configuration
 * - Notification preferences
 * - SMTP settings (if needed)
 */

// Web3Forms Configuration
export const WEB3FORMS_CONFIG = {
  // Separate API keys for different notification types
  PATIENT: {
    ACCESS_KEY: '8501ef93-4fb1-427e-b8f8-4c34686a53a6', // Patient notifications API key
    FROM_NAME: 'PanchKarma Wellness',
    REPLY_TO: 'support@panchkarmawellness.com'
  },
  
  DOCTOR: {
    ACCESS_KEY: '77c9f68f-35c2-4a19-ae00-9e87cc827679', // Doctor notifications API key
    FROM_NAME: 'PanchKarma Wellness System',
    REPLY_TO: 'admin@panchkarmawellness.com'
  },
  
  // Common settings
  ENDPOINT: 'https://api.web3forms.com/submit',
  REDIRECT_URL: 'https://web3forms.com/success'
};

// Email Template Configuration
export const EMAIL_TEMPLATES = {
  // Patient notification settings
  PATIENT: {
    BOOKING_CONFIRMATION: {
      subject: '🌿 PanchKarma Therapy Booking Confirmed',
      includePreparationGuide: true,
      includeSupportContacts: true
    },
    THERAPY_REMINDER: {
      subject: '⏰ PanchKarma Therapy Reminder',
      hoursBeforeAppointment: 24,
      includeChecklist: true
    },
    CANCELLATION_CONFIRMATION: {
      subject: '❌ PanchKarma Therapy Cancelled - Booking Confirmation',
      includeRebookingOptions: true
    }
  },
  
  // Doctor notification settings
  DOCTOR: {
    NEW_BOOKING: {
      subject: '📅 New PanchKarma Therapy Booking - Patient Scheduled',
      includePatientDetails: true,
      includePreparationReminders: true
    },
    PATIENT_CANCELLED: {
      subject: '❌ Patient Cancelled PanchKarma Therapy Session',
      notifyImmediately: true
    }
  }
};

// Notification Preferences
export const NOTIFICATION_PREFERENCES = {
  // Enable/disable different types of notifications
  BOOKING_CONFIRMATIONS: {
    patient: true,
    doctor: true,
    admin: false
  },
  
  CANCELLATION_NOTIFICATIONS: {
    patient: true,
    doctor: true,
    admin: true
  },
  
  REMINDER_NOTIFICATIONS: {
    patient: true,
    hoursBeforeAppointment: [24, 2], // Send reminders 24h and 2h before
    doctor: false
  },
  
  // Contact form notifications
  CONTACT_FORM: {
    sendToAdmin: true,
    sendConfirmationToUser: true,
    adminEmail: 'admin@panchkarmawellness.com'
  }
};

// Error handling configuration
export const ERROR_CONFIG = {
  // Retry settings for failed notifications
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // milliseconds
  
  // Fallback options
  FALLBACK_EMAIL: 'support@panchkarmawellness.com',
  LOG_FAILURES: true,
  
  // User-facing error messages
  MESSAGES: {
    NOTIFICATION_FAILED: 'Booking successful! However, we encountered an issue sending email notifications.',
    PARTIAL_SUCCESS: 'Some email notifications may not have been delivered.',
    RETRY_LATER: 'Email notifications will be sent shortly.'
  }
};

// Support contact information
export const SUPPORT_CONTACTS = {
  MAIN: {
    phone: '+1 (555) 123-4567',
    email: 'support@panchkarmawellness.com',
    hours: '24/7 Support'
  },
  
  EMERGENCY: {
    phone: '+1 (555) 999-0000',
    email: 'emergency@panchkarmawellness.com',
    hours: '24/7 Emergency Line'
  },
  
  ADMIN: {
    phone: '+1 (555) 456-7890',
    email: 'admin@panchkarmawellness.com',
    hours: 'Mon-Fri: 9 AM - 5 PM'
  }
};

// Business information for emails
export const BUSINESS_INFO = {
  name: 'PanchKarma Wellness',
  tagline: 'Authentic Ayurvedic Detoxification',
  address: {
    line1: '54709 Willms Station',
    line2: 'Suite 350',
    city: 'Washington',
    country: 'USA'
  },
  website: 'https://panchkarmawellness.com',
  socialMedia: {
    facebook: 'https://facebook.com/panchkarmawellness',
    instagram: 'https://instagram.com/panchkarmawellness',
    twitter: 'https://twitter.com/panchkarmacare'
  }
};

// Export default configuration object
export default {
  WEB3FORMS_CONFIG,
  EMAIL_TEMPLATES,
  NOTIFICATION_PREFERENCES,
  ERROR_CONFIG,
  SUPPORT_CONTACTS,
  BUSINESS_INFO
};