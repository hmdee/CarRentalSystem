// signUpGoogle.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

const usersList = JSON.parse(localStorage.getItem("usersList")) || [];
console.log(usersList);

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDEU3PXK0-i73qo3YiYSvF0MndKiBFsXpc",
  authDomain: "car-rental-auth-4807b.firebaseapp.com",
  projectId: "car-rental-auth-4807b",
  storageBucket: "car-rental-auth-4807b.firebasestorage.app",
  messagingSenderId: "413472981028",
  appId: "1:413472981028:web:b86d58a3b322e070bdd8b1",
  measurementId: "G-PN1B542Z68",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.useDeviceLanguage();

const provider = new GoogleAuthProvider();

const googleBtn = document.getElementById("googleBtn");

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("User Info:", user);
    const existingUser = usersList.find((u) => u.email === user.email);
    if (!existingUser) {
      const newUser = {
        email: user.email,
        id: user.uid,
        name: user.displayName,
        password: null,
        profileImage: user.photoURL,
        role: "user",
      };
      usersList.push(newUser);
      localStorage.setItem("usersList", JSON.stringify(usersList));
      localStorage.setItem("currentUser", JSON.stringify(newUser));
    } else {
      localStorage.setItem("currentUser", JSON.stringify(existingUser));
    }
    window.open("../../index.html", "_self");
    // show success message or redirect
  } catch (error) {
    console.error("Sign-in Error:", error);
  }
}

googleBtn.addEventListener("click", () => {
  signInWithGoogle();
});

export async function signOutUser() {
  try {
    await signOut(auth);
    console.log("User signed out.");
  } catch (error) {
    console.error("Sign-out Error:", error);
  }
}

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Logged in as:", user.displayName);
  } else {
    console.log("User logged out.");
  }
});
