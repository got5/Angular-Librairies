define(['appModule', 'services/UserService'], function(app)
{
	/** Product Detail View controller. */
    app.lazy.controller('DetailController',
    [
        '$scope', '$routeParams', 'CatalogService', 'UserService',
        function($scope, $routeParams, catalogService, userService) {
        	
        	/** Gets product from Firebase. */
        	catalogService.getProduct($routeParams.id, $scope, "product");
        	
            /** Add select item to user cart. */
            $scope.addToCart = function(pItem) {
            	userService.addToCart(pItem, 1);
            };
            
            $scope.quantity = 1;
            
            $scope.getRatingClass = function() {
            	var cssClass = { rating: true };
            	switch (catalogService.getProductRating($scope.product)) {
            		case 5:
            			cssClass.five = true;
            			break;
            		case 4:
            			cssClass.four = true;
            			break;
            		case 3:
            			cssClass.three = true;
            			break;
            		case 2:
            			cssClass.two = true;
            			break;
            		case 1:
            			cssClass.one = true;
            			break;
            		case 0:
            			cssClass.zero = true;
            			break;
            		default:
            			break;
            	}
            	return cssClass;
            };
        }
    ]);
});