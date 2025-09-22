import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import ModernHeader from '../components/ui/Header';
import Button from '../components/ui/Button';
import Icon from '../components/AppIcon';
import { toast } from "react-toastify";
import axios from "axios";
import { initializeTherapyNotifications } from '../services/therapyNotificationService';

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData, userData, setUserData, setToken } =
    useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserData(false);
    setToken('');
    navigate('/');
  };

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const getAvailableSlots = async () => {
    setDocSlots([]);

    // getting current date
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      // getting date with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // setting end time of the date with index
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      // setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = day + "_" + month + "_" + year;
        const slotTime = formattedTime;

        const isSlotAvailable =
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(slotTime)
            ? false
            : true;

        if (isSlotAvailable) {
          // add slot to array
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        // Increment current time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }

    try {
      const date = docSlots[slotIndex][0].datetime;

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = day + "_" + month + "_" + year;

      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { docId, slotDate, slotTime },
        { headers: { token } }
      );
      
      if (data.success) {
        toast.success(data.message);
        
        // Send booking notifications to both patient and doctor
        try {
          // Initialize notification service with explicit API keys
          const patientApiKey = '8501ef93-4fb1-427e-b8f8-4c34686a53a6';
          const doctorApiKey = '77c9f68f-35c2-4a19-ae00-9e87cc827679';
          const notificationService = initializeTherapyNotifications(patientApiKey, doctorApiKey);
          
          console.log('🔧 DEBUG: Initialized notification service with patient key:', patientApiKey);
          
          // Get user data for notifications
          const userResponse = await axios.get(backendUrl + "/api/user/get-profile", {
            headers: { token }
          });
          
          const appointmentData = {
            userData: userResponse.data.user,
            docData: docInfo,
            slotDate,
            slotTime,
            amount: docInfo.fees
          };
          
          console.log('📋 DEBUG: Appointment data for notifications:', {
            patientEmail: appointmentData.userData?.email,
            patientName: appointmentData.userData?.name,
            doctorName: appointmentData.docData?.name,
            slotDate,
            slotTime
          });
          
          // Send notifications (non-blocking)
          notificationService.sendBookingNotifications(appointmentData)
            .then((result) => {
              console.log('Booking notifications sent:', result);
              if (result.patientNotification && result.doctorNotification) {
                toast.success('📧 Booking confirmations sent to both you and the specialist!');
              } else if (result.patientNotification) {
                toast.success('📧 Booking confirmation sent to your email!');
              } else {
                console.warn('Some notifications failed to send:', result.errors);
              }
            })
            .catch((error) => {
              console.error('Error sending booking notifications:', error);
              // Don't show error to user as booking was successful
            });
            
        } catch (notificationError) {
          console.error('Notification service error:', notificationError);
          // Don't block the booking flow for notification errors
        }
        
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    getAvailableSlots();
  }, [docInfo]);

  useEffect(() => {
    console.log(docSlots);
  }, [docSlots]);

  return (
    <div className="min-h-screen bg-background">
      <ModernHeader
        userRole="patient"
        isAuthenticated={!!token}
        userName={userData?.name || "User"} 
        onLogout={handleLogout}
      />
      
      <main className="pt-16">
        {docInfo && (
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 pb-20 sm:pb-8">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-xs sm:text-sm text-text-secondary mb-4 sm:mb-6 lg:mb-8">
              <button
                onClick={() => navigate('/doctors')}
                className="hover:text-foreground transition-breathing p-2 -ml-2 rounded touch-manipulation"
              >
                👩‍⚕️ Specialists
              </button>
              <Icon name="ChevronRight" size={14} />
              <span className="text-foreground font-medium">{docInfo.name}</span>
            </div>

            {/* Doctor Profile Section */}
            <div className="bg-card rounded-xl sm:rounded-2xl shadow-breathing overflow-hidden mb-6 sm:mb-8">
              <div className="flex flex-col lg:flex-row">
                {/* Doctor Image */}
                <div className="lg:w-1/3 p-4 sm:p-6">
                  <div className="relative">
                    <img
                      className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg sm:rounded-xl shadow-elevated"
                      src={docInfo.image}
                      alt={docInfo.name}
                    />
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                      <div className={`flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                        docInfo.available 
                          ? 'bg-success text-success-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          docInfo.available ? 'bg-success-foreground' : 'bg-muted-foreground'
                        }`}></div>
                        {docInfo.available ? 'Available' : 'Unavailable'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="lg:w-2/3 p-4 sm:p-6 lg:p-8">
                  <div className="flex items-start justify-between mb-4 sm:mb-6">
                    <div className="w-full">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                        <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                          {docInfo.name}
                        </h1>
                        <Icon name="CheckSquare" size={20} className="text-success sm:mt-1" />
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <span className="font-body text-sm sm:text-base text-text-secondary">
                          {docInfo.degree} - {docInfo.speciality}
                        </span>
                        <div className="px-2 sm:px-3 py-1 bg-accent/10 text-accent text-xs sm:text-sm font-medium rounded-full">
                          {docInfo.experience} Experience
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* About Section */}
                  <div className="mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 mb-2 sm:mb-3">
                      <Icon name="User" size={18} className="text-text-secondary" />
                      <h3 className="font-heading text-base sm:text-lg font-semibold text-foreground">
                        About Dr. {docInfo.name.split(' ').pop()}
                      </h3>
                    </div>
                    <p className="font-body text-sm sm:text-base text-text-secondary leading-relaxed">
                      {docInfo.about}
                    </p>
                  </div>

                  {/* Consultation Fee */}
                  <div className="flex items-center justify-between p-3 sm:p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <span className="font-body text-sm sm:text-base text-text-secondary">Consultation Fee</span>
                    <span className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                      Rs.{docInfo.fees}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Slots Section */}
            <div className="bg-card rounded-xl sm:rounded-2xl shadow-breathing p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <Icon name="Calendar" size={20} className="text-primary" />
                <h2 className="font-heading text-lg sm:text-xl lg:text-2xl font-bold text-foreground">
                  Available Slots
                </h2>
              </div>

              {/* Date Selection */}
              <div className="mb-6">
                <h3 className="font-body text-sm font-medium text-text-secondary mb-3 sm:mb-4">
                  📅 Select Date
                </h3>
                <div 
                  className="flex gap-2 sm:gap-3 overflow-x-auto pb-3 scrollbar-hide" 
                  style={{
                    scrollbarWidth: 'none', 
                    msOverflowStyle: 'none',
                    WebkitOverflowScrolling: 'touch'
                  }}
                >
                  {docSlots.length > 0 &&
                    docSlots.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => setSlotIndex(index)}
                        className={`flex-shrink-0 text-center px-3 sm:px-4 py-3 sm:py-4 min-w-16 sm:min-w-20 rounded-lg border-2 transition-all duration-200 touch-manipulation ${
                          slotIndex === index
                            ? "border-primary bg-primary text-primary-foreground shadow-lg transform scale-105"
                            : "border-border bg-card text-text-secondary hover:border-primary/50 hover:bg-primary/5 active:scale-95"
                        }`}
                      >
                        <p className="text-xs font-medium mb-1">
                          {item[0] && daysOfWeek[item[0].datetime.getDay()]}
                        </p>
                        <p className="text-base sm:text-lg font-bold">
                          {item[0] && item[0].datetime.getDate()}
                        </p>
                      </button>
                    ))}
                </div>
              </div>

              {/* Time Selection */}
              <div className="mb-6 sm:mb-8">
                <h3 className="font-body text-sm font-medium text-text-secondary mb-3 sm:mb-4">
                  ⏰ Select Time
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                  {docSlots.length > 0 &&
                    docSlots[slotIndex]?.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => setSlotTime(item.time)}
                        className={`px-3 sm:px-4 py-3 sm:py-4 rounded-lg border-2 text-xs sm:text-sm font-medium transition-all duration-200 touch-manipulation min-h-12 ${
                          item.time === slotTime
                            ? "border-primary bg-primary text-primary-foreground shadow-lg transform scale-105"
                            : "border-border bg-card text-text-secondary hover:border-primary/50 hover:bg-primary/5 active:scale-95"
                        }`}
                      >
                        {item.time}
                      </button>
                    ))}
                </div>
              </div>

              {/* Book Button */}
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                {!slotTime && (
                  <div className="text-center sm:text-right">
                    <p className="text-sm text-text-secondary mb-2">
                      📅 Please select a date and time to book
                    </p>
                  </div>
                )}
                <Button
                  onClick={bookAppointment}
                  disabled={!slotTime}
                  size="lg"
                  className={`px-6 sm:px-8 w-full sm:w-auto min-h-12 ${!slotTime ? 'opacity-50' : ''}`}
                  iconName="Calendar"
                  iconPosition="left"
                >
                  💳 Book Consultation
                </Button>
              </div>
              
              {/* Mobile Floating Action Button */}
              {slotTime && (
                <div className="fixed bottom-4 left-4 right-4 z-40 sm:hidden">
                  <Button
                    onClick={bookAppointment}
                    size="lg"
                    className="w-full shadow-2xl bg-primary hover:bg-primary/90 text-primary-foreground min-h-14 text-base font-semibold"
                    iconName="Calendar"
                    iconPosition="left"
                  >
                    💳 Book for Rs.{docInfo.fees} - {slotTime}
                  </Button>
                </div>
              )}
            </div>

            {/* Related Doctors Section */}
            <div className="bg-card rounded-xl sm:rounded-2xl shadow-breathing p-4 sm:p-6 lg:p-8">
              <h2 className="font-heading text-lg sm:text-xl lg:text-2xl font-bold text-foreground mb-4 sm:mb-6">
                👩‍⚕️ Related Specialists
              </h2>
              <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Appointment;
