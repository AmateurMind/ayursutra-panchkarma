import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import Header from '../components/ui/Header';
import Button from '../components/ui/Button';

const TherapyPreparation = () => {
  const navigate = useNavigate();
  const { token } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('checklist');

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logout clicked');
  };

  // Mock data for therapy preparation - would be fetched from backend
  const therapyDetails = {
    type: "Virechana PanchKarma Therapy",
    appointmentDate: "Tomorrow, 10:00 AM",
    timeRemaining: 18.5 // hours
  };

  // Initialize checklist items as state
  const [checklistItems, setChecklistItems] = useState([
    {
      id: 1,
      title: "Complete Pre-PanchKarma Assessment",
      description: "Gather all medical documents and complete PanchKarma readiness assessment",
      icon: "📋",
      priority: "high",
      completed: false,
      timing: "Before appointment",
      detailedInstructions: [
        "Complete the Prakriti (body constitution) assessment form",
        "List all current medications, herbs, and supplements",
        "Document any allergies, especially to oils and herbs",
        "Note your digestive patterns and recent health issues",
        "Prepare questions about the specific PanchKarma therapy"
      ],
      notes: []
    },
    {
      id: 2,
      title: "Dietary Preparation (Deepana & Pachana)",
      description: "Begin the pre-therapy dietary regimen as prescribed",
      icon: "💳",
      priority: "high",
      completed: true,
      timing: "Before leaving home",
      detailedInstructions: [
        "Follow the prescribed light diet (laghu ahara)",
        "Take prescribed digestive medicines (deepana pachana)",
        "Avoid heavy, oily, and spicy foods",
        "Drink warm water and herbal teas only",
        "Fast as instructed before the therapy day"
      ],
      notes: ["Started light diet 3 days ago"]
    },
    {
      id: 3,
      title: "Snehana (Oil Preparation)",
      description: "Complete the internal and external oil application as prescribed",
      icon: "⏰",
      priority: "medium",
      completed: false,
      timing: "Day of appointment",
      detailedInstructions: [
        "Take prescribed ghee or medicated oils internally",
        "Apply prescribed oils externally for abhyanga",
        "Follow the increasing dosage schedule",
        "Monitor your body's response to oleation",
        "Report any discomfort to your practitioner"
      ],
      notes: []
    },
    {
      id: 4,
      title: "Swedana (Steam Therapy) Preparation",
      description: "Prepare for the pre-therapy steam and heat treatments",
      icon: "📝",
      priority: "medium",
      completed: false,
      timing: "As instructed",
      detailedInstructions: [
        "Stay hydrated but avoid excessive water intake",
        "Wear loose, comfortable cotton clothing",
        "Bring towels and change of clothes",
        "Avoid air conditioning and cold environments",
        "Rest well and avoid physical exertion"
      ],
      notes: []
    }
  ]);

  const emergencyContact = {
    name: "Dr. Rajesh Sharma",
    designation: "Chief PanchKarma Specialist",
    phone: "+1 (555) 123-4567",
    email: "support@panchkarmawellness.com",
    available: "24/7"
  };

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

  const handleAddNote = (itemId, note) => {
    if (note.trim()) {
      setChecklistItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId 
            ? { ...item, notes: [...item.notes, note.trim()] }
            : item
        )
      );
    }
    console.log(`Note added to item ${itemId}: ${note}`);
  };

  const handleContactSupport = () => {
    console.log('Contacting support...');
  };

  const tabs = [
    { id: 'checklist', label: 'Preparation Checklist', icon: '✅' },
    { id: 'instructions', label: 'Instructions', icon: '📚' },
    { id: 'contact', label: 'Contact Support', icon: '📞' }
  ];

  const PreparationHeader = () => (
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 mb-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            PanchKarma Therapy Preparation
          </h1>
          <p className="text-lg text-text-secondary mb-1">
            {therapyDetails.type}
          </p>
          <p className="text-sm text-text-secondary">
            Scheduled for: {therapyDetails.appointmentDate}
          </p>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {Math.floor(therapyDetails.timeRemaining)}h {Math.round((therapyDetails.timeRemaining % 1) * 60)}m
          </div>
          <div className="text-sm text-text-secondary">Time remaining</div>
        </div>
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
              <div className="flex items-center gap-3">
                <Button
                  variant={item.completed ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleItemComplete(item.id, !item.completed)}
                >
                  {item.completed ? '✅ Completed' : 'Mark Complete'}
                </Button>
                {item.notes.length > 0 && (
                  <span className="text-sm text-success">Notes added</span>
                )}
              </div>
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
            onClick={() =>
              window.open(
                `mailto:${emergencyContact.email}?subject=Appointment Inquiry&body=Hello, I have a question about my upcoming appointment.`,
                "_blank"
              )
            }
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
        userName="User"
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
                    onClick={handleContactSupport}
                  >
                    💬 Contact Specialist
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

              {/* Appointment Reminder */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-xl">⏰</span>
                  <h3 className="font-semibold text-foreground">Appointment Reminder</h3>
                </div>
                <p className="text-sm text-text-secondary mb-3">
                  Your appointment is in {Math.floor(therapyDetails.timeRemaining)} hours and {Math.round((therapyDetails.timeRemaining % 1) * 60)} minutes.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setActiveTab('contact')}
                >
                  Need to Reschedule?
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