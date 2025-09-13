import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
  const [docImg, SetDocImg] = useState(false);
  const [name, SetName] = useState("");
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  const [experience, SetExperience] = useState("1 Year");
  const [fees, SetFees] = useState("");
  const [about, SetAbout] = useState("");
  const [speciality, SetSpeciality] = useState("Vamana Therapy");
  const [degree, SetDegree] = useState("");
  const [address1, SetAddress1] = useState("");
  const [address2, SetAddress2] = useState("");

  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!docImg) {
        return toast.error("Image Not Selected");
      }

      const formData = new FormData();

      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 })
      );

      // console log formdata
      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      const { data } = await axios.post(
        backendUrl + "/api/admin/add-doctor",
        formData,
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        SetDocImg(false);
        SetName("");
        SetEmail("");
        SetPassword("");
        SetFees("");
        SetAbout("");
        SetDegree("");
        SetAddress1("");
        SetAddress2("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-foreground mb-2">👨‍⚕️ Add PanchKarma Specialist</h1>
        <p className="text-text-secondary font-body">Register a new certified PanchKarma therapist to your wellness center</p>
      </div>

      <form onSubmit={onSubmitHandler} className="card-breathing max-w-4xl">
        <div className="space-y-8">
        {/* Photo Upload Section */}
        <div className="flex items-center gap-6 p-6 bg-muted/30 rounded-lg border border-border">
          <label htmlFor="doc-img" className="cursor-pointer group">
            <div className="relative">
              <img
                className="w-20 h-20 rounded-full object-cover shadow-breathing border-2 border-primary/20 group-hover:border-primary/40 transition-colors"
                src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
                alt="Specialist photo"
              />
              <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-xs">📷</span>
              </div>
            </div>
          </label>
          <input
            onChange={(e) => SetDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            accept="image/*"
            hidden
          />
          <div>
            <h3 className="font-heading font-semibold text-foreground mb-1">Specialist Photo</h3>
            <p className="text-sm text-text-secondary font-body">Upload a professional photo of the PanchKarma specialist</p>
            <p className="text-xs text-text-secondary font-body mt-1">Recommended: Square image, min 400x400px</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground font-body">👨‍⚕️ Specialist Name</label>
              <input
                onChange={(e) => SetName(e.target.value)}
                value={name}
                className="w-full px-4 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 font-body"
                type="text"
                placeholder="Dr. Full Name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground font-body">📧 Email Address</label>
              <input
                onChange={(e) => SetEmail(e.target.value)}
                value={email}
                className="w-full px-4 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 font-body"
                type="email"
                placeholder="specialist@panchkarmawellness.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground font-body">🔒 Login Password</label>
              <input
                onChange={(e) => SetPassword(e.target.value)}
                value={password}
                className="w-full px-4 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 font-body"
                type="password"
                placeholder="Create a secure password"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground font-body">⭐ Experience Level</label>
              <select
                onChange={(e) => SetExperience(e.target.value)}
                value={experience}
                className="w-full px-4 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 font-body"
              >
                <option value="1 Year">1 Year Experience</option>
                <option value="2 Years">2 Years Experience</option>
                <option value="3 Years">3 Years Experience</option>
                <option value="4 Years">4 Years Experience</option>
                <option value="5 Years">5 Years Experience</option>
                <option value="6 Years">6 Years Experience</option>
                <option value="7 Years">7 Years Experience</option>
                <option value="8 Years">8 Years Experience</option>
                <option value="9 Years">9 Years Experience</option>
                <option value="10+ Years">10+ Years Experience</option>
                <option value="15+ Years">15+ Years Experience</option>
                <option value="20+ Years">20+ Years Experience</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground font-body">💰 Consultation Fee (₹)</label>
              <input
                onChange={(e) => SetFees(e.target.value)}
                value={fees}
                className="w-full px-4 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 font-body"
                type="number"
                placeholder="2500"
                min="500"
                max="50000"
                required
              />
              <p className="text-xs text-text-secondary font-body">Fee per PanchKarma consultation session</p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground font-body">🌿 PanchKarma Specialization</label>
              <select
                onChange={(e) => SetSpeciality(e.target.value)}
                value={speciality}
                className="w-full px-4 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 font-body"
              >
                <option value="Vamana Therapy">Vamana Therapy (Therapeutic Emesis)</option>
                <option value="Virechana Therapy">Virechana Therapy (Therapeutic Purgation)</option>
                <option value="Basti Therapy">Basti Therapy (Medicated Enema)</option>
                <option value="Nasya Therapy">Nasya Therapy (Nasal Administration)</option>
                <option value="Raktamokshana Therapy">Raktamokshana Therapy (Bloodletting)</option>
                <option value="Complete PanchKarma">Complete PanchKarma Specialist</option>
                <option value="Ayurvedic Pulse Diagnosis">Ayurvedic Pulse Diagnosis</option>
                <option value="Panchakosha Therapy">Panchakosha Therapy</option>
              </select>
              <p className="text-xs text-text-secondary font-body">Primary area of PanchKarma expertise</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground font-body">🎓 Education & Qualifications</label>
              <input
                onChange={(e) => SetDegree(e.target.value)}
                value={degree}
                className="w-full px-4 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 font-body"
                type="text"
                placeholder="BAMS, MD (Panchakarma)"
                required
              />
              <p className="text-xs text-text-secondary font-body">Ayurvedic degrees and certifications</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground font-body">📍 Practice Location</label>
              <div className="space-y-3">
                <input
                  onChange={(e) => SetAddress1(e.target.value)}
                  value={address1}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 font-body"
                  type="text"
                  placeholder="Clinic/Center Name & Address Line 1"
                  required
                />
                <input
                  onChange={(e) => SetAddress2(e.target.value)}
                  value={address2}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 font-body"
                  type="text"
                  placeholder="City, State, Pincode"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground font-body">📜 About the PanchKarma Specialist</label>
          <textarea
            onChange={(e) => SetAbout(e.target.value)}
            value={about}
            className="w-full px-4 py-3 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 font-body resize-vertical"
            placeholder="Describe the specialist's PanchKarma expertise, training background, approach to treatment, areas of focus, and philosophy towards Ayurvedic healing..."
            rows={5}
            required
          />
          <p className="text-xs text-text-secondary font-body">Detailed information about their PanchKarma practice and expertise</p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-border">
          <button
            type="submit"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 py-3 rounded-lg transition-all duration-200 shadow-breathing hover:shadow-elevated font-body flex items-center gap-2"
          >
            <span>✨</span>
            Add PanchKarma Specialist
          </button>
        </div>
        </div>
      </form>
    </div>
  );
};

export default AddDoctor;
