import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDW4SEMaGHwoF8hUMbvedoYDCuHvZnMK5M",
  authDomain: "itc-project-312be.firebaseapp.com",
  projectId: "itc-project-312be",
  storageBucket: "itc-project-312be.firebasestorage.app",
  messagingSenderId: "607930049938",
  appId: "1:607930049938:web:c227b52d36eda62ca44d4b",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function getPageTitle() {
  return document.title;
}

onAuthStateChanged(auth, (user) => {
  const page = getPageTitle();

  if (user) {
    console.log("User logged in:", user.email);

    if (page === "Login" || page === "Signup" || page === "Forgot Password") {
      window.location.href = "welcome.html";
    }

    if (page === "Welcome") {
      const heading = document.querySelector(".form-heading");
      heading.textContent = `Welcome, ${user.email}`;
    }
  } else {
    console.log("User logged out");

    if (page === "Welcome") {
      window.location.href = "index.html";
    }
  }
});

if (getPageTitle() === "Signup") {
  const signupForm = document.querySelector(".form");

  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const submitBtn = signupForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = "Loading...";
    submitBtn.disabled = true;

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created successfully!");
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    } catch (error) {
      alert(error.message);
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

if (getPageTitle() === "Login") {
  const loginForm = document.querySelector(".form");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    submitBtn.textContent = "Loading...";
    submitBtn.disabled = true;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    } catch (error) {
      alert(error.message);
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

if (getPageTitle() === "Forgot Password") {
  const forgotForm = document.querySelector(".form");

  forgotForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const submitBtn = forgotForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;

    // Set loading state
    submitBtn.textContent = "Loading...";
    submitBtn.disabled = true;

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent!");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    } catch (error) {
      alert(error.message);
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

if (getPageTitle() === "Welcome") {
  const logoutButton = document.querySelector(".signout-btn");

  logoutButton.addEventListener("click", async () => {
    const originalText = logoutButton.textContent;

    logoutButton.textContent = "Loading...";
    logoutButton.disabled = true;

    try {
      await signOut(auth);
      logoutButton.textContent = originalText;
      logoutButton.disabled = false;
    } catch (error) {
      alert("Failed to sign out");
      logoutButton.textContent = originalText;
      logoutButton.disabled = false;
    }
  });
}
