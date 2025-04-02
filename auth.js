import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "./firebase.js";

document.addEventListener("DOMContentLoaded", function () {

    // ✅ Register Form Handling
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const fullNameInput = document.getElementById("register-fullname");
            const emailInput = document.getElementById("register-email");
            const passwordInput = document.getElementById("register-password");
            const confirmPasswordInput = document.getElementById("register-confirm-password");
            const statusMessage = document.getElementById("register-status");

            if (!fullNameInput || !emailInput || !passwordInput || !confirmPasswordInput) {
                console.error("❌ Form elements not found!");
                return;
            }

            const fullName = fullNameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            if (!fullName || !email || !password || !confirmPassword) {
                statusMessage.innerText = "⚠️ Please fill all fields!";
                return;
            }

            if (password.length < 6) {
                statusMessage.innerText = "⚠️ Password must be at least 6 characters!";
                return;
            }

            if (password !== confirmPassword) {
                statusMessage.innerText = "❌ Passwords do not match!";
                return;
            }

            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, { displayName: fullName });

                statusMessage.innerText = "✅ Registration successful! Redirecting...";
                setTimeout(() => window.location.href = "login.html", 2000);
            } catch (error) {
                statusMessage.innerText = `❌ ${error.message}`;
            }
        });
    }

    // ✅ Login Form Handling
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const emailInput = document.getElementById("login-email");
            const passwordInput = document.getElementById("login-password");
            const statusMessage = document.getElementById("login-status");

            if (!emailInput || !passwordInput || !statusMessage) {
                console.error("❌ Login form elements not found!");
                return;
            }

            const email = emailInput.value.trim();
            const password = passwordInput.value;

            if (!email || !password) {
                statusMessage.innerText = "⚠️ Please fill all fields!";
                return;
            }

            try {
                await signInWithEmailAndPassword(auth, email, password);
                statusMessage.innerText = "✅ Login successful! Redirecting...";
                setTimeout(() => window.location.href = "home.html", 2000);
            } catch (error) {
                statusMessage.innerText = `❌ ${error.message}`;
            }
        });
    }

    // ✅ Logout Handling
    const logoutButton = document.getElementById("logout-button");
    if (logoutButton) {
        logoutButton.addEventListener("click", async () => {
            await signOut(auth);
            window.location.href = "login.html";
        });
    }
});


