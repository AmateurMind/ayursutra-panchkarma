import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Doctors from "./pages/Doctors";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./pages/MyProfile";
import MyAppointments from "./pages/MyAppointments";
import Appointment from "./pages/Appointment";
import TherapyPreparation from "./pages/TherapyPreparation";
import QuickBooking from "./pages/QuickBooking";
import Footer from "./components/Footer";
import AutoLaunchChatbot from "./components/ui/AutoLaunchChatbot";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <div className="min-h-screen bg-background">
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:speciality" element={<Doctors />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/my-appointments" element={<MyAppointments />} />
        <Route path="/appointment/:docId" element={<Appointment />} />
        <Route path="/therapy-preparation" element={<TherapyPreparation />} />
        <Route path="/quick-booking" element={<QuickBooking />} />
      </Routes>
      <Footer />
      {/* Global Auto-Launching Chatbot */}
      <AutoLaunchChatbot />
    </div>
  );
};

export default App;
