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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              My PanchKarma Therapies
            </h1>
            <p className="text-text-secondary">
              Track and manage your PanchKarma therapy appointments and wellness sessions.
            </p>
          </div>
          {appointments.length > 0 ? (
            <div className="space-y-6">
              {appointments.map((item, index) => (
                <div
                  className="bg-card rounded-lg p-6 shadow-breathing hover:shadow-elevated transition-all duration-300 border border-border"
                  key={index}
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Specialist Image */}
                    <div className="flex-shrink-0">
                      <img
                        className="w-32 h-32 object-cover rounded-lg bg-primary/5"
                        src={item.docData.image}
                        alt={item.docData.name}
                      />
                    </div>
                    
                    {/* Appointment Details */}
                    <div className="flex-1">
                      <div className="mb-4">
                        <h3 className="text-xl font-heading font-semibold text-foreground mb-1">
                          {item.docData.name}
                        </h3>
                        <p className="text-primary font-medium">{item.docData.speciality}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-semibold text-foreground text-sm mb-2">📍 Therapy Location:</h4>
                          <p className="text-sm text-text-secondary">
                            {item.docData.address.line1}
                          </p>
                          <p className="text-sm text-text-secondary">
                            {item.docData.address.line2}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-foreground text-sm mb-2">🕐 Schedule:</h4>
                          <p className="text-sm text-text-secondary">
                            <span className="font-medium">Date:</span> {slotDateFormat(item.slotDate)}
                          </p>
                          <p className="text-sm text-text-secondary">
                            <span className="font-medium">Time:</span> {item.slotTime}
                          </p>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className="mb-4">
                        {item.cancelled && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-error/10 text-error">
                            ❌ Therapy Cancelled
                          </span>
                        )}
                        {item.isCompleted && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success/10 text-success">
                            ✅ Therapy Completed
                          </span>
                        )}
                        {!item.cancelled && !item.isCompleted && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-warning/10 text-warning">
                            ⏳ Upcoming Therapy
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 lg:min-w-[200px]">
                      {!item.cancelled && !item.isCompleted && (
                        <>
                          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors font-medium text-sm">
                            💳 Pay Online
                          </button>
                          <button
                            onClick={() => cancelAppointment(item._id)}
                            className="bg-error/10 text-error px-4 py-2 rounded-md hover:bg-error hover:text-white transition-colors font-medium text-sm border border-error/20"
                          >
                            ❌ Cancel Therapy
                          </button>
                          <button
                            onClick={() => navigate('/therapy-preparation')}
                            className="bg-secondary/10 text-secondary px-4 py-2 rounded-md hover:bg-secondary hover:text-white transition-colors font-medium text-sm border border-secondary/20"
                          >
                            📋 Prepare for Therapy
                          </button>
                        </>
                      )}
                      {item.cancelled && (
                        <button 
                          className="bg-muted text-text-secondary px-4 py-2 rounded-md cursor-not-allowed font-medium text-sm" 
                          disabled
                        >
                          Therapy Cancelled
                        </button>
                      )}
                      {item.isCompleted && (
                        <>
                          <button className="bg-success/10 text-success px-4 py-2 rounded-md font-medium text-sm border border-success/20 cursor-default">
                            ✅ Completed
                          </button>
                          <button
                            onClick={() => navigate(`/appointment/${item.docData._id}`)}
                            className="bg-primary/10 text-primary px-4 py-2 rounded-md hover:bg-primary hover:text-white transition-colors font-medium text-sm border border-primary/20"
                          >
                            🔄 Book Again
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-muted rounded-full w-24 h-24 mx-auto flex items-center justify-center mb-6">
                <span className="text-4xl">📅</span>
              </div>
              <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                No PanchKarma Therapies Booked
              </h3>
              <p className="text-text-secondary mb-6 max-w-md mx-auto">
                You haven't booked any PanchKarma therapy sessions yet. Start your wellness journey by exploring our certified specialists.
              </p>
              <button
                onClick={() => navigate('/doctors')}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 transition-colors font-medium"
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
