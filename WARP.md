# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

AYURSTUTRA is a full-stack appointment booking system for doctors and hospitals with three-tier authentication:
1. **Patients** - Book appointments and manage their bookings
2. **Doctors** - View appointments and manage profiles  
3. **Admins** - Manage appointments and doctor profiles

The system consists of three main applications:
- **Frontend (clientside/)** - Patient-facing React application
- **Admin Panel (admin/)** - Admin and doctor dashboard React application  
- **Backend (backend/)** - Node.js/Express API server

## Architecture

### Backend (Node.js/Express)
- **Entry Point**: `backend/server.js`
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt password hashing
- **File Upload**: Multer with Cloudinary integration
- **Payment Processing**: Razorpay integration
- **Models**: User, Doctor, and Appointment entities

### Frontend Applications (React + Vite)
Both frontend apps use:
- **React 18** with React Router for navigation
- **Tailwind CSS** for styling
- **Axios** for API communication
- **React Toastify** for notifications
- **Vite** as build tool and dev server

### Database Schema
- **Users**: name, email, password, image, address, gender, dob, phone
- **Doctors**: name, email, password, image, speciality, degree, experience, about, available, fees, address, slots_booked
- **Appointments**: user_id, doctor_id, date, time, status, payment info

## Development Commands

### Backend Development
```bash
cd backend
npm install
npm run server          # Start development server with nodemon
npm start               # Start production server
```

### Frontend (Patient App) Development  
```bash
cd clientside
npm install
npm run dev             # Start dev server (default port)
npm run build           # Build for production
npm run lint            # Run ESLint
npm run preview         # Preview production build
```

### Admin Panel Development
```bash
cd admin  
npm install
npm run dev             # Start dev server on port 5174
npm run build           # Build for production
npm run lint            # Run ESLint
npm run preview         # Preview production build
```

## Environment Setup

Each application requires environment variables:

### Backend (.env)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_SECRET_KEY` - Cloudinary config
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` - Razorpay payment config
- `PORT` - Server port (default: 4000)

### Frontend Apps (.env)
- `VITE_BACKEND_URL` - Backend API URL

## API Structure

The backend exposes three main route groups:
- `/api/user` - Patient registration, login, appointments
- `/api/doctor` - Doctor authentication, profile management, appointments  
- `/api/admin` - Admin functions, doctor management, appointment oversight

## Deployment

All three applications are configured for Vercel deployment with `vercel.json` files:
- Backend deploys as serverless functions
- Frontend apps deploy as static sites
- Environment variables must be configured in Vercel dashboard

## Key Development Notes

- Both frontend apps use React Context for state management (AdminContext, DoctorContext, AppContext)
- Authentication is handled via JWT tokens stored in localStorage
- File uploads go through Multer → Cloudinary pipeline
- Payment processing integrates with Razorpay
- All apps use ES modules (`"type": "module"` in package.json)
- Tailwind CSS is configured with custom primary color: `#5f6FFF`