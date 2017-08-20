var map;

var markers = [];

var newMarker = ko.observable(null);

var shape = ko.observable(null);

var radius = ko.observable(null);

var locations = [
	{title: 'Quakertown Action Park', type: 'park', location: {lat: 40.430491, lng: -75.344964}},
  {title: 'Bethlehem Skate Plaza', type: 'park', location: {lat: 40.612325, lng: -75.355298}},
  {title: 'Ambler Skate Park', type: 'park', location: {lat: 40.148134, lng: -75.219983}},
  {title: 'Penn Skate', type: 'park', location: {lat: 40.606535, lng: -75.445162}},
  {title: 'Perkasie Skate Park', type: 'park', location: {lat: 40.364859, lng: -75.298026}},
  {title: 'Bottom Dollar Manual Pad', type: 'spot', location: {lat: 40.442640, lng: -75.338742}}
];

function initMap() {
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

  var zoomAutocomplete = new google.maps.places.Autocomplete(document.getElementById('zoomSearch'));

  google.maps.event.addListener(zoomAutocomplete, 'place_changed', function() {
    result = zoomAutocomplete.getPlace();
    duhVyooMahdul.address(result.formatted_address);
  });

  var spotInfowindow = new google.maps.InfoWindow();

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.430491, lng: -75.344964},
    zoom: 20,
    mapTypeControl: true,
    mapTypeId: 'satellite',
    zoomControl: true,
    scaleControl: true,
    streetViewControl: true,
    rotateControl: true
  });

  var drawingManager = new google.maps.drawing.DrawingManager();
	drawingManager.setMap(map);
	drawingManager.setOptions({
	  drawingControlOptions: {
	    drawingModes: ['circle', 'polygon', 'marker'],
	    position: google.maps.ControlPosition.BOTTOM_CENTER
	  }
	});

	for (var i = 0; i < locations.length; i++) {
    if (locations[i].type === 'spot') {
      // Get the position from the location array.
      var position = locations[i].location;
      var title = locations[i].title;
      // Create a marker per location, and put into markers array.
      var marker = new google.maps.Marker({
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        icon: spotIcon,
        id: i,
        map: map
      });
      // Push the marker to our array of markers.
      markers.push(marker);
      // Create an onclick event to open the large infowindow at each marker.
      marker.addListener('click', function() {
        populateInfoWindow(this, spotInfowindow);
      });
      // Two event listeners - one for mouseover, one for mouseout,
      // to change the colors back and forth.
      marker.addListener('mouseover', function() {
        this.setIcon(hoveredSpotIcon);
      });
      marker.addListener('mouseout', function() {
        this.setIcon(spotIcon);
      });
      marker.addListener('click', function() {
        markerBounce(this);
      });
    } else if (locations[i].type === 'park') {
      // Get the position from the location array.
      var position = locations[i].location;
      var title = locations[i].title;
      // Create a marker per location, and put into markers array.
      var marker = new google.maps.Marker({
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        icon: parkIcon,
        id: i,
        map: map
      });
      // Push the marker to our array of markers.
      markers.push(marker);
      // Create an onclick event to open the large infowindow at each marker.
      marker.addListener('click', function() {
        populateInfoWindow(this, spotInfowindow);
      });
      // Two event listeners - one for mouseover, one for mouseout,
      // to change the colors back and forth.
      marker.addListener('mouseover', function() {
        this.setIcon(hoveredParkIcon);
      });
      marker.addListener('mouseout', function() {
        this.setIcon(parkIcon);
      });
      marker.addListener('click', function() {
        markerBounce(this);
      });
    }
  }

  drawingManager.addListener('overlaycomplete', function(event) {
    duhVyooMahdul.shapes(true);

    // Check if there is an existing shape.
    // If there is, get rid of it and remove the markers
    if (shape()) {
      shape().setMap(null);
      shape(null);
      radius(null);
      hideMarkers(markers);
    }

    if (newMarker()) {
      newMarker().setMap(null);
      newMarker(null);
    }

    // Switching the drawing mode to the HAND (i.e., no longer drawing).
    drawingManager.setDrawingMode(null);
    // Creating a new editable shape from the overlay.

    if (event.type === 'marker') {
      duhVyooMahdul.typeOfShape('Marker');
      showMarkers(markers);
      newMarker(event.overlay);
    }

    if (event.type === 'polygon') {
      shape(event.overlay);
      duhVyooMahdul.typeOfShape('Polygon');
      shape().setEditable(true);
      // Searching within the shape.
      searchWithinPolygon(shape());
      // Make sure the search is re-done if the poly is changed.
      shape().getPath().addListener('set_at', searchWithinPolygon);
      shape().getPath().addListener('insert_at', searchWithinPolygon);
    }

    if (event.type === 'circle') {
      shape(event.overlay);
      duhVyooMahdul.typeOfShape('Circle');
      shape().setEditable(true);

      radius(event.overlay.getRadius());
      searchWithinCircle(shape);

      shape().addListener('center_changed', searchWithinCircle);
      shape().addListener('radius_changed', searchWithinCircle);
      shape().addListener('radius_changed', function() {
        radius(shape().getRadius());
      });
    }
  });
}

function searchWithinPolygon() {
  for (var i = 0; i < markers.length; i++) {
    if (google.maps.geometry.poly.containsLocation(markers[i].position, shape())) {
      markers[i].setMap(map);
    } else {
      markers[i].setMap(null);
    }
  }
}

function searchWithinCircle() {
  for (var i = 0; i < markers.length; i++) {
    if (google.maps.geometry.spherical.computeDistanceBetween(markers[i].getPosition(), shape().getCenter()) <= shape().getRadius()) {
      markers[i].setMap(map);
    } else {
      markers[i].setMap(null);
    }
  }
}

function hideMarkers(markers) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}

function showMarkers(markers) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function markerBounce(marker) {
  marker.setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(function() {
    marker.setAnimation(null);
  }, 2000);
}

function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  function getStreetView(data, status) {
    if (status === google.maps.StreetViewStatus.OK) {
      var nearStreetViewLocation = data.location.latLng;
      var heading = google.maps.geometry.spherical.computeHeading(
        nearStreetViewLocation, marker.position);
        infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
        var panoramaOptions = {
          position: nearStreetViewLocation,
          pov: {
            heading: heading,
            pitch: 0
          }
        };
      var panorama = new google.maps.StreetViewPanorama(
        document.getElementById('pano'), panoramaOptions);
    } else {
      infowindow.setContent('<div>' + marker.title + '</div>' +
        '<div>No Street View Found</div>');
    }
  }
  if (infowindow.marker != marker) {
    // Clear the infowindow content to give the streetview time to load.
    infowindow.setContent('');
    infowindow.marker = marker;
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
    var streetViewService = new google.maps.StreetViewService();
    var streetRadius = 500;
    // In case the status is OK, which means the pano was found, compute the
    // position of the streetview image, then calculate the heading, then get a
    // panorama from that and set the options
  
    // Use streetview service to get the closest streetview image within
    // 50 meters of the markers position
    streetViewService.getPanoramaByLocation(marker.position, streetRadius, getStreetView);
    // Open the infowindow on the correct marker.
    infowindow.open(map, marker);
  }
}

function zoomToArea() {
  // Initialize the geocoder.
  var geocoder = new google.maps.Geocoder();
  // Make sure the address isn't blank.
  if (duhVyooMahdul.address() === '') {
    duhVyooMahdul.zoomSearchAlert('Gotta type something, bro.');
  } else {
  // Geocode the address/area entered to get the center. Then, center the map
  // on it and zoom in
  geocoder.geocode(
    {address: duhVyooMahdul.address()},
    function(results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        map.setZoom(15);
        duhVyooMahdul.zoomSearchAlert('');
      } else {
        duhVyooMahdul.zoomSearchAlert('We could not find that location - try entering a more specific place.');
      }
    });
  }
}

function discoverUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      duhVyooMahdul.userLoc('There you are! Happy skating!');
      duhVyooMahdul.zoomSearchAlert('');
      map.setCenter(pos);
    }, function() {
      handleLocationError(true);
    });
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false);
  }
}

function handleLocationError(browserCompatible) {
  duhVyooMahdul.userLoc(browserCompatible ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
  duhVyooMahdul.zoomSearchAlert('');
}