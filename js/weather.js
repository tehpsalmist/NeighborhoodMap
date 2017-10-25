function getWeatherData(marker) {
  // set loading message while data is being requested and loaded
  duhVyooMahdul.weatherLoading(true);
  // declaring the marker to ensure everything runs right, lol...I have no idea why.
  var marker = marker;
  // establishing the proper url for the 10-day forecast data request
  var url = "https://api.wunderground.com/api/0a5ebedb6494b2b5/forecast10day/geolookup/conditions/q/" + marker.position.lat() + "," + marker.position.lng() + ".json";
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      marker.weatherData(data.forecast.simpleforecast.forecastday);
      duhVyooMahdul.weatherLoading(false);
    })
    .catch(e => {
      console.log(e);
      duhVyooMahdul.weatherRequestError("Weather Underground does not provide information for this location.")
        // Clear the loading message and/or error messages
      duhVyooMahdul.weatherLoading(false);
      setTimeout(function() {
        duhVyooMahdul.weatherRequestError('');
      }, 4000);
    });
}

function getYelpStuff(marker) {
  var marker = marker;

  var token = "RqkMDF6Btw_f5qAi8w7ekQCH1ZPt55L9nV49F5czOPSFt18ImvRzlBlP_B8IGClMum2PSFRF43hoarvPVou9zJqQftL1L_9c6-mqLb4E4bh65K-n3QFo8FGBxgfwWXYx";

  var url = "https://api.yelp.com/v3/businesses/search?term=food&latitude=" + marker.position.lat + "&longitude=" + marker.position.lng + "Authorization=Bearer " + token;

  fetch(url)
    .then(response => {
      response.json();
      console.log(response, response.json());
    })
    .then(data => {
      marker.yelpFood = data;
    })
    .catch(e => console.log(e));
  console.log(marker.yelpFood);
}


// client_id=DHPJTfzPshFQwg4tGSMv8A&client_secret=0BRGGlwnDnmG3v6dCG3mxO3jp1IZNGJfxfiL8qKPW03K0eul7H8TZV20UUWhz2Tx