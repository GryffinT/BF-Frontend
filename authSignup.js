
const form = document.getElementById("signupAuthForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = e.target.email.value;
  const username = e.target.username.value;
  const password = e.target.password.value;

  console.log("Submitting signup...");
  document.body.style.cursor = 'wait';

  try {
    const res = await fetch("https://bf-backend-production.up.railway.app/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password })
    });

    console.log("Status:", res.status);

    const data = await res.json();
    console.log("Response:", data);

    if (res.ok) {
      document.body.style.cursor = 'default';
      window.location.href = 'location.html';
    }

  } catch (err) {
    document.body.style.cursor = 'default';
    console.error("Signup fetch error:", err);
  }
});


