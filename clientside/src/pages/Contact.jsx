import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import Header from "../components/ui/Header";
import ContactForm from "../components/ui/ContactForm";
import { toast } from "react-toastify";

const Contact = () => {
  const { token } = useContext(AppContext);

  const handleFormSuccess = (result) => {
    toast.success("Thank you! Your message has been sent successfully. We'll get back to you soon.");
  };

  const handleFormError = (error) => {
    toast.error("Sorry, there was an error sending your message. Please try again or call us directly.");
  };

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole="patient"
        isAuthenticated={!!token}
        userName="User"
        onLogout={handleLogout}
      />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-heading font-bold text-foreground mb-4">
              Contact <span className="text-primary">Ayursutra</span>
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Get in touch with our Ayursutra specialists for therapy bookings, wellness consultations, or assistance with your detoxification journey.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Contact Form */}
            <ContactForm
              title="Send Us a Message"
              description="Fill out the form below and we'll get back to you as soon as possible."
              accessKey="8501ef93-4fb1-427e-b8f8-4c34686a53a6"
              onSuccess={handleFormSuccess}
              onError={handleFormError}
            />

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Office Info */}
              <div className="bg-card rounded-lg p-6 shadow-breathing">
                <h3 className="text-xl font-heading font-semibold text-foreground mb-6 flex items-center gap-3">
                  <span className="text-2xl">🏢</span>
                  Our Office
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-primary mt-1">📍</span>
                    <div>
                      <div className="font-medium text-foreground">Address</div>
                      <div className="text-text-secondary">
                        PES Modern College<br />
                        Shiavji Nagar, Pune, Maharashtra<br />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-primary mt-1">📞</span>
                    <div>
                      <div className="font-medium text-foreground">Phone</div>
                      <div className="text-text-secondary">
                        <a href="tel:+14155550132" className="hover:text-primary transition-colors">
                          1234567890
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-primary mt-1">📧</span>
                    <div>
                      <div className="font-medium text-foreground">Email</div>
                      <div className="text-text-secondary">
                        <a href="mailto:support@karmpanchawellness.com" className="hover:text-primary transition-colors">
                          suhail17mohammad@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-primary mt-1">⏰</span>
                    <div>
                      <div className="font-medium text-foreground">Business Hours</div>
                      <div className="text-text-secondary">
                        Mon-Fri: 8:00 AM - 8:00 PM<br />
                        Sat-Sun: 9:00 AM - 5:00 PM<br />
                        Emergency: 24/7 Support
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Careers Section */}
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
                <h3 className="text-xl font-heading font-semibold text-foreground mb-4 flex items-center gap-3">
                  <span className="text-2xl">🚀</span>
                  Careers at Ayursutra
                </h3>
                <p className="text-text-secondary mb-6">
                  Join our mission to bring authentic PanchKarma therapies and Ayurvedic wellness to people worldwide through traditional healing practices.
                </p>
                <button className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors font-medium">
                  Explore Job Opportunities
                </button>
              </div>

              {/* Image */}
              <div className="rounded-lg overflow-hidden shadow-breathing">
                <img
                  className="w-full h-64 object-cover"
                  src={assets.contact_image}
                  alt="Contact PanchKarma Wellness"
                />
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-8 shadow-breathing">
            <h2 className="text-2xl font-heading font-semibold text-foreground mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-2">How do I book a PanchKarma therapy?</h4>
                <p className="text-text-secondary text-sm">
                  Browse our certified PanchKarma specialists, select your desired therapy (Vamana, Virechana, etc.), choose a time slot, and confirm your booking.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Can I reschedule my PanchKarma session?</h4>
                <p className="text-text-secondary text-sm">
                  Yes, but PanchKarma requires preparation. Please reschedule at least 3 days in advance to allow for proper pre-therapy protocols.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">How long does a PanchKarma program take?</h4>
                <p className="text-text-secondary text-sm">
                  Complete PanchKarma typically takes 7-21 days including preparation, therapy, and recovery phases based on individual needs.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Are there any side effects of PanchKarma?</h4>
                <p className="text-text-secondary text-sm">
                  PanchKarma may cause temporary effects during detoxification. Our specialists monitor you closely and provide guidance throughout the process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
