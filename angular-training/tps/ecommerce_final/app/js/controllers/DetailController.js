/** Product detail view controller */
angular.module('app').controller('DetailController', 
		[ '$scope', '$routeParams', 'CatalogService', 'ProductUtils', 
		  function($scope, $routeParams, catalogService, productUtils) {

	/** Gets product from Firebase. */
	catalogService.getProduct($routeParams.id, $scope, "product");
	
	$scope.quantity = 1;
	
	/** Add select item to user cart. */
	$scope.addToCart = function() {
		// TODO
	};
    
    /** Returns the CSS class for the average rating of a given product. */
	$scope.getRatingClass = function() {
		if ($scope.product != undefined) {
			return productUtils.getRatingCss($scope.product);
		}
		return null;
	};
}]);