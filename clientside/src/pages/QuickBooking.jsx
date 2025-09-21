import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ModernHeader from '../components/ui/Header';
import Button from '../components/ui/Button';
import { AppContext } from '../context/AppContext';
import { parseBookingRequest, generateFollowUpQuestion } from '../utils/bookingParser';
import { initializeTherapyNotifications } from '../services/therapyNotificationService';
import { toast } from 'react-toastify';

const QuickBooking = () => {
  const [input, setInput] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const { token, userData, setUserData, setToken, backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserData(false);
    setToken('');
    navigate('/');
  };

  const addToConversation = (message, isUser = true, data = null) => {
    const newMessage = {
      id: Date.now(),
      message,
      isUser,
      timestamp: new Date(),
      data
    };
    setConversationHistory(prev => [...prev, newMessage]);
  };

  const handleInputSubmit = async () => {
    if (!input.trim()) return;
    
    // Check if user is logged in before processing booking request
    if (!token) {
      toast.warn('Please login first to book an appointment');
      return navigate('/login?mode=login');
    }
    
    setIsProcessing(true);
    
    // Add user message to conversation
    addToConversation(input, true);
    
    try {
      // Parse the natural language input
      const parsed = parseBookingRequest(input);
      console.log('Parsed booking data:', parsed);
      
      // If we have existing parsed data, merge it with new data (preserve existing info)
      let mergedData = { ...parsed };
      if (parsedData) {
        // Keep existing data if new parsing didn't find it
        if (!parsed.doctorName && parsedData.doctorName) {
          mergedData.doctorName = parsedData.doctorName;
        }
        if (!parsed.specialty && parsedData.specialty) {
          mergedData.specialty = parsedData.specialty;
        }
        if (!parsed.slotDate && parsedData.slotDate) {
          mergedData.slotDate = parsedData.slotDate;
        }
        if (!parsed.slotTime && parsedData.slotTime) {
          mergedData.slotTime = parsedData.slotTime;
        }
        
        // Recalculate missing fields
        mergedData.missingFields = [];
        if (!mergedData.slotDate) mergedData.missingFields.push('slotDate');
        if (!mergedData.slotTime) mergedData.missingFields.push('slotTime');
      }
      
      console.log('Merged booking data:', mergedData);
      
      // Add assistant response
      if (mergedData.missingFields.length > 0) {
        let contextMessage = "Got it! Here's what I have so far:\n\n";
        if (mergedData.specialty) contextMessage += `✅ Therapy: ${mergedData.specialty}\n`;
        if (mergedData.doctorName) contextMessage += `✅ Doctor: ${mergedData.doctorName}\n`;
        if (mergedData.slotDate) contextMessage += `✅ Date: ${formatDisplayDate(mergedData.slotDate)}\n`;
        if (mergedData.slotTime) contextMessage += `✅ Time: ${formatDisplayTime(mergedData.slotTime)}\n`;
        
        const followUpQuestion = generateFollowUpQuestion(mergedData.missingFields);
        const fullMessage = contextMessage + "\n" + followUpQuestion;
        
        addToConversation(fullMessage, false, mergedData);
        setParsedData(mergedData);
      } else {
        // All required fields are present
        const confirmationMessage = `I understand you'd like to book:
        
${mergedData.specialty ? `• Therapy: ${mergedData.specialty}` : ''}
${mergedData.doctorName ? `• Doctor: ${mergedData.doctorName}` : '• Doctor: Any available specialist'}
• Date: ${formatDisplayDate(mergedData.slotDate)}
• Time: ${formatDisplayTime(mergedData.slotTime)}

Would you like me to proceed with this booking?`;
        
        addToConversation(confirmationMessage, false, mergedData);
        setParsedData(mergedData);
        setShowConfirmation(true);
      }
    } catch (error) {
      console.error('Parsing error:', error);
      addToConversation("I'm sorry, I couldn't understand that request. Please try again with something like 'Book Vamana therapy tomorrow at 4 PM' or 'Book with Dr. Sharma on 25 Sep between 2-5'.", false);
    }
    
    setInput('');
    setIsProcessing(false);
  };

  const handleConfirmBooking = async () => {
    if (!token) {
      toast.warn('Please login to book an appointment');
      return navigate('/login?mode=login');
    }
    
    if (!parsedData) return;
    
    // Check if user data is loaded
    if (!userData || !userData.email) {
      toast.warn('Loading user profile... Please try again in a moment.');
      return;
    }

    try {
      setIsProcessing(true);
      
      // Create booking data for API
      const bookingData = {
        specialty: parsedData.specialty,
        doctorName: parsedData.doctorName,
        slotDate: parsedData.slotDate,
        slotTime: parsedData.slotTime
      };

      // Make the API call to your backend
      const response = await fetch(`${backendUrl}/api/user/quick-book-appointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token
        },
        body: JSON.stringify(bookingData)
      });

      const result = await response.json();
      
      if (result.success) {
        const appointmentInfo = result.appointment;
        
        // Send email notifications to both patient and doctor
        try {
          console.log('Starting email notification process...');
          console.log('User data:', userData);
          console.log('Appointment info:', appointmentInfo);
          
          // Check if user has email
          if (!userData || !userData.email) {
            console.error('User data or email missing:', userData);
            toast.warn('Unable to send email confirmation - user email not found');
            return;
          }
          
          // Initialize notification service with explicit API keys
          const notificationService = initializeTherapyNotifications(
            '8501ef93-4fb1-427e-b8f8-4c34686a53a6', // Patient API key
            '77c9f68f-35c2-4a19-ae00-9e87cc827679'  // Doctor API key
          );
          
          console.log('Notification service initialized with API keys');
          console.log('Patient API key:', '8501ef93-4fb1-427e-b8f8-4c34686a53a6');
          console.log('Doctor API key:', '77c9f68f-35c2-4a19-ae00-9e87cc827679');
          
          // Prepare appointment data for email notifications  
          const appointmentData = {
            userData: {
              name: userData.name,
              email: userData.email,
              phone: userData.phone || 'Not provided',
              dob: userData.dob || null,
              gender: userData.gender || 'Not provided'
            },
            docData: {
              name: appointmentInfo.doctorName,
              email: appointmentInfo.doctorEmail || 'doctor@panchkarmawellness.com',
              speciality: appointmentInfo.specialty,
              experience: appointmentInfo.doctorExperience || '10+ Years',
              address: appointmentInfo.doctorAddress || {
                line1: 'PanchKarma Wellness Center',
                line2: 'Pune'
              }
            },
            slotDate: appointmentInfo.slotDate, // Should be in day_month_year format from backend
            slotTime: appointmentInfo.slotTime,
            amount: appointmentInfo.fees
          };
          
          console.log('Final appointment data for email:', appointmentData);
          
          // Send notifications (non-blocking)
          console.log('Calling sendBookingNotifications...');
          
          const notificationPromise = notificationService.sendBookingNotifications(appointmentData);
          console.log('Notification promise created:', notificationPromise);
          
          notificationPromise
            .then((notificationResult) => {
              console.log('✅ Quick booking notifications SUCCESS:', notificationResult);
              if (notificationResult && notificationResult.patientNotification && notificationResult.doctorNotification) {
                toast.success('📧 Booking confirmations sent to both you and the specialist!');
              } else if (notificationResult && notificationResult.patientNotification) {
                toast.success('📧 Booking confirmation sent to your email!');
              } else {
                console.warn('❌ Some notifications failed:', notificationResult);
                toast.info('Booking successful, but some email notifications may have failed');
              }
            })
            .catch((error) => {
              console.error('❌ Error sending quick booking notifications:');
              console.error('Error message:', error.message);
              console.error('Error stack:', error.stack);
              console.error('Full error object:', error);
              toast.warn('Booking successful, but email notifications failed to send');
            });
            
        } catch (notificationError) {
          console.error('Notification service error:', notificationError);
          toast.warn('Booking successful, but unable to send email notifications');
        }
        
        addToConversation(
          `✅ Your appointment has been successfully booked!

📋 Appointment Details:
• Doctor: ${appointmentInfo.doctorName}
• Specialty: ${appointmentInfo.specialty}
• Date: ${formatDisplayDate(appointmentInfo.slotDate)}
• Time: ${appointmentInfo.slotTime}
• Fees: ₹${appointmentInfo.fees}

📧 Confirmation emails are being sent to both you and your specialist.

You can view and manage your appointments in the 'My Appointments' section.`,
          false
        );
      } else {
        addToConversation(`❌ Sorry, I couldn't book your appointment: ${result.message}. Please try different criteria or use the regular booking system.`, false);
        toast.error(result.message);
        return;
      }
      
      toast.success('Appointment booked successfully!');
      setShowConfirmation(false);
      setParsedData(null);
      
      // Optionally redirect to appointments page
      setTimeout(() => {
        navigate('/my-appointments');
      }, 2000);

    } catch (error) {
      console.error('Booking error:', error);
      addToConversation("Sorry, there was an error processing your booking. Please try again or use the regular booking system.", false);
      toast.error('Failed to book appointment');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleInputSubmit();
    }
  };

  const formatDisplayDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatDisplayTime = (timeString) => {
    if (!timeString) return 'Not specified';
    if (timeString === 'anytime') return 'Anytime';
    
    const [start, end] = timeString.split('-');
    if (start && end) {
      const formatHour = (hour) => {
        const h = parseInt(hour);
        if (h === 0) return '12 AM';
        if (h < 12) return `${h} AM`;
        if (h === 12) return '12 PM';
        return `${h - 12} PM`;
      };
      return `${formatHour(start)} - ${formatHour(end)}`;
    }
    return timeString;
  };

  const exampleQueries = [
    "Book Vamana therapy tomorrow between 4 and 8",
    "Schedule Virechana with Dr. Meera next Monday",
    "Book Basti therapy with Rajesh tomorrow morning",
    "Book Nasya therapy on 25 Sep anytime",
    "Schedule Raktamokshana with Dr. Suresh next week",
    "Book Complete PanchKarma with Priya on Friday",
    "Book liver detox tomorrow afternoon",
    "Schedule enema therapy next Monday",
    "Book bloodletting with Sneha anytime",
    "Book nasal therapy tomorrow between 2-5"
  ];

  return (
    <div className="min-h-screen bg-background">
      <ModernHeader
        userRole="patient"
        isAuthenticated={!!token}
        userName={userData?.name || "User"} 
        onLogout={handleLogout}
      />
      
      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Quick Booking Assistant
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simply describe what you need in natural language, and I'll help you book your appointment instantly.
            </p>
          </div>

          {/* Example queries */}
          {conversationHistory.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Try saying something like:</h3>
              <div className="grid gap-2">
                {exampleQueries.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(example)}
                    className="text-left p-3 rounded-lg bg-gray-50 hover:bg-primary/10 transition-colors text-sm text-gray-700 hover:text-primary"
                  >
                    "{example}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Conversation History */}
          <div className="space-y-4 mb-8">
            {conversationHistory.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-xl ${
                  msg.isUser 
                    ? 'bg-primary text-primary-foreground ml-4' 
                    : 'bg-white shadow-sm border border-gray-100 mr-4'
                }`}>
                  <div className="whitespace-pre-wrap text-sm">
                    {msg.message}
                  </div>
                  <div className={`text-xs mt-2 opacity-70 ${
                    msg.isUser ? 'text-primary-foreground' : 'text-gray-500'
                  }`}>
                    {msg.timestamp.toLocaleTimeString()}
                  </div>
                  
                  {/* Show parsed data for debugging (only in development) */}
                  {process.env.NODE_ENV === 'development' && msg.data && (
                    <details className="mt-2 text-xs">
                      <summary className="cursor-pointer opacity-60">Parsed Data</summary>
                      <pre className="mt-1 p-2 bg-black/10 rounded text-xs overflow-auto">
                        {JSON.stringify(msg.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={token 
                    ? "Type your booking request here... (e.g., 'Book Vamana therapy tomorrow between 4 and 8')"
                    : "Please login first to book appointments..."
                  }
                  className={`w-full p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary ${
                    token ? 'border-gray-200' : 'border-red-200 bg-red-50'
                  }`}
                  rows="3"
                  disabled={isProcessing || !token}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={token ? handleInputSubmit : () => navigate('/login?mode=login')}
                  disabled={isProcessing || (!token && !input.trim())}
                  variant={token ? "primary" : "secondary"}
                  size="lg"
                  className="whitespace-nowrap"
                >
                  {isProcessing ? 'Processing...' : (token ? 'Send' : 'Login Required')}
                </Button>
                
                {showConfirmation && (
                  <Button
                    onClick={handleConfirmBooking}
                    disabled={isProcessing}
                    variant="secondary"
                    size="lg"
                    className="whitespace-nowrap bg-green-600 hover:bg-green-700 text-white"
                  >
                    Confirm Booking
                  </Button>
                )}
              </div>
            </div>
            
            <div className="mt-4 text-xs text-gray-500">
              Press Enter to send, Shift+Enter for new line
            </div>
          </div>

          {/* Help section */}
          <div className="mt-8 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">How it works:</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Describe your needs</h4>
                  <p className="text-gray-600">Tell me what therapy you want, when, and with which doctor</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">I'll understand & clarify</h4>
                  <p className="text-gray-600">I'll parse your request and ask for any missing details</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Book instantly</h4>
                  <p className="text-gray-600">Confirm the details and your appointment is booked!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuickBooking;