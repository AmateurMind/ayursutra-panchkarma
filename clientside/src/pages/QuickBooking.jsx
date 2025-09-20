import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ModernHeader from '../components/ui/Header';
import Button from '../components/ui/Button';
import { AppContext } from '../context/AppContext';
import { parseBookingRequest, generateFollowUpQuestion } from '../utils/bookingParser';
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
    
    setIsProcessing(true);
    
    // Add user message to conversation
    addToConversation(input, true);
    
    try {
      // Parse the natural language input
      const parsed = parseBookingRequest(input);
      
      // Add assistant response
      if (parsed.missingFields.length > 0) {
        const followUpQuestion = generateFollowUpQuestion(parsed.missingFields);
        addToConversation(followUpQuestion, false, parsed);
        setParsedData(parsed);
      } else {
        // All required fields are present
        const confirmationMessage = `I understand you'd like to book:
        
${parsed.specialty ? `• Therapy: ${parsed.specialty}` : ''}
${parsed.doctorName ? `• Doctor: ${parsed.doctorName}` : '• Doctor: Any available specialist'}
• Date: ${formatDisplayDate(parsed.slotDate)}
• Time: ${formatDisplayTime(parsed.slotTime)}

Would you like me to proceed with this booking?`;
        
        addToConversation(confirmationMessage, false, parsed);
        setParsedData(parsed);
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
    if (!parsedData || !token) return;

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
        addToConversation(
          `✅ Your appointment has been successfully booked!

📋 Appointment Details:
• Doctor: ${appointmentInfo.doctorName}
• Specialty: ${appointmentInfo.specialty}
• Date: ${formatDisplayDate(appointmentInfo.slotDate)}
• Time: ${appointmentInfo.slotTime}
• Fees: ₹${appointmentInfo.fees}

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
    "Book on 25 Sep anywhere between 1-10",
    "Booking for Dr. Rajesh Sharma specific doctor",
    "Book anything on 29 anytime",
    "Schedule Basti therapy next Monday morning",
    "Book Complete PanchKarma with Dr. Priya next week"
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
                  placeholder="Type your booking request here... (e.g., 'Book Vamana therapy tomorrow between 4 and 8')"
                  className="w-full p-4 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  rows="3"
                  disabled={isProcessing}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleInputSubmit}
                  disabled={!input.trim() || isProcessing}
                  variant="primary"
                  size="lg"
                  className="whitespace-nowrap"
                >
                  {isProcessing ? 'Processing...' : 'Send'}
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