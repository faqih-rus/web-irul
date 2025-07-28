# Health Monitoring System

A real-time health monitoring web application built with Next.js and Firebase.

## Features

- **User Authentication**: Login and Register functionality using Firebase Auth
- **Real-time Data Monitoring**: Live updates for health metrics:
  - EKG (Heart Rate) - Variable: `ekg`
  - SpO2 (Oxygen Saturation) - Variable: `sp02`
  - Temperature - Variable: `suhu`
- **Beautiful UI**: Modern gradient design matching the provided mockup
- **Responsive Design**: Works on desktop and mobile devices

## Firebase Configuration

The app is configured to connect to:
- **Database URL**: https://tugas-akhir-85d6a-default-rtdb.firebaseio.com/
- **API Key**: AIzaSyCRXSjhpH0fwOXX4L-tL1rFFH6B9AUuMHY
- **Auth Token**: oUB52LKEUZGzXWWAkoAPocfmcSBVmziPsMV9GhrQ

## Real-time Variables

The application monitors these variables from Firebase Realtime Database:
- `ekg` - Heart rate in BPM
- `sp02` - Blood oxygen saturation percentage
- `suhu` - Body temperature in Celsius

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Login/Register**: 
   - Use email and password to create an account or login
   - Toggle between login and register modes

2. **Dashboard**: 
   - After authentication, view real-time health data
   - Data updates automatically from Firebase
   - Health status indicators show normal/abnormal ranges

3. **Logout**: 
   - Click the logout button to return to login screen

## Health Status Ranges

- **EKG**: Normal range 60-100 BPM
- **SpO2**: Normal range ≥95%
- **Temperature**: Normal range 36-37.5°C

## Files Structure

- `app/page.js` - Main application component with login and dashboard
- `app/config/firebase.js` - Firebase configuration and initialization
- `app/layout.js` - Next.js layout wrapper
- `app/globals.css` - Global styles with Tailwind CSS

## Dependencies

- Next.js 14
- React 18
- Firebase 10.x
- Tailwind CSS

## Design Features

- Gradient blue background matching the mockup
- Yellow input fields as shown in the design
- Heart icon with EKG wave visualization
- Medical-themed icons and colors
- Real-time data cards with status indicators
