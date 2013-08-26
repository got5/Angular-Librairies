/** Catalog view controller */
var CatalogController = function($scope, catalogService) {

	/** Returns all products. */
	catalogService.getCatalog().success(function(result) {
		$scope.products = [];
		for(var id in result.products) {
			$scope.products.push(result.products[id]);
		}
	});
};
CatalogController.$inject = ['$scope', 'CatalogService'];