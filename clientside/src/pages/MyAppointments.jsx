import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../components/ui/Header";
import { initializeTherapyNotifications } from '../services/therapyNotificationService';

const MyAppointments = () => {
  const navigate = useNavigate();
  const { backendUrl, token, getDoctorsData, setToken, userData, setUserData } = useContext(AppContext);

  const [appointments, setAppointments] = useState([]);
  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      // Find the appointment being cancelled for notification purposes
      const appointmentToCancel = appointments.find(apt => apt._id === appointmentId);
      
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } }
      );
      
      if (data.success) {
        toast.success(data.message);
        
        // Send cancellation notification
        if (appointmentToCancel) {
          try {
            const notificationService = initializeTherapyNotifications();
            
            const appointmentData = {
              userData: appointmentToCancel.userData,
              docData: appointmentToCancel.docData,
              slotDate: appointmentToCancel.slotDate,
              slotTime: appointmentToCancel.slotTime
            };
            
            // Send cancellation notification (non-blocking)
            notificationService.sendCancellationNotification(appointmentData)
              .then(() => {
                console.log('Cancellation notification sent successfully');
                toast.success('📧 Cancellation confirmation sent to your email!');
              })
              .catch((error) => {
                console.error('Error sending cancellation notification:', error);
              });
              
          } catch (notificationError) {
            console.error('Notification service error:', notificationError);
          }
        }
        
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserData(false);
    setToken('');
    navigate('/');
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole="patient"
        isAuthenticated={!!token}
        userName={userData?.name || "User"}
        onLogout={handleLogout}
      />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-2">
              My PanchKarma Therapies
            </h1>
            <p className="text-text-secondary text-sm sm:text-base">
              Track and manage your PanchKarma therapy appointments and wellness sessions.
            </p>
          </div>
          {appointments.length > 0 ? (
            <div className="space-y-4 sm:space-y-6">
              {appointments.map((item, index) => (
                <div
                  className="bg-card rounded-lg p-4 sm:p-6 shadow-breathing hover:shadow-elevated transition-all duration-300 border border-border"
                  key={index}
                >
                  <div className="flex flex-col gap-4 sm:gap-6">
                    {/* Specialist Info Header - Mobile First */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-shrink-0 mx-auto sm:mx-0">
                        <img
                          className="w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 object-cover rounded-lg bg-primary/5"
                          src={item.docData.image}
                          alt={item.docData.name}
                        />
                      </div>
                      
                      <div className="flex-1 text-center sm:text-left">
                        <div className="mb-3">
                          <h3 className="text-lg sm:text-xl font-heading font-semibold text-foreground mb-1">
                            {item.docData.name}
                          </h3>
                          <p className="text-primary font-medium text-sm sm:text-base">{item.docData.speciality}</p>
                        </div>
                        
                        {/* Status Badge */}
                        <div className="mb-3">
                          {item.cancelled && (
                            <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-error/10 text-error">
                              ❌ Therapy Cancelled
                            </span>
                          )}
                          {item.isCompleted && (
                            <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-success/10 text-success">
                              ✅ Therapy Completed
                            </span>
                          )}
                          {!item.cancelled && !item.isCompleted && (
                            <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-warning/10 text-warning">
                              ⏳ Upcoming Therapy
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Appointment Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-background p-3 sm:p-4 rounded-lg">
                        <h4 className="font-semibold text-foreground text-sm mb-2 flex items-center gap-2">
                          📍 <span>Therapy Location</span>
                        </h4>
                        <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                          {item.docData.address.line1}
                          <br />
                          {item.docData.address.line2}
                        </p>
                      </div>
                      
                      <div className="bg-background p-3 sm:p-4 rounded-lg">
                        <h4 className="font-semibold text-foreground text-sm mb-2 flex items-center gap-2">
                          🕐 <span>Schedule</span>
                        </h4>
                        <p className="text-xs sm:text-sm text-text-secondary">
                          <span className="font-medium">Date:</span> {slotDateFormat(item.slotDate)}
                        </p>
                        <p className="text-xs sm:text-sm text-text-secondary">
                          <span className="font-medium">Time:</span> {item.slotTime}
                        </p>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="border-t border-border pt-4">
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        {!item.cancelled && !item.isCompleted && (
                          <>
                            <button className="bg-primary text-primary-foreground px-4 py-2 sm:py-3 rounded-md hover:bg-primary/90 transition-colors font-medium text-sm touch-target flex-1 sm:flex-none">
                              💳 Pay Online
                            </button>
                            <button
                              onClick={() => navigate('/therapy-preparation')}
                              className="bg-secondary/10 text-secondary px-4 py-2 sm:py-3 rounded-md hover:bg-secondary hover:text-white transition-colors font-medium text-sm border border-secondary/20 touch-target flex-1 sm:flex-none"
                            >
                              📋 Prepare
                            </button>
                            <button
                              onClick={() => cancelAppointment(item._id)}
                              className="bg-error/10 text-error px-4 py-2 sm:py-3 rounded-md hover:bg-error hover:text-white transition-colors font-medium text-sm border border-error/20 touch-target flex-1 sm:flex-none"
                            >
                              ❌ <span className="hidden sm:inline">Cancel Therapy</span><span className="sm:hidden">Cancel</span>
                            </button>
                          </>
                        )}
                        {item.cancelled && (
                          <button 
                            className="bg-muted text-text-secondary px-4 py-2 sm:py-3 rounded-md cursor-not-allowed font-medium text-sm touch-target w-full" 
                            disabled
                          >
                            Therapy Cancelled
                          </button>
                        )}
                        {item.isCompleted && (
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
                            <button className="bg-success/10 text-success px-4 py-2 sm:py-3 rounded-md font-medium text-sm border border-success/20 cursor-default touch-target flex-1">
                              ✅ Completed
                            </button>
                            <button
                              onClick={() => navigate(`/appointment/${item.docData._id}`)}
                              className="bg-primary/10 text-primary px-4 py-2 sm:py-3 rounded-md hover:bg-primary hover:text-white transition-colors font-medium text-sm border border-primary/20 touch-target flex-1"
                            >
                              🔄 Book Again
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16 px-4">
              <div className="bg-muted rounded-full w-20 h-20 sm:w-24 sm:h-24 mx-auto flex items-center justify-center mb-6">
                <span className="text-3xl sm:text-4xl">📅</span>
              </div>
              <h3 className="text-lg sm:text-xl font-heading font-semibold text-foreground mb-2">
                No PanchKarma Therapies Booked
              </h3>
              <p className="text-text-secondary mb-6 max-w-md mx-auto text-sm sm:text-base">
                You haven't booked any PanchKarma therapy sessions yet. Start your wellness journey by exploring our certified specialists.
              </p>
              <button
                onClick={() => navigate('/doctors')}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors font-medium text-sm sm:text-base touch-target"
              >
                🌿 Explore PanchKarma Specialists
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyAppointments;
