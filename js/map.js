// Globally declared variables and observables
var map;

var markers = [];

var newMarker = ko.observable(null);

var shape = ko.observable(null);

var radius = ko.observable(null);

var drawingManager = '';

var locations = [];

function loadDatabase() {
  var config = {
    apiKey: "AIzaSyAvirBHOZJADuil02yaaZseFILM7esEOqc",
    authDomain: "neighborhood-map-174401.firebaseapp.com",
    databaseURL: "https://neighborhood-map-174401.firebaseio.com",
    projectId: "neighborhood-map-174401",
    storageBucket: "neighborhood-map-174401.appspot.com",
    messagingSenderId: "793662469029"
  };
  firebase.initializeApp(config);

  var locationData = firebase.database().ref('locations');

  locationData.once('value').then(function(snapshot) {
    snapshot.val().map(location => {
      locations.push(location);
    });
    initMap();
  }).catch(e => {
    console.log(e);
    duhVyooMahdul.loading('Unfortunately, there has been a database error. Reload the page to try again.');
    duhVyooMahdul.loadingSpinner(false);
  });
}

function initMap() {
  // Different icons for different types of skate spots (2 of each for highlighting)
  var spotIcon = {   
    path: "M70.5,3c-0.3-0.3-0.8-0.5-1.2-0.5c-0.4,0-0.8,0.2-1.2,0.5L9,59.5c-0.7,0.6-0.7,1.7-0.1,2.4c0.3,0.3,0.8,0.5,1.2,0.5  c0.4,0,0.8-0.2,1.2-0.5L70.5,5.4C71.2,4.8,71.2,3.7,70.5,3z M58.5,51.5V19.3l-3,2.8v29.3H58.5z M32.5,76.5V44l-3,2.8v29.6H32.5z   M96.3,40.5H64.9c-0.9,0-1.4,1.1-1.4,2v11H52.9c-0.9,0-1.4,0.7-1.4,1.6v10.4H40.3c-0.9,0-1.8,1.3-1.8,2.2v10.8H27.7  c-0.9,0-2.2,0.9-2.2,1.8v11.2h-9.7c-0.9,0-1.3,0.5-1.3,1.4v9.6l29.3,0c0.8,0,1.4-0.2,2-0.6l50.7-49.2V40.9  C96.5,40.9,96.4,40.5,96.3,40.5z",
    fillColor: '#ff4b00',
    fillOpacity: 1,
    scale: 0.5,
    strokeWeight: 0,
    anchor: new google.maps.Point(45, 50)
  };

  var hoveredSpotIcon = {   
    path: "M70.5,3c-0.3-0.3-0.8-0.5-1.2-0.5c-0.4,0-0.8,0.2-1.2,0.5L9,59.5c-0.7,0.6-0.7,1.7-0.1,2.4c0.3,0.3,0.8,0.5,1.2,0.5  c0.4,0,0.8-0.2,1.2-0.5L70.5,5.4C71.2,4.8,71.2,3.7,70.5,3z M58.5,51.5V19.3l-3,2.8v29.3H58.5z M32.5,76.5V44l-3,2.8v29.6H32.5z   M96.3,40.5H64.9c-0.9,0-1.4,1.1-1.4,2v11H52.9c-0.9,0-1.4,0.7-1.4,1.6v10.4H40.3c-0.9,0-1.8,1.3-1.8,2.2v10.8H27.7  c-0.9,0-2.2,0.9-2.2,1.8v11.2h-9.7c-0.9,0-1.3,0.5-1.3,1.4v9.6l29.3,0c0.8,0,1.4-0.2,2-0.6l50.7-49.2V40.9  C96.5,40.9,96.4,40.5,96.3,40.5z",
    fillColor: '#00ffff',
    fillOpacity: 1,
    scale: 0.5,
    strokeWeight: 0,
    anchor: new google.maps.Point(45, 50)
  };

  var parkIcon = {   
    path: "M89.2,41.4h-5.1c-0.3,0-0.5,0.1-0.7,0.2c0,0,0,0,0,0l-10.1,5.6c-0.8,0.5-1.4,1.3-1.4,2.3c-0.4,6.3-5.8,11.3-12.1,11.3H40.3   c-6.3,0-11.6-4.9-12.1-11.3c-0.1-0.9-0.6-1.8-1.5-2.3l-10.1-5.6c0,0,0,0,0,0c-0.2-0.1-0.5-0.2-0.8-0.2h-5.1c-0.9,0-1.6,0.7-1.6,1.6   v28c0,0.9,0.7,1.6,1.6,1.6h78.4c0.9,0,1.6-0.7,1.6-1.6V43C90.8,42.1,90,41.4,89.2,41.4z M73.8,49.6c0-0.3,0.2-0.5,0.4-0.7l8.2-4.5   c-0.9,8.2-7.1,14.7-15.1,16C71,58.1,73.5,54.2,73.8,49.6z M26.2,49.6c0.3,4.6,2.8,8.5,6.4,10.9c-8-1.3-14.2-7.8-15.1-16l8.2,4.5   C26,49.1,26.2,49.3,26.2,49.6z M88.8,70.6H11.2V43.4h4.2c0.5,10.9,9.3,19.3,20.3,19.3h28.6c10.9,0,19.8-8.4,20.3-19.3h4.2V70.6z M67.4,43.7l-0.6-0.1c-0.5-0.1-1.1,0.3-1.2,0.8c-0.1,0.5,0.3,1.1,0.8,1.2l0.6,0.1c0.2,0,0.5,0.1,0.7,0.1c0.1,0,0.1,0,0.2,0   c0,0.2,0.1,0.4,0.2,0.5c0.3,0.5,0.8,0.8,1.3,0.8c0.2,0,0.5-0.1,0.7-0.2c0.3-0.2,0.6-0.5,0.7-0.9c0.1-0.4,0.1-0.8-0.1-1.1   c0,0-0.1-0.1-0.1-0.1l3.8-2.1c0,0.1,0,0.1,0.1,0.2c0.3,0.5,0.8,0.8,1.3,0.8c0.2,0,0.5-0.1,0.7-0.2c0.7-0.4,1-1.3,0.6-2l0,0   c-0.1-0.2-0.2-0.3-0.4-0.4c0.2-0.2,0.3-0.5,0.4-0.8l0.2-0.6c0.2-0.5-0.1-1.1-0.6-1.3c-0.5-0.2-1.1,0.1-1.3,0.6l-0.2,0.6 c-0.1,0.4-0.4,0.6-0.7,0.8l-5.9,3.3C68.1,43.7,67.7,43.7,67.4,43.7z M62.3,34.4c0.1,0.5,0.5,0.9,1,0.9c0,0,0.1,0,0.1,0c0.5-0.1,0.9-0.6,0.9-1.1l-0.3-2l1.5-1.3l-0.2,2.6c0,0.2,0,0.4,0.1,0.6   l1.6,2.7l-0.5,4.1c-0.1,0.5,0.3,1,0.9,1.1c0,0,0.1,0,0.1,0c0.5,0,0.9-0.4,1-0.9l0.5-4.4c0-0.2,0-0.4-0.1-0.6l-1.1-1.8l2.8-0.8   l1.1,2c0.2,0.3,0.5,0.5,0.9,0.5c0.2,0,0.3,0,0.5-0.1c0.5-0.3,0.6-0.9,0.4-1.4l-1.5-2.7c-0.2-0.4-0.7-0.6-1.1-0.5l-3.5,1l0.2-2.4   l2.5,0.6c0.3,0.1,0.7,0,0.9-0.2l1.7-1.5c0.4-0.4,0.4-1,0.1-1.4c-0.4-0.4-1-0.4-1.4-0.1l-1.3,1.2l-1.8-0.5c0.6-0.7,0.7-1.6,0.3-2.5   c0,0,0,0,0,0c-0.6-1.1-1.9-1.6-3.1-1.1c-1.1,0.6-1.6,1.9-1.1,3.1c0.2,0.4,0.5,0.7,0.9,1l-3,2.6c-0.3,0.2-0.4,0.6-0.3,0.9L62.3,34.4   z M66.4,26.1c0,0,0.1,0,0.1,0c0.1,0,0.2,0.1,0.3,0.2c0.1,0.2,0,0.3-0.1,0.4c-0.2,0.1-0.3,0-0.4-0.1C66.2,26.4,66.3,26.2,66.4,26.1z",
    fillColor: '#ff4b00',
    fillOpacity: 1,
    scale: 0.8,
    strokeWeight: 0,
    anchor: new google.maps.Point(60, 40)
  };

  var hoveredParkIcon = {   
    path: "M89.2,41.4h-5.1c-0.3,0-0.5,0.1-0.7,0.2c0,0,0,0,0,0l-10.1,5.6c-0.8,0.5-1.4,1.3-1.4,2.3c-0.4,6.3-5.8,11.3-12.1,11.3H40.3   c-6.3,0-11.6-4.9-12.1-11.3c-0.1-0.9-0.6-1.8-1.5-2.3l-10.1-5.6c0,0,0,0,0,0c-0.2-0.1-0.5-0.2-0.8-0.2h-5.1c-0.9,0-1.6,0.7-1.6,1.6   v28c0,0.9,0.7,1.6,1.6,1.6h78.4c0.9,0,1.6-0.7,1.6-1.6V43C90.8,42.1,90,41.4,89.2,41.4z M73.8,49.6c0-0.3,0.2-0.5,0.4-0.7l8.2-4.5   c-0.9,8.2-7.1,14.7-15.1,16C71,58.1,73.5,54.2,73.8,49.6z M26.2,49.6c0.3,4.6,2.8,8.5,6.4,10.9c-8-1.3-14.2-7.8-15.1-16l8.2,4.5   C26,49.1,26.2,49.3,26.2,49.6z M88.8,70.6H11.2V43.4h4.2c0.5,10.9,9.3,19.3,20.3,19.3h28.6c10.9,0,19.8-8.4,20.3-19.3h4.2V70.6z M67.4,43.7l-0.6-0.1c-0.5-0.1-1.1,0.3-1.2,0.8c-0.1,0.5,0.3,1.1,0.8,1.2l0.6,0.1c0.2,0,0.5,0.1,0.7,0.1c0.1,0,0.1,0,0.2,0   c0,0.2,0.1,0.4,0.2,0.5c0.3,0.5,0.8,0.8,1.3,0.8c0.2,0,0.5-0.1,0.7-0.2c0.3-0.2,0.6-0.5,0.7-0.9c0.1-0.4,0.1-0.8-0.1-1.1   c0,0-0.1-0.1-0.1-0.1l3.8-2.1c0,0.1,0,0.1,0.1,0.2c0.3,0.5,0.8,0.8,1.3,0.8c0.2,0,0.5-0.1,0.7-0.2c0.7-0.4,1-1.3,0.6-2l0,0   c-0.1-0.2-0.2-0.3-0.4-0.4c0.2-0.2,0.3-0.5,0.4-0.8l0.2-0.6c0.2-0.5-0.1-1.1-0.6-1.3c-0.5-0.2-1.1,0.1-1.3,0.6l-0.2,0.6 c-0.1,0.4-0.4,0.6-0.7,0.8l-5.9,3.3C68.1,43.7,67.7,43.7,67.4,43.7z M62.3,34.4c0.1,0.5,0.5,0.9,1,0.9c0,0,0.1,0,0.1,0c0.5-0.1,0.9-0.6,0.9-1.1l-0.3-2l1.5-1.3l-0.2,2.6c0,0.2,0,0.4,0.1,0.6   l1.6,2.7l-0.5,4.1c-0.1,0.5,0.3,1,0.9,1.1c0,0,0.1,0,0.1,0c0.5,0,0.9-0.4,1-0.9l0.5-4.4c0-0.2,0-0.4-0.1-0.6l-1.1-1.8l2.8-0.8   l1.1,2c0.2,0.3,0.5,0.5,0.9,0.5c0.2,0,0.3,0,0.5-0.1c0.5-0.3,0.6-0.9,0.4-1.4l-1.5-2.7c-0.2-0.4-0.7-0.6-1.1-0.5l-3.5,1l0.2-2.4   l2.5,0.6c0.3,0.1,0.7,0,0.9-0.2l1.7-1.5c0.4-0.4,0.4-1,0.1-1.4c-0.4-0.4-1-0.4-1.4-0.1l-1.3,1.2l-1.8-0.5c0.6-0.7,0.7-1.6,0.3-2.5   c0,0,0,0,0,0c-0.6-1.1-1.9-1.6-3.1-1.1c-1.1,0.6-1.6,1.9-1.1,3.1c0.2,0.4,0.5,0.7,0.9,1l-3,2.6c-0.3,0.2-0.4,0.6-0.3,0.9L62.3,34.4   z M66.4,26.1c0,0,0.1,0,0.1,0c0.1,0,0.2,0.1,0.3,0.2c0.1,0.2,0,0.3-0.1,0.4c-0.2,0.1-0.3,0-0.4-0.1C66.2,26.4,66.3,26.2,66.4,26.1z",
    fillColor: '#00ffff',
    fillOpacity: 1,
    scale: 0.8,
    strokeWeight: 0,
    anchor: new google.maps.Point(60, 40)
  };

  // Google Maps API autocomplete is used for the browse from address and search within distance of address options.
  var zoomAutocomplete = new google.maps.places.Autocomplete(document.getElementById('zoomSearch'));

  google.maps.event.addListener(zoomAutocomplete, 'place_changed', function() {
    result = zoomAutocomplete.getPlace();
    duhVyooMahdul.address(result.formatted_address);
  });

  var distanceAutocomplete = new google.maps.places.Autocomplete(document.getElementById('center-location'));

  google.maps.event.addListener(distanceAutocomplete, 'place_changed', function() {
    result = distanceAutocomplete.getPlace();
    duhVyooMahdul.centerLocationAddress(result.formatted_address);
  });

  // establishing the infowindow object
  var spotInfowindow = new google.maps.InfoWindow();

  // establishing the map object
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.430491, lng: -75.344964},
    zoom: 15,
    mapTypeControl: true,
    mapTypeControlOptions: {
      mapTypeIds: ['satellite', 'terrain', 'roadmap'],
      position: google.maps.ControlPosition.TOP_RIGHT
    },
    mapTypeId: 'satellite',
    zoomControl: true,
    scaleControl: true,
    streetViewControl: true,
    rotateControl: true
  });
  
  // This media query handles the placement of the drawing manager controls (bottom on desktop/tablet, top on mobile)
  var mobile = window.matchMedia( "(max-width: 580px)" );
  if (mobile.matches) {
    drawingManager = new google.maps.drawing.DrawingManager();
    drawingManager.setMap(map);
    drawingManager.setOptions({
      drawingControlOptions: {
        drawingModes: ['circle', 'polygon', 'marker'],
        position: google.maps.ControlPosition.TOP_CENTER
      }
    });
  } else {
    drawingManager = new google.maps.drawing.DrawingManager();
  	drawingManager.setMap(map);
  	drawingManager.setOptions({
  	  drawingControlOptions: {
  	    drawingModes: ['circle', 'polygon', 'marker'],
  	    position: google.maps.ControlPosition.BOTTOM_CENTER
  	  }
  	});
  }

  // creating the marker objects from each location in the locations array
	for (var i = 0; i < locations.length; i++) {
    var position = locations[i].location;
    var title = locations[i].title;
    var type = locations[i].type;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i,
      map: map,
      type: type
    });
    // Create onclick events to open the infowindow at each marker, populate the search results, and animate the marker.
    marker.addListener('click', function() {
      populateInfoWindow(this, spotInfowindow);
      markerBounce(this);
      duhVyooMahdul.showMediaFunction.call(this);
      if (duhVyooMahdul.visibleSidebar() === false) {
        duhVyooMahdul.toggleSidebar();
      }
    });

    // if statement controls which icon will be used for each spot with listeners to alternate colors on mouseover
    if (locations[i].type === 'spot') {
      marker.setIcon(spotIcon);
      
      marker.addListener('mouseover', function() {
        this.setIcon(hoveredSpotIcon);
      });
      marker.addListener('mouseout', function() {
        this.setIcon(spotIcon);
      });
    } else if (locations[i].type === 'park') {
      marker.setIcon(parkIcon);
      
      marker.addListener('mouseover', function() {
        this.setIcon(hoveredParkIcon);
      });
      marker.addListener('mouseout', function() {
        this.setIcon(parkIcon);
      });
    }
    // distance object (if not false) contains the information to display
    marker.distanceObj = false;
    // weatherData is declared here in the event no data can be found, and as a placeholder while data loads.
    marker.weatherData = ko.observable({});
    // boolean observable to handle visibility of media/weather info under location display
    marker.showMedia = ko.observable(false);
    // Yelp Food Data placeholder
    marker.foursquare = ko.observable({});
    // set ID of div corresponding to this marker's place in the search results array. This will be used to populate the Street View Panorama.
    marker.divID = title.split(' ').join('_');
    markers.push(marker);
  }
  // add markers to search results, from which they will be displayed
  markers.map(marker => duhVyooMahdul.searchResultsArray.push(marker));

  // drawing manager event listener
  drawingManager.addListener('overlaycomplete', function(event) {
    // this observable controls the "Draw a search area" form visibility
    duhVyooMahdul.shapes(true);
    // Check if there is an existing shape.
    // If there is, hide it, clear the values, and hide all markers
    if (shape()) {
      shape().setMap(null);
      shape(null);
      radius(null);
      hideMarkers(markers);
    }

    // Check if there is an existing newMarker (user-placed marker).
    // If there is, hide it and clear the values
    if (newMarker()) {
      newMarker().setMap(null);
      newMarker(null);
    }

    // Switching the drawing mode to the HAND (i.e., no longer drawing).
    drawingManager.setDrawingMode(null);
    
    // If marker was placed, show all location markers and establish the newMarker object as the center for any distance searches
    if (event.type === 'marker') {
      duhVyooMahdul.typeOfShape('Marker');
      showMarkers(markers);
      newMarker(event.overlay);
      duhVyooMahdul.centerLocation(newMarker().position);
    }

    // If polygon was drawn, search within the shape for locations to display
    if (event.type === 'polygon') {
      shape(event.overlay);
      duhVyooMahdul.typeOfShape('Polygon');
      shape().setEditable(true);
      
      // Searching within the polygon.
      searchWithinPolygon(shape());
      
      // Make sure the search is re-done if the polygon is changed.
      shape().getPath().addListener('set_at', searchWithinPolygon);
      shape().getPath().addListener('insert_at', searchWithinPolygon);
    }

    // If circle was drawn, search within the shape for locations to display and measure the radius for display
    if (event.type === 'circle') {
      shape(event.overlay);
      duhVyooMahdul.typeOfShape('Circle');
      shape().setEditable(true);

      // searches within the circle
      radius(event.overlay.getRadius());
      searchWithinCircle(shape);

      // Remeasure the radius and search again if the circle is changed.
      shape().addListener('center_changed', searchWithinCircle);
      shape().addListener('radius_changed', searchWithinCircle);
      shape().addListener('radius_changed', function() {
        radius(shape().getRadius());
      });
    }
  });
  duhVyooMahdul.loading(false);
}

function searchWithinPolygon() {
  // clear results, to avoid duplicates etc.
  duhVyooMahdul.searchResultsArray.removeAll();
  clearMedia();
  for (var i = 0; i < markers.length; i++) {
    if (google.maps.geometry.poly.containsLocation(markers[i].position, shape())) {
      // extend the marker with the necessary information (pass false for distances, since no relative distance was measured)
      duhVyooMahdul.searchResultsArray.push(markers[i]);
      markers[i].setMap(map);
    } else {
      // hide markers outside of the search parameters
      markers[i].setMap(null);
    }
  }
}

function searchWithinCircle() {
  // clear results, to avoid duplicates etc.
  duhVyooMahdul.searchResultsArray.removeAll();
  clearMedia();
  for (var i = 0; i < markers.length; i++) {
    if (google.maps.geometry.spherical.computeDistanceBetween(markers[i].getPosition(), shape().getCenter()) <= shape().getRadius()) {
      // extend the marker with the necessary information (pass false for distances, since no relative distance was measured)
      duhVyooMahdul.searchResultsArray.push(markers[i]);
      markers[i].setMap(map);
    } else {
      // hide markers outside of the search parameters
      markers[i].setMap(null);
    }
  }
}

function hideMarkers(markers) {
  markers.map(marker => marker.setMap(null));
}

function showMarkers(markers) {
  markers.map(marker => marker.setMap(map));
}

function clearMedia() {
  markers.map(marker => marker.showMedia(false));
}

function markerBounce(marker) {
  marker.setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(function() {
    marker.setAnimation(null);
  }, 2000);
}


function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker !== marker) {
    // Set loading screen to give the streetview time to load.
    infowindow.setContent('<div class="street-view-loading"><h3>Bartering with the Street View Gnomes for a Panorama View</h3><i class="fa fa-spinner fa-spin fa-2x" aria-hidden="true"></i></div>');
    infowindow.marker = marker;
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
    var streetViewService = new google.maps.StreetViewService();
    var streetRadius = 50;
    // In case the status is OK, which means the pano was found, compute the
    // position of the streetview image, then calculate the heading, then get a
    // panorama from that and set the options
    function getStreetView(data, status) {
      if (status === google.maps.StreetViewStatus.OK) {
        var nearStreetViewLocation = data.location.latLng;
        var heading = google.maps.geometry.spherical.computeHeading(
          nearStreetViewLocation, marker.position);
          infowindow.setContent('<h2 class="street-view-title">' + marker.title + '</h2><div id="pano"></div>');
          var panoramaOptions = {
            position: nearStreetViewLocation,
            pov: {
              heading: heading,
              pitch: 0
            }
          };
        var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
      } else {
        infowindow.setContent('<h2 class="street-view-title">' + marker.title + '</h2><h4 class="street-view-title">No Street View Found</h4>');
      }
    }
    // Use streetview service to get the closest streetview image within
    // 50 meters of the markers position
    streetViewService.getPanoramaByLocation(marker.position, streetRadius, getStreetView);
    // Open the infowindow on the correct marker.
    infowindow.open(map, marker);
  }
}

function zoomToArea() {
  // Initialize the geocoder.
  var zoomGeocoder = new google.maps.Geocoder();
  // Make sure the address isn't blank and alert the user if it is blank.
  if (duhVyooMahdul.address() === '') {
    duhVyooMahdul.zoomSearchAlert('Gotta type something, bro.');
  } else {
  // Geocode the address/area entered to get the center. Then, center the map
  // on it and zoom in
  zoomGeocoder.geocode(
    {address: duhVyooMahdul.address()},
    function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        map.setZoom(15);
        duhVyooMahdul.zoomSearchAlert('');
      } else {
        // #errorHandling
        duhVyooMahdul.zoomSearchAlert('We could not find that location - try entering a more specific place.');
      }
    });
  }
}
// use the browser's navigator to find the user's location
function discoverUserLocation() {
  // Set the loading message to display
  duhVyooMahdul.findingUser(true);
  // test for browser navigator and get user's position
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      // center location object is used to center map and to search within distance
      duhVyooMahdul.centerLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
      // center map
      map.setCenter(duhVyooMahdul.centerLocation());
      // post cute message and clear any error alerts and loading messages
      duhVyooMahdul.userLoc('There you are! Happy skating!');
      duhVyooMahdul.zoomSearchAlert('');
      duhVyooMahdul.findingUser(false);
    }, function() {
      // unable to successfully locate user
      handleLocationError(true);
      duhVyooMahdul.findingUser(false);
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false);
    duhVyooMahdul.findingUser(false);
  }
}

// error handler for discovering user location
function handleLocationError(browserCompatible) {
  duhVyooMahdul.userLoc(browserCompatible ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  duhVyooMahdul.zoomSearchAlert('');
}

// establish distance search starting point by address
function distanceGeocoder() {
  // Initialize the geocoder.
  var distanceGeocoder = new google.maps.Geocoder();
  // Make sure the address isn't blank.
  if (duhVyooMahdul.centerLocationAddress() === '') {
    duhVyooMahdul.distanceSearchAlert('Gotta type something, bro.');
  } else {
  // Geocode the address/area entered to get the center. Then, center the map
  // on it and zoom in
  distanceGeocoder.geocode(
    {address: duhVyooMahdul.centerLocationAddress()},
    function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        duhVyooMahdul.centerLocation(results[0].geometry.location);
        duhVyooMahdul.distanceSearchAlert('');
      } else {
        // #errorHandling
        duhVyooMahdul.distanceSearchAlert('We could not find that location - try entering a more specific place.');
      };
    });
  }
}

// Find locations within a travel time of the chosen center location
function searchWithinTime() {
  clearMedia();
  // Initialize the distance matrix service.
  var distanceMatrixService = new google.maps.DistanceMatrixService();
  hideMarkers(markers);
  markers.map(marker => marker.distanceObj = false);
  // Use the distance matrix service to calculate the duration of the
  // routes between all our markers, and the destination address entered
  // by the user. Then put all the origins into an origin matrix.
  var origins = [];
  for (var i = 0; i < markers.length; i++) {
    origins[i] = markers[i].position;
  }
  // Now that both the origins and destination are defined, get all the
  // info for the distances between them.
  distanceMatrixService.getDistanceMatrix({
    origins: origins,
    destinations: [duhVyooMahdul.centerLocation()],
    travelMode: google.maps.TravelMode[duhVyooMahdul.mode()],
    unitSystem: google.maps.UnitSystem.IMPERIAL,
  }, function(response, status) {
    if (status !== google.maps.DistanceMatrixStatus.OK) {
      window.alert('Error was: ' + status);
    } else {
      displayMarkersWithinTime(response);
    }
  });
}

// When the response is returned from the Distance Matrix Service, this function
// evaluates each marker's relationship to the center and sends the qualified markers
// to the foundTheMarker function.
function displayMarkersWithinTime(response) {
  var origins = response.originAddresses;
  var destinations = response.destinationAddresses;
  // Parse through the results, and get the distance and duration of each.
  // Because there might be  multiple origins and destinations we have a nested loop
  // Then, make sure at least 1 result was found.
  var atLeastOne = false;
  duhVyooMahdul.searchResultsArray.removeAll();
  for (var i = 0; i < origins.length; i++) {
    var results = response.rows[i].elements;
    for (var j = 0; j < results.length; j++) {
      var element = results[j];
      if (element.status === "OK") {
        // Duration value is given in seconds so we make it MINUTES. We need both the value
        // and the text.
        var duration = element.duration.value / 60;
        if (duration <= duhVyooMahdul.time() && duration !== 0) {
          // Markers/elements that survived to this point are sent off to be happily married
          // by the foundTheMarker function so the data can populate the DOM.
          atLeastOne = true;
          markers[i].distanceObj = element;
          duhVyooMahdul.searchResultsArray.push(markers[i]);
          showMarkers(duhVyooMahdul.searchResultsArray());
        }
      }
    }
  }
  // Couldn't find any locations in the desired distance
  if (!atLeastOne) {
    window.alert('We could not find any locations within that distance!');
  }
}

// This function puts the Street View pano in the sidebar for each location found in any search
function createStreetView(marker, div) {
  var streetViewService = new google.maps.StreetViewService();
  var streetRadius = 50;
  // In case the status is OK, which means the pano was found, compute the
  // position of the streetview image, then calculate the heading, then get a
  // panorama from that and set the options
  function getStreetView(data, status) {
    if (status === google.maps.StreetViewStatus.OK) {
      var nearStreetViewLocation = data.location.latLng;
      var heading = google.maps.geometry.spherical.computeHeading(
        nearStreetViewLocation, marker.position);
        var panoramaOptions = {
          position: nearStreetViewLocation,
          pov: {
            heading: heading,
            pitch: 0
          }
        };
      var panorama = new google.maps.StreetViewPanorama(document.getElementById(div), panoramaOptions);
      // the pano property of each marker is used to ensure that the Street View isn't blank when it is revealed in the sidebar
      marker.pano = panorama;
    } else {
      document.getElementById(div).innerHTML = 'No Street View Found';
    }
  }
  streetViewService.getPanoramaByLocation(marker.position, streetRadius, getStreetView);
}

function goToMarker(marker) {
  map.setCenter(marker.position);
  map.setZoom(15);
  marker.setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(function() {
    marker.setAnimation(null);
  }, 3000);
}

function googleError(error) {
  console.log(error);
  duhVyooMahdul.loading('Google Maps was unable to load. Refresh your browser to try again.');
}