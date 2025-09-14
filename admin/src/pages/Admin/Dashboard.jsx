import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } =
    useContext(AdminContext);

  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  return (
    dashData && (
      <div className="min-h-screen bg-background">
        {/* Main content */}
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <section className="relative bg-primary rounded-lg mb-8 overflow-hidden">
            <div className="px-6 md:px-10 lg:px-20 py-10 md:py-16">
              <div className="relative z-10">
                <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl text-primary-foreground font-semibold leading-tight mb-4">
                  🏥 Welcome to <br /> 
                  <span className="text-accent">Admin Dashboard</span> <br />
                </h1>
<p className="text-white font-body text-lg leading-relaxed">
  Manage your wellness center operations and track performance metrics.
</p>

              </div>
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-accent/10 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gradient-to-tr from-secondary/10 to-transparent"></div>
            </div>
          </section>

          {/* Stats Cards */}
{/* Stats Cards */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  {/* Doctors Card */}
  <div className="bg-card rounded-lg p-6 shadow-breathing hover:shadow-elevated transition-all duration-300 group cursor-pointer border border-border hover:border-earth/20">
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 bg-gradient-to-r from-earth to-sage rounded-xl flex items-center justify-center shadow-breathing group-hover:scale-110 transition-transform">
        <span className="text-2xl text-white">👨‍⚕️</span>
      </div>
      <div>
        <p className="text-3xl font-heading font-bold text-foreground group-hover:text-earth transition-colors">
          {dashData.doctors}
        </p>
        <p className="text-text-secondary font-body">Ayursutra Specialists</p>
      </div>
    </div>
  </div>

  {/* Therapy Sessions Card */}
  <div className="bg-card rounded-lg p-6 shadow-breathing hover:shadow-elevated transition-all duration-300 group cursor-pointer border border-border hover:border-earth/20">
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 bg-gradient-to-r from-earth to-sage rounded-xl flex items-center justify-center shadow-breathing group-hover:scale-110 transition-transform">
        <span className="text-2xl text-white">🌿</span>
      </div>
      <div>
        <p className="text-3xl font-heading font-bold text-foreground group-hover:text-earth transition-colors">
          {dashData.appointments}
        </p>
        <p className="text-text-secondary font-body">Therapy Sessions</p>
      </div>
    </div>
  </div>

  {/* Patients Card */}
  <div className="bg-card rounded-lg p-6 shadow-breathing hover:shadow-elevated transition-all duration-300 group cursor-pointer border border-border hover:border-earth/20">
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 bg-gradient-to-r from-earth to-sage rounded-xl flex items-center justify-center shadow-breathing group-hover:scale-110 transition-transform">
        <span className="text-2xl text-white">🧘‍♀️</span>
      </div>
      <div>
        <p className="text-3xl font-heading font-bold text-foreground group-hover:text-earth transition-colors">
          {dashData.patients}
        </p>
        <p className="text-text-secondary font-body">Wellness Seekers</p>
      </div>
    </div>
  </div>
</div>



          {/* Latest Appointments */}
          <div className="bg-card rounded-lg p-6 md:p-8 shadow-breathing">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-primary text-lg">📅</span>
              </div>
              <div>
                <h2 className="text-xl font-heading font-semibold text-foreground">Latest Therapy Bookings</h2>
                <p className="text-sm text-text-secondary font-body">Recent therapy session appointments</p>
              </div>
            </div>

          <div className="space-y-4">
            {dashData.latestAppointments.length > 0 ? (
              dashData.latestAppointments.map((item, index) => (
                <div
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-primary/20"
                  key={index}
                >
                  <img
                    className="w-12 h-12 rounded-full object-cover shadow-breathing"
                    src={item.docData.image}
                    alt={item.docData.name}
                  />
                  <div className="flex-1">
                    <p className="font-heading font-semibold text-foreground mb-1">
                      Dr. {item.docData.name}
                    </p>
                    <p className="text-sm text-text-secondary font-body">
                      🗓 {slotDateFormat(item.slotDate)} • {item.slotTime}
                    </p>
                    <p className="text-sm text-primary font-body">
                      {item.docData.speciality}
                    </p>
                  </div>
                  <div className="text-right">
                    {item.cancelled ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-error/10 text-error border border-error/20">
                        ❌ Cancelled
                      </span>
                    ) : item.isCompleted ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
                        ✅ Completed
                      </span>
                    ) : (
                      <div className="space-y-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-warning/10 text-warning border border-warning/20">
                          ⏳ Upcoming
                        </span>
                        <button
                          onClick={() => cancelAppointment(item._id)}
                          className="block w-full text-xs text-error hover:bg-error/5 px-2 py-1 rounded transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-2">No Recent Bookings</h3>
                <p className="text-text-secondary font-body">New therapy appointments will appear here</p>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
