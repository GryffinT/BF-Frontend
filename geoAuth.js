button = document.getElementById('verify');

const verifyGeoData = () => {
  document.body.style.cursor = 'wait';

  let geoData = JSON.parse(localStorage.getItem("geoData"));

  if (geoData && geoData.lat && geoData.lng) {
    window.location.href = 'home.html'; 
  } else {
    console.log("Error Data Missing");
    console.log(geoData['lat']);
    console.log(geoData['lng']);
    console.log(geoData);
  }
  document.body.style.cursor = 'default';
}

button.addEventListener('click', verifyGeoData);
