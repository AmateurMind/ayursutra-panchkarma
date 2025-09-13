import React, { useContext } from 'react'
import ModernHeader from '../components/ui/Header'
import Button from '../components/ui/Button'
import SpecialityMenu from '../components/SpecialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

const Home = () => {
  const { token } = useContext(AppContext);
  
  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logout clicked');
  };

  return (
    <div className="min-h-screen bg-background">
      <ModernHeader
        userRole="patient"
        isAuthenticated={!!token}
        userName="User" 
        onLogout={handleLogout}
      />
      
      {/* Main content with top padding for fixed header */}
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative bg-primary rounded-lg mx-4 sm:mx-6 lg:mx-8 mt-4 overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-10 lg:px-20 py-10 md:py-16">
            {/* Left Side - Content */}
            <div className="md:w-1/2 flex flex-col items-start justify-center gap-6 z-10">
              <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-primary-foreground font-semibold leading-tight">
                Experience Authentic <br /> 
                <span className="text-accent">PanchKarma</span> <br />
                Detoxification & Healing
              </h1>
              
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 text-primary-foreground">
                <img className="w-28 rounded-lg shadow-breathing" src={assets.group_profiles} alt="Practitioners" />
                <p className="font-body text-sm md:text-base opacity-90 leading-relaxed">
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

        {/* Existing components with modern styling */}
        <div className="px-4 sm:px-6 lg:px-8">
          <SpecialityMenu />
          <TopDoctors />
          <Banner />
        </div>
      </main>
    </div>
  )
}

export default Home
