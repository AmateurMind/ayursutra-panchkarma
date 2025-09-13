import React, { useState } from 'react';
import { initializeTherapyNotifications } from '../services/therapyNotificationService';
import { toast } from 'react-toastify';

/**
 * Demo component to test notification functionality
 * This component should be used for testing purposes only
 */
const NotificationDemo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [patientApiKey, setPatientApiKey] = useState('');
  const [doctorApiKey, setDoctorApiKey] = useState('');

  // Sample appointment data for testing
  const sampleAppointmentData = {
    userData: {
      name: 'John Doe',
      email: testEmail || 'patient@example.com',
      phone: '+1 (555) 123-4567',
      dob: '1990-05-15',
      gender: 'Male'
    },
    docData: {
      name: 'Dr. Rajesh Sharma',
      speciality: 'Virechana Therapy',
      experience: '15 Years',
      fees: 2500,
      email: 'doctor@panchkarmawellness.com',
      address: {
        line1: 'PanchKarma Wellness Center',
        line2: 'Main Branch'
      }
    },
    slotDate: '15_12_2024',
    slotTime: '10:00 AM',
    amount: 2500
  };

  const testBookingNotification = async () => {
    setIsLoading(true);
    try {
      const notificationService = initializeTherapyNotifications(patientApiKey, doctorApiKey);
      
      const result = await notificationService.sendBookingNotifications({
        ...sampleAppointmentData,
        userData: { ...sampleAppointmentData.userData, email: testEmail || 'patient@example.com' }
      });
      
      if (result.success) {
        toast.success(`✅ Test notifications sent! Patient: ${result.patientNotification}, Doctor: ${result.doctorNotification}`);
      } else {
        toast.error('❌ Failed to send test notifications');
      }
    } catch (error) {
      console.error('Test notification error:', error);
      toast.error(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testPatientNotification = async () => {
    setIsLoading(true);
    try {
      const notificationService = initializeTherapyNotifications(patientApiKey, doctorApiKey);
      
      await notificationService.sendPatientBookingConfirmation({
        ...sampleAppointmentData,
        userData: { ...sampleAppointmentData.userData, email: testEmail || 'patient@example.com' }
      });
      
      toast.success('✅ Patient notification sent successfully!');
    } catch (error) {
      console.error('Patient notification error:', error);
      toast.error(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testDoctorNotification = async () => {
    setIsLoading(true);
    try {
      const notificationService = initializeTherapyNotifications(patientApiKey, doctorApiKey);
      
      await notificationService.sendDoctorBookingNotification({
        ...sampleAppointmentData,
        userData: { ...sampleAppointmentData.userData, email: testEmail || 'patient@example.com' }
      });
      
      toast.success('✅ Doctor notification sent successfully!');
    } catch (error) {
      console.error('Doctor notification error:', error);
      toast.error(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testReminderNotification = async () => {
    setIsLoading(true);
    try {
      const notificationService = initializeTherapyNotifications(patientApiKey, doctorApiKey);
      
      await notificationService.sendTherapyReminder({
        ...sampleAppointmentData,
        userData: { ...sampleAppointmentData.userData, email: testEmail || 'patient@example.com' }
      }, 24);
      
      toast.success('✅ Reminder notification sent successfully!');
    } catch (error) {
      console.error('Reminder notification error:', error);
      toast.error(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testCancellationNotification = async () => {
    setIsLoading(true);
    try {
      const notificationService = initializeTherapyNotifications(patientApiKey, doctorApiKey);
      
      await notificationService.sendCancellationNotification({
        ...sampleAppointmentData,
        userData: { ...sampleAppointmentData.userData, email: testEmail || 'patient@example.com' }
      });
      
      toast.success('✅ Cancellation notification sent successfully!');
    } catch (error) {
      console.error('Cancellation notification error:', error);
      toast.error(`❌ Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-card rounded-lg shadow-breathing">
      <div className="mb-6">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          🧪 PanchKarma Notification Testing
        </h2>
        <p className="text-text-secondary">
          Test the email notification system for therapy bookings. Enter your email to receive test notifications.
        </p>
      </div>

      {/* API Keys Configuration */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="patientApiKey" className="block text-sm font-medium text-foreground mb-2">
            Patient API Key (Web3Forms)
          </label>
          <input
            type="text"
            id="patientApiKey"
            value={patientApiKey}
            onChange={(e) => setPatientApiKey(e.target.value)}
            placeholder="Enter patient notifications API key"
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label htmlFor="doctorApiKey" className="block text-sm font-medium text-foreground mb-2">
            Doctor API Key (Web3Forms)
          </label>
          <input
            type="text"
            id="doctorApiKey"
            value={doctorApiKey}
            onChange={(e) => setDoctorApiKey(e.target.value)}
            placeholder="Enter doctor notifications API key"
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-colors"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Email Input */}
      <div className="mb-6">
        <label htmlFor="testEmail" className="block text-sm font-medium text-foreground mb-2">
          Test Email Address
        </label>
        <input
          type="email"
          id="testEmail"
          value={testEmail}
          onChange={(e) => setTestEmail(e.target.value)}
          placeholder="your-email@example.com"
          className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
          disabled={isLoading}
        />
      </div>

      {/* Test Sample Data */}
      <div className="mb-6 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold text-foreground mb-2">📋 Sample Test Data:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Patient:</strong> {sampleAppointmentData.userData.name}<br />
            <strong>Doctor:</strong> {sampleAppointmentData.docData.name}<br />
            <strong>Therapy:</strong> {sampleAppointmentData.docData.speciality}
          </div>
          <div>
            <strong>Date:</strong> December 15, 2024<br />
            <strong>Time:</strong> {sampleAppointmentData.slotTime}<br />
            <strong>Fee:</strong> ₹{sampleAppointmentData.amount}
          </div>
        </div>
      </div>

      {/* Test Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          onClick={testBookingNotification}
          disabled={isLoading}
          className="bg-primary text-primary-foreground px-4 py-3 rounded-md hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              Sending...
            </span>
          ) : (
            '📧 Test Both Notifications'
          )}
        </button>

        <button
          onClick={testPatientNotification}
          disabled={isLoading}
          className="bg-secondary text-secondary-foreground px-4 py-3 rounded-md hover:bg-secondary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🌿 Patient Confirmation
        </button>

        <button
          onClick={testDoctorNotification}
          disabled={isLoading}
          className="bg-accent text-accent-foreground px-4 py-3 rounded-md hover:bg-accent/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          👨‍⚕️ Doctor Notification
        </button>

        <button
          onClick={testReminderNotification}
          disabled={isLoading}
          className="bg-warning text-warning-foreground px-4 py-3 rounded-md hover:bg-warning/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ⏰ Reminder Email
        </button>

        <button
          onClick={testCancellationNotification}
          disabled={isLoading}
          className="bg-error text-error-foreground px-4 py-3 rounded-md hover:bg-error/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ❌ Cancellation Email
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
          <span>💡</span>
          Testing Instructions:
        </h4>
        <ul className="text-sm text-text-secondary space-y-1">
          <li>• Enter your Web3Forms API keys for patient and doctor notifications</li>
          <li>• Enter your email address to receive test notifications</li>
          <li>• Click any button to send the respective notification type</li>
          <li>• Patient notifications use the patient API key</li>
          <li>• Doctor notifications use the doctor API key</li>
          <li>• Check your email inbox (and spam folder) for the test emails</li>
          <li>• Each email will be styled with PanchKarma branding</li>
          <li>• Remove this component before production deployment</li>
        </ul>
      </div>

      {/* Web3Forms Status */}
      <div className="mt-4 p-3 bg-success/5 border border-success/20 rounded-lg">
        <p className="text-sm text-success flex items-center gap-2">
          <span>✅</span>
          Web3Forms integration is active and ready to send notifications
        </p>
      </div>
    </div>
  );
};

export default NotificationDemo;