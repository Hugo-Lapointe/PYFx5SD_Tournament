// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAoNDGOCJxCaUZBNzVHmcWUhyqTjEIMFoY",
  authDomain: "pyf-5sd-tournament.firebaseapp.com",
  projectId: "pyf-5sd-tournament",
  storageBucket: "pyf-5sd-tournament.firebasestorage.app",
  messagingSenderId: "1088318648643",
  appId: "1:1088318648643:web:de3c35268a9e1ef6b4bff6",
  measurementId: "G-JCJYY1KW4E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);