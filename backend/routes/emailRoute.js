import express from 'express';
import { sendPatientEmail, testEmailService } from '../controllers/emailController.js';
import authUser from '../middlewares/authUser.js';

const emailRouter = express.Router();

// Send patient booking confirmation email
emailRouter.post('/send-patient-email', authUser, sendPatientEmail);

// Test email service (for development/testing)
emailRouter.post('/test-email', testEmailService);

export default emailRouter;