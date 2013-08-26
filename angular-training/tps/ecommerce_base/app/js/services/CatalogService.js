/** Products catalog service. */
var CatalogService = function(http, angularFire) {
	
	/** json catalog url */
	var CATALOG_URL = 'data/catalog.json';
	
	/** Firebase catalog url */
	var FIREBASE_BASE_URL = "https://ecommerce-training.firebaseio.com/products/";
	
	/** Returns all products. Uses the JSON file */
	this.getCatalog = function () {
		return http.get(CATALOG_URL).success(function(data) {
			console.log('Catalog loaded successfully.');
		}).error(function(data) {
			console.error('ERROR loading catalog: ' + data);
		});
	};

	/** Returns product with given id. Uses Firebase. */
	this.getProduct = function(pId, pScope, pProperty) {
		angularFire(FIREBASE_BASE_URL + pId, pScope, pProperty, {});
	};
};

app.factory('CatalogService', ['$http', 'angularFire', function($http, angularFire) {
	return new CatalogService($http, angularFire);
}]);