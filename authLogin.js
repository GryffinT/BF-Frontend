document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginAuthForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      document.body.style.cursor = 'wait';
      const res = await fetch("https://bf-backend-production.up.railway.app/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      console.log("Response:", data);



      if (data.token) {
        localStorage.setItem("authToken", data.token);
        console.log("Login successful");
        document.body.style.cursor = 'default';
        window.location.href = 'location.html';
      } else {
        document.body.style.cursor = 'default';
        console.log("Login failed:", data.error);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  });
});

