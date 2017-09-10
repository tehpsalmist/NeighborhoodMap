function ViewModel() {
	var self = this;

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
		} else {
			shape().setMap(null);
			self.radiusResult(0);
			shape(null);
		}
		showMarkers(markers);
		self.shapes(false);
	}

	// Causing the pointer to highlight the drawing toolbar and disappear
	this.drawingPointer = ko.observable(false);
	this.fadePointer = ko.observable(false);
	this.showDrawingPointer = function() {
		self.drawingPointer(true);
		self.browse(false);
		self.details(false);
		self.distance(false);
		setTimeout(function() {
			self.fadePointer(true);
		}, 3500)
		setTimeout(function() {
			self.drawingPointer(false);
		}, 4400);
		setTimeout(function() {
			self.fadePointer(false);
		}, 4600);
	}

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

	// Marking and saving a new skatespot
	this.newSpot = ko.computed(function() {
		return newMarker();
	});
	
	// These observables keep track of the resulting data objects
	// from each location when a search is executed
	this.searchResultsArray = ko.observableArray();
	this.searchResults = ko.computed(function() {
		if (self.searchResultsArray().length > 0) {
			return true;
		} else {
			return false;
		};
	}, this);

	// Browse from Location button
	this.browse = ko.observable(false);
	this.browseClick = function() {
		if (self.browse() === false) {
			self.browse(true);
		} else {
			self.browse(false);
		}
	};
	this.userLoc = ko.observable('');
	this.address = ko.observable('');
	this.zoomSearchAlert = ko.observable('');
	this.zoomToStart = function() {
		map.setCenter({lat: 40.430491, lng: -75.344964});
    map.setZoom(15);
    self.address('');
    self.zoomSearchAlert('');
    self.userLoc('');
	}

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
	this.distanceSearchAlert = ko.observable('');
	this.typing = ko.observable(false);
	this.findingUser = ko.observable(false);
	this.locationMethod = ko.observable("chooseCenter");
	this.locationMethodChange = function() {
		self.distanceSearchAlert('');
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
		};
	};
	this.runDistanceSearch = function() {
		if (self.locationMethod() === "typeAddress") {
			distanceGeocoder();
		};
		if (!self.centerLocation()) {
			self.distanceSearchAlert('Gotta pick a starting location, bro.');
		} else {
			searchWithinTime();
			self.distanceSearchAlert('');
		};
	}

	// Interacting with the search results
	this.showMediaFunction = function() {
		if (this.showMedia()) {
			this.showMedia(false);
		} else {
			this.showMedia(true);
			this.pano.setVisible(true);
			self.populateForecast(this);
		};
	}
	this.goToMarker = function(marker) {
		map.setCenter(marker.position);
		map.setZoom(17);
		marker.setAnimation(google.maps.Animation.BOUNCE)
		setTimeout(function() {
			marker.setAnimation(null);
		}, 3000);
	}
	this.clearSearchResults = function() {
		self.searchResultsArray([]);
	}
	this.populateForecast = function(marker) {
		getWeatherData(marker);
	}
	this.weatherLoading = ko.observable(false);

	// show the credits!
	this.credits = ko.observable(false);
	this.creditClick = function() {
		if (self.credits() === false) {
			self.credits(true);
		} else {
			self.credits(false);
		};
	};
}

var duhVyooMahdul = new ViewModel();

ko.applyBindings(duhVyooMahdul);