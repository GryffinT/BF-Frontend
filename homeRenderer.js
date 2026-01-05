const homeButton = document.getElementById('home');
const chatButton = document.getElementById('chat');
const finderButton = document.getElementById('finder');

const inputsSec = document.getElementById('searchAndFilter');
const displaySec = document.getElementById('display');

// Data structures

class UIElement {
  constructor(type, text, events, cssClass) {
    this.el = document.createElement(type);
    if (text && (type.toLowerCase() !== 'input')) {
      this.el.textContent = text;
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

class Button extends UIElement {
  constructor(text, events, cssClass) {
    super("button", text, events, cssClass);
  }
}

// Populate & De-populate functions

let clearChildren = () => {
  displaySec.replaceChildren();
  inputsSec.replaceChildren();
};

let renderFinderDisplay = () => {
  console.log('Rendering Finder Display Section');

  clearChildren();

  const categories = ['Accommodations', 'Recreational', 'Beaches', 'Shops', 'Catering', 'Schools', 'Emergency Facilities', 'Entertainment Centers', 'Leisure Centers', 'Parks', 'Services', 'Tourist Spots'];
  
  const label = new UIElement('h3', 'Explore Businesses Near You!', null, 'title');
  const categoryM = new UIElement('div', null, null, 'categoryDisplay');

  display.appendChild(label.el);
  
  const hr = document.createElement('hr');
  hr.style.width = "100%";
  hr.style.marginBottom = '15px';
  display.appendChild(hr);

  display.appendChild(categoryM.el);
  
  for (let category of categories) {
    let elemToAdd = new Button(
      category,
      { click: () => console.log(category) },
      'latteButton'
    );
    display.getElementsByTagName('div')[0].appendChild(elemToAdd.el);
  }
};

let renderFinderSearch = () => {
  console.log('Rendering Finder Search Section');

  const label = new UIElement('h3', 'Filter your results', null, 'title');
  const searchbar = new UIElement('input', 'Where to?', null, 'searchbar');
  const hr = document.createElement('hr');
  const gridBox = new UIElement('div', null, null, 'categoryDisplay');
  const starLabel = new UIElement('label', 'Filter by rating', null, null);

  starLabel.el.for = 'starRatings';

  hr.style.width = '100%';
  hr.style.marginBottom = '15px';

  gridBox.el.id = 'searchGrid';

  searchbar.el.style.marginBottom = '15px';

  searchbar.el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      console.log(searchbar.el.value);
    }
  })

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

  document.getElementById('searchGrid').getElementsByTagName('div')[0].classList.add('rating');
  document.getElementById('searchGrid').getElementsByTagName('div')[0].appendChild(starLabel.el);

  for (let i = 1; i <= 5; i++) {
    const ratingsFilter = new UIElement('input', null, null, 'star-radio'); 
    ratingsFilter.el.type = 'radio';
    ratingsFilter.el.name = 'starRatings';
    ratingsFilter.el.value = i;
    // console.log(i);

    document
      .getElementById('searchGrid')
      .getElementsByTagName('div')[0]
      .appendChild(ratingsFilter.el);

  }
};

finderButton.addEventListener('click', renderFinderDisplay);
finderButton.addEventListener('click', renderFinderSearch);

homeButton.addEventListener('click', clearChildren);

