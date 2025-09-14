import React, { useState } from 'react';
import Button from './Button';

const ContactForm = ({ 
  title = "Contact Us", 
  description = "Get in touch with our PanchKarma wellness team",
  accessKey ="77c9f68f-35c2-4a19-ae00-9e87cc827679",
  onSuccess,
  onError 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('access_key', accessKey);
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      // Add additional metadata
      formDataToSend.append('from_name', 'Prescripto Contact Form');
      formDataToSend.append('redirect', 'https://web3forms.com/success');

      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formDataToSend
      });

      const result = await response.json();

      if (result.success) {
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });

        if (onSuccess) {
          onSuccess(result);
        } else {
          alert('Thank you! Your message has been sent successfully.');
        }
      } else {
        throw new Error(result.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      if (onError) {
        onError(error);
      } else {
        alert('Sorry, there was an error sending your message. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-breathing">
      <div className="mb-6">
        <h2 className="text-2xl font-heading font-semibold text-foreground mb-2">
          {title}
        </h2>
        <p className="text-text-secondary">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              placeholder="Enter your email address"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
              Subject *
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
            >
              <option value="">Select a subject</option>
              <option value="panchkarma-booking">PanchKarma Therapy Booking</option>
              <option value="therapy-modification">Therapy Modification</option>
              <option value="wellness-inquiry">Wellness & Therapy Inquiry</option>
              <option value="preparation-guidance">Pre-Therapy Preparation</option>
              <option value="technical-support">Technical Support</option>
              <option value="feedback-complaint">Feedback & Suggestions</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="5"
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-vertical"
            placeholder="Please describe your inquiry in detail..."
          ></textarea>
        </div>

        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-primary mt-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-sm mb-1">Response Time</h4>
            <p className="text-xs text-text-secondary">
              We typically respond to inquiries within 24 hours during business days. 
              For urgent therapy-related concerns, please call our specialist helpline directly.
            </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </div>
            ) : (
              <>📧 Send Message</>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => setFormData({
              name: '',
              email: '',
              phone: '',
              subject: '',
              message: ''
            })}
            disabled={isSubmitting}
          >
            🔄 Clear Form
          </Button>
        </div>
      </form>

      <div className="mt-6 pt-6 border-t border-border">
        <h4 className="font-semibold text-foreground text-sm mb-3">Alternative Contact Methods:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-primary">📞</span>
            <div>
              <div className="font-medium text-foreground">Phone</div>
              <div className="text-text-secondary">1234567890</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary">📧</span>
            <div>
              <div className="font-medium text-foreground">Email</div>
              <div className="text-text-secondary">ayur@gmail.com</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary">⏰</span>
            <div>
              <div className="font-medium text-foreground">Hours</div>
              <div className="text-text-secondary">24/7 Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;