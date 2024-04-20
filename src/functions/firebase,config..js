// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMAdvurmLXst-7h4N1I6_VQYxdp-lQ6gE",
  authDomain: "tic-tac-toe-9f7b1.firebaseapp.com",
  projectId: "tic-tac-toe-9f7b1",
  storageBucket: "tic-tac-toe-9f7b1.appspot.com",
  messagingSenderId: "793156075153",
  appId: "1:793156075153:web:306bf7e9f6232c8e498930",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;
