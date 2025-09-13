import React, { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "../context/DoctorContext";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (state === "Admin") {
        const { data } = await axios.post(backendUrl + "/api/admin/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/doctor/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("dToken", data.token);
          setDToken(data.token);
          console.log(data.token);
          
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {}
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-card flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-breathing">
            <span className="text-white text-2xl font-bold">🌿</span>
          </div>
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">PanchKarma Wellness</h1>
          <p className="text-text-secondary font-body">Admin Portal Access</p>
        </div>
        
        {/* Login Form */}
        <form onSubmit={onSubmitHandler} className="card-breathing">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-heading font-semibold text-foreground">
              <span className="text-primary">{state}</span> Login
            </h2>
            <p className="text-text-secondary font-body text-sm mt-1">
              {state === "Admin" ? "Access administrative controls" : "Access your specialist dashboard"}
            </p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 font-body">Email Address</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="w-full px-4 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 font-body"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 font-body">Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="w-full px-4 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 font-body"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>
          
          <button 
            type="submit"
            className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-lg transition-all duration-200 shadow-breathing hover:shadow-elevated font-body"
          >
            🚪 Sign In to {state} Portal
          </button>
          
          <div className="mt-6 text-center">
            {state === "Admin" ? (
              <p className="text-text-secondary font-body text-sm">
                PanchKarma Specialist?{" "}
                <span
                  className="text-primary hover:text-primary/80 underline cursor-pointer font-medium transition-colors"
                  onClick={() => setState("Doctor")}
                >
                  Access Specialist Portal
                </span>
              </p>
            ) : (
              <p className="text-text-secondary font-body text-sm">
                Administrator?{" "}
                <span
                  className="text-primary hover:text-primary/80 underline cursor-pointer font-medium transition-colors"
                  onClick={() => setState("Admin")}
                >
                  Access Admin Portal
                </span>
              </p>
            )}
          </div>
        </form>
        
        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-text-secondary font-body text-xs">
            Authentic PanchKarma Wellness Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
