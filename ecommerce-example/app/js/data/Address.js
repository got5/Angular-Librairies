/** User cart. */
var Address = function(firstName, lastName, address, postalCode, town, isDefault) {
	this.firstName = firstName;
	this.lastName = lastName;
	this.address = address;
	this.postalCode = postalCode;
	this.town = town;
	
	/** Is this the default shipping address? */
	this.isDefault = isDefault;
	
	this.getHTML = function() {
		var htmlAddress = this.firstName + " " + this.lastName + "<br/>";
		htmlAddress += address + "<br/>";
		htmlAddress += this.postalCode + " " + this.town;
		return htmlAddress;
	};
};