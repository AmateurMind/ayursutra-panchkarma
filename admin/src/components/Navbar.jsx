import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AdminContext } from "../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { DoctorContext } from "../context/DoctorContext";

const Navbar = () => {
  const { aToken, setAToken } = useContext(AdminContext);
  const { dToken, setDToken } = useContext(DoctorContext);

  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
    aToken && setAToken("");
    aToken && localStorage.removeItem("aToken");
    dToken && setDToken("");
    dToken && localStorage.removeItem("dToken");
  };

  return (
    <div className="flex justify-between items-center px-4 sm:px-10 py-4 border-b border-border bg-card/90 backdrop-blur-md shadow-breathing">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center shadow-breathing">
            <span className="text-white text-xl font-bold">🌿</span>
          </div>
          <div>
            <h1 className="text-xl font-heading font-bold text-foreground">PanchKarma Wellness</h1>
            <p className="text-xs font-body text-text-secondary">Admin Portal</p>
          </div>
        </div>
        <div className="ml-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            👨‍⚕️ {aToken ? "Administrator" : "PanchKarma Specialist"}
          </span>
        </div>
      </div>
      <button
        onClick={logout}
        className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-breathing hover:shadow-elevated"
      >
        🚪 Logout
      </button>
    </div>
  );
};

export default Navbar;
