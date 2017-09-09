function getWeatherData(marker) {
  var marker = marker;
  var url = "http://api.wunderground.com/api/0a5ebedb6494b2b5/forecast10day/geolookup/conditions/q/" + marker.position.lat() + "," + marker.position.lng() + ".json";
  weatherRequest = new XMLHttpRequest();
  weatherRequest.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      allData = JSON.parse(this.responseText);
      marker.weatherData(allData.forecast.simpleforecast.forecastday);
      console.log(markers);
      console.log(marker.weatherData());
    };
  };
  weatherRequest.open("GET", url, true);
  weatherRequest.send();
}


/*for (var i = markers.length - 1; i >= 0; i--) {
  markers[i].addURLProperty = function(data) {
    console.log(data);
    if (data.response.error) {
      window.alert("Failure to gather location data for weather readings:" + "\n" + data.response.error.description);
      this.weatherURL = null;
    } else if (data.location.country === "US") {
      this.weatherURL = "http://api.wunderground.com/api/0a5ebedb6494b2b5/forecast10day/q/" + data.location.state + "/" + data.location.city + ".json";
      this.weatherURL = this.weatherURL.split(' ').join('_');
    } else if (data.location.country !== undefined || null) {
      this.weatherURL = "http://api.wunderground.com/api/0a5ebedb6494b2b5/forecast10day/q/" + data.location.country + "/" + data.location.city + ".json";
      this.weatherURL = this.weatherURL.split(' ').join('_');
    } else {
      window.alert("There is something very wrong about the data connected to " + this.title +". \n Expect errors during this session, and possibly bad weather.");
      this.weatherURL = null;
    };
  };
};

function getWeatherURL() {
  for (var i = markers.length - 1; i >= 0; i--) {
    var url = "http://api.wunderground.com/api/0a5ebedb6494b2b5/geolookup/q/" + markers[i].position.lat() + "," + markers[i].position.lng() + ".json";
    var marker = markers[i];
    marker.weatherURLRequest = new XMLHttpRequest();
    

    marker.weatherURLRequest.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var weatherGeoData = JSON.parse(this.responseText);
        marker.addURLProperty(weatherGeoData);
      }
    };
    marker.weatherURLRequest.open("GET", url, true);
    marker.weatherURLRequest.send();
  }
}

window.addEventListener('load', function() {
  getWeatherURL();
})*/