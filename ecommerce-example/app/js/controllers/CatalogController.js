define(['appModule', 'services/CatalogService', 'filters/startFrom'], function(app)
{
	/** Catalog view controller */
    app.lazy.controller('CatalogController',
    [
        '$scope', 'CatalogService',
        function($scope, catalogService)
        {	
        	/** Returns all products. */
            catalogService.getCatalog().success(function(result) {
            	$scope.products = [];
            	for(var id in result.products) {
            		$scope.products.push(result.products[id]);
            	}
            	
            	$scope.currentPage = 1;
            	$scope.nbResults = 3;
            	
            	$scope.getNbPages = function() {
            		return $scope.products != undefined ? Math.ceil($scope.products.length / $scope.nbResults) : 0;
            	};
            });
        }
    ]);
});