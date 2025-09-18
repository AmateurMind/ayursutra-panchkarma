import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Header from '../components/ui/Header';
import Button from '../components/ui/Button';
import PreparationVideo from '../components/PreparationVideo';
import InstructionalContent from '../components/InstructionalContent';

const TherapyPreparation = () => {
  const navigate = useNavigate();
  const { token, userData, setUserData, setToken } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('video');
  const [noteInputs, setNoteInputs] = useState({});
  const [showNoteInput, setShowNoteInput] = useState({});

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserData(false);
    setToken('');
    navigate('/');
  };


  // Initialize checklist items as state - would be fetched from backend
  const [checklistItems, setChecklistItems] = useState([
    {
      id: 1,
      title: "Pre-Therapy Assessment",
      description: "Complete necessary health assessments and documentation",
      icon: "📋",
      priority: "high",
      completed: false,
      timing: "Before appointment",
      detailedInstructions: [
        "Fill out the health assessment form",
        "List all current medications and supplements",
        "Document any allergies or health conditions",
        "Review your health history",
        "Prepare questions for your specialist"
      ],
      notes: []
    },
    {
      id: 2,
      title: "Dietary Guidelines",
      description: "Follow recommended dietary preparations",
      icon: "🍃",
      priority: "high",
      completed: false,
      timing: "As advised",
      detailedInstructions: [
        "Follow the prescribed diet plan",
        "Take any recommended supplements",
        "Avoid specified foods and beverages",
        "Stay properly hydrated",
        "Follow fasting instructions if provided"
      ],
      notes: []
    },
    {
      id: 3,
      title: "Preparation Steps",
      description: "Complete necessary preparation procedures",
      icon: "⚡",
      priority: "medium",
      completed: false,
      timing: "As scheduled",
      detailedInstructions: [
        "Follow any pre-treatment instructions",
        "Apply recommended preparations",
        "Follow the provided schedule",
        "Monitor your body's response",
        "Contact support if you have concerns"
      ],
      notes: []
    },
    {
      id: 4,
      title: "Final Preparations",
      description: "Complete final steps before your appointment",
      icon: "✨",
      priority: "medium",
      completed: false,
      timing: "Day of appointment",
      detailedInstructions: [
        "Get adequate rest",
        "Wear comfortable clothing",
        "Bring necessary items",
        "Arrive on time",
        "Relax and prepare mentally"
      ],
      notes: []
    }
  ]);

  const emergencyContact = {
    name: "Dr. Support Team",
    designation: "Ayursutra Specialist",
    phone: "1234567890",
    email: "support@ayursutra.com",
    available: "24/7"
  };

  // Instructional videos for preparation (YouTube links)
  const instructionalVideos = [
    {
      id: 1,
      title: "Panchkarma Full Explanation and Demonsration Guide",
      description: "A complete walkthrough of Panchakarma therapy, with clear explanations and practical demonstrations tailored for you.",
      thumbnail: "https://images.pexels.com/photos/7988011/pexels-photo-7988011.jpeg",
      duration: "39:48",
      instructor: "Paramanand Ayurveda",
      //rating: "4.9",
      videoUrl: "https://www.youtube.com/watch?v=EQRuIgsfqp4"
    },
    {
      id: 2,
      title: "Breathing Techniques for Therapy",
      description: "Learn Pranayama techniques to enhance therapy benefits",
      thumbnail: "https://images.pexels.com/photos/33949611/pexels-photo-33949611.jpeg",
      duration: "3:00",
      instructor: "Drs. Neda Gould",
      //rating: "4.8",
      videoUrl: "https://www.youtube.com/watch?v=Wemm-i6XHr8"
    },
    {
      id: 3,
      title: "Post-Therapy Care Instructions",
      description: "Essential care tips for after your Abhyanga session",
      thumbnail: "https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg",
      duration: "9:25",
      instructor: "The Professional Massage Academy",
      //rating: "4.7",
      videoUrl: "https://www.youtube.com/watch?v=RCxp0MLzRYw"
    }
  ];

  // Expert tips data
  const expertTips = [
    {
      id: 1,
      title: "Optimal Oil Temperature",
      category: "Preparation Technique",
      icon: "Thermometer",
      content: `The oil used in Abhyanga should be slightly warm, not hot. Test the temperature on your wrist before application. Warm oil penetrates deeper into tissues and provides better therapeutic benefits. If the oil is too hot, it can cause burns; if too cold, it won't absorb properly.`,
      author: "Rajesh Vaidya",
      experience: 25
    },
    {
      id: 2,
      title: "Mind-Body Connection",
      category: "Mental Preparation",
      icon: "Heart",
      content: `Abhyanga is not just a physical therapy but a spiritual practice. Approach it with reverence and positive intention. Visualize the healing energy flowing through your body. This mental preparation enhances the therapeutic effects significantly.`,
      author: "Meera Sharma",
      experience: 18
    },
    {
      id: 3,
      title: "Seasonal Considerations",
      category: "Timing & Environment",
      icon: "Sun",
      content: `The best time for Abhyanga varies by season. In winter, morning sessions are ideal as they warm the body. In summer, early morning or evening sessions prevent overheating. Always ensure the room is warm and draft-free.`,
      author: "Amit Kumar",
      experience: 22
    },
    {
      id: 4,
      title: "Post-Therapy Rest",
      category: "Recovery Protocol",
      icon: "Bed",
      content: `After Abhyanga, rest for at least 30 minutes before bathing. This allows the oil to penetrate deeply and the body to integrate the therapy. Avoid strenuous activities for the rest of the day to maximize benefits.`,
      author: "Sunita Devi",
      experience: 30
    }
  ];

  const handleItemComplete = (itemId, completed) => {
    setChecklistItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, completed: completed }
          : item
      )
    );
    console.log(`Item ${itemId} marked as ${completed ? 'completed' : 'incomplete'}`);
  };

  const handleAddNote = (itemId) => {
    const note = noteInputs[itemId];
    if (note && note.trim()) {
      setChecklistItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId 
            ? { ...item, notes: [...item.notes, note.trim()] }
            : item
        )
      );
      setNoteInputs(prev => ({ ...prev, [itemId]: '' }));
      setShowNoteInput(prev => ({ ...prev, [itemId]: false }));
    }
    console.log(`Note added to item ${itemId}: ${note}`);
  };
  
  const handleNoteInputChange = (itemId, value) => {
    setNoteInputs(prev => ({ ...prev, [itemId]: value }));
  };
  
  const toggleNoteInput = (itemId) => {
    setShowNoteInput(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const handleContactSupport = () => {
    console.log('Contacting support...');
  };

  const tabs = [
    { id: 'checklist', label: 'Preparation Checklist', icon: '✅' },
    { id: 'instructions', label: 'Instructions', icon: '📚' },
    { id: 'video', label: 'Preparation Video', icon: '📷' },
    { id: 'contact', label: 'Contact Support', icon: '📞' }
  ];

  const PreparationHeader = () => (
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 mb-8">
      <div className="text-center">
        <h1 className="text-3xl font-heading font-bold text-foreground">
          Ayursutra Therapy Preparation
        </h1>
      </div>
    </div>
  );

  const ChecklistSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading font-semibold text-foreground mb-6">
        Preparation Checklist
      </h2>
      {checklistItems.map((item) => (
        <div key={item.id} className="bg-card rounded-lg p-6 shadow-breathing">
          <div className="flex items-start gap-4">
            <div className="text-2xl">{item.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {item.title}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  item.priority === 'high' ? 'bg-error/10 text-error' : 
                  item.priority === 'medium' ? 'bg-warning/10 text-warning' : 
                  'bg-muted text-text-secondary'
                }`}>
                  {item.priority} priority
                </span>
              </div>
              <p className="text-text-secondary mb-3">{item.description}</p>
              <div className="text-sm text-text-secondary mb-4">
                <strong>Timing:</strong> {item.timing}
              </div>
              <div className="bg-muted rounded-lg p-4 mb-4">
                <h4 className="font-semibold text-foreground mb-2">Instructions:</h4>
                <ul className="space-y-1 text-sm text-text-secondary">
                  {item.detailedInstructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Display existing notes */}
              {item.notes.length > 0 && (
                <div className="bg-primary/5 rounded-lg p-3 mb-4">
                  <h5 className="font-semibold text-foreground text-sm mb-2">My Notes:</h5>
                  <ul className="space-y-1">
                    {item.notes.map((note, index) => (
                      <li key={index} className="text-sm text-text-secondary flex items-start gap-2">
                        <span className="text-primary mt-1">📝</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant={item.completed ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleItemComplete(item.id, !item.completed)}
                >
                  {item.completed ? '✅ Completed' : 'Mark Complete'}
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleNoteInput(item.id)}
                >
                  {showNoteInput[item.id] ? '❌ Cancel' : '📝 Add Note'}
                </Button>
                
                {item.notes.length > 0 && (
                  <span className="text-sm text-success flex items-center gap-1">
                    <span>📝</span>
                    {item.notes.length} note{item.notes.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              
              {/* Note input form */}
              {showNoteInput[item.id] && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Add a personal note or reminder:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={noteInputs[item.id] || ''}
                      onChange={(e) => handleNoteInputChange(item.id, e.target.value)}
                      placeholder="Enter your note here..."
                      className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddNote(item.id);
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleAddNote(item.id)}
                      disabled={!noteInputs[item.id]?.trim()}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const InstructionsSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading font-semibold text-foreground mb-6">
        General Instructions
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 shadow-breathing">
          <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
            Before Your Appointment
          </h3>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Get a good night's sleep</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Eat a light meal if not fasting</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Avoid alcohol 24 hours before</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Take regular medications unless advised otherwise</span>
            </li>
          </ul>
        </div>
        <div className="bg-card rounded-lg p-6 shadow-breathing">
          <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
            What to Bring
          </h3>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Valid photo ID</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Insurance card</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>List of current medications</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>Previous medical records if relevant</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  const ContactSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading font-semibold text-foreground mb-6">
        Need Help?
      </h2>
      <div className="bg-card rounded-lg p-6 shadow-breathing">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-2xl">📞</span>
          </div>
          <div>
            <h3 className="text-xl font-heading font-semibold text-foreground">
              {emergencyContact.name}
            </h3>
            <p className="text-text-secondary">{emergencyContact.designation}</p>
            <p className="text-sm text-success">Available {emergencyContact.available}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => {
              if (confirm(`Do you want to call ${emergencyContact.phone}?`)) {
                window.location.href = `tel:${emergencyContact.phone}`;
              }
            }}
          >
            📞 Call {emergencyContact.phone}
          </Button>
          <Button
  variant="outline"
  onClick={() => {
    if (!emergencyContact?.email) return;

    const email = emergencyContact.email;
    const subject = encodeURIComponent("Appointment Inquiry");
    const body = encodeURIComponent(
      "Hello, I have a question about my upcoming appointment."
    );

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;

    window.open(gmailUrl, "_blank");
  }}
>
  📧 Email Support
</Button>

        </div>
        
        <div className="mt-6 p-4 bg-warning/5 rounded-lg border border-warning/20">
          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <span>⚠️</span>
            When to Contact Support:
          </h4>
          <ul className="text-sm text-text-secondary space-y-1">
            <li>• Need to reschedule or cancel your appointment</li>
            <li>• Have questions about preparation requirements</li>
            <li>• Experience technical issues with the platform</li>
            <li>• Need assistance with insurance or payment</li>
          </ul>
        </div>
      </div>
    </div>
  );

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
          <PreparationHeader />

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="border-b border-border">
              <nav className="-mb-px flex space-x-8 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                      ${activeTab === tab.id
                        ? 'border-primary text-primary' : 'border-transparent text-text-secondary hover:text-foreground hover:border-border'
                      }
                    `}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {activeTab === 'checklist' && <ChecklistSection />}
              {activeTab === 'instructions' && <InstructionsSection />}
              {activeTab === 'video' && <InstructionalContent videos={instructionalVideos} tips={expertTips} emergencyContact={emergencyContact} />}
              {activeTab === 'contact' && <ContactSection />}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-card rounded-lg p-6">
                <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/my-appointments')}
                  >
                    📅 View My Therapies
                  </Button>

                  

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/')}
                  >
                    ← Back to Home
                  </Button>
                </div>
              </div>

              {/* Progress Summary */}
              <div className="bg-card rounded-lg p-6">
                <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                  Preparation Progress
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Checklist Items</span>
                    <span className="text-sm font-medium text-foreground">
                      {checklistItems.filter(item => item.completed).length}/{checklistItems.length}
                    </span>
                  </div>

                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(checklistItems.filter(item => item.completed).length / checklistItems.length) * 100}%`
                      }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Overall Readiness</span>
                    <span className="text-sm font-medium text-success">
                      {Math.round((checklistItems.filter(item => item.completed).length / checklistItems.length) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Support */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-xl">📞</span>
                  <h3 className="font-semibold text-foreground">Need Help?</h3>
                </div>
                <p className="text-sm text-text-secondary mb-3">
                  Have questions about your therapy preparation? Contact our support team.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setActiveTab('contact')}
                >
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TherapyPreparation;