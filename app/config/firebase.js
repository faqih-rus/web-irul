// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRXSjhpH0fwOXX4L-tL1rFFH6B9AUuMHY",
  authDomain: "tugas-akhir-85d6a.firebaseapp.com",
  databaseURL: "https://tugas-akhir-85d6a-default-rtdb.firebaseio.com/",
  projectId: "tugas-akhir-85d6a",
  storageBucket: "tugas-akhir-85d6a.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);
export const auth = getAuth(app);

export default app;