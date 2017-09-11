function getWeatherData(marker) {
  // set loading message while data is being requested and loaded
  duhVyooMahdul.weatherLoading(true);
  // declaring the marker to ensure everything runs right, lol...I have no idea why.
  var marker = marker;
  // establishing the proper url for the 10-day forecast data request
  var url = "https://api.wunderground.com/api/0a5ebedb6494b2b5/forecast10day/geolookup/conditions/q/" + marker.position.lat() + "," + marker.position.lng() + ".json";
  // Requesting the data via XHR
  weatherRequest = new XMLHttpRequest();
  weatherRequest.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      // Parse the response
      allData = JSON.parse(this.responseText);
      try {
        // If the response is what we are looking for, this 10-day forecast array will be found in the object, which we will add to our marker
        marker.weatherData(allData.forecast.simpleforecast.forecastday);
      } catch (e) {
        // All that matters here is that we didn't get the 10-day forecast in the response object. Go big or throw a generic error, right?
        duhVyooMahdul.weatherRequestError("Weather Underground does not provide information for this location.");
      } finally {
        // Clear the loading message and/or error messages
        duhVyooMahdul.weatherLoading(false);
        setTimeout(function() {
          duhVyooMahdul.weatherRequestError('');
        }, 4000);
      };
    };
  };
  weatherRequest.open("GET", url, true);
  weatherRequest.send();
  // #errorHandling
  weatherRequest.onerror = function() {
    duhVyooMahdul.weatherLoading(false);
    duhVyooMahdul.weatherRequestError('Unable to retrieve data from Weather Underground.')
    setTimeout(function() {
      duhVyooMahdul.weatherRequestError('');
    }, 4000);
  }
}