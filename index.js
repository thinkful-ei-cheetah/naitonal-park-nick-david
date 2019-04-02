'use strict';

let store = [
  // {
  //   fullName,
  //   description,
  //   url
  // }
];

const apiKey = 'M0Nl186fMAUlJlSWVWrbbPfRtWvgXdRRbsTVergz';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function extractData(park) {
  return {
    fullName: park.fullName,
    description: park.description,
    url: park.url,
    states: park.states
  };
}

function populateStore(responseJson) {
  for(let i=0; i<responseJson.limit; i++){
    store.push(extractData(responseJson.data[i]));
  }
  
  console.log(store);
}

function displayResults() {
  $('#results-list').empty();

  for(let i=0; i < store.length; i++) {
    $('#results-list').append(
      `<li>
        <h3>${store[i].fullName}:</h3>
        <p>${store[i].description}</p>
        <a target="_blank" href="${store[i].url}"><p>${store[i].url}</p></a>
      </li>`
    );
  }

  $('#results').removeClass('hidden');
}

function getNationalParks(stateCode, maxResults=10) {
  const params = {
    api_key: apiKey,
    stateCode,
    limit: maxResults
  };
  const queryString = formatQueryParams(params);
  const url = searchURL + '?' + queryString;

  console.log(url);

  fetch(url)
    .then(response => {
      if(response.status > 199 && response.status < 300) {
        return response.json();
      } else {
        throw new Error('Park not found');
      }     
    })
    .then(responseJson => {
      populateStore(responseJson);
      displayResults();
    });
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    store = [];

    // grab "search term"
    const searchTerm = $('#js-search-term').val();
    // grab "max results"
    const maxResults = $('#js-max-results').val();

    $('#js-search-term').val('');
    $('#js-max-results').val('10');

    console.log(searchTerm);
    getNationalParks(searchTerm, maxResults);
    // assemble request using searchTerm and maxResults...
    // query format:
    //    searchURL + '?' + stateCode=${searchTerm}
  });
}

$(watchForm);