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

	// Marking and saving a new skatespot
	this.newSpot = ko.computed(function() {
		return newMarker();
	});

	this.searchResults = ko.observable(false);

	// Browse from Location button
	this.browse = ko.observable(false);
	this.browseClick = function() {
		if (self.browse() === false) {
			self.browse(true);
			self.details(false);
			self.distance(false);
		} else {
			self.browse(false);
		}
	};
	this.userLoc = ko.observable('');
	this.address = ko.observable('');
	this.zoomSearchAlert = ko.observable('');
	this.zoomToStart = function() {
		map.setCenter({lat: 40.430491, lng: -75.344964});
    map.setZoom(19);
    self.address('');
    self.zoomSearchAlert('');
    self.userLoc('');
	}

	// Search within certain detail parameters
	this.details = ko.observable(false);
	this.showDetails = function() {
		if (self.details() === false) {
			self.browse(false);
			self.details(true);
			self.distance(false);
		} else {
			self.details(false);
		}
	}
	// Search within a distance of a location
	this.distance = ko.observable(false);
	this.showDistance = function() {
		if (self.distance() === false) {
			self.browse(false);
			self.details(false);
			self.distance(true);
		} else {
			self.distance(false);
		}
	}

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