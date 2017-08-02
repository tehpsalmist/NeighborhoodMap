function ViewModel() {
	var self = this;
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
	}
}

ko.applyBindings(new ViewModel());