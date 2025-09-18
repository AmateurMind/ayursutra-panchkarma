// Google Analytics utility functions
export const GA_TRACKING_ID = 'G-87P2GPSLKD';

// Track page views
export const pageview = (url) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// Track custom events
export const event = ({ action, category, label, value }) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track specific events for your healthcare app
export const trackAppointmentBooked = (doctorName, appointmentDate) => {
  event({
    action: 'appointment_booked',
    category: 'engagement',
    label: `Doctor: ${doctorName} | Date: ${appointmentDate}`,
  });
};

export const trackDoctorProfile = (doctorName) => {
  event({
    action: 'doctor_profile_viewed',
    category: 'engagement',
    label: doctorName,
  });
};

export const trackContactForm = () => {
  event({
    action: 'contact_form_submitted',
    category: 'engagement',
    label: 'Contact Us',
  });
};