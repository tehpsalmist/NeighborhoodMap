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

	//	-create location from marker

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