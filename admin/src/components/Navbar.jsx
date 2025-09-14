import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AdminContext } from "../context/AdminContext";
import { DoctorContext } from "../context/DoctorContext";
import Button from "./ui/Button";

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate("/");
    aToken && setAToken("");
    aToken && localStorage.removeItem("aToken");
    dToken && setDToken("");
    dToken && localStorage.removeItem("dToken");
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const getAdminNavItems = () => [
    {
      label: 'Dashboard',
      path: '/admin-dashboard',
      icon: '📈',
      isActive: location?.pathname === '/admin-dashboard'
    },
    {
      label: 'Appointments',
      path: '/all-appointments',
      icon: '📅',
      isActive: location?.pathname === '/all-appointments'
    },
    {
      label: 'Add Specialist',
      path: '/add-doctor',
      icon: '➕',
      isActive: location?.pathname === '/add-doctor'
    },
    {
      label: 'Specialists',
      path: '/doctor-list',
      icon: '👨‍⚕️',
      isActive: location?.pathname === '/doctor-list'
    }
  ];

  const getDoctorNavItems = () => [
    {
      label: 'Dashboard',
      path: '/doctor-dashboard',
      icon: '📈',
      isActive: location?.pathname === '/doctor-dashboard'
    },
    {
      label: 'Appointments',
      path: '/doctor-appointments',
      icon: '📅',
      isActive: location?.pathname === '/doctor-appointments'
    },
    {
      label: 'Profile',
      path: '/doctor-profile',
      icon: '👨‍⚕️',
      isActive: location?.pathname === '/doctor-profile'
    }
  ];

  const navigationItems = aToken ? getAdminNavItems() : getDoctorNavItems();
  const userName = aToken ? "Administrator" : "Specialist";

  const NavItem = ({ item, isMobile = false }) => (
    <button
      onClick={() => handleNavigation(item?.path)}
      className={`
        relative flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-breathing
        touch-target focus-ring hover-lift
        ${item?.isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-text-secondary hover:text-foreground hover:bg-muted'
        }
        ${isMobile ? 'w-full justify-start' : ''}
      `}
    >
      <span className="text-lg">{item?.icon}</span>
      <span className="font-body">{item?.label}</span>
    </button>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center space-x-4">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handleNavigation(aToken ? '/admin-dashboard' : '/doctor-dashboard')}>
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-2xl">🌿</span>
              </div>
              <div className="font-heading font-semibold text-xl text-foreground">
                Ayursutra
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems?.map((item) => (
              <NavItem key={item?.path} item={item} />
            ))}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-secondary-foreground text-sm">👤</span>
              </div>
              <span className="font-body text-foreground">{userName}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              iconName="🚪"
              className="text-text-secondary hover:text-foreground"
            >
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <span className="text-secondary-foreground text-sm">👤</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              iconName={isMobileMenuOpen ? "❌" : "☰"}
              className="touch-target"
            />
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems?.map((item) => (
                <NavItem key={item?.path} item={item} isMobile />
              ))}
              <div className="pt-4 border-t border-border mt-4">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="font-body text-sm text-foreground">
                    {userName}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    iconName="🚪"
                    className="text-text-secondary"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
