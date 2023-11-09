// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAQP_Dvxt66_YcOGz8NYF9TvYO5XWu16DI",
  authDomain: "guardar-mis-lugares.firebaseapp.com",
  projectId: "guardar-mis-lugares",
  storageBucket: "guardar-mis-lugares.appspot.com",
  messagingSenderId: "545589643936",
  appId: "1:545589643936:web:8b8d96f3400cf75c9897c5",
  measurementId: "G-3Y8XBWKSG8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);