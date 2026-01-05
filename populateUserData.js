const usernameElem = document.getElementById('username');
const cityElem = document.getElementById('city');

const geoData = JSON.parse(localStorage.getItem('geoData'));

let fetchUserInfo = async () => {

  try {
    const res = await fetch("https://bf-backend-production.up.railway.app/auth/login", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, username })
    })

    const data = await res.json();
    console.log("Response:", data);

  } catch (err) {
    console.log("Cannot fetch user data:", err);
  }
}

let populateInfo = () => {
  cityElem.innerText = `${geoData.city}, ${geoData.reg}`;
}

populateInfo();
