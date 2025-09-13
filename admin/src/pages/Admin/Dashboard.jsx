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
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">🏥 PanchKarma Wellness Dashboard</h1>
          <p className="text-text-secondary font-body">Overview of your wellness center operations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-breathing hover-lift group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center shadow-breathing group-hover:scale-110 transition-transform">
                <span className="text-2xl">👨‍⚕️</span>
              </div>
              <div>
                <p className="text-3xl font-heading font-bold text-foreground">
                  {dashData.doctors}
                </p>
                <p className="text-text-secondary font-body">PanchKarma Specialists</p>
              </div>
            </div>
          </div>

          <div className="card-breathing hover-lift group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-secondary to-accent rounded-xl flex items-center justify-center shadow-breathing group-hover:scale-110 transition-transform">
                <span className="text-2xl">🌿</span>
              </div>
              <div>
                <p className="text-3xl font-heading font-bold text-foreground">
                  {dashData.appointments}
                </p>
                <p className="text-text-secondary font-body">Therapy Sessions</p>
              </div>
            </div>
          </div>

          <div className="card-breathing hover-lift group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-r from-accent to-primary rounded-xl flex items-center justify-center shadow-breathing group-hover:scale-110 transition-transform">
                <span className="text-2xl">🧘‍♀️</span>
              </div>
              <div>
                <p className="text-3xl font-heading font-bold text-foreground">
                  {dashData.patients}
                </p>
                <p className="text-text-secondary font-body">Wellness Seekers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Appointments */}
        <div className="card-breathing">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-primary text-lg">📅</span>
            </div>
            <div>
              <h2 className="text-xl font-heading font-semibold text-foreground">Latest PanchKarma Bookings</h2>
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
    )
  );
};

export default Dashboard;
