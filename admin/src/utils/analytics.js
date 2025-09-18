// Google Analytics utility functions for Admin Panel
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

// Track specific admin events
export const trackAdminLogin = () => {
  event({
    action: 'admin_login',
    category: 'admin',
    label: 'Admin Panel Access',
  });
};

export const trackDoctorAdded = (doctorName) => {
  event({
    action: 'doctor_added',
    category: 'admin',
    label: doctorName,
  });
};

export const trackAppointmentManaged = (action) => {
  event({
    action: 'appointment_managed',
    category: 'admin',
    label: action, // 'approved', 'cancelled', etc.
  });
};