LIVE DEMO:
https://ayursutra-clientside.onrender.com/
```markdown
# 🌿 AYURSUTRA - Ayurvedic Appointment Booking System
A comprehensive digital p![Uploading Screenshot 2025-10-02 201008.png…]()
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


<img width="1913" height="869" alt="Screenshot 2025-10-02 201008" src="https://github.com/user-attachments/assets/1fe6fea6-02f9-476f-aa03-3d796b919fa7" />

<img width="1916" height="862" alt="Screenshot 2025-10-02 201236" src="https://github.com/user-attachments/assets/510757b5-4110-4adf-91b6-e59a8a05e14b" />

<img width="1917" height="879" alt="Screenshot 2025-10-02 201310" src="https://github.com/user-attachments/assets/c6c62015-278e-4978-83ad-a4c1d623a8c1" />

<img width="1919" height="866" alt="Screenshot 2025-10-02 201342" src="https://github.com/user-attachments/assets/cf98822f-a7f6-462c-bff7-4cf5076ed922" />

<img width="1730" height="872" alt="Screenshot 2025-10-02 201544" src="https://github.com/user-attachments/assets/9e7fdbef-a1e0-4b07-abee-4c5696e0f763" />

<img width="1608" height="874" alt="Screenshot 2025-10-02 201631" src="https://github.com/user-attachments/assets/f6d657f6-2ea1-44eb-8778-7c4fb0e94aa7" />

<img width="1733" height="876" alt="Screenshot 2025-10-02 201647" src="https://github.com/user-attachments/assets/53ccbcd0-e551-436c-9f32-8ebbb0345afc" />
