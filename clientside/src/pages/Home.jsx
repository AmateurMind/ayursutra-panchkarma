import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import ModernHeader from '../components/ui/Header'
import Button from '../components/ui/Button'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

const Home = () => {
  const { token, userData, setUserData, setToken } = useContext(AppContext);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserData(false);
    setToken('');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <ModernHeader
        userRole="patient"
        isAuthenticated={!!token}
        userName={userData?.name || "User"} 
        onLogout={handleLogout}
      />
      
      {/* Main content with top padding for fixed header */}
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative bg-primary rounded-lg mx-3 sm:mx-4 lg:mx-8 mt-3 sm:mt-4 overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 md:px-10 lg:px-20 py-6 sm:py-8 md:py-16">
            {/* Left Side - Content */}
            <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left justify-center gap-4 sm:gap-6 z-10">
              <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-primary-foreground font-semibold leading-tight">
                Experience Authentic <br className="hidden sm:block" /> 
                <span className="text-accent">PanchKarma</span><br className="hidden sm:block" />
                <span className="block sm:inline">Detoxification & Healing</span>
              </h1>
              
              <div className="flex flex-col md:flex-row items-center md:items-center gap-3 sm:gap-4 text-primary-foreground">
                <img className="w-20 sm:w-24 md:w-28 rounded-lg shadow-breathing" src={assets.group_profiles} alt="Practitioners" />
                <p className="font-body text-xs sm:text-sm md:text-base opacity-90 leading-relaxed max-w-lg">
                  Transform your health through traditional PanchKarma therapies - Vamana, Virechana, Basti, Nasya & Raktamokshana. 
                  <br className="hidden sm:block" /> 
                  Begin your detoxification journey with certified specialists.
                </p>
              </div>
              
              <Button
                  variant="secondary"
                  size="lg"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-elevated hover-lift"
                  iconName="Calendar"
                  iconPosition="right"
                  onClick={() => {
                    const section = document.getElementById("speciality");
                    section?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  Start PanchKarma Journey
                </Button>
            </div>

            {/* Right Side - Image */}
            <div className="md:w-1/2 relative mt-8 md:mt-0">
              <div className="relative">
                <img 
                  className="w-full h-auto max-w-lg mx-auto rounded-2xl shadow-elevated" 
                  src={assets.header_img} 
                  alt="PanchKarma Therapy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
          
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-accent/10 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gradient-to-tr from-secondary/10 to-transparent"></div>
        </section>

        {/* Quick Booking Call-to-Action */}
        <section className="px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-secondary/10 to-accent/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-secondary/20">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Use Instant Booking
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed">
                Simply tell us what you need in plain English - "Book Vamana therapy tomorrow at 4 PM" or "Schedule with Dr. Sharma next Monday"
              </p>
              <Button
                variant="secondary"
                size="lg"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 shadow-elevated hover-lift"
                iconName="MessageCircle"
                iconPosition="right"
                onClick={() => navigate('/quick-booking')}
              >
                Try Quick Booking Assistant
              </Button>
            </div>
          </div>
        </section>

        {/* Existing components with modern styling */}
        <div className="px-3 sm:px-4 lg:px-8">
          <SpecialityMenu />
          <TopDoctors />
          <Banner />
        </div>
      </main>
    </div>
  )
}

export default Home
