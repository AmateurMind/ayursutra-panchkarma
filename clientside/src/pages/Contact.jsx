import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import Header from "../components/ui/Header";
import ContactForm from "../components/ui/ContactForm";
import { toast } from "react-toastify";

const Contact = () => {
  const { token, userData, setUserData, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const handleFormSuccess = (result) => {
    toast.success("Thank you! Your message has been sent successfully. We'll get back to you soon.");
  };

  const handleFormError = (error) => {
    toast.error("Your msg has been sent");
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserData(false);
    setToken('');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole="patient"
        isAuthenticated={!!token}
        userName={userData?.name || "User"}
        onLogout={handleLogout}
      />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4 px-4">
              Contact <span className="text-primary">Ayursutra</span>
            </h1>
            <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto px-4">
              Get in touch with our Ayursutra specialists for therapy bookings, wellness consultations, or assistance with your detoxification journey.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 sm:mb-16">
            {/* Contact Form */}
            <div className="order-2 lg:order-1">
              <ContactForm
                title="Send Us a Message"
                description="Fill out the form below and we'll get back to you as soon as possible."
                accessKey="77c9f68f-35c2-4a19-ae00-9e87cc827679"
                onSuccess={handleFormSuccess}
                onError={handleFormError}
              />
            </div>

            {/* Contact Information */}
            <div className="space-y-6 sm:space-y-8 order-1 lg:order-2">
              {/* Office Info */}
              <div className="bg-card rounded-lg p-4 sm:p-6 shadow-breathing">
                <h3 className="text-lg sm:text-xl font-heading font-semibold text-foreground mb-4 sm:mb-6 flex items-center gap-3">
                  <span className="text-xl sm:text-2xl">🏢</span>
                  Our Office
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-primary mt-1 flex-shrink-0">📍</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-foreground text-sm sm:text-base">Address</div>
                      <div className="text-text-secondary text-sm">
                        PES Modern College<br />
                        Shiavji Nagar, Pune, Maharashtra<br />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-primary mt-1 flex-shrink-0">📞</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-foreground text-sm sm:text-base">Phone</div>
                      <div className="text-text-secondary text-sm">
                        <a href="tel:+911234567890" className="hover:text-primary transition-colors touch-target inline-block py-1">
                          1234567890
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-primary mt-1 flex-shrink-0">📧</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-foreground text-sm sm:text-base">Email</div>
                      <div className="text-text-secondary text-sm break-words">
                        <a href="mailto:suhail17mohammad@gmail.com" className="hover:text-primary transition-colors touch-target inline-block py-1">
                          suhail17mohammad@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-primary mt-1 flex-shrink-0">⏰</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-foreground text-sm sm:text-base">Business Hours</div>
                      <div className="text-text-secondary text-sm">
                        Mon-Fri: 8:00 AM - 8:00 PM<br />
                        Sat-Sun: 9:00 AM - 5:00 PM<br />
                        Emergency: 24/7 Support
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Careers Section */}
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-heading font-semibold text-foreground mb-3 sm:mb-4 flex items-center gap-3">
                  <span className="text-xl sm:text-2xl">🚀</span>
                  Careers at Ayursutra
                </h3>
                <p className="text-text-secondary mb-4 sm:mb-6 text-sm sm:text-base">
                  Join our mission to bring authentic PanchKarma therapies and Ayurvedic wellness to people worldwide through traditional healing practices.
                </p>
                <button className="bg-primary text-primary-foreground px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-primary/90 transition-colors font-medium text-sm sm:text-base touch-target w-full sm:w-auto">
                  Explore Job Opportunities
                </button>
              </div>

              {/* Image */}
              <div className="rounded-lg overflow-hidden shadow-breathing">
                <img
                  className="w-full h-48 sm:h-64 object-cover"
                  src={assets.contact_image}
                  alt="Contact PanchKarma Wellness"
                />
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-card rounded-lg p-4 sm:p-8 shadow-breathing">
            <h2 className="text-xl sm:text-2xl font-heading font-semibold text-foreground mb-6 text-center">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="p-4 bg-background rounded-lg">
                <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">How do I book a PanchKarma therapy?</h4>
                <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">
                  Browse our certified PanchKarma specialists, select your desired therapy (Vamana, Virechana, etc.), choose a time slot, and confirm your booking.
                </p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Can I reschedule my PanchKarma session?</h4>
                <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">
                  Yes, but PanchKarma requires preparation. Please reschedule at least 3 days in advance to allow for proper pre-therapy protocols.
                </p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">How long does a PanchKarma program take?</h4>
                <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">
                  Complete PanchKarma typically takes 7-21 days including preparation, therapy, and recovery phases based on individual needs.
                </p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Are there any side effects of PanchKarma?</h4>
                <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">
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
