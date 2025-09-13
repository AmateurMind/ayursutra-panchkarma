import React, { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { DoctorContext } from "../context/DoctorContext";

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);

  return (
    <div className="min-h-screen bg-card/80 backdrop-blur-sm border-r border-border shadow-breathing">
      {aToken && (
        <div className="p-4">
          <div className="mb-6">
            <h2 className="text-lg font-heading font-semibold text-foreground mb-1">🏥 Admin Panel</h2>
            <p className="text-sm font-body text-text-secondary">PanchKarma Wellness Management</p>
          </div>
          <ul className="space-y-2">
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-breathing" 
                    : "text-foreground hover:bg-primary/5 hover:text-primary"
                }`
              }
              to={"/admin-dashboard"}
            >
              <span className="text-lg">📈</span>
              <p className="hidden md:block font-medium font-body">Dashboard</p>
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-breathing" 
                    : "text-foreground hover:bg-primary/5 hover:text-primary"
                }`
              }
              to={"/all-appointments"}
            >
              <span className="text-lg">📅</span>
              <p className="hidden md:block font-medium font-body">PanchKarma Sessions</p>
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-breathing" 
                    : "text-foreground hover:bg-primary/5 hover:text-primary"
                }`
              }
              to={"/add-doctor"}
            >
              <span className="text-lg">➕</span>
              <p className="hidden md:block font-medium font-body">Add Specialist</p>
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-breathing" 
                    : "text-foreground hover:bg-primary/5 hover:text-primary"
                }`
              }
              to={"/doctor-list"}
            >
              <span className="text-lg">👨‍⚕️</span>
              <p className="hidden md:block font-medium font-body">PanchKarma Specialists</p>
            </NavLink>
          </ul>
        </div>
      )}

      {dToken && (
        <div className="p-4">
          <div className="mb-6">
            <h2 className="text-lg font-heading font-semibold text-foreground mb-1">🌿 Specialist Portal</h2>
            <p className="text-sm font-body text-text-secondary">PanchKarma Practice Management</p>
          </div>
          <ul className="space-y-2">
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-breathing" 
                    : "text-foreground hover:bg-primary/5 hover:text-primary"
                }`
              }
              to={"/doctor-dashboard"}
            >
              <span className="text-lg">📈</span>
              <p className="hidden md:block font-medium font-body">Dashboard</p>
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-breathing" 
                    : "text-foreground hover:bg-primary/5 hover:text-primary"
                }`
              }
              to={"/doctor-appointments"}
            >
              <span className="text-lg">📅</span>
              <p className="hidden md:block font-medium font-body">My Sessions</p>
            </NavLink>

            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-breathing" 
                    : "text-foreground hover:bg-primary/5 hover:text-primary"
                }`
              }
              to={"/doctor-profile"}
            >
              <span className="text-lg">📝</span>
              <p className="hidden md:block font-medium font-body">My Profile</p>
            </NavLink>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
