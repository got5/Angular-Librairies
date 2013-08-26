/** Directive controller */
var ProductSummaryController = function($scope, userService, productUtils) {

	/** Add select item to user cart. */
	$scope.addToCart = function(pItem) {
		userService.addToCart(pItem, 1);
	};

	$scope.getRatingClass = productUtils.getRatingCss;
};

/** Product summary directive */
app.directive('productSummary', function() {
	return {
		restrict : 'E',
		templateUrl : "templates/partials/productSummary.html",
		controller : [
				'$scope',
				'UserService',
				'ProductUtils',
				function(scope, userService, productUtils) {
					return new ProductSummaryController(scope, userService,
							productUtils);
				} ]
	};
});