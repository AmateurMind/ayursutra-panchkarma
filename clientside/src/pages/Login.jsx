import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import ModernHeader from '../components/ui/Header';
import Button from '../components/ui/Button';
import Icon from '../components/AppIcon';
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [state, setState] = useState("Sign Up");
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Prevent multiple submissions
    if (isLoading) return;

    // Validate form inputs
    if (state === "Sign Up" && (!name || !email || !password)) {
      toast.error("Please fill in all fields");
      return;
    }
    if (state === "Login" && (!email || !password)) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  const handleLogout = () => {
    // Not needed on login page
  };

  return (
    <div className="min-h-screen bg-background">
      <ModernHeader
        userRole="patient"
        isAuthenticated={false}
        userName="" 
        onLogout={handleLogout}
      />
      
      <main className="pt-16 flex items-center justify-center min-h-[calc(100vh-4rem)] py-12">
        <div className="w-full max-w-md">
          <form onSubmit={onSubmitHandler} className="bg-card rounded-2xl shadow-breathing p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="User" size={32} className="text-primary-foreground" />
              </div>
              <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
                {state === "Sign Up" ? "Create Account" : "Welcome Back"}
              </h1>
              <p className="font-body text-text-secondary">
                Please {state === "Sign Up" ? "sign up" : "log in"} to book your consultation
              </p>
            </div>

            <div className="space-y-6">
              {state === "Sign Up" && (
                <div>
                  <label className="block font-body text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-breathing"
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block font-body text-sm font-medium text-foreground mb-2">
                  Email Address
                </label>
                <input
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-breathing"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block font-body text-sm font-medium text-foreground mb-2">
                  Password
                </label>
                <input
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-breathing"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <div className="mt-8">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full py-3"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Icon name="Loader2" size={20} className="mr-2" />
                    Please wait...
                  </>
                ) : (
                  state === "Sign Up" ? "Create Account" : "Sign In"
                )}
              </Button>
            </div>

            <div className="mt-6 text-center">
              <p className="font-body text-sm text-text-secondary">
                {state === "Sign Up" ? (
                  <>
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setState("Login")}
                      className="text-primary hover:text-primary/80 font-medium transition-breathing"
                    >
                      Sign in here
                    </button>
                  </>
                ) : (
                  <>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setState("Sign Up")}
                      className="text-primary hover:text-primary/80 font-medium transition-breathing"
                    >
                      Create one here
                    </button>
                  </>
                )}
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Login;
