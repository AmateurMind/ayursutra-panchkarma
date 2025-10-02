
This guide will help you configure your Web3Forms API keys for the PanchKarma therapy booking notification system.

## 📧 **API Key Configuration**

You have **2 separate Web3Forms API keys** for different notification types:

### 1. **Patient API Key** 🏥
- **Purpose**: Sends notifications TO patients
- **Used for**:
  - Booking confirmation emails to patients
  - Therapy reminder emails to patients
  - Cancellation confirmation emails to patients
- **Sender Name**: "PanchKarma Wellness"
- **Reply-To**: support@panchkarmawellness.com

### 2. **Doctor API Key** 👨‍⚕️
- **Purpose**: Sends notifications TO doctors/specialists
- **Used for**:
  - New patient booking alerts to doctors
  - Patient cancellation notifications to doctors
- **Sender Name**: "PanchKarma Wellness System"
- **Reply-To**: admin@panchkarmawellness.com

## ⚙️ **How to Set Up Your API Keys**

### Option 1: Update Configuration File (Recommended)

1. **Open the configuration file**:
   ```
   F:\prescripto-main\clientside\src\config\notificationConfig.js
   ```

2. **Replace the placeholder API keys**:
   ```javascript
   export const WEB3FORMS_CONFIG = {
     PATIENT: {
       ACCESS_KEY: 'YOUR_PATIENT_API_KEY_HERE', // 👈 Replace this
       FROM_NAME: 'PanchKarma Wellness',
       REPLY_TO: 'support@panchkarmawellness.com'
     },
     
     DOCTOR: {
       ACCESS_KEY: 'YOUR_DOCTOR_API_KEY_HERE', // 👈 Replace this
       FROM_NAME: 'PanchKarma Wellness System',
       REPLY_TO: 'admin@panchkarmawellness.com'
     },
     
     ENDPOINT: 'https://api.web3forms.com/submit',
     REDIRECT_URL: 'https://web3forms.com/success'
   };
   ```

3. **Save the file** and your notifications will work automatically!

### Option 2: Dynamic Configuration (For Testing)

You can also pass the API keys directly when initializing the service:

```javascript
const notificationService = initializeTherapyNotifications(
  'your_patient_api_key_here',
  'your_doctor_api_key_here'
);
```

## 🧪 **Testing Your Setup**

### Using the Demo Component

1. **Access the testing component** (for development only):
   - Import and use the `NotificationDemo` component
   - Enter your API keys in the form
   - Enter your test email address
   - Click the test buttons to verify notifications

2. **Test each notification type**:
   - **Patient Confirmation**: Tests booking confirmation email
   - **Doctor Notification**: Tests new patient booking alert
   - **Reminder Email**: Tests therapy reminder functionality
   - **Cancellation Email**: Tests cancellation confirmation
   - **Both Notifications**: Tests the complete booking flow

### Manual Testing

```javascript
import { initializeTherapyNotifications } from './services/therapyNotificationService';

// Initialize with your API keys
const notificationService = initializeTherapyNotifications(
  'your_patient_api_key',
  'your_doctor_api_key'
);

// Test patient notification
await notificationService.sendPatientBookingConfirmation(appointmentData);

// Test doctor notification
await notificationService.sendDoctorBookingNotification(appointmentData);
```

## 📊 **Notification Flow Diagram**

```
Therapy Booking Made
        |
        ▼
┌─────────────────┐
│  Notification   │
│    Service      │
└─────────────────┘
        |
        ▼
    ┌─────┴─────┐
    ▼           ▼
┌─────────┐ ┌─────────┐
│ Patient │ │ Doctor  │
│   API   │ │   API   │
│  Key    │ │  Key    │
└─────────┘ └─────────┘
    |           |
    ▼           ▼
┌─────────┐ ┌─────────┐
│Patient  │ │Doctor   │
│Email    │ │Email    │
│📧       │ │📧       │
└─────────┘ └─────────┘
```

## 🔧 **API Key Management Best Practices**

### Security
- **Never commit API keys** to version control
- **Use environment variables** in production
- **Rotate keys periodically** for security

### Organization
- **Patient Key**: For all patient-facing communications
- **Doctor Key**: For all internal/doctor communications
- **Separate analytics**: Track patient vs doctor notification metrics separately

### Environment Variables (Production)
Create a `.env` file:
```env
REACT_APP_PATIENT_WEB3FORMS_KEY=your_patient_api_key_here
REACT_APP_DOCTOR_WEB3FORMS_KEY=your_doctor_api_key_here
```

Then use in your config:
```javascript
PATIENT: {
  ACCESS_KEY: process.env.REACT_APP_PATIENT_WEB3FORMS_KEY || 'fallback_key',
  // ...
}
```

## 📈 **Benefits of Separate API Keys**

### 1. **Analytics & Tracking**
- Separate delivery statistics for patient vs doctor notifications
- Better monitoring of notification success rates
- Easier troubleshooting of delivery issues

### 2. **Rate Limiting**
- Independent rate limits for each notification type
- Prevents doctor notifications from affecting patient notifications

### 3. **Security & Access Control**
- Different permissions for different notification types
- Easier to revoke/rotate specific key types

### 4. **Compliance**
- Separate audit trails for patient communications
- Better HIPAA/privacy compliance tracking

## ✅ **Verification Checklist**

- [ ] Patient API key configured in `notificationConfig.js`
- [ ] Doctor API key configured in `notificationConfig.js`
- [ ] Test email sent using demo component
- [ ] Patient receives booking confirmation email
- [ ] Doctor receives new booking notification email
- [ ] Email styling and branding looks correct
- [ ] All links and contact information work
- [ ] Spam folder checked for test emails
- [ ] Demo component removed before production

## 🚨 **Troubleshooting**

### Common Issues:

1. **Emails not received**:
   - Check spam/junk folder
   - Verify API key is correct
   - Ensure email address format is valid

2. **Wrong sender name**:
   - Check `FROM_NAME` in configuration
   - Verify correct API key is being used

3. **Rate limiting errors**:
   - Wait a few minutes between test emails
   - Check Web3Forms dashboard for limits

4. **HTML rendering issues**:
   - Ensure `_content_type: 'html'` is set
   - Check email client compatibility

## 📞 **Support**

If you encounter issues:
- Check Web3Forms dashboard for delivery status
- Verify API keys are active and have sufficient quota
- Test with a simple plain text email first
- Contact Web3Forms support if needed

## 🎯 **Next Steps**

1. **Configure your API keys** in the config file
2. **Test the notification system** using the demo component
3. **Book a test therapy** to verify the complete flow
4. **Remove the demo component** before production deployment
5. **Monitor notification delivery** in your Web3Forms dashboard

---

**Your PanchKarma notification system is now ready to send professional, branded emails to both patients and doctors! 🌿✨**
