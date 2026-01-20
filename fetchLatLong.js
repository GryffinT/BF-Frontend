
const coordinateElement = document.getElementById('coordinates');
const locationElement = document.getElementById('location');
const countryElement = document.getElementById('country');
const accuracyElement = document.getElementById('accuracy');



document.getElementById('fetchButton').addEventListener("click", async () => {
  document.body.style.cursor = 'wait';

  try {
    const data = await window.geo.fallback();

    if (data) {
      coordinateElement.innerText = `${data.lat}, ${data.lng}`;
      locationElement.innerText = `${data.city}, ${data.reg}`;
      countryElement.innerText = data.country;
      accuracyElement.innerText = data.accuracy;
      localStorage.setItem("geoData", JSON.stringify(data));
    } else {
      coordinateElement.innerText = "Unable to determine location";
    }
  } catch (err) {
    coordinateElement.innerText = "Error fetching location data";
    console.error(err);
  } finally {
    document.body.style.cursor = 'default';
  }
});

async function fetchGeo() {
  document.body.style.cursor = 'wait';

  try {
    const data = await window.geo.fallback();

    if (data) {
      coordinateElement.innerText = `${data.lat}, ${data.lng}`;
      locationElement.innerText = `${data.city}, ${data.reg}`;
      countryElement.innerText = data.country;
      accuracyElement.innerText = data.accuracy;
      localStorage.setItem("geoData", JSON.stringify(data));
    } else {
      coordinateElement.innerText = "Unable to determine location";
    }
  } catch (err) {
    coordinateElement.innerText = "Error fetching location data";
    console.error(err);
  } finally {
    document.body.style.cursor = 'default';
  }
}

fetchGeo();



