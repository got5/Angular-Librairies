/** Product detail view controller */
var DetailController = function($scope, $routeParams, catalogService) {

	/** Gets product from Firebase. */
	catalogService.getProduct($routeParams.id, $scope, "product");
	
	$scope.quantity = 1;
	
	/** Add select item to user cart. */
	$scope.addToCart = function() {
		// TODO
	};
    
    /** Returns the CSS class for the average rating of a given product. */
	$scope.getRatingClass = function() {
		var productRating = 0;
		var cssClass = "zero";
		if ($scope.product != undefined && $scope.product.comments && $scope.product.comments.length > 0) {
    		var sumRatings = 0;
    		for (var index = 0; index < $scope.product.comments.length; index++) {
    			var comment = $scope.product.comments[index];
    			sumRatings += comment.rate;
    		}
    		productRating = Math.floor(sumRatings/$scope.product.comments.length);
    		
    		switch (productRating) {
	    		case 5:
	    			cssClass = "five";
	    			break;
	    		case 4:
	    			cssClass = "four";
	    			break;
	    		case 3:
	    			cssClass = "three";
	    			break;
	    		case 2:
	    			cssClass = "two";
	    			break;
	    		case 1:
	    			cssClass = "one";
	    			break;
	    		case 0:
	    		default:
	    			break;
	    	}
    	}
		return "rating " + cssClass;
	};
};
DetailController.$inject = ['$scope', '$routeParams', 'CatalogService'];