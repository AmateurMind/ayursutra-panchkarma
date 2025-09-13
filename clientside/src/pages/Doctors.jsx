import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import ModernHeader from '../components/ui/Header';
import Button from '../components/ui/Button';

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const navigate = useNavigate();

  const { doctors, token } = useContext(AppContext);
  
  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logout clicked');
  };

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
    <div className="min-h-screen bg-background">
      <ModernHeader
        userRole="patient"
        isAuthenticated={!!token}
        userName="User" 
        onLogout={handleLogout}
      />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-semibold text-foreground mb-2">
              Find Your PanchKarma Specialist
            </h1>
            <p className="font-body text-text-secondary">
              Browse through our certified PanchKarma specialists and book your detoxification therapy.
            </p>
          </div>
          <div className="flex flex-col lg:flex-row items-start gap-8">
            <Button
              variant={showFilter ? "default" : "outline"}
              size="sm"
              className="lg:hidden mb-4"
              onClick={() => setShowFilter((prev) => !prev)}
            >
              {showFilter ? "Hide Filters" : "Show Filters"}
            </Button>
            <div
              className={`lg:w-64 flex-col gap-3 ${
                showFilter ? "flex" : "hidden lg:flex"
              }`}
            >
              <div className="bg-card rounded-lg p-4 shadow-breathing">
                <h3 className="font-heading font-medium text-foreground mb-4">
                  Filter by PanchKarma Therapy
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() =>
                      speciality === "Vamana Therapy"
                        ? navigate("/doctors")
                        : navigate("/doctors/Vamana Therapy")
                    }
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-body transition-breathing focus-ring ${
                      speciality === "Vamana Therapy"
                        ? "bg-primary text-primary-foreground"
                        : "text-text-secondary hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    Vamana Therapy (Emesis)
                  </button>
                  <button
                    onClick={() =>
                      speciality === "Virechana Therapy"
                        ? navigate("/doctors")
                        : navigate("/doctors/Virechana Therapy")
                    }
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-body transition-breathing focus-ring ${
                      speciality === "Virechana Therapy" 
                        ? "bg-primary text-primary-foreground" 
                        : "text-text-secondary hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    Virechana Therapy (Purgation)
                  </button>
                  <button
                    onClick={() =>
                      speciality === "Basti Therapy"
                        ? navigate("/doctors")
                        : navigate("/doctors/Basti Therapy")
                    }
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-body transition-breathing focus-ring ${
                      speciality === "Basti Therapy" 
                        ? "bg-primary text-primary-foreground" 
                        : "text-text-secondary hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    Basti Therapy (Enema)
                  </button>
                  <button
                    onClick={() =>
                      speciality === "Nasya Therapy"
                        ? navigate("/doctors")
                        : navigate("/doctors/Nasya Therapy")
                    }
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-body transition-breathing focus-ring ${
                      speciality === "Nasya Therapy" 
                        ? "bg-primary text-primary-foreground" 
                        : "text-text-secondary hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    Nasya Therapy (Nasal)
                  </button>
                  <button
                    onClick={() =>
                      speciality === "Raktamokshana Therapy"
                        ? navigate("/doctors")
                        : navigate("/doctors/Raktamokshana Therapy")
                    }
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-body transition-breathing focus-ring ${
                      speciality === "Raktamokshana Therapy" 
                        ? "bg-primary text-primary-foreground" 
                        : "text-text-secondary hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    Raktamokshana (Bloodletting)
                  </button>
                  <button
                    onClick={() =>
                      speciality === "Complete PanchKarma"
                        ? navigate("/doctors")
                        : navigate("/doctors/Complete PanchKarma")
                    }
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-body transition-breathing focus-ring ${
                      speciality === "Complete PanchKarma"
                        ? "bg-primary text-primary-foreground"
                        : "text-text-secondary hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    Complete PanchKarma Program
                  </button>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterDoc.map((item, index) => (
                  <div
                    onClick={() => navigate(`/appointment/${item._id}`)}
                    className="bg-card rounded-xl overflow-hidden cursor-pointer hover-lift shadow-breathing hover:shadow-elevated transition-all duration-300"
                    key={index}
                  >
                    <div className="aspect-w-4 aspect-h-3 bg-muted">
                      <img 
                        className="w-full h-48 object-cover" 
                        src={item.image} 
                        alt={item.name}
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            item.available ? "bg-success" : "bg-muted-foreground"
                          }`}
                        ></div>
                        <span
                          className={`text-sm font-body ${
                            item.available ? "text-success" : "text-muted-foreground"
                          }`}
                        >
                          {item.available ? "Available" : "Not Available"}
                        </span>
                      </div>
                      <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
                        {item.name}
                      </h3>
                      <p className="font-body text-sm text-text-secondary mb-4">
                        {item.speciality}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/appointment/${item._id}`);
                        }}
                      >
                        Book Consultation
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Doctors;
