import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import Header from "../components/ui/Header";

const About = () => {
  const navigate = useNavigate();
  const { token, userData, setToken, setUserData } = useContext(AppContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserData(false);
    setToken('');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole={userData ? "patient" : "guest"}
        isAuthenticated={!!token}
        userName={userData?.name || "User"}
        onLogout={handleLogout}
      />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4">
              About <span className="text-primary">Ayursutra</span>
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Your trusted partner in authentic PanchKarma therapies and holistic Ayurvedic wellness.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <div className="order-2 lg:order-1">
                <img
                  className="w-full rounded-2xl shadow-elevated"
                  src={assets.about_image}
                  alt="Ayursutra Wellness Center"
                />
              </div>
              
              {/* Content */}
              <div className="order-1 lg:order-2 space-y-6">
                <div className="space-y-4">
                  <p className="text-lg text-text-primary leading-relaxed">
                    Welcome to <strong className="text-primary">Ayursutra</strong>, your trusted destination for authentic PanchKarma therapies. We specialize in the five classical detoxification and rejuvenation treatments of Ayurveda, bringing you ancient wisdom through modern, professional practice.
                  </p>
                  <p className="text-lg text-text-primary leading-relaxed">
                    Our center is committed to preserving and delivering genuine PanchKarma treatments - <strong>Vamana, Virechana, Basti, Nasya, and Raktamokshana</strong> - administered by certified specialists who understand the profound healing potential of these time-tested therapies.
                  </p>
                </div>
                
                <div className="bg-primary/5 p-6 rounded-lg border-l-4 border-primary">
                  <h3 className="text-xl font-heading font-bold text-foreground mb-3">
                    🌿 Our Vision
                  </h3>
                  <p className="text-text-primary leading-relaxed">
                    To make authentic PanchKarma therapies accessible to everyone seeking deep healing and rejuvenation. We aim to create a sanctuary where traditional Ayurvedic detoxification meets modern wellness standards, empowering you to achieve optimal health naturally.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                Why Choose <span className="text-primary">Ayursutra</span>
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                Discover what makes our Ayursutra center the trusted choice for authentic Ayurvedic detoxification and healing.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-xl shadow-breathing hover:shadow-elevated transition-all duration-300 group cursor-pointer border border-border hover:border-primary/20">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🧘‍♀️</div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                  Authentic PanchKarma
                </h3>
                <p className="text-text-primary leading-relaxed">
                  Genuine five-fold detoxification therapies administered according to classical Ayurvedic protocols by certified specialists.
                </p>
              </div>
              
              <div className="bg-card p-8 rounded-xl shadow-breathing hover:shadow-elevated transition-all duration-300 group cursor-pointer border border-border hover:border-primary/20">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🌿</div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                  Natural Healing
                </h3>
                <p className="text-text-primary leading-relaxed">
                  Complete detoxification and rejuvenation using only natural herbs, oils, and traditional methods with no chemicals.
                </p>
              </div>
              
              <div className="bg-card p-8 rounded-xl shadow-breathing hover:shadow-elevated transition-all duration-300 group cursor-pointer border border-border hover:border-primary/20">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">👥</div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                  Personalized Care
                </h3>
                <p className="text-text-primary leading-relaxed">
                  Customized PanchKarma protocols based on your unique constitution, health condition, and wellness goals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gradient-to-r from-primary to-secondary p-8 md:p-12 rounded-2xl text-white">
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                Ready to Begin Your Ayursutra Journey?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Connect with our certified Ayursutra specialists and discover the transformative power of authentic Ayurvedic detoxification.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/doctors')}
                  className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  🌿 Find Specialists
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="bg-white/10 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20"
                >
                  💬 Contact Us
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
