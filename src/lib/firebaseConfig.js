// Import the functions you need from the SDKs you need
import { getAuth } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8twnfFDaoYaEyOXj9qkm02HJPcBd0iAI",
  authDomain: "task-manager-35b88.firebaseapp.com",
  projectId: "task-manager-35b88",
  storageBucket: "task-manager-35b88.appspot.com",
  messagingSenderId: "1053676780044",
  appId: "1:1053676780044:web:2964bbd710630eba21cc29",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
