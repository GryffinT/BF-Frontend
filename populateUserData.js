const usernameElem = document.getElementById("username");
const cityElem = document.getElementById("city");

const geoData = JSON.parse(localStorage.getItem("geoData"));

const fetchUserInfo = async () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    console.error("No auth token found");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(
      "https://bf-backend-production.up.railway.app/auth/me",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!res.ok) {
      throw new Error("Unauthorized");
    }

    const data = await res.json();
    console.log("User data:", data);

    usernameElem.innerText = data.username;

  } catch (err) {
    console.error("Cannot fetch user data:", err);
    localStorage.removeItem("authToken");
    window.location.href = "login.html";
  }
};

const populateInfo = () => {
  if (geoData) {
    cityElem.innerText = `${geoData.city}, ${geoData.reg}`;
  }
};

fetchUserInfo();
populateInfo();

