/** User VO */
var User = function(pId, pFirst, pLast, pLogin, pPass, pMail, pCartItems, pRole, pAddresses) {
	this.id = pId;
	this.firstName = pFirst;
	this.lastName = pLast;
	this.login = pLogin;
	this.password = pPass;
	this.mail = pMail;
	this.cart = new Cart(pCartItems);
	this.role = pRole;
	
	this.addresses = [];
	if (pAddresses) {
		for (var index = 0; index < pAddresses.length; index++) {
			var addr = pAddresses[index];
			this.addresses.push(new Address(addr.firstName, addr.lastName, addr.address, addr.postalCode,
				addr.town, addr.isDefault));
		}
	}
};