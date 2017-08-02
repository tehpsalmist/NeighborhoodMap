var map;

			var markers = [];

			var locations = [
				{title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
        {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
        {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
        {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
        {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
        {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
      ];

      function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|0|_|%E2%80%A2',
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21,34));
        return markerImage;
      }

			function initMap() {
				map = new google.maps.Map(document.getElementById('map'), {
	        center: {lat: 40.7413549, lng: -73.9980244},
	        zoom: 13,
	        mapTypeControl: true
	      });
	      var drawingManager = new google.maps.drawing.DrawingManager();
				drawingManager.setMap(map);
				drawingManager.setOptions({
				  drawingControlOptions: {
				    drawingModes: ['circle', 'polygon'],
				    position: google.maps.ControlPosition.BOTTOM_CENTER
				  }
				});

				var normalMarker = makeMarkerIcon('0091ff');
        var highlightedMarker = makeMarkerIcon('FFFF24');

				for (var i = 0; i < locations.length; i++) {
          // Get the position from the location array.
          var position = locations[i].location;
          var title = locations[i].title;
          // Create a marker per location, and put into markers array.
          var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: normalMarker,
            id: i,
            map: map
          });
          // Push the marker to our array of markers.
          markers.push(marker);
          // Create an onclick event to open the large infowindow at each marker.
          marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
          });
          // Two event listeners - one for mouseover, one for mouseout,
          // to change the colors back and forth.
          marker.addListener('mouseover', function() {
            this.setIcon(highlightedMarker);
          });
          marker.addListener('mouseout', function() {
            this.setIcon(normalMarker);
          });
        }
	    };