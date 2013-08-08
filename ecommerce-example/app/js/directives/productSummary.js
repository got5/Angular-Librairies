define(['appModule', 'services/UserService', 'services/ProductUtils', ], function(app) {
	
	/** Directive controller */
	var ProductSummaryController = function($scope, userService, productUtils) {
		
		/** Add select item to user cart. */
        $scope.addToCart = function(pItem) {
        	userService.addToCart(pItem, 1);
        };
        
        $scope.getNbComments = productUtils.getNbComments;
        $scope.getRatingClass = productUtils.getRatingClass;
	};
	
	/** Product summary directive */
	app.lazy.directive('productSummary', function() {
		return {
    		restrict: 'E',
    		replace: true,
    		transclude: false,
    		templateUrl: "templates/partials/productSummary.html",
			controller : [ 
			    '$scope', 'UserService', 'ProductUtils',
			    function(scope, userService, productUtils) {
			    	return new ProductSummaryController(scope, userService, productUtils);
			}]
    	};
	});
});