import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../components/ui/Header";

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData, setToken } =
    useContext(AppContext);
  const navigate = useNavigate();

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();

      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);

      image && formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUserData(false);
    setToken('');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        userRole="patient"
        isAuthenticated={!!token}
        userName={userData?.name || "User"}
        onLogout={handleLogout}
      />
      
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-2">
              My Profile
            </h1>
            <p className="text-text-secondary text-sm sm:text-base">
              Manage your personal information and account settings
            </p>
          </div>

          {userData ? (
            <div className="bg-card rounded-lg p-4 sm:p-6 shadow-breathing max-w-2xl">
              <div className="flex flex-col gap-6">
                {/* Profile Image Section */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                  {isEdit ? (
                    <label htmlFor="image" className="flex-shrink-0">
                      <div className="inline-block relative cursor-pointer">
                        <img
                          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-primary/20 opacity-75"
                          src={image ? URL.createObjectURL(image) : userData.image}
                          alt="Profile"
                        />
                        <div className="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7m0 0V5a2 2 0 012-2h6l2 2h6a2 2 0 012 2v2M7 13l3 3 7-7" />
                          </svg>
                        </div>
                      </div>
                      <input
                        onChange={(e) => setImage(e.target.files[0])}
                        type="file"
                        id="image"
                        accept="image/*"
                        hidden
                      />
                    </label>
                  ) : (
                    <img 
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-primary/20 flex-shrink-0" 
                      src={userData.image} 
                      alt="Profile" 
                    />
                  )}
                  
                  <div className="flex-1 text-center sm:text-left">
                    {isEdit ? (
                      <input
                        className="text-xl sm:text-2xl font-heading font-semibold bg-background border border-border rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                        type="text"
                        value={userData.name}
                        onChange={(e) =>
                          setUserData((prev) => ({ ...prev, name: e.target.value }))
                        }
                      />
                    ) : (
                      <h2 className="text-xl sm:text-2xl font-heading font-semibold text-foreground">
                        {userData.name}
                      </h2>
                    )}
                    <p className="text-text-secondary mt-1 text-sm sm:text-base break-words">{userData.email}</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-border"></div>
                {/* Contact Information Section */}
                <div>
                  <h3 className="text-base sm:text-lg font-heading font-semibold text-foreground mb-4">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Email Address
                      </label>
                      <p className="text-text-secondary bg-muted px-3 py-2 rounded-md text-sm break-words">
                        {userData.email}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Phone Number
                      </label>
                      {isEdit ? (
                        <input
                          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                          type="tel"
                          placeholder="Enter phone number"
                          value={userData.phone}
                          onChange={(e) =>
                            setUserData((prev) => ({ ...prev, phone: e.target.value }))
                          }
                        />
                      ) : (
                        <p className="text-text-secondary bg-muted px-3 py-2 rounded-md text-sm">
                          {userData.phone || 'Not provided'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Address
                    </label>
                    {isEdit ? (
                      <div className="space-y-2">
                        <input
                          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                          placeholder="Address Line 1"
                          onChange={(e) =>
                            setUserData((prev) => ({
                              ...prev,
                              address: { ...prev.address, line1: e.target.value },
                            }))
                          }
                          value={userData.address?.line1 || ''}
                          type="text"
                        />
                        <input
                          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                          placeholder="Address Line 2"
                          onChange={(e) =>
                            setUserData((prev) => ({
                              ...prev,
                              address: { ...prev.address, line2: e.target.value },
                            }))
                          }
                          value={userData.address?.line2 || ''}
                          type="text"
                        />
                      </div>
                    ) : (
                      <p className="text-text-secondary bg-muted px-3 py-2 rounded-md whitespace-pre-line text-sm">
                        {userData.address?.line1 && userData.address?.line2 
                          ? `${userData.address.line1}\n${userData.address.line2}`
                          : userData.address?.line1 || 'Not provided'
                        }
                      </p>
                    )}
                  </div>
                </div>
                {/* Basic Information Section */}
                <div>
                  <h3 className="text-base sm:text-lg font-heading font-semibold text-foreground mb-4">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Gender
                      </label>
                      {isEdit ? (
                        <select
                          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                          onChange={(e) =>
                            setUserData((prev) => ({ ...prev, gender: e.target.value }))
                          }
                          value={userData.gender || ''}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      ) : (
                        <p className="text-text-secondary bg-muted px-3 py-2 rounded-md text-sm">
                          {userData.gender || 'Not provided'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Date of Birth
                      </label>
                      {isEdit ? (
                        <input
                          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                          type="date"
                          onChange={(e) =>
                            setUserData((prev) => ({ ...prev, dob: e.target.value }))
                          }
                          value={userData.dob || ''}
                        />
                      ) : (
                        <p className="text-text-secondary bg-muted px-3 py-2 rounded-md text-sm">
                          {userData.dob || 'Not provided'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                  {isEdit ? (
                    <>
                      <button
                        className="bg-primary text-primary-foreground px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-primary/90 transition-colors font-medium text-sm sm:text-base touch-target flex-1 sm:flex-none order-1 sm:order-1"
                        onClick={updateUserProfileData}
                      >
                        💾 Save Changes
                      </button>
                      <button
                        className="border border-border px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-muted transition-colors font-medium text-sm sm:text-base touch-target flex-1 sm:flex-none order-2 sm:order-2"
                        onClick={() => {
                          setIsEdit(false);
                          setImage(false);
                          loadUserProfileData(); // Reset to original data
                        }}
                      >
                        ❌ Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="bg-primary text-primary-foreground px-4 sm:px-6 py-2 sm:py-3 rounded-md hover:bg-primary/90 transition-colors font-medium text-sm sm:text-base touch-target w-full sm:w-auto"
                      onClick={() => setIsEdit(true)}
                    >
                      ✏️ Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-lg p-4 sm:p-6 shadow-breathing max-w-2xl">
              <div className="animate-pulse">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-muted rounded-full flex-shrink-0"></div>
                  <div className="flex-1 text-center sm:text-left">
                    <div className="h-6 sm:h-8 bg-muted rounded w-32 sm:w-48 mb-2 mx-auto sm:mx-0"></div>
                    <div className="h-3 sm:h-4 bg-muted rounded w-48 sm:w-64 mx-auto sm:mx-0"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-3 sm:h-4 bg-muted rounded w-full"></div>
                  <div className="h-3 sm:h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 sm:h-4 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyProfile;
