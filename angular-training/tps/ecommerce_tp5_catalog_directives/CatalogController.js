/** Catalog view controller */
var CatalogController = function($scope, catalogService, userService, productUtils) {

	/** Returns all products. */
	catalogService.getCatalog().success(function(result) {
		$scope.products = [];
		for(var id in result.products) {
			$scope.products.push(result.products[id]);
		}
		
		/** Add select item to user cart. */
        $scope.addToCart = function(pItem) {
        	userService.addToCart(pItem, 1);
        };
		
        $scope.getRatingClass = productUtils.getRatingCss;
	});
};
CatalogController.$inject = ['$scope', 'CatalogService', 'UserService', 'ProductUtils'];