function ViewModel() {
	var self = this;
	this.loading = ko.observable('Loading...');
	this.loadingSpinner = ko.observable(true);
	// Sidebar access variables and functions
	this.visibleSidebar = ko.observable(false);
	this.chevronRight = ko.observable(true);
	this.toggleSidebar = function() {
		if (self.visibleSidebar() === false) {
			self.visibleSidebar(true);
			self.chevronRight(false);
		} else if (self.visibleSidebar() === true) {
			self.visibleSidebar(false);
			self.chevronRight(true);
		}
	};

	// Radius information and display controls
	this.radiusResult = ko.observable(0);
	this.computedRadius = ko.computed(function() {
		return self.radiusResult(Math.trunc(radius() * 1000 / 1609) / 1000);
	}, this);

	// Display Clear Shape button and clearShape function
	this.shapes = ko.observable(false);
	this.typeOfShape = ko.observable('Drawing');
	this.clearShapes = function() {
		if (newMarker()) {
			newMarker().setMap(null);
			newMarker(null);
			self.centerLocation(null);
		} else {
			shape().setMap(null);
			self.radiusResult(0);
			shape(null);
		}
		showMarkers(markers);
		self.shapes(false);
	};

	// Causing the pointer to highlight the drawing toolbar and disappear
	this.drawingPointer = ko.observable(false);
	this.fadePointer = ko.observable(false);
	this.showDrawingPointer = function() {
		self.drawingPointer(true);
		self.browse(false);
		self.distance(false);
		setTimeout(function() {
			self.fadePointer(true);
		}, 3500);
		setTimeout(function() {
			self.drawingPointer(false);
		}, 4400);
		setTimeout(function() {
			self.fadePointer(false);
		}, 4600);
	};

	// Scripts that interact with media queries to display items
	// correctly based on screen size.
	this.chevronUp = ko.observable(false);
	this.chevronDown = ko.observable(true);
	var mobileView = window.matchMedia( "(max-width: 580px)" );
  if (mobileView.matches) {
    self.chevronUp(true);
    self.chevronDown(false);
  } else {
    self.chevronUp(false);
    self.chevronDown(true);
  }
/*
	// Marking and saving a new skatespot
	this.newSpot = ko.computed(function() {
		return newMarker();
	});
*/
	// These observables keep track of the resulting data objects
	// from each location when a search is executed and display or hide
	// the search results DOM elements
	this.searchResultsArray = ko.observableArray();
	this.filtered = ko.observable(false);
	this.searchResults = ko.computed(function() {
		if (self.searchResultsArray().length === locations.length) {
			self.filtered(false);
			return 'Locations';
		} else if (self.searchResultsArray().length === 0) {
			self.filtered(true);
			return 'No Locations Found';
		} else {
			self.filtered(true);
			return 'Filtered Locations';
		}
	}, this);
	// Restore all markers to the map and list
	this.unfilterSearchResults = function() {
		self.searchResultsArray([]);
		clearMedia();
		markers.map(marker => self.searchResultsArray.push(marker));
		showMarkers(markers);
	};

	// Browse from Location button
	this.browse = ko.observable(false);
	this.browseClick = function() {
		if (self.browse() === false) {
			self.browse(true);
		} else {
			self.browse(false);
		}
	};
	// these observables control the Browse from Location buttons
	this.userLoc = ko.observable('');
	this.address = ko.observable('');
	this.zoomSearchAlert = ko.observable('');
	// Reset Map button takes the map back to where it started at 
	// Quakertown Action Park
	this.zoomToStart = function() {
		map.setCenter({lat: 40.430491, lng: -75.344964});
    map.setZoom(15);
    self.address('');
    self.zoomSearchAlert('');
    self.userLoc('');
	};

	// Clicking the search within distance button
	this.distance = ko.observable(false);
	this.showDistance = function() {
		if (self.distance() === false) {
			self.distance(true);
		} else {
			self.distance(false);
		}
	};
	// Search within a distance of a location
	this.centerLocation = ko.observable();
	this.centerLocationAddress = ko.observable('');
	this.mode = ko.observable("DRIVING");
	this.time = ko.observable("10");
	this.locationMethod = ko.observable("chooseCenter");
	this.distanceSearchAlert = ko.observable('');
	// Displays the input field when a user wants to type an address
	this.typing = ko.observable(false);
	// Displays loading message
	this.findingUser = ko.observable(false);

	// When the location method changes, these functions are triggered
	this.locationMethodChange = function() {
		// clear residual error messages from previous attempts
		self.distanceSearchAlert('');
		// 
		if (self.locationMethod() === "userLocation") {
			discoverUserLocation();
			this.centerLocationAddress('');
			self.typing(false);
		} else if (self.locationMethod() === "dropMarker") {
			drawingManager.setDrawingMode('marker');
			this.centerLocationAddress('');
			self.typing(false);
			if (newMarker() === null) {
				self.centerLocation(null);
			} else {
				self.centerLocation(newMarker().position);
			}
		} else if (self.locationMethod() === "typeAddress") {
			self.centerLocation(null);
			self.typing(true);
		} else {
			self.centerLocation(null);
			self.typing(false);
		}
	};
	// Function executed when the user selects search within distance of location
	this.runDistanceSearch = function() {
		// If address was chosen, geocoder must be run first, to establish centerLocation
		if (self.locationMethod() === "typeAddress") {
			distanceGeocoder();
		}
		// If no location was selected to start, display message, otherwise, run the Search
		// using the centerLocation
		if (!self.centerLocation()) {
			self.distanceSearchAlert('Gotta pick a starting location, bro.');
		} else {
			searchWithinTime();
			self.distanceSearchAlert('');
		}
	};

	// Interacting with the search results

	// Displays Streetview and requests the forecast from Wunderground
	// for that particular location
	this.showMediaFunction = function() {
		// "this" is the marker/location, which has methods showMedia and pano
		if (this.showMedia()) {
			this.showMedia(false);
		} else {
			this.showMedia(true);
			// If a pano exists for this location, then it must be (re)set to visible,
			// as it is turned to a black picture when the element's style.display is 'none'
			if (this.pano) {
				this.pano.setVisible(true);
			} else {
				createStreetView(this, this.divID);
			}
			// passing the marker object to the populate forecast function
			self.populateAPIStuff(this);
			goToMarker(this);
		}
		return true;
	};
	// prevent event bubbling so the media containers aren't closed prematurely when touched
	this.stopProp = function(event) {
		return true;
	};
	// Calling the 
	this.populateAPIStuff = function(marker) {
		getWeatherData(marker);
		getFoursquareData(marker);
	};
	// observables that control loading and error messages for api requests
	this.weatherLoading = ko.observable(false);
	this.weatherRequestError = ko.observable('');

	this.foursquareLoading = ko.observable(false);
	this.foursquareRequestError = ko.observable('');

	// show the credits!
	this.credits = ko.observable(false);
	this.creditClick = function() {
		if (self.credits() === false) {
			self.credits(true);
		} else {
			self.credits(false);
		}
	};
}

// You can tell I was in a weird mood when I refactored this part...
var duhVyooMahdul = new ViewModel();

ko.applyBindings(duhVyooMahdul);