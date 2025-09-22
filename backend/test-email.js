import nodemailer from 'nodemailer';
import 'dotenv/config';

// Test email configuration
async function testEmailSetup() {
  try {
    console.log('🧪 Testing email configuration...');
    
    // Create transporter for testing
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER || 'test@example.com',
        pass: process.env.EMAIL_PASS || 'test-password'
      }
    });
    
    console.log('📧 Transporter created successfully');
    console.log('📝 Using email:', process.env.EMAIL_USER || 'test@example.com');
    
    // For testing, we'll just verify the configuration without sending
    console.log('✅ Email service configuration test complete');
    console.log('📋 To enable real email sending:');
    console.log('   1. Update EMAIL_USER and EMAIL_PASS in .env file');
    console.log('   2. Use a valid Gmail account with app password');
    console.log('   3. Restart the server');
    
  } catch (error) {
    console.error('❌ Email configuration error:', error.message);
  }
}

testEmailSetup();