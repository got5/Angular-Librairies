/** User cart. */
var Cart = function(pCartItems) {
	
	var items = null;
	
	this.setItems = function(pItems) {
		items = {};
		if (pItems) {
			for (var index = 0; index < pItems.length; index++) {
				var cartItem = pItems[index];
				items[cartItem.id] = cartItem.qty;
			}
		}
	};
	
	this.getItems = function() {
		var arrItems = [];
		for (var key in items) {
			arrItems.push(items[key]);
		}
		return arrItems;
	};
	
	this.setItemQty = function(pItem, pQty) {
		if (pQty > 0) {
			if (items[pItem.id] == undefined) {
				items[pItem.id] = new CartItem(pItem, pQty);
			} else {
				items[pItem.id].qty += pQty;
			}
		}
	};
	
	this.getItemQty = function(pItem) {
		return items[pItem.id] != undefined ? items[pItem.id].qty : 0;
	};
	
	this.addItem = function(pItem) {
		this.setItemQty(pItem, 1);
	};
	
	this.removeItem = function(pItem) {
		this[pItem.id] = undefined;
	};
	
	this.setItems(pCartItems);
};

var CartItem = function(pItem, pQty) {
	this.id = pItem.id;
	this.name = pItem.name;
	this.price = pItem.price;
	this.qty = pQty;
};