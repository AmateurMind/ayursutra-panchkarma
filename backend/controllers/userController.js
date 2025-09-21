import validator from "validator";
import bycrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

// API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // validating email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "enter a valid email" });
    }

    // validating strong password
    if (password.length < 8) {
      return res.json({ success: false, message: "enter a strong password" });
    }

    // hashing user password
    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bycrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get user profile data
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const useData = await userModel.findById(userId).select("-password");

    res.json({ success: true, user: useData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update user profile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });

    if (imageFile) {
      // upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to book appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }

    let slots_booked = docData.slots_booked;

    // checking for slot availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot not available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");

    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // save new slots data in docData
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment Booked" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for quick booking with natural language processing
const quickBookAppointment = async (req, res) => {
  try {
    const { userId, specialty, doctorName, slotDate, slotTime } = req.body;

    // Convert YYYY-MM-DD date format to day_month_year format
    const dateObj = new Date(slotDate);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1;
    const year = dateObj.getFullYear();
    const formattedSlotDate = `${day}_${month}_${year}`;

    // Find available doctors based on the parsed data
    let query = { available: true };
    
    // If specialty is specified, add it to the query
    if (specialty) {
      query.speciality = specialty;
    }

    // If doctor name is specified, add it to the query
    if (doctorName) {
      query.name = { $regex: doctorName, $options: 'i' }; // Case insensitive search
    }

    const availableDoctors = await doctorModel.find(query).select("-password");

    if (availableDoctors.length === 0) {
      return res.json({ success: false, message: "No available doctors found for the specified criteria" });
    }

    // Generate available time slots (10:00 AM to 9:00 PM, 30-minute intervals)
    const generateTimeSlots = () => {
      const slots = [];
      for (let hour = 10; hour <= 21; hour++) {
        if (hour <= 21) slots.push(`${hour.toString().padStart(2, '0')}:00`);
        if (hour < 21) slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
      return slots;
    };

    // For time ranges (e.g., "4-8"), we need to find available slots
    let availableDoctor = null;
    let finalSlotTime = slotTime;

    if (slotTime === 'anytime') {
      // Find any available slot for the date
      for (const doctor of availableDoctors) {
        const slots_booked = doctor.slots_booked[formattedSlotDate] || [];
        const allSlots = generateTimeSlots();
        
        const availableSlot = allSlots.find(slot => !slots_booked.includes(slot));
        if (availableSlot) {
          availableDoctor = doctor;
          finalSlotTime = availableSlot;
          break;
        }
      }
    } else if (slotTime.includes('-')) {
      // Handle time ranges like "4-8" or "9-12"
      const [startHour, endHour] = slotTime.split('-').map(Number);
      
      for (const doctor of availableDoctors) {
        const slots_booked = doctor.slots_booked[formattedSlotDate] || [];
        let foundSlot = false;
        
        // Convert to proper hour format (ensure 10+ for working hours)
        const actualStartHour = startHour < 10 ? startHour + 12 : startHour;
        const actualEndHour = endHour < 10 ? endHour + 12 : endHour;
        
        for (let hour = Math.max(actualStartHour, 10); hour < Math.min(actualEndHour, 22) && !foundSlot; hour++) {
          const slots = [`${hour.toString().padStart(2, '0')}:00`, `${hour.toString().padStart(2, '0')}:30`];
          for (const slot of slots) {
            if (!slots_booked.includes(slot)) {
              availableDoctor = doctor;
              finalSlotTime = slot;
              foundSlot = true;
              break;
            }
          }
        }
        if (foundSlot) break;
      }
    } else {
      // Specific time slot - convert to proper format if needed
      let formattedTime = slotTime;
      if (slotTime.includes(':') && slotTime.length === 4) {
        formattedTime = slotTime.padStart(5, '0'); // Convert "9:00" to "09:00"
      }
      
      for (const doctor of availableDoctors) {
        const slots_booked = doctor.slots_booked[formattedSlotDate] || [];
        if (!slots_booked.includes(formattedTime)) {
          availableDoctor = doctor;
          finalSlotTime = formattedTime;
          break;
        }
      }
    }

    if (!availableDoctor) {
      return res.json({ success: false, message: "No available slots found for the specified time" });
    }

    // Book the appointment using the existing logic
    let slots_booked = availableDoctor.slots_booked;
    
    if (slots_booked[formattedSlotDate]) {
      slots_booked[formattedSlotDate].push(finalSlotTime);
    } else {
      slots_booked[formattedSlotDate] = [finalSlotTime];
    }

    const userData = await userModel.findById(userId).select("-password");

    const appointmentData = {
      userId,
      docId: availableDoctor._id,
      userData,
      docData: {
        _id: availableDoctor._id,
        name: availableDoctor.name,
        email: availableDoctor.email,
        image: availableDoctor.image,
        speciality: availableDoctor.speciality,
        degree: availableDoctor.degree,
        experience: availableDoctor.experience,
        about: availableDoctor.about,
        fees: availableDoctor.fees,
        address: availableDoctor.address
      },
      amount: availableDoctor.fees,
      slotTime: finalSlotTime,
      slotDate: formattedSlotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // Save new slots data in docData
    await doctorModel.findByIdAndUpdate(availableDoctor._id, { slots_booked });

    res.json({ 
      success: true, 
      message: "Appointment Booked Successfully",
      appointment: {
        doctorName: availableDoctor.name,
        doctorEmail: availableDoctor.email,
        specialty: availableDoctor.speciality,
        slotDate,
        slotTime: finalSlotTime,
        fees: availableDoctor.fees,
        doctorExperience: availableDoctor.experience,
        doctorAddress: availableDoctor.address
      }
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    // verify appointment user
    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // releasing doctor slot

    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    let slots_booked = doctorData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  quickBookAppointment,
  listAppointment,
  cancelAppointment,
};
