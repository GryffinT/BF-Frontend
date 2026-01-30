// This file is the renders the home page's dynamic content.

// Constatnts, theses are the primary containers.

const placesCache = {};
const homeButton = document.getElementById('home');
const chatButton = document.getElementById('chat');
const finderButton = document.getElementById('finder');
const inputsSec = document.getElementById('searchAndFilter');
const displaySec = document.getElementById('display');

// Data structures

// Base UI Element class

class UIElement {
  constructor(type, text, events, cssClass) {
    this.el = document.createElement(type);
    if (text && (type.toLowerCase() !== 'input')) {
      this.el.innerHTML = text;
    } else {
      this.el.placeholder = text;
    }
    if (cssClass) this.el.className = cssClass;
    if (events) {
      for (const [event, handler] of Object.entries(events)) {
        this.el.addEventListener(event, handler);
      }
    }
  }
}

// Special Button case.

class Button extends UIElement {
  constructor(text, events, cssClass) {
    super("button", text, events, cssClass);
  }
}

// Populate & De-populate functions

// Location fetching function 

async function fetchPlacesByRadius(category, radiusMiles = 50) {
  const apiKey = "8cc013f796ce40798f4ebb18d3c0be0c";

  const geoData = JSON.parse(localStorage.getItem("geoData"));

  if (!geoData || !geoData.lat || !geoData.lng) {
    console.error("geoData missing in localStorage");
    return null;
  }

  const lat = geoData.lat;
  const lon = geoData.lng;

  const radiusMeters = radiusMiles * 1609.34;

  const categories = encodeURIComponent(category);

  const url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${lon},${lat},${radiusMeters}&limit=50&apiKey=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");

    return await response.json();
  } catch (err) {
    console.error("Error fetching places:", err);
    return null;
  }
}

// Fetching for cached places, reduces loading speed for fetched locations.

async function fetchPlacesCached(category, radiusMiles = 50) {
  if (placesCache[category]) {
    console.log("Loaded from cache:", category);
    return placesCache[category];
  }

  document.body.style.cursor = "wait";

  try {
    const result = await fetchPlacesByRadius(category, radiusMiles);
    placesCache[category] = result;
    return result;
  } finally {
    document.body.style.cursor = "default";
  }
}

// Clear children, clears chidlren from both the search and display boxes.

let clearChildren = () => {
  displaySec.replaceChildren();
  inputsSec.replaceChildren();
};

// Function to render the display box for when the user clicks "business finder".

let renderFinderDisplay = async () => {
  console.log('Rendering Finder Display Section');

  clearChildren();

  const categories = [
    'Favorites', 'Accommodations', 'Retail', 'Catering', 'Entertainment',
    'Leisure', 'Parks', 'Services', 'Tourist locations'
  ];

  const queryLabels = [
    'Favorites', 'accommodation', 'commercial', 'catering', 'entertainment',
    'leisure', 'natural', 'services', 'tourist'
  ];

  let primaryCategories = {};
  try {
    const response = await fetch('primaryCategories.JSON');
    primaryCategories = await response.json();
  } catch (err) {
    console.error("Error loading primaryCategories.JSON:", err);
  }

  const label = new UIElement('h3', 'Explore Businesses Near You!', null, 'title');
  const categoryM = new UIElement('div', null, null, 'categoryDisplay');

  display.appendChild(label.el);

  const hr = document.createElement('hr');
  hr.style.width = "100%";
  hr.style.marginBottom = '15px';
  display.appendChild(hr);

  display.appendChild(categoryM.el);

  categoryM.id = 'SearchResults';

  // Category buttons
  let elemToAdd;

  const fixedHeight = categoryM.el.offsetHeight + "px";
  categoryM.el.style.height = fixedHeight;
  categoryM.el.style.maxHeight = fixedHeight;
  categoryM.el.style.minHeight = fixedHeight;

  for (let i = 0; i < categories.length; i++) {
    const categoryName = categories[i];
    const queryLabel = queryLabels[i];
    
    if (i != 0) {

      elemToAdd = new Button(
        categoryName,
        {
          click: function () {
            label.el.innerText = `Fetching ${categoryName} Locations Near You...`
            const apiCategoryArray = primaryCategories[queryLabel] || [queryLabel];

            fetchPlacesCached(apiCategoryArray).then(data => {
              console.log("Results for:", apiCategoryArray, data);


              categoryM.el.innerHTML = "";
              categoryM.el.style.padding = '15px';
              categoryM.el.style.boxSizing = 'border-box';
              categoryM.el.style.gridTemplateColumns = "1fr";

              // Card construction

              data.features.forEach(feature => {
                const props = feature.properties;

                const card = new UIElement('div', null, {'click': function () {
  
                  let data = props;

                  clearChildren();

                  console.log(`Examining ${data.name}`);

                  let infoText = `${data.contact && data.contact.phone ? data.contact.phone : "No phone number available."} | ${data.formatted ? data.formatted : "No address available."}`;
                  let website = new UIElement('p', data.website, null, 'title');
                  let title = new UIElement('h1', data.name, null, 'title');
                  title.el.style.marginBottom = "5px";
                  let info = new UIElement('p', infoText, null, 'subHeader');
                  let inputsHr = document.createElement('hr');
                  let dealTitle = new UIElement('h1', 'Deals & Promotions', null, 'title');
                  let displayHr = document.createElement('hr');
                  let dealsBox = new UIElement('div', null, null, 'espressoCard');

                  let favoriteButton = new Button(
                    'Favorite', { click:
                    async () => {
                      try {
                        const [lng, lat] = feature.geometry.coordinates;

                        const token = localStorage.getItem("authToken");
                        if (!token) {
                          console.error("No auth token found");
                          window.location.href = "login.html";
                          return;
                        }

                        const res = await fetch(
                          "https://bf-backend-production.up.railway.app/auth/favorites",
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({ lat, lng })
                          }
                        );

                        if (!res.ok) throw new Error("Failed to save favorite");

                        const data = await res.json();
                        console.log("Favorite saved:", data);
                        alert("Favorite saved!");

                      } catch (err) {
                        console.error("Error saving favorite:", err);
                        alert("Could not save favorite.");
                      }
                    }
                    },
                    'espressoButton'
                  );

                  // console.log(feature.geometry.coordinates[0], feature.geometry.coordinates[1]);

                  inputsHr.style.width = "100%";
                  displayHr.style.width = '100%';

                  Object.assign(favoriteButton.el.style, {
                    width : '25%',
                    height : '20px'
                  });


                  dealsBox.el.style.height = '100%';

                  // NEED DEAL API

                  inputsSec.appendChild(title.el);
                  inputsSec.appendChild(info.el);
                  inputsSec.appendChild(inputsHr);
                  inputsSec.appendChild(website.el);
                  inputsSec.appendChild(favoriteButton.el);

                  displaySec.appendChild(dealTitle.el);
                  displaySec.appendChild(displayHr);
                  displaySec.appendChild(dealsBox.el);

                } }, 'businessCard');

                card.el.style.cursor = 'pointer';
                card.el.id = props.name.trim().toLowerCase();

                const title = document.createElement("h4");
                title.textContent = props.name || "Unnamed Location";
              title.style.margin = "0 0 6px 0";

                const address = new UIElement('p', props.formatted || 'No address available', null, 'espressoCardTitle');

                const websiteHTML = props.website
                ? `<a href="${props.website}" target="_blank">${props.website}</a>`
                : 'No website available';

                const phoneNumber = props.contact && props.contact.phone ? props.contact.phone : "No phone number available."; 

                const cat = new UIElement(
                  'p',
                  `${phoneNumber} | ${websiteHTML}`,
                  null,
                  'espressoCardTags'
                );


                card.el.appendChild(title);
                card.el.appendChild(address.el);
                card.el.appendChild(cat.el);

                categoryM.el.appendChild(card.el);
              });
              label.el.innerText = `Explore ${categoryName} Locations Near You!`
            });
          }
        },
        'latteButton'
      );
    } else {

      elemToAdd = new Button(
        categoryName,
        {
          click: async () => {
            try {
              const token = localStorage.getItem("authToken");
              if (!token) {
                console.error("No auth token found");
                window.location.href = "login.html";
                return;
              }

              const res = await fetch(
                "https://bf-backend-production.up.railway.app/auth/me",
                {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                  }
                }
              );

              if (!res.ok) throw new Error("Failed to fetch user data");

              const user = await res.json();
              const favorites = user.favorites || [];

              categoryM.el.innerHTML = "";

              for (let index = 0; index < favorites.length; index++) {
                const fav = favorites[index];
                const geoapifyUrl = `https://api.geoapify.com/v2/place-details?lat=${fav.lat}&lon=${fav.lng}&apiKey=2ef8deb058ba4535a44fd111735abb95`;

                try {
                  const requestOptions = { method: "GET" };
                  const geoRes = await fetch(geoapifyUrl, requestOptions);
                  if (!geoRes.ok) throw new Error("Failed to fetch place details");
                  const placeData = await geoRes.json();

                  card = new UIElement('div', null, null, 'espressoCard');

                  Object.assign(card.el.style, {

                    display : "flex",
                    flexDirection : "column",
                    marginBottom : "8px",
                    padding : "6px",
                    border : "1px solid #ccc",
                    borderRadius : "4px",

                  });

                  const name = placeData.features?.[0]?.properties?.name || "Unknown Place";
                  const address = placeData.features?.[0]?.properties?.formatted || "";
                  card.el.innerHTML = `<strong>${name}</strong><br>${address}<br>`;
                  card.el.style.height = '250px';

                  const removeBtn = new Button('Remove', 
                    { onclick: async () => {
                      try {
                        const removeRes = await fetch(
                          "https://bf-backend-production.up.railway.app/auth/favorites/remove",
                          {
                            method: "POST",
                            headers: {
                              Authorization: `Bearer ${token}`,
                              "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ lat: fav.lat, lng: fav.lng })
                          }
                        );

                        if (!removeRes.ok) throw new Error("Failed to remove favorite");

                        card.el.remove();
                      } catch (err) {
                        console.error("Error removing favorite:", err);
                        alert("Could not remove favorite.");
                      }}},
                    'espressoButton');

                  Object.assign( removeBtn.el.style, {
                    height: '40px',
                    marginTop: 'auto',
                  });

                  card.el.appendChild(removeBtn.el);

                  categoryM.el.appendChild(card.el);

                } catch (geoErr) {
                  console.error("Error fetching place details:", geoErr);
                }
              }

            } catch (err) {
              console.error("Error fetching favorites:", err);
              alert("Could not load favorites");
            }
          }
        },
        "espressoButton"
      );
    }

    // console.log(elemToAdd);

    elemToAdd.el.id = queryLabel;
    categoryM.el.appendChild(elemToAdd.el);
  }
};

// Search function for business finder, it scrolls the results to the indicated one.

const search = ( text = null ) => {

  let resultsBox = document.getElementById('SearchResults');

  if ( text != null ) {

    let target = document.getElementById(`${text.trim().toLowerCase()}`);

    if (!target) {

      console.log("Error, no such location exists!");
      return;

    }

    target.scrollIntoView({

      behavior: 'smooth',
      block: 'center'

    });


  } else {

    console.log("Please enter a location to search for!");

  }

};

// Renders the search box for the home page when the user clicks Business Finder.

let renderFinderSearch = () => {
  console.log('Rendering Finder Search Section');

  const label = new UIElement('h3', 'Filter your results', null, 'title');
  const searchbar = new UIElement('input', 'Where to?', { keydown(e) { if (e.key == 'Enter') {search(this.value)}; } } , 'searchbar');
  const hr = document.createElement('hr');
  const gridBox = new UIElement('div', null, null, 'categoryDisplay');
  const starLabel = new UIElement('label', 'Filter by rating', null, null);
  const proxSearch = new UIElement('input', 'Distance (mi)', null, 'searchbar')

  Object.assign(proxSearch.el.style, {
    width: '50%',
    fontSize: '60%',
    marginLeft:'25%',
    marginRight: '25%',
  });

  starLabel.el.for = 'starRatings';

  hr.style.width = '100%';
  hr.style.marginBottom = '15px';

  gridBox.el.id = 'searchGrid';

  searchbar.el.style.marginBottom = '15px';

  // Appending Section

  inputsSec.appendChild(label.el);
  inputsSec.appendChild(hr);
  inputsSec.appendChild(searchbar.el);

  inputsSec.appendChild(gridBox.el);
  
  for (let i =0; i < 3; i++) {
    const filterWidgets = new UIElement('div', null, null, null);
    const searchG = document.getElementById('searchGrid');
    searchG.appendChild(filterWidgets.el);
  }

  for (let i = 1; i <= 5; i++) {
    document
      .getElementById('searchGrid')
      .getElementsByTagName('div')[0]
      .appendChild(ratingsFilter.el);

  }
};

let homeDisplay = () => {

  clearChildren();

  let title = new UIElement('h1', 'The Traveller\'s Co-op', null, 'title');
  let hr = document.createElement('hr');
  let description = new UIElement('h1', "From aimless wandering to an insightful adventure- find local businesses, attractions, and landmarks wherever you go!", null, 'title');
  description.el.style.fontSize  = '20px';

  hr.style.width = '100%';

  inputsSec.appendChild(title.el);
  inputsSec.appendChild(hr);
  inputsSec.appendChild(description.el);

  // display content

  let displayTitle = new UIElement('h1', 'Travel Post', null, 'title');
  let hrD = document.createElement('hr');
  hrD.style.width = '100%';
  let forumBlock = new UIElement('div', null, null, 'espressoCard');
  forumBlock.el.style.height = '100%';
  forumBlock.el.style.display = 'flex';

  // Forum stuff
  
  let textInput = new UIElement('input', 'Share your experiences.', null, 'searchbar');
  textInput.el.style.marginTop = 'auto';


  forumBlock.el.appendChild(textInput.el);


  displaySec.appendChild(displayTitle.el);
  displaySec.appendChild(hrD);
  displaySec.appendChild(forumBlock.el);

}


// Event listeners.

homeDisplay();

finderButton.addEventListener('click', renderFinderDisplay);
finderButton.addEventListener('click', renderFinderSearch);

homeButton.addEventListener('click', homeDisplay);

