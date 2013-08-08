define(['app'], function(app)
{
	/** Home view controller */
    app.lazy.controller('HomeController', ['$scope', function($scope) {
    	
    	$scope.welcomeMsg = "Hello World";
    }]);
});