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
          // Initialize notification service (uses default config)
          const notificationService = initializeTherapyNotifications();
          
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-text-secondary mb-8">
              <button
                onClick={() => navigate('/doctors')}
                className="hover:text-foreground transition-breathing"
              >
                Doctors
              </button>
              <Icon name="ChevronRight" size={16} />
              <span className="text-foreground">{docInfo.name}</span>
            </div>

            {/* Doctor Profile Section */}
            <div className="bg-card rounded-2xl shadow-breathing overflow-hidden mb-8">
              <div className="flex flex-col lg:flex-row">
                {/* Doctor Image */}
                <div className="lg:w-1/3 p-6">
                  <div className="relative">
                    <img
                      className="w-full h-80 lg:h-96 object-cover rounded-xl shadow-elevated"
                      src={docInfo.image}
                      alt={docInfo.name}
                    />
                    <div className="absolute top-4 right-4">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
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
                <div className="lg:w-2/3 p-6 lg:p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="font-heading text-3xl font-bold text-foreground">
                          {docInfo.name}
                        </h1>
                        <Icon name="CheckSquare" size={24} className="text-success" />
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="font-body text-text-secondary">
                          {docInfo.degree} - {docInfo.speciality}
                        </span>
                        <div className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
                          {docInfo.experience} Experience
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* About Section */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon name="User" size={20} className="text-text-secondary" />
                      <h3 className="font-heading text-lg font-semibold text-foreground">
                        About Dr. {docInfo.name.split(' ').pop()}
                      </h3>
                    </div>
                    <p className="font-body text-text-secondary leading-relaxed">
                      {docInfo.about}
                    </p>
                  </div>

                  {/* Consultation Fee */}
                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <span className="font-body text-text-secondary">Consultation Fee</span>
                    <span className="font-heading text-2xl font-bold text-foreground">
                      Rs.{docInfo.fees}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Slots Section */}
            <div className="bg-card rounded-2xl shadow-breathing p-6 lg:p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Icon name="Calendar" size={24} className="text-primary" />
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  Available Slots
                </h2>
              </div>

              {/* Date Selection */}
              <div className="mb-6">
                <h3 className="font-body text-sm font-medium text-text-secondary mb-4">
                  Select Date
                </h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {docSlots.length > 0 &&
                    docSlots.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => setSlotIndex(index)}
                        className={`flex-shrink-0 text-center px-4 py-3 min-w-20 rounded-lg border-2 transition-breathing focus-ring ${
                          slotIndex === index
                            ? "border-primary bg-primary text-primary-foreground shadow-breathing"
                            : "border-border bg-card text-text-secondary hover:border-primary/50"
                        }`}
                      >
                        <p className="text-xs font-medium mb-1">
                          {item[0] && daysOfWeek[item[0].datetime.getDay()]}
                        </p>
                        <p className="text-lg font-bold">
                          {item[0] && item[0].datetime.getDate()}
                        </p>
                      </button>
                    ))}
                </div>
              </div>

              {/* Time Selection */}
              <div className="mb-8">
                <h3 className="font-body text-sm font-medium text-text-secondary mb-4">
                  Select Time
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {docSlots.length > 0 &&
                    docSlots[slotIndex]?.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => setSlotTime(item.time)}
                        className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-breathing focus-ring ${
                          item.time === slotTime
                            ? "border-primary bg-primary text-primary-foreground shadow-breathing"
                            : "border-border bg-card text-text-secondary hover:border-primary/50 hover:bg-primary/5"
                        }`}
                      >
                        {item.time}
                      </button>
                    ))}
                </div>
              </div>

              {/* Book Button */}
              <div className="flex justify-end">
                <Button
                  onClick={bookAppointment}
                  disabled={!slotTime}
                  size="lg"
                  className="px-8"
                  iconName="Calendar"
                  iconPosition="left"
                >
                  Book Consultation
                </Button>
              </div>
            </div>

            {/* Related Doctors Section */}
            <div className="bg-card rounded-2xl shadow-breathing p-6 lg:p-8">
              <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
                Related Doctors
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
