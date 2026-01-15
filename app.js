/* ================================
   FIREBASE AUTHENTICATION SCRIPT
   ================================ */

/* ---------- 1. IMPORTS ---------- */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

/* ---------- 2. FIREBASE CONFIG ---------- */
const firebaseConfig = {
};

/* ---------- 3. INITIALIZE FIREBASE ---------- */
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* ---------- 4. HELPER FUNCTIONS ---------- */
function showAlert(message) {
  alert(message);
}

function getPageTitle() {
  return document.title;
}

/* ---------- 5. AUTH STATE LISTENER ---------- */
onAuthStateChanged(auth, (user) => {
  const page = getPageTitle();

  if (user) {
    console.log("User logged in:", user.email);

    // Prevent logged-in users from accessing auth pages
    if (page === "Login" || page === "Signup" || page === "Forgot Password") {
      window.location.href = "welcome.html";
    }

    // Show user info on Welcome page
    if (page === "Welcome") {
      const heading = document.querySelector(".form-heading");
      heading.textContent = `Welcome, ${user.displayName || user.email}`;
    }
  } else {
    console.log("User logged out");

    // Protect Welcome page
    if (page === "Welcome") {
      window.location.href = "index.html";
    }
  }
});

/* ---------- 6. SIGNUP ---------- */
if (getPageTitle() === "Signup") {
  const signupForm = document.querySelector(".form");

  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: username,
      });

      showAlert("Account created successfully!");
    } catch (error) {
      showAlert(error.message);
    }
  });
}

/* ---------- 7. LOGIN ---------- */
if (getPageTitle() === "Login") {
  const loginForm = document.querySelector(".form");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      showAlert(error.message);
    }
  });
}

/* ---------- 8. FORGOT PASSWORD ---------- */
if (getPageTitle() === "Forgot Password") {
  const forgotForm = document.querySelector(".form");

  forgotForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();

    try {
      await sendPasswordResetEmail(auth, email);
      showAlert("Password reset email sent!");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    } catch (error) {
      showAlert(error.message);
    }
  });
}

/* ---------- 9. LOGOUT ---------- */
if (getPageTitle() === "Welcome") {
  const logoutButton = document.querySelector(".signout-btn");

  logoutButton.addEventListener("click", async () => {
    try {
      await signOut(auth);
    } catch (error) {
      showAlert("Failed to sign out");
    }
  });
}
