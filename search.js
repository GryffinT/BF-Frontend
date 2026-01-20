// The search function for the Business finder page, used by homeRenderer.js

const resultsBox = document.getElementById('SearchResults');

const search = ( text = null ) => {

  if ( text != null ) {

    let target = resultsBox.querySelector(`#${text.trim().toLowerCase()}`);

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
