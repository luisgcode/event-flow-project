import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCjzNKN-4PhJ7haNaSEfrdcamjcKmXTHf4",
  authDomain: "eventlogin-75b0b.firebaseapp.com",
  projectId: "eventlogin-75b0b",
  storageBucket: "eventlogin-75b0b.appspot.com",
  messagingSenderId: "907029754351",
  appId: "1:907029754351:web:bc6bdaf1d231b0d3a2061a",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerBtn = document.getElementById("register-btn");
  const biometricBtn = document.getElementById("biometric-btn");
  const errorMessage = document.getElementById("error-message");

  // Login con Email y Contraseña
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.location.href = "user.html";
      })
      .catch((error) => {
        errorMessage.textContent = "⚠️ " + error.message;
      });
  });

  // Registro con Email y Contraseña
  registerBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        window.location.href = "user.html";
      })
      .catch((error) => {
        errorMessage.textContent = "⚠️ " + error.message;
      });
  });

  // Login con Google (incluye Passkeys/Biometrics si está activado)
  biometricBtn.addEventListener("click", () => {
    signInWithPopup(auth, provider)
      .then(() => {
        window.location.href = "user.html";
      })
      .catch((error) => {
        errorMessage.textContent = "⚠️ " + error.message;
      });
  });
});
