/** Product detail view controller */
var DetailController = function($scope, $routeParams, catalogService) {

	/** Gets product from Firebase. */
	catalogService.getProduct($routeParams.id, $scope, "product");
	
	$scope.quantity = 1;
	
	/** Add select item to user cart. */
	$scope.addToCart = function() {
		// TODO
	};
};
DetailController.$inject = ['$scope', '$routeParams', 'CatalogService'];