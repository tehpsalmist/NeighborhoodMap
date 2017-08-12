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
	this.clearShapes = function() {
		if (shape) {
			shape.setMap(null);
		} else if (newMarker()) {
			newMarker().setMap(null);
			newMarker(null);
		}
		showMarkers(markers);
	}

	// Causing the pointer to highlight the drawing toolbar and disappear
	this.drawingPointer = ko.observable(false);
	this.fadePointer = ko.observable(false);
	this.showDrawingPointer = function() {
		self.drawingPointer(true);
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

	//	-search for spots within distance of location
	//	-get directions to spot

	//	-center map on location

	//	-info windows populated with what? Name, streetview, instagram post, type?
	//	-connect firebase to location information

	//	-Pull in Instagram Info
	//	-create login for users to access/edit firebase
	//	-obtain user's instagram login and location services permission

	//	-style stuff
	//	-scroll credits
}

var duhVyooMahdul = new ViewModel();

ko.applyBindings(duhVyooMahdul);