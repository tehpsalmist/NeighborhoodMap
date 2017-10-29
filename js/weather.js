function getWeatherData(marker) {
  // set loading message while data is being requested and loaded
  duhVyooMahdul.weatherLoading(true);
  // declaring the marker to ensure everything runs right, lol...I have no idea why.
  var marker = marker;
  // establishing the proper url for the 10-day forecast data request
  var lat = marker.position.lat();
  var lng = marker.position.lng();
  var url = "https://api.wunderground.com/api/0a5ebedb6494b2b5/forecast10day/geolookup/conditions/q/" + lat + "," + lng + ".json";
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.forecast.simpleforecast.forecastday) {
        marker.weatherData(data.forecast.simpleforecast.forecastday);
      }
      duhVyooMahdul.weatherLoading(false);
    })
    .catch(e => {
      console.log(e);
      duhVyooMahdul.weatherRequestError("Weather Underground does not provide information for this location.");
        // Clear the loading message and/or error messages
      duhVyooMahdul.weatherLoading(false);
      setTimeout(function() {
        duhVyooMahdul.weatherRequestError('');
      }, 4000);
    });
}

// this function is nearly identical to the function above
function getFoursquareData(marker) {
  duhVyooMahdul.foursquareLoading(true);
  var marker = marker;
  var lat = marker.position.lat();
  var lng = marker.position.lng();
  var url = "https://api.foursquare.com/v2/venues/explore?section=food&ll=" + lat + "," + lng + "&radius=2000&limit=10&venuePhotos=1&time=any&day=any&sortByDistance=0&client_id=B3JQ1F4O1QK0TTXD1I0AGNP20NZIGKIAWFCFNRQYSFFEDQA3&client_secret=A25OW4GYR3OMEAC3EZDQMBTARZAKZW0LP4PZW55QGEUQWJFA&v=20171025";

  fetch(url)
    .then(response => response.json())
    .then(data => {
      marker.foursquare(data.response.groups[0].items);
      duhVyooMahdul.foursquareLoading(false);
    })
    .catch(e => {
      console.log(e);
      duhVyooMahdul.foursquareRequestError("Foursquare is unable to provide information for this location at this time.");
        // Clear the loading message and/or error messages
      duhVyooMahdul.foursquareLoading(false);
      setTimeout(function() {
        duhVyooMahdul.foursquareRequestError('');
      }, 4000);
    });
}