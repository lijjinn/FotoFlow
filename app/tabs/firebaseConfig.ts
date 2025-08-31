// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBYxUdtvC_Y4FKInMu3xP3HHSu8_VmUt-0",
  authDomain: "fotoflow-182dc.firebaseapp.com",
  projectId: "fotoflow-182dc",
  storageBucket: "fotoflow-182dc.firebasestorage.app",
  messagingSenderId: "839364900374",
  appId: "1:839364900374:web:5297a6f553bd2c4c56a737",
  measurementId: "G-9SETN8ZK2S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);