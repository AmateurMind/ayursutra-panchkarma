LIVE DEMO:
https://ayursutra-clientside.onrender.com/
<img width="1913" height="869" alt="Screenshot 2025-10-02 201008 - Copy" src="https://github.com/user-attachments/assets/27e502b1-5bbf-4545-a8fe-331ad9940565" />

<img width="621" height="298" alt="Screenshot 2025-10-02 201225" src="https://github.com/user-attachments/assets/91941004-8b45-4991-ba9e-72392f8f40d0" />

<img width="1916" height="862" alt="Screenshot 2025-10-02 201236" src="https://github.com/user-attachments/assets/133da0f1-569f-4d97-915c-e3f3df55be28" />

<img width="1917" height="879" alt="Screenshot 2025-10-02 201310" src="https://github.com/user-attachments/assets/7f38e29c-a425-44ea-a73c-edc33467549d" />

<img width="1608" height="874" alt="Screenshot 2025-10-02 201631" src="https://github.com/user-attachments/assets/bbad2a57-b1fa-4c12-a1b4-92916af9ae6e" />

<img width="1733" height="876" alt="Screenshot 2025-10-02 201647" src="https://github.com/user-attachments/assets/567e5921-8a08-4ae3-8156-d69bd6508f6f" />

```markdown
# 🌿 AYURSUTRA - Ayurvedic Appointment Booking System
A comprehensive digital p<img width="1913" height="869" alt="Screenshot 2025-10-02 201008" src="https://github.com/user-attachments/assets/d7c9cb40-718a-46be-8850-d9a11fa16e2a" />
latform connecting wellness seekers with Ayurvedic specialists, featuring appointment booking, profile management, and administrative tools.

## 🏗️ System Architecture

AYURSUTRA consists of three main applications:

### 1. Patient Frontend (`clientside/`)
- **Technology**: React + Vite
- **Purpose**: Patient-facing interface for booking appointments
- **Features**: Doctor discovery, appointment booking, profile management

### 2. Admin Panel (`admin/`)
- **Technology**: React + Vite  
- **Purpose**: Administrative interface for healthcare facility management
- **Features**: Dual-role support (Administrators & Doctors), dashboard analytics, appointment management

### 3. Backend API (`backend/`)
- **Technology**: Node.js + Express + MongoDB
- **Purpose**: RESTful API serving all client applications
- **Features**: Authentication, appointment management, payment integration

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB
- Cloudinary account
- Razorpay account (for payments) not working currently

## 🎯 Key Features

### For Patients
- **Doctor Discovery**: Browse Ayurvedic specialists by specialization
- **Smart Booking**: Real-time slot availability with 30-minute intervals
- **Profile Management**: Update personal information and medical history
- **Appointment Tracking**: View upcoming, completed, and cancelled appointments

### For Administrators
- **Dashboard Analytics**: Track specialists, therapy sessions, and wellness seekers
- **Doctor Management**: Add, edit, and manage specialist profiles
- **Appointment Oversight**: View and manage all facility appointments
- **Availability Control**: Toggle doctor availability status

### For Doctors
- **Personal Dashboard**: View appointment statistics and schedule
- **Appointment Management**: Complete, cancel, or reschedule appointments
- **Profile Updates**: Manage fees, availability, and contact information

## 🏥 Appointment System

The booking system uses a sophisticated slot management approach:

- **Time Slots**: 30-minute intervals from 10:00 AM to 9:00 PM
- **Availability Tracking**: Real-time slot booking prevention
- **Date Range**: 7-day advance booking window
- **Conflict Prevention**: Automatic slot blocking upon booking

## 🔐 Authentication & Security

- **JWT-based Authentication**: Stateless token system
- **Role-based Access Control**: Separate tokens for patients, doctors, and admins
- **Password Security**: bcrypt hashing with salt rounds
- **Input Validation**: Comprehensive validation using validator.js

## 🌐 Deployment

### Render Deployment
The system is configured for Render deployment with three separate services:

1. **Backend Service**: Node.js application
2. **Patient Frontend**: Static site (Vite build)
3. **Admin Panel**: Static site (Vite build)

### Environment Variables for Production
Ensure all environment variables are configured in your hosting platform's dashboard.

## 🛠️ Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | React, Vite, Tailwind CSS | User interfaces |
| **Backend** | Node.js, Express.js | API server |
| **Database** | MongoDB, Mongoose | Data persistence |
| **Authentication** | JWT | Secure authentication |
| **File Storage** | Cloudinary | Image management |
| **Payments** | Razorpay | Payment processing |
| **Notifications** | Web3Forms | Email notifications |

## 📱 User Roles & Permissions

### Patient Role
- Book and manage appointments
- Update personal profile
- View doctor profiles and specializations
- Track appointment history

### Doctor Role  
- Manage personal appointments
- Update availability and fees
- Complete appointment sessions
- View personal dashboard metrics

### Administrator Role
- Oversee all system operations
- Manage doctor profiles and availability
- View comprehensive analytics
- Handle appointment conflicts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


