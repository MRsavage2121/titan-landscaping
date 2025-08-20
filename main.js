// ✅ Firebase Setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// 🔑 Your Firebase Config (replace with your real values!)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ✅ Booking Buttons
document.querySelectorAll(".book-btn").forEach(button => {
  button.addEventListener("click", async (e) => {
    const service = e.target.getAttribute("data-service");
    const price = e.target.getAttribute("data-price");
    const desc = e.target.getAttribute("data-desc");

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          await addDoc(collection(db, "bookings"), {
            service: service,
            price: price,
            description: desc,
            user: user.email,
            date: new Date().toISOString()
          });

          // Redirect to confirmation page
          window.location.href = `confirmation.html?service=${encodeURIComponent(service)}&price=${price}&desc=${encodeURIComponent(desc)}`;
        } catch (err) {
          alert("Error booking service: " + err.message);
        }
      } else {
        alert("Please login or register to book a service.");
        window.location.href = "login.html";
      }
    });
  });
});

