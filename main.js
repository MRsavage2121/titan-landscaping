// ===============================
// SERVICE DROPDOWNS
// ===============================
document.querySelectorAll(".service-toggle").forEach(button => {
  button.addEventListener("click", () => {
    const content = button.nextElementSibling;

    // Close all other service dropdowns
    document.querySelectorAll(".service-content").forEach(section => {
      if (section !== content) {
        section.style.display = "none";
      }
    });

    // Toggle current one
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
});

// ===============================
// REGISTER SYSTEM (Local Storage)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      let users = JSON.parse(localStorage.getItem("users")) || [];

      // Check if email already registered
      if (users.some(user => user.email === email)) {
        alert("Email already registered. Please login.");
        return;
      }

      users.push({ username, email, password });
      localStorage.setItem("users", JSON.stringify(users));

      alert("Registration successful! You can now login.");
      window.location.href = "login.html";
    });
  }

  // ===============================
  // LOGIN SYSTEM
  // ===============================
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      let users = JSON.parse(localStorage.getItem("users")) || [];
      let validUser = users.find(user => user.email === email && user.password === password);

      if (validUser) {
        alert("Login successful! Welcome " + validUser.username);
        localStorage.setItem("loggedInUser", JSON.stringify(validUser));
        window.location.href = "index.html";
      } else {
        alert("Invalid email or password. Try again.");
      }
    });
  }
});

// ===============================
// BOOK NOW REDIRECT
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const bookBtn = document.getElementById("bookNowBtn");
  if (bookBtn) {
    bookBtn.addEventListener("click", () => {
      window.location.href = "contact.html";
    });
  }
});

